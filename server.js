const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据库初始化
initDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
// 获取随机一对 meme 进行对战
app.get('/api/battle-pair', async (req, res) => {
  try {
    if (db.type === 'postgresql') {
      const result = await db.query('SELECT * FROM memes ORDER BY RANDOM() LIMIT 2');
      res.json(result.rows);
    } else {
      db.all("SELECT * FROM memes ORDER BY RANDOM() LIMIT 2", (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 提交对战结果
app.post('/api/battle-result', async (req, res) => {
  const { meme1_id, meme2_id, winner_id } = req.body;
  
  if (!meme1_id || !meme2_id || !winner_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    if (db.type === 'postgresql') {
      // PostgreSQL 版本
      await db.query(
        'INSERT INTO battles (meme1_id, meme2_id, winner_id) VALUES ($1, $2, $3)',
        [meme1_id, meme2_id, winner_id]
      );

      // 更新 ELO 分数
      const k = 32;
      const winner = winner_id === meme1_id ? meme1_id : meme2_id;
      const loser = winner_id === meme1_id ? meme2_id : meme1_id;

      const winnerResult = await db.query('SELECT elo_score FROM memes WHERE id = $1', [winner]);
      const loserResult = await db.query('SELECT elo_score FROM memes WHERE id = $1', [loser]);

      const winnerScore = winnerResult.rows[0].elo_score;
      const loserScore = loserResult.rows[0].elo_score;

      const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
      const newWinnerScore = Math.round(winnerScore + k * (1 - expectedWinner));
      const newLoserScore = Math.round(loserScore + k * (0 - expectedWinner));

      await db.query('UPDATE memes SET elo_score = $1, wins = wins + 1 WHERE id = $2', [newWinnerScore, winner]);
      await db.query('UPDATE memes SET elo_score = $1, losses = losses + 1 WHERE id = $2', [newLoserScore, loser]);

      res.json({ success: true });
    } else {
      // SQLite 版本（原有代码）
      db.run(
        "INSERT INTO battles (meme1_id, meme2_id, winner_id) VALUES (?, ?, ?)",
        [meme1_id, meme2_id, winner_id],
        (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const k = 32;
          const winner = winner_id === meme1_id ? meme1_id : meme2_id;
          const loser = winner_id === meme1_id ? meme2_id : meme1_id;

          db.get("SELECT elo_score FROM memes WHERE id = ?", [winner], (err, winnerRow) => {
            db.get("SELECT elo_score FROM memes WHERE id = ?", [loser], (err, loserRow) => {
              const winnerScore = winnerRow.elo_score;
              const loserScore = loserRow.elo_score;

              const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
              const newWinnerScore = Math.round(winnerScore + k * (1 - expectedWinner));
              const newLoserScore = Math.round(loserScore + k * (0 - expectedWinner));

              db.run("UPDATE memes SET elo_score = ?, wins = wins + 1 WHERE id = ?", [newWinnerScore, winner]);
              db.run("UPDATE memes SET elo_score = ?, losses = losses + 1 WHERE id = ?", [newLoserScore, loser]);

              res.json({ success: true });
            });
          });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取排行榜
app.get('/api/leaderboard', async (req, res) => {
  try {
    if (db.type === 'postgresql') {
      const result = await db.query('SELECT * FROM memes ORDER BY elo_score DESC');
      res.json(result.rows);
    } else {
      db.all("SELECT * FROM memes ORDER BY elo_score DESC", (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});