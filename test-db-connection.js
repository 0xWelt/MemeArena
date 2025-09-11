const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 加载环境变量
const envPath = path.join(__dirname, '.env');
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

const db = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

async function testConnection() {
  try {
    console.log('🧪 测试数据库连接...');
    
    // 测试连接
    const client = await db.connect();
    console.log('✅ 数据库连接成功');
    
    // 检查表结构
    console.log('📊 检查数据库结构...');
    
    // 检查 memes 表
    const tableResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'memes' 
      ORDER BY ordinal_position
    `);
    
    console.log('🗄️  memes 表结构:');
    tableResult.rows.forEach(column => {
      console.log(`   ${column.column_name}: ${column.data_type} ${column.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // 检查数据
    const dataResult = await client.query('SELECT id, name, cover, description, elo_score, wins, losses FROM memes LIMIT 3');
    console.log('📋 示例数据:');
    dataResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.name}`);
      console.log(`      图片: ${row.cover ? row.cover.substring(0, 60) + '...' : '无'}`);
      console.log(`      描述: ${row.description || '无'}`);
      console.log(`      ELO: ${row.elo_score}, 胜负: ${row.wins}/${row.losses}`);
    });
    
    client.release();
    await db.end();
    
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
    process.exit(1);
  }
}

testConnection();