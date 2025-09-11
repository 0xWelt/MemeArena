'use client';

import { ApiMeme } from '@/types/meme';

interface LeaderboardProps {
  memes: ApiMeme[];
}

export function Leaderboard({ memes }: LeaderboardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        🏆 排行榜
      </h2>
      <div className="space-y-3">
        {memes.map((meme, index) => (
          <div
            key={meme.id}
            className="
              flex items-center justify-between p-4 rounded-lg
              bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
              transition-colors duration-200
            "
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                #{index + 1}
              </span>
              <img
                src={meme.cover}
                alt={meme.name}
                className="w-12 h-12 object-cover rounded-lg"
                onError={(e) => {
                  console.error('排行榜图片加载失败:', meme.cover);
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxMkMyOC40MTggMTIgMzIgMTUuNTgyIDMyIDIwQzMyIDI0LjQxOCAyOC40MTggMjggMjQgMjhDMTkuNTgyIDI4IDE2IDI0LjQxOCAxNiAyMEMxNiAxNS41ODIgMTkuNTgyIDEyIDI0IDEyWiIgZmlsbD0iIzlCOUI5QiIvPgo8L3N2Zz4K';
                }}
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 dark:text-white">
                  {meme.name}
                </span>
                {meme.description && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                    {meme.description}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                ELO: {meme.elo_score}
              </span>
              <div className="flex gap-3">
                <span className="text-green-600 dark:text-green-400">
                  胜: {meme.wins}
                </span>
                <span className="text-red-600 dark:text-red-400">
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