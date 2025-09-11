'use client';

import { useState, useEffect } from 'react';
import { ApiMeme } from '@/types/meme';
import { Leaderboard } from './leaderboard';

export function ClientLeaderboard() {
  const [memes, setMemes] = useState<ApiMeme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setMemes(data);
    } catch (error) {
      console.error('加载排行榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();

    // 监听排行榜更新事件
    const handleLeaderboardUpdate = () => {
      loadLeaderboard();
    };

    window.addEventListener('leaderboardUpdate', handleLeaderboardUpdate);
    
    return () => {
      window.removeEventListener('leaderboardUpdate', handleLeaderboardUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">加载排行榜...</p>
        </div>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 p-8">
        暂无数据
      </div>
    );
  }

  return <Leaderboard memes={memes} />;
}