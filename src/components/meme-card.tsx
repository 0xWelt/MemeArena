'use client';

import { Meme } from '@/types/meme';

interface MemeCardProps {
  meme: Meme;
  onClick: () => void;
  disabled?: boolean;
}

export function MemeCard({ meme, onClick, disabled }: MemeCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2'}
        border border-gray-200 dark:border-gray-700
      `}
    >
      <img
        src={meme.cover}
        alt={meme.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {meme.name}
      </h3>
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
        <span>ELO: {meme.elo_score}</span>
        <div className="flex gap-4">
          <span className="text-green-600 dark:text-green-400">胜: {meme.wins}</span>
          <span className="text-red-600 dark:text-red-400">负: {meme.losses}</span>
        </div>
      </div>
    </div>
  );
}