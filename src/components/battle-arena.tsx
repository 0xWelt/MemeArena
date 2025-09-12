'use client';

import { useBattleQueue } from '@/hooks/use-battle-queue';
import { MemeCard } from './meme-card';

export function BattleArena() {
  const {
    currentPair,
    queue,
    isLoading,
    isSubmitting,
    submitBattle,
    loadMorePairs,
  } = useBattleQueue();

  if (isLoading && currentPair.length === 0) {
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
      </div>
    );
  }

  if (currentPair.length !== 2) {
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
      {/* 对战卡片 - 一左一右经典布局 */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* 左侧卡片 */}
        <div className="flex-1 max-w-md">
          <MemeCard
            meme={currentPair[0]}
            onClick={() => submitBattle(currentPair[0].id)}
            disabled={isSubmitting}
            showStats={false}
          />
        </div>

        {/* 中央对战图标 */}
        <div className="flex-shrink-0 flex items-center justify-center my-8 lg:my-0">
          <div className="text-8xl lg:text-9xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent opacity-90 animate-pulse">
            ⚔️
          </div>
        </div>

        {/* 右侧卡片 */}
        <div className="flex-1 max-w-md">
          <MemeCard
            meme={currentPair[1]}
            onClick={() => submitBattle(currentPair[1].id)}
            disabled={isSubmitting}
            showStats={false}
          />
        </div>
      </div>

      {/* 提交状态 */}
      {isSubmitting && (
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 text-muted-foreground">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="font-medium">正在记录您的选择...</span>
          </div>
        </div>
      )}

      {/* 队列状态指示器 */}
      {queue.length < 3 && !isLoading && (
        <div className="text-center mt-8">
          <button
            onClick={loadMorePairs}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            队列剩余 {queue.length} 组，点击加载更多
          </button>
        </div>
      )}
    </div>
  );
}
