import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(
      'SELECT id, name as title, cover as image_url, elo_score, wins, losses FROM memes ORDER BY RANDOM() LIMIT 2'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('获取对战组合失败:', error);
    return NextResponse.json(
      { error: '获取对战组合失败' },
      { status: 500 }
    );
  }
}