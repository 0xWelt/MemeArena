#!/usr/bin/env node

import { Pool } from 'pg';

async function resetDatabase() {
  const db = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/memearena',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🗑️  清空现有数据并重新创建表结构...');
    
    // 删除现有表（如果存在）
    await db.query('DROP TABLE IF EXISTS battles');
    await db.query('DROP TABLE IF EXISTS memes');
    
    // 重新创建 memes 表，包含 uid 字段
    await db.query(`
      CREATE TABLE memes (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(255) UNIQUE NOT NULL,
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
      CREATE TABLE battles (
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
    
    console.log('✅ 数据库重置完成，新表结构已创建');
    console.log('📋 新表包含 uid 字段，用于文件路径唯一标识');
    
  } catch (error) {
    console.error('❌ 重置失败:', error);
    throw error;
  } finally {
    await db.end();
  }
}

resetDatabase().catch(error => {
  console.error('未捕获的错误:', error);
  process.exit(1);
});