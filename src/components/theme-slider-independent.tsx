'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeSliderIndependent() {
  const { theme, setTheme, systemTheme } = useTheme();
  
  // 获取当前实际主题（处理 SSR 和水合）
  const currentTheme = theme === 'system' ? systemTheme : theme;

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

  // 获取当前图标（扁平风格）
  const getCurrentIcon = () => {
    if (theme === 'dark') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59z" />
        </svg>
      );
    }
    if (theme === 'light') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59z" />
        </svg>
      );
    }
    // system - 电脑图标（扁平风格）
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2 0v12h12V5H6zm2 2h8v2H8V7zm0 4h8v2H8v-2z" />
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