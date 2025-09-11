'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeSliderCompact() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 防止水合不匹配
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-16 h-8 bg-muted rounded-full p-1">
        <div className="w-6 h-6 bg-muted-foreground rounded-full animate-pulse"></div>
      </div>
    );
  }

  // 主题顺序: 系统 -> 浅色 -> 深色
  const themes = ['system', 'light', 'dark'] as const;
  const currentIndex = themes.indexOf(theme as typeof themes[number]);
  const nextIndex = (currentIndex + 1) % themes.length;

  // 获取滑块位置（紧凑设计，仿佛只有2个状态）
  const getSliderPosition = () => {
    switch (theme) {
      case 'system':
        return 'translate-x-[20px]'; // 居中位置
      case 'light':
        return 'translate-x-0'; // 左侧
      case 'dark':
        return 'translate-x-[40px]'; // 右侧
      default:
        return 'translate-x-0';
    }
  };

  // 切换主题
  const handleClick = () => {
    setTheme(themes[nextIndex]);
  };

  // 获取当前图标
  const getCurrentIcon = () => {
    if (theme === 'dark') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    if (theme === 'light') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    // system - 电脑图标
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17H7a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-2m-4 0H9m2 0v2m0-2V9m2 0h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2z" />
      </svg>
    );
  };

  return (
    <div className="relative group">
      {/* 整个可点击区域 - 紧凑设计 */}
      <button
        onClick={handleClick}
        className="relative w-16 h-8 bg-muted rounded-full p-1 shadow-inner transition-all duration-200 hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label={`当前主题: ${theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色模式' : '深色模式'}，点击切换`}
        title={theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色模式' : '深色模式'}
      >
        {/* 紧凑的滑块轨道 - 只显示当前图标 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 当前模式的图标 */}
          <div className="flex items-center justify-center w-6 h-6 rounded-full">
            {getCurrentIcon()}
          </div>
        </div>

        {/* 滑块指示器 - 紧凑设计 */}
        <div className={`
          absolute top-1 ${getSliderPosition()} w-6 h-6 rounded-full transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'bg-gray-900 shadow-lg' : 'bg-white shadow-lg'}
          flex items-center justify-center pointer-events-none
        `}>
          {/* 滑块内图标 */}
          <div className={`
            ${theme === 'dark' ? 'text-yellow-400' : theme === 'light' ? 'text-yellow-500' : 'text-blue-500'}
            transition-colors duration-300
          `}>
            {getCurrentIcon()}
          </div>
        </div>
      </button>

      {/* 悬停提示 */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-border/50 backdrop-blur-sm">
          <div className="font-medium">{theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色模式' : '深色模式'}</div>
          <div className="text-xs text-muted-foreground mt-0.5">点击切换主题</div>
        </div>
      </div>
    </div>
  );
}