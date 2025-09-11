'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeSlider() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 防止水合不匹配
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-24 h-8 bg-muted rounded-full p-1">
        <div className="w-6 h-6 bg-muted-foreground rounded-full animate-pulse"></div>
      </div>
    );
  }

  // 主题顺序: 系统 -> 浅色 -> 深色
  const themes = ['system', 'light', 'dark'] as const;
  const currentIndex = themes.indexOf(theme as typeof themes[number]);

  // 获取滑块位置
  const getSliderPosition = () => {
    switch (theme) {
      case 'system':
        return 'left-1';
      case 'light':
        return 'left-9';
      case 'dark':
        return 'left-[49px]';
      default:
        return 'left-1';
    }
  };

  // 切换主题
  const handleClick = (newTheme: typeof themes[number]) => {
    setTheme(newTheme);
  };

  return (
    <div className="relative group">
      {/* 滑块轨道 */}
      <div className="relative w-24 h-8 bg-muted rounded-full p-1 shadow-inner">
        {/* 轨道指示器 */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {/* 太阳图标 - 浅色 */}
          <button
            onClick={() => handleClick('light')}
            className={`z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
              theme === 'light' ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'
            }`}
            aria-label="浅色模式"
            title="浅色模式"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          {/* 系统图标 - 居中 */}
          <button
            onClick={() => handleClick('system')}
            className={`z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
              theme === 'system' ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
            }`}
            aria-label="跟随系统"
            title="跟随系统"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>

          {/* 月亮图标 - 深色 */}
          <button
            onClick={() => handleClick('dark')}
            className={`z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-muted-foreground hover:text-indigo-400'
            }`}
            aria-label="深色模式"
            title="深色模式"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

        {/* 滑块指示器 */}
        <div className={`
          absolute top-1 ${getSliderPosition()} w-6 h-6 rounded-full transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'bg-gray-900 shadow-lg' : 'bg-white shadow-lg'}
          flex items-center justify-center
          group-hover:scale-105
        `}>
          {/* 滑块内图标 */}
          <div className={`
            ${theme === 'dark' ? 'text-yellow-400' : theme === 'light' ? 'text-yellow-500' : 'text-blue-500'}
            transition-colors duration-300
          `}>
            {theme === 'dark' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            {theme === 'light' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            {theme === 'system' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
          </div>
        </div>
      </div>

      {/* 悬停提示 */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-border/50 backdrop-blur-sm">
          <div className="font-medium">{theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色模式' : '深色模式'}</div>
          <div className="text-xs text-muted-foreground mt-0.5">点击图标或拖动滑块切换</div>
        </div>
      </div>
    </div>
  );
}