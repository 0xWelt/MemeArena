'use client';

import { useLeaderboard } from '@/hooks/use-leaderboard';
import { Leaderboard } from './leaderboard';

export function ClientLeaderboard() {
  const { memes, isLoading, isRefreshing, refresh, lastUpdated } = useLeaderboard();

  if (isLoading && memes.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-lg">加载排行榜中...</p>
          <div className="flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: '0s' }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-12 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="text-8xl mb-6 animate-bounce emoji">🏆</div>
        <h3 className="text-2xl font-bold mb-4">排行榜虚位以待</h3>
        <p className="text-lg mb-6">还没有表情包参与排名</p>
        <div className="inline-flex items-center gap-2 text-primary font-medium">
          <span>快去参与对战，为喜欢的表情包投票吧！</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {/* 排行榜标题 */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            <span className="inline-block emoji">🏆</span>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent ml-2">
              排行榜
            </span>
          </h2>
          <p className="text-muted-foreground">💡 基于 ELO 评分算法，胜率越高的表情包排名越靠前</p>
        </div>

        {/* 状态指示器 - 紧跟在标题下方 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            {isRefreshing && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                <span>更新中...</span>
              </div>
            )}
            {lastUpdated && (
              <div className="flex items-center gap-2">
                <span>🕐 最后更新: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50"
            >
              <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>

      <Leaderboard memes={memes} />
    </div>
  );
}
