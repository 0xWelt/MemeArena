import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    console.log('🏆 获取排行榜...');
    const result = await db.query(
      'SELECT id, name as title, cover as image_url, description, elo_score, wins, losses FROM memes ORDER BY elo_score DESC'
    );
    
    console.log('📊 排行榜数据:', result.rows.length, '条记录');
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('❌ 获取排行榜失败:', error);
    return NextResponse.json(
      { error: '获取排行榜失败' },
      { status: 500 }
    );
  }
}