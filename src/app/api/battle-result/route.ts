import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { BattleResult } from '@/types/meme';

export async function POST(request: NextRequest) {
  try {
    const body: BattleResult = await request.json();
    const { meme1_id, meme2_id, winner_id } = body;

    if (!meme1_id || !meme2_id || !winner_id) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 插入对战记录
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('提交对战结果失败:', error);
    return NextResponse.json(
      { error: '提交对战结果失败' },
      { status: 500 }
    );
  }
}