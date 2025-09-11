'use client';

import { useState, useEffect } from 'react';
import { ApiMeme } from '@/types/meme';
import { MemeCard } from './meme-card';

interface BattleArenaProps {
  initialMemes?: ApiMeme[];
}

export function BattleArena({ initialMemes = [] }: BattleArenaProps) {
  const [memes, setMemes] = useState<ApiMeme[]>(initialMemes);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadBattlePair = async () => {
    try {
      setLoading(true);
      console.log('🔄 正在加载对战组合...');
      const response = await fetch('/api/battle-pair');
      console.log('📡 API 响应状态:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 接收到的数据:', data);
      console.log('🖼️  图片URL检查:', data.map((meme: ApiMeme) => meme.cover?.substring(0, 50)));
      
      setMemes(data);
    } catch (error) {
      console.error('❌ 加载对战组合失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitBattle = async (winnerId: number) => {
    if (memes.length !== 2 || submitting) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/battle-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meme1_id: memes[0].id,
          meme2_id: memes[1].id,
          winner_id: winnerId,
        }),
      });

      if (!response.ok) {
        throw new Error('提交失败');
      }

      // 重新加载对战组合
      loadBattlePair();
      
      // 触发排行榜更新事件
      window.dispatchEvent(new CustomEvent('leaderboardUpdate'));
    } catch (error) {
      alert('提交失败: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadBattlePair();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-lg">正在加载对战组合...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (memes.length !== 2) {
    return (
      <div className="text-center text-destructive p-8 bg-destructive/10 rounded-xl border border-destructive/20">
        <div className="text-6xl mb-4">😅</div>
        <h3 className="text-xl font-semibold mb-2">加载失败</h3>
        <p>无法加载对战组合，请刷新页面重试</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <MemeCard
          meme={memes[0]}
          onClick={() => submitBattle(memes[0].id)}
          disabled={submitting}
          showStats={false} // 对战页面隐藏统计信息，保持公平
        />
        
        <div className="text-4xl font-bold text-muted-foreground px-4 animate-pulse">
          VS
        </div>
        
        <MemeCard
          meme={memes[1]}
          onClick={() => submitBattle(memes[1].id)}
          disabled={submitting}
          showStats={false} // 对战页面隐藏统计信息，保持公平
        />
      </div>

      {submitting && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            提交中...
          </div>
        </div>
      )}
    </div>
  );
}