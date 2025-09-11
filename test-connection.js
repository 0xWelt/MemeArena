const { initDatabase } = require('./src/lib/db.ts');

async function testConnection() {
  console.log('🧪 测试数据库连接...');
  
  try {
    await initDatabase();
    console.log('✅ 数据库连接和初始化成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

testConnection();