'use client';

import { ApiMeme } from '@/types/meme';

interface MemeCardProps {
  meme: ApiMeme;
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
        src={meme.image_url}
        alt={meme.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => {
          console.error('图片加载失败:', meme.image_url);
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBDMTE1LjQ3MyA1MCAxMjggNjIuNTI3MSAxMjggNzhDMTI4IDkzLjQ3MjkgMTE1LjQ3MyAxMDYgMTAwIDEwNkM4NC41MjcxIDEwNiA3MiA5My40NzI5IDcyIDc4QzcyIDYyLjUyNzEgODQuNTI3MSA1MCAxMDAgNTBaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0xMDAgMTI1VjE1MCIgZmlsbD0iIzlCOUI5QiIvPgo8L3N2Zz4K';
        }}
      />
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {meme.title}
      </h3>
      {meme.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 overflow-hidden text-ellipsis">
          {meme.description}
        </p>
      )}
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