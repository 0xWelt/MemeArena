const fs = require('fs');
const path = require('path');

// 只在 .env 文件存在时加载
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config();
}

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

// 检测环境，选择数据库
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production' || process.env.DATABASE_URL;

let db;

if (isRailway && process.env.DATABASE_URL) {
  // PostgreSQL for Railway
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  db.type = 'postgresql';
} else {
  // SQLite for local development
  db = new sqlite3.Database('./memearena.db');
  db.type = 'sqlite';
}

// 数据库初始化函数
async function initDatabase() {
  if (db.type === 'postgresql') {
    // PostgreSQL 初始化
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
  } else {
    // SQLite 初始化（原有代码）
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS memes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          image_url TEXT NOT NULL,
          elo_score INTEGER DEFAULT 1500,
          wins INTEGER DEFAULT 0,
          losses INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS battles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          meme1_id INTEGER NOT NULL,
          meme2_id INTEGER NOT NULL,
          winner_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (meme1_id) REFERENCES memes (id),
          FOREIGN KEY (meme2_id) REFERENCES memes (id),
          FOREIGN KEY (winner_id) REFERENCES memes (id)
        )`);

        db.get("SELECT COUNT(*) as count FROM memes", (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO memes (title, image_url) VALUES (?, ?)");
            stmt.run("Distracted Boyfriend", "https://i.imgflip.com/1ur9b0.jpg");
            stmt.run("Drake Hotline Bling", "https://i.imgflip.com/2wifvo.jpg");
            stmt.run("Two Buttons", "https://i.imgflip.com/1otk96.jpg");
            stmt.run("Change My Mind", "https://i.imgflip.com/24y43o.jpg");
            stmt.run("Mocking Spongebob", "https://i.imgflip.com/1otpo4.jpg");
            stmt.finalize(() => resolve());
          } else {
            resolve();
          }
        });
      });
    });
  }
}

module.exports = { db, initDatabase };