'use client';

import { ApiMeme } from '@/types/meme';

interface LeaderboardProps {
  memes: ApiMeme[];
}

export function Leaderboard({ memes }: LeaderboardProps) {
  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-yellow-400/30 text-yellow-600 dark:text-yellow-400';
      case 1:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30 text-gray-600 dark:text-gray-400';
      case 2:
        return 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 border-orange-400/30 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gradient-to-r from-muted/30 to-muted/20 border-border/50 text-foreground';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* 排行榜标题 */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          🏆 表情包排行榜
        </h2>
        <p className="text-muted-foreground">基于 ELO 评分系统的权威排名</p>
      </div>

      {/* 排行榜列表 */}
      <div className="space-y-3">
        {memes.map((meme, index) => (
          <div
            key={meme.id}
            className={`
              flex items-center justify-between p-6 rounded-2xl border-2 backdrop-blur-sm
              transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
              group relative overflow-hidden
              ${getRankStyle(index)}
            `}
          >
            {/* 排名和图标 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">{getRankIcon(index)}</div>
                <div className="text-sm text-muted-foreground">第 {index + 1} 名</div>
              </div>

              {/* 表情包图片 */}
              <div className="relative group">
                <img
                  src={meme.cover}
                  alt={meme.name}
                  className="w-16 h-16 object-cover rounded-xl border-2 border-white/50 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  onError={e => {
                    e.currentTarget.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSJoc2wodmFyKC0tbXV0ZWQpKSIvPgo8cGF0aCBkPSJNMzIgMTZDMzYuNDE4IDE2IDQwIDE5LjU4MiA0MCAyNEM0MCAyOC40MTggMzYuNDE4IDMyIDMyIDMyQzI3LjU4MiAzMiAyNCAyOC40MTggMjQgMjRDMjQgMTkuNTgyIDI3LjU4MiAxNiAzMiAxNloiIGZpbGw9ImhzbCh2YXIoLS1tdXRlZC1mb3JlZ3JvdW5kKSkiLz4KPC9zdmc+Cg==';
                  }}
                />
                {/* 悬停光效 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* 表情包信息 */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {meme.name}
                </h3>
                {meme.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                    {meme.description}
                  </p>
                )}
              </div>
            </div>

            {/* 评分和统计 */}
            <div className="flex items-center gap-6">
              {/* ELO 评分 */}
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{meme.elo_score}</div>
                <div className="text-xs text-muted-foreground">ELO</div>
              </div>

              {/* 胜负统计 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">●</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {meme.wins} 胜
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-red-500">●</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {meme.losses} 负
                  </span>
                </div>
              </div>

              {/* 胜率 */}
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {meme.wins + meme.losses > 0
                    ? Math.round((meme.wins / (meme.wins + meme.losses)) * 100)
                    : 0}
                  %
                </div>
                <div className="text-xs text-muted-foreground">胜率</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部说明 */}
      <div className="text-center text-muted-foreground text-sm mt-8">
        <p>💡 基于 ELO 评分算法，胜率越高的表情包排名越靠前</p>
      </div>
    </div>
  );
}
