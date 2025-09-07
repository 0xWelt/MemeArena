const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据库初始化
const db = new sqlite3.Database('./memearena.db');

// 创建表
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

  // 插入测试数据
  db.get("SELECT COUNT(*) as count FROM memes", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO memes (title, image_url) VALUES (?, ?)");
      stmt.run("Distracted Boyfriend", "https://i.imgflip.com/1ur9b0.jpg");
      stmt.run("Drake Hotline Bling", "https://i.imgflip.com/2wifvo.jpg");
      stmt.run("Two Buttons", "https://i.imgflip.com/1otk96.jpg");
      stmt.run("Change My Mind", "https://i.imgflip.com/24y43o.jpg");
      stmt.run("Mocking Spongebob", "https://i.imgflip.com/1otpo4.jpg");
      stmt.finalize();
    }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
// 获取随机一对 meme 进行对战
app.get('/api/battle-pair', (req, res) => {
  db.all("SELECT * FROM memes ORDER BY RANDOM() LIMIT 2", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 提交对战结果
app.post('/api/battle-result', (req, res) => {
  const { meme1_id, meme2_id, winner_id } = req.body;
  
  if (!meme1_id || !meme2_id || !winner_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // 记录对战
  db.run(
    "INSERT INTO battles (meme1_id, meme2_id, winner_id) VALUES (?, ?, ?)",
    [meme1_id, meme2_id, winner_id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // 更新 ELO 分数（简化版）
      const k = 32;
      const winner = winner_id === meme1_id ? meme1_id : meme2_id;
      const loser = winner_id === meme1_id ? meme2_id : meme1_id;

      // 获取当前分数
      db.get("SELECT elo_score FROM memes WHERE id = ?", [winner], (err, winnerRow) => {
        db.get("SELECT elo_score FROM memes WHERE id = ?", [loser], (err, loserRow) => {
          const winnerScore = winnerRow.elo_score;
          const loserScore = loserRow.elo_score;

          // 计算预期胜率
          const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
          const expectedLoser = 1 - expectedWinner;

          // 更新分数
          const newWinnerScore = Math.round(winnerScore + k * (1 - expectedWinner));
          const newLoserScore = Math.round(loserScore + k * (0 - expectedLoser));

          db.run("UPDATE memes SET elo_score = ?, wins = wins + 1 WHERE id = ?", [newWinnerScore, winner]);
          db.run("UPDATE memes SET elo_score = ?, losses = losses + 1 WHERE id = ?", [newLoserScore, loser]);

          res.json({ success: true });
        });
      });
    }
  );
});

// 获取排行榜
app.get('/api/leaderboard', (req, res) => {
  db.all("SELECT * FROM memes ORDER BY elo_score DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});