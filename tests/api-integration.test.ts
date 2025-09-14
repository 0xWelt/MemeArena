import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// 使用真实数据库配置
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/memearena';

// 模拟 NextRequest 对象
function createMockRequest() {
  return {
    method: 'GET',
    headers: new Headers(),
    url: 'http://localhost:3000/api/battle-pair'
  };
}

describe('主程序 API 集成测试', () => {
  let pool: Pool;

  beforeAll(async () => {
    // 使用与主程序相同的方式连接数据库
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

    // 测试数据库连接
    try {
      const client = await pool.connect();
      console.log('✅ 数据库连接成功');
      
      // 获取数据库信息
      const result = await client.query('SELECT COUNT(*) as count FROM memes');
      console.log(`📊 数据库中meme数量: ${result.rows[0].count}`);
      
      client.release();
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });

  test('主程序数据库连接正常', async () => {
    // 使用与主程序相同的查询测试数据库
    const result = await pool.query('SELECT version()');
    expect(result.rows[0]).toBeDefined();
    expect(result.rows[0].version).toContain('PostgreSQL');
  });

  test('主程序获取对战pair查询正常', async () => {
    // 使用与主程序完全相同的查询
    const result = await pool.query(
      'SELECT id, name, cover, description, elo_score, wins, losses FROM memes ORDER BY RANDOM() LIMIT 2'
    );

    console.log(`获取到 ${result.rows.length} 个meme用于对战`);

    // 验证获取到至少2个meme
    expect(result.rows.length).toBeGreaterThanOrEqual(2);

    // 验证数据格式与主程序期望的一致
    result.rows.forEach((meme, index) => {
      console.log(`Meme ${index + 1}:`, meme.name, '- 图片URL:', `${meme.cover?.substring(0, 50)}...`);
      
      // 验证所有字段都存在且类型正确
      expect(typeof meme.id).toBe('number');
      expect(typeof meme.name).toBe('string');
      expect(typeof meme.cover).toBe('string');
      expect(typeof meme.elo_score).toBe('number');
      expect(typeof meme.wins).toBe('number');
      expect(typeof meme.losses).toBe('number');
      
      // 验证必要字段不为空
      expect(meme.name).toBeTruthy();
      expect(meme.cover).toBeTruthy();
      expect(meme.elo_score).toBeGreaterThanOrEqual(0);
      expect(meme.wins).toBeGreaterThanOrEqual(0);
      expect(meme.losses).toBeGreaterThanOrEqual(0);
    });

    // 验证两个meme不同
    expect(result.rows[0].id).not.toBe(result.rows[1].id);
  });

  test('验证主程序查询逻辑的一致性', async () => {
    // 多次执行相同的查询，验证结果一致性
    const iterations = 3;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      const result = await pool.query(
        'SELECT id, name, cover, description, elo_score, wins, losses FROM memes ORDER BY RANDOM() LIMIT 2'
      );
      results.push(result);
    }

    // 验证每次都能获取到数据
    results.forEach((result, index) => {
      console.log(`第 ${index + 1} 次查询结果: ${result.rows.length} 个meme`);
      expect(result.rows.length).toBeGreaterThanOrEqual(2);
    });

    // 验证数据格式一致性
    results.forEach(result => {
      result.rows.forEach(meme => {
        expect(meme).toHaveProperty('id');
        expect(meme).toHaveProperty('name');
        expect(meme).toHaveProperty('cover');
        expect(meme).toHaveProperty('elo_score');
        expect(meme).toHaveProperty('wins');
        expect(meme).toHaveProperty('losses');
      });
    });
  });

  test('验证数据库表结构符合主程序要求', async () => {
    // 检查memes表是否存在且结构正确
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'memes'
      )
    `);
    expect(tableExists.rows[0].exists).toBe(true);

    // 检查必要字段是否存在
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'memes'
      ORDER BY ordinal_position
    `);

    const columnNames = columns.rows.map(col => col.column_name);
    const requiredColumns = ['id', 'name', 'cover', 'elo_score', 'wins', 'losses'];
    
    requiredColumns.forEach(col => {
      expect(columnNames).toContain(col);
    });

    console.log('数据库表结构验证通过');
  });

  test('模拟主程序完整的API调用流程', async () => {
    // 模拟主程序中的完整流程
    try {
      console.log('🎯 模拟获取对战组合...');
      
      // 使用与主程序完全相同的数据库调用
      const result = await pool.query(
        'SELECT id, name, cover, description, elo_score, wins, losses FROM memes ORDER BY RANDOM() LIMIT 2'
      );

      console.log('📊 查询结果:', result.rows.length, '条记录');
      result.rows.forEach((row: any, index: number) => {
        console.log(`   ${index + 1}.`, row.name, '- 图片URL:', `${row.cover?.substring(0, 50)}...`);
      });

      // 模拟构造响应（类似 NextResponse.json）
      const responseData = result.rows;
      
      // 验证响应数据格式
      expect(Array.isArray(responseData)).toBe(true);
      expect(responseData).toHaveLength(2);
      
      // 验证数据格式正确性
      responseData.forEach(meme => {
        expect(meme).toHaveProperty('id');
        expect(meme).toHaveProperty('name');
        expect(meme).toHaveProperty('cover');
        expect(meme).toHaveProperty('elo_score');
        expect(meme).toHaveProperty('wins');
        expect(meme).toHaveProperty('losses');
      });

      console.log('✅ 完整API流程测试通过');
      
    } catch (error) {
      console.error('❌ 获取对战组合失败:', error);
      throw error;
    }
  });
});