'use client';

import { ApiMeme } from '@/types/meme';

interface MemeCardProps {
  meme: ApiMeme;
  onClick: () => void;
  disabled?: boolean;
  showStats?: boolean; // 是否显示 ELO 分数和胜负情况
}

export function MemeCard({ meme, onClick, disabled, showStats = false }: MemeCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        bg-card text-card-foreground rounded-xl p-6 shadow-lg cursor-pointer
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2'}
        border border-border hover:border-primary/50
        group overflow-hidden
      `}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={meme.cover}
          alt={meme.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            console.error('图片加载失败:', meme.cover);
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJoc2woMjE0LjMsMzEuOCUsOTEuNCUpIi8+CjxwYXRoIGQ9Ik0xMDAgNTBDMTE1LjQ3MyA1MCAxMjggNjIuNTI3MSAxMjggNzhDMTI4IDkzLjQ3MjkgMTE1LjQ3MyAxMDYgMTAwIDEwNkM4NC41MjcxIDEwNiA3MiA5My40NzI5IDcyIDc4QzcyIDYyLjUyNzEgODQuNTI3MSA1MCAxMDAgNTBaIiBmaWxsPSJoc2woMjE1LjQsMTYuMyUsNDYuOSUpIi8+CjxwYXRoIGQ9Ik0xMDAgMTI1VjE1MCIgZmlsbD0iaHNsKDIxNS40LDE2LjMlLDQ2LjklKSIvPgo8L3N2Zz4K';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {meme.name}
      </h3>
      
      {meme.description && (
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {meme.description}
        </p>
      )}
      
      {showStats && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span className="font-medium">ELO: {meme.elo_score}</span>
          <div className="flex gap-4">
            <span className="text-green-600 dark:text-green-400">胜: {meme.wins}</span>
            <span className="text-red-600 dark:text-red-400">负: {meme.losses}</span>
          </div>
        </div>
      )}
    </div>
  );
}