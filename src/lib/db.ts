import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// 加载环境变量
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('📋 检测到 .env 文件，加载环境变量');
  require('dotenv').config({ path: envPath });
} else {
  console.log('⚠️  未检测到 .env 文件，使用默认配置');
}

// 创建 PostgreSQL 连接池
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/memearena';

console.log('🔌 数据库连接配置:');
console.log('   DATABASE_URL:', connectionString.replace(/:[^:@]+@/, ':****@'));
console.log('   连接时间:', new Date().toLocaleString());

const db = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false,
  connectionTimeoutMillis: 10000, // 10秒连接超时
  idleTimeoutMillis: 30000, // 30秒空闲超时
});

// 测试数据库连接并记录详细信息
db.connect()
  .then(client => {
    console.log('✅ 数据库连接成功');
    console.log('   连接池状态: 活跃连接数 =', db.totalCount, ', 空闲连接数 =', db.idleCount);
    
    // 获取数据库版本信息
    client.query('SELECT version()').then(result => {
      console.log('   PostgreSQL版本:', result.rows[0].version.split(' ')[0]);
    }).catch(err => {
      console.log('   无法获取版本信息:', err.message);
    });
    
    client.release();
  })
  .catch(err => {
    console.error('❌ 数据库连接失败:', err.message);
    console.error('   错误代码:', err.code);
    console.error('   错误详情:', err.detail);
  });

// 数据库初始化函数
export async function initDatabase() {
  try {
    // 创建 memes 表
    await db.query(`
      CREATE TABLE IF NOT EXISTS memes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cover VARCHAR(500) NOT NULL,
        description TEXT,
        elo_score INTEGER DEFAULT 1500,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建 battles 表
    await db.query(`
      CREATE TABLE IF NOT EXISTS battles (
        id SERIAL PRIMARY KEY,
        meme1_id INTEGER NOT NULL,
        meme2_id INTEGER NOT NULL,
        winner_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (meme1_id) REFERENCES memes (id),
        FOREIGN KEY (meme2_id) REFERENCES memes (id),
        FOREIGN KEY (winner_id) REFERENCES memes (id)
      )
    `);

    // 检查是否需要插入测试数据
    const result = await db.query('SELECT COUNT(*) as count FROM memes');
    if (result.rows[0].count === 0) {
      const testMemes = [
        ['Distracted Boyfriend', 'https://i.imgflip.com/1ur9b0.jpg'],
        ['Drake Hotline Bling', 'https://i.imgflip.com/2wifvo.jpg'],
        ['Two Buttons', 'https://i.imgflip.com/1otk96.jpg'],
        ['Change My Mind', 'https://i.imgflip.com/24y43o.jpg'],
        ['Mocking Spongebob', 'https://i.imgflip.com/1otpo4.jpg']
      ];

      for (const [name, cover] of testMemes) {
        await db.query(
          'INSERT INTO memes (name, cover) VALUES ($1, $2)',
          [name, cover]
        );
      }
    }

    console.log('✅ PostgreSQL 数据库初始化完成');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
}

export default db;