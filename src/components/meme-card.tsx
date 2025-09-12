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
        transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2'}
        border border-border hover:border-primary/50
        group overflow-hidden relative
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity
      `}
    >
      {/* 图片容器 */}
      <div className="relative overflow-hidden rounded-xl mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meme.cover}
          alt={meme.name}
          className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
          onError={e => {
            e.currentTarget.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJoc2wodmFyKC0tbXV0ZWQpKSIvPgo8cGF0aCBkPSJNMTAwIDUwQzExNS40NzMgNTAgMTI4IDYyLjUyNzEgMTI4IDc4QzEyOCA5My40NzI5IDExNS40NzMgMTA2IDEwMCAxMDZDODQuNTI3MSAxMDYgNzIgOTMuNDcyOSA3MiA3OEM3MiA2Mi41MjcxIDg0LjUyNzEgNTAgMTAwIDUwWiIgZmlsbD0iaHNsKHZhcigtLW11dGVkLWZvcmVncm91bmQpKSIvPgo8L3N2Zz4K';
          }}
        />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 悬停时的光效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {meme.name}
        </h3>

        {meme.description && (
          <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
            {meme.description}
          </p>
        )}

        {showStats && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-primary">ELO: {meme.elo_score}</span>
              <div className="flex gap-3 text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full">
                  胜: {meme.wins}
                </span>
                <span className="text-red-600 dark:text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded-full">
                  负: {meme.losses}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 悬停时的交互提示 */}
      {!disabled && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.5 7.5l3 3"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
