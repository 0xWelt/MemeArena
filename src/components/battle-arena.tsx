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
      const response = await fetch('/api/battle-pair');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMemes(data);
    } catch (error) {
      // 静默处理错误，用户界面已显示错误状态
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
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">🎭</div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg font-medium">正在准备对战...</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
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
    <div className="space-y-12">
      {/* VS 标题 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center space-x-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-24"></div>
          <div className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
            VS
          </div>
          <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent w-24"></div>
        </div>
      </div>

      {/* 对战卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1">
          <MemeCard
            meme={memes[0]}
            onClick={() => submitBattle(memes[0].id)}
            disabled={submitting}
            showStats={false}
          />
        </div>
        
        <div className="order-1 lg:order-2 flex items-center justify-center">
          <div className="text-8xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent opacity-80">
            ⚔️
          </div>
        </div>
        
        <div className="order-3">
          <MemeCard
            meme={memes[1]}
            onClick={() => submitBattle(memes[1].id)}
            disabled={submitting}
            showStats={false}
          />
        </div>
      </div>

      {/* 提交状态 */}
      {submitting && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-muted-foreground bg-muted/50 px-6 py-3 rounded-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="font-medium">正在记录您的选择...</span>
          </div>
        </div>
      )}
    </div>
  );
}