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
      console.log('🔄 正在加载排行榜...');
      const response = await fetch('/api/leaderboard');
      console.log('📡 排行榜 API 响应状态:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 接收到的排行榜数据:', data);
      console.log('🏆 排行榜记录数:', data.length);
      if (data.length > 0) {
        console.log('🖼️  第一条记录图片URL:', data[0].cover?.substring(0, 50));
        console.log('📝 第一条记录标题:', data[0].name);
        console.log('📝 第一条记录描述:', data[0].description);
      }
      
      setMemes(data);
    } catch (error) {
      console.error('❌ 加载排行榜失败:', error);
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
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-lg">加载排行榜中...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 bg-card rounded-xl border border-border">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold mb-2">暂无数据</h3>
        <p>还没有表情包参与排名，快去投票吧！</p>
      </div>
    );
  }

  return <Leaderboard memes={memes} />;
}