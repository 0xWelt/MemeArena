import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    console.log('🎯 获取对战组合...');
    const result = await db.query(
      'SELECT id, name, cover, description, elo_score, wins, losses FROM memes ORDER BY RANDOM() LIMIT 2'
    );
    
    console.log('📊 查询结果:', result.rows.length, '条记录');
    result.rows.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}.`, row.name, '- 图片URL:', row.cover?.substring(0, 50) + '...');
    });
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('❌ 获取对战组合失败:', error);
    return NextResponse.json(
      { error: '获取对战组合失败' },
      { status: 500 }
    );
  }
}