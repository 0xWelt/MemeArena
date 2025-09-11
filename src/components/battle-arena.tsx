'use client';

import { useState, useEffect } from 'react';
import { Meme } from '@/types/meme';
import { MemeCard } from './meme-card';

interface BattleArenaProps {
  initialMemes?: Meme[];
}

export function BattleArena({ initialMemes = [] }: BattleArenaProps) {
  const [memes, setMemes] = useState<Meme[]>(initialMemes);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadBattlePair = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/battle-pair');
      const data = await response.json();
      setMemes(data);
    } catch (error) {
      console.error('加载对战组合失败:', error);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  if (memes.length !== 2) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        无法加载对战组合
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          选择你更喜欢的表情包
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          点击卡片进行投票，帮助建立最权威的 meme 排行榜！
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <MemeCard
          meme={memes[0]}
          onClick={() => submitBattle(memes[0].id)}
          disabled={submitting}
        />
        
        <div className="text-4xl font-bold text-gray-400 dark:text-gray-500 px-4">
          VS
        </div>
        
        <MemeCard
          meme={memes[1]}
          onClick={() => submitBattle(memes[1].id)}
          disabled={submitting}
        />
      </div>

      {submitting && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
            提交中...
          </div>
        </div>
      )}
    </div>
  );
}