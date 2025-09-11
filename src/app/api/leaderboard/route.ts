import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(
      'SELECT id, name as title, cover as image_url, elo_score, wins, losses FROM memes ORDER BY elo_score DESC'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('获取排行榜失败:', error);
    return NextResponse.json(
      { error: '获取排行榜失败' },
      { status: 500 }
    );
  }
}