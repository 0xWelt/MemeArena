'use client';

import { Meme } from '@/types/meme';

interface LeaderboardProps {
  memes: Meme[];
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
              />
              <span className="font-semibold text-gray-800 dark:text-white">
                {meme.name}
              </span>
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