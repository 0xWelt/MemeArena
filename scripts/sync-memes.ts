#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

interface ParsedMeme {
  uid: string;
  name: string;
  cover: string;
  description: string;
}

interface SyncResult {
  success: number;
  failed: number;
  errors: string[];
}

/**
 * 解析单个meme markdown文件
 */
function parseMemeFile(content: string, filePath: string): ParsedMeme {
  const lines = content.split('\n');
  const relativePath = path
    .relative(path.join(process.cwd(), 'data'), filePath)
    .replace(/\.md$/, '');

  // 解析标题 (# 一级标题)
  const nameLine = lines.find(line => line.startsWith('# '));
  const name = nameLine
    ? nameLine.replace('# ', '').trim()
    : path.basename(filePath, '.md').replace(/-/g, ' ');

  // 解析图片链接 (## Cover 后的 ![alt](url))
  let cover = '';
  const coverSectionIndex = lines.findIndex(line => line.trim() === '## Cover');
  if (coverSectionIndex !== -1) {
    // 找到Cover章节后的第一个图片语法
    for (let i = coverSectionIndex + 1; i < lines.length; i++) {
      const imageMatch = lines[i].match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        cover = imageMatch[2].trim();
        break;
      }
      // 如果遇到了下一个二级标题，停止搜索
      if (lines[i].startsWith('## ')) break;
    }
  }

  // 解析描述 (## Description 后的内容)
  let description = '';
  const descSectionIndex = lines.findIndex(line => line.trim() === '## Description');
  if (descSectionIndex !== -1) {
    const descLines = lines.slice(descSectionIndex + 1);
    // 找到下一个二级标题或文件结尾
    const nextSectionIndex = descLines.findIndex(line => line.startsWith('## '));
    const endIndex = nextSectionIndex > -1 ? nextSectionIndex : descLines.length;
    description = descLines.slice(0, endIndex).join('\n').trim();
  }

  return {
    uid: relativePath.replace(/\\/g, '/'), // Windows兼容
    name,
    cover,
    description,
  };
}

/**
 * 获取要处理的文件列表
 */
function getFilesToProcess(targetPath: string): string[] {
  const fullPath = path.resolve(targetPath);
  const files: string[] = [];

  if (!fs.existsSync(fullPath)) {
    throw new Error(`路径不存在: ${fullPath}`);
  }

  const stat = fs.statSync(fullPath);

  if (stat.isFile()) {
    // 单个文件
    if (fullPath.endsWith('.md')) {
      files.push(fullPath);
    }
  } else if (stat.isDirectory()) {
    // 目录 - 递归查找所有markdown文件
    function walkDir(dir: string) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const itemStat = fs.statSync(itemPath);

        if (itemStat.isDirectory()) {
          walkDir(itemPath);
        } else if (item.endsWith('.md')) {
          files.push(itemPath);
        }
      }
    }
    walkDir(fullPath);
  }

  return files;
}

/**
 * 同步meme到数据库
 */
async function syncMemeToDatabase(meme: ParsedMeme, db: any): Promise<boolean> {
  try {
    // 使用UPSERT - 如果存在则更新，不存在则插入
    const query = `
      INSERT INTO memes (uid, name, cover, description, elo_score, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (uid) DO UPDATE SET
        name = EXCLUDED.name,
        cover = EXCLUDED.cover,
        description = EXCLUDED.description,
        updated_at = NOW()
      RETURNING id
    `;

    await db.query(query, [meme.uid, meme.name, meme.cover, meme.description, 1500]);
    return true;
  } catch (error) {
    console.error(`❌ 同步失败 ${meme.uid}:`, error);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📋 用法: npm run sync:memes <路径>

参数:
  <路径>  要同步的文件或文件夹路径

示例:
  npm run sync:memes data/memes/funny-cat.md
  npm run sync:memes data/memes
  npm run sync:memes data
    `);
    process.exit(0);
  }

  const targetPath = args[0];
  console.log(`🚀 开始同步: ${targetPath}`);

  try {
    // 获取数据库连接
    const db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/memearena',
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    });

    // 测试数据库连接
    await db.query('SELECT 1');
    console.log('✅ 数据库连接成功');

    // 获取要处理的文件
    const files = getFilesToProcess(targetPath);
    console.log(`📁 找到 ${files.length} 个markdown文件`);

    if (files.length === 0) {
      console.log('⚠️  没有找到markdown文件');
      process.exit(0);
    }

    // 处理每个文件
    const result: SyncResult = { success: 0, failed: 0, errors: [] };

    for (const file of files) {
      try {
        console.log(`📄 处理: ${path.relative(process.cwd(), file)}`);

        const content = fs.readFileSync(file, 'utf-8');
        const meme = parseMemeFile(content, file);

        if (!meme.cover) {
          console.warn(`⚠️  跳过 - 缺少cover图片: ${meme.uid}`);
          result.failed++;
          result.errors.push(`${meme.uid}: 缺少cover图片`);
          continue;
        }

        const success = await syncMemeToDatabase(meme, db);
        if (success) {
          console.log(`✅ 同步成功: ${meme.uid}`);
          result.success++;
        } else {
          result.failed++;
          result.errors.push(`${meme.uid}: 数据库同步失败`);
        }
      } catch (error) {
        console.error(`❌ 处理文件失败: ${file}`, error);
        result.failed++;
        result.errors.push(`${file}: ${error}`);
      }
    }

    // 输出结果
    console.log('\n📊 同步完成:');
    console.log(`   ✅ 成功: ${result.success}`);
    console.log(`   ❌ 失败: ${result.failed}`);

    if (result.errors.length > 0) {
      console.log('\n⚠️  错误详情:');
      result.errors.forEach(error => console.log(`   - ${error}`));
    }

    await db.end();
    process.exit(result.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('💥 同步过程失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  console.error('未捕获的错误:', error);
  process.exit(1);
});

module.exports = { parseMemeFile };
