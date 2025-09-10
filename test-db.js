const fs = require('fs');
const path = require('path');

// 只在 .env 文件存在时加载
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config();
}

const { Pool } = require('pg');

async function testDatabaseConnection() {
  console.log('🧪 测试数据库连接...');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL 未在 .env 文件中设置');
    return;
  }

  console.log('📋 DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000, // 10秒超时
      idleTimeoutMillis: 30000
    });

    // 测试连接
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');

    // 检查表是否存在
    const tableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'memes'
      )
    `);
    
    if (tableResult.rows[0].exists) {
      console.log('✅ memes 表存在');
      
      // 读取数据
      const dataResult = await client.query('SELECT COUNT(*) as count, MAX(id) as max_id FROM memes');
      const { count, max_id } = dataResult.rows[0];
      console.log(`📊 当前数据: ${count} 条记录, 最大ID: ${max_id || '无'}`);
      
      if (count > 0) {
        const sampleResult = await client.query('SELECT id, name, cover, elo_score FROM memes LIMIT 1');
        const meme = sampleResult.rows[0];
        console.log('🎯 示例数据:', {
          id: meme.id,
          name: meme.name,
          cover: meme.cover ? meme.cover.substring(0, 50) + '...' : '无封面',
          elo_score: meme.elo_score
        });
      }
    } else {
      console.log('⚠️  memes 表不存在，数据库可能是空的');
    }

    // 检查 battles 表
    const battlesTableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'battles'
      )
    `);
    
    if (battlesTableResult.rows[0].exists) {
      console.log('✅ battles 表存在');
      const battlesCount = await client.query('SELECT COUNT(*) as count FROM battles');
      console.log(`⚔️  对战记录: ${battlesCount.rows[0].count} 条`);
    }

    client.release();
    await pool.end();
    
    console.log('🎉 数据库测试完成');
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 提示: 连接被拒绝，检查数据库URL是否正确');
    } else if (error.code === '28P01') {
      console.log('💡 提示: 认证失败，检查用户名密码');
    } else if (error.code === '3D000') {
      console.log('💡 提示: 数据库不存在');
    } else if (error.message.includes('timeout')) {
      console.log('💡 提示: 连接超时，检查网络连接和数据库状态');
    }
    console.log('🔍 详细错误:', error);
  }
}

// 运行测试
testDatabaseConnection().catch(console.error);