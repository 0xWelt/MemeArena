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
      // 静默处理错误，用户界面已显示错误状态
      // 可以在这里添加错误上报逻辑
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
      <div className="text-center text-muted-foreground p-12 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h3 className="text-2xl font-bold mb-4">排行榜虚位以待</h3>
        <p className="text-lg mb-6">还没有表情包参与排名</p>
        <div className="inline-flex items-center gap-2 text-primary font-medium">
          <span>快去参与对战，为喜欢的表情包投票吧！</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    );
  }

  return <Leaderboard memes={memes} />;
}