'use client';

import { ApiMeme } from '@/types/meme';

interface LeaderboardProps {
  memes: ApiMeme[];
}

export function Leaderboard({ memes }: LeaderboardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl p-6 shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
        🏆 排行榜
      </h2>
      <div className="space-y-3">
        {memes.map((meme, index) => (
          <div
            key={meme.id}
            className={`
              flex items-center justify-between p-4 rounded-lg
              bg-muted/50 hover:bg-muted/80 transition-all duration-200
              border border-border/50 hover:border-border
              group
              ${index === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : ''}
              ${index === 1 ? 'bg-gray-500/10 border-gray-500/30' : ''}
              ${index === 2 ? 'bg-orange-500/10 border-orange-500/30' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold ${
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-500' :
                index === 2 ? 'text-orange-500' :
                'text-muted-foreground'
              }`}>
                #{index + 1}
              </span>
              <img
                src={meme.cover}
                alt={meme.name}
                className="w-12 h-12 object-cover rounded-lg border border-border group-hover:scale-105 transition-transform"
                onError={(e) => {
                  // 静默处理图片加载失败，显示占位符
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSJoc2woMjE0LjMsMzEuOCUsOTEuNCUpIi8+CjxwYXRoIGQ9Ik0yNCAxMkMyOC40MTggMTIgMzIgMTUuNTgyIDMyIDIwQzMyIDI0LjQxOCAyOC40MTggMjggMjQgMjhDMTkuNTgyIDI4IDE2IDI0LjQxOCAxNiAyMEMxNiAxNS41ODIgMTkuNTgyIDEyIDI0IDEyWiIgZmlsbD0iaHNsKDIxNS40LDE2LjMlLDQ2LjklKSIvPgo8L3N2Zz4K';
                }}
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {meme.name}
                </span>
                {meme.description && (
                  <span className="text-sm text-muted-foreground truncate max-w-xs">
                    {meme.description}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="font-bold text-foreground">
                ELO: {meme.elo_score}
              </span>
              <div className="flex gap-3">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  胜: {meme.wins}
                </span>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  负: {meme.losses}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}