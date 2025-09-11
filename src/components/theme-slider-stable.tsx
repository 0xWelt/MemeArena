'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeSliderStable() {
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
        return 'translate-x-[40px]'; // 右侧 - 修复对齐
      default:
        return 'translate-x-0';
    }
  };

  // 切换主题
  const handleClick = () => {
    setTheme(themes[nextIndex]);
  };

  // 获取当前图标（使用稳定的 SVG，避免水合问题）
  const getCurrentIcon = () => {
    if (theme === 'dark') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37-.73A4.42,4.42,0,0,1,15.42,8.5a8.64,8.64,0,0,1,.54-3.07,1,1,0,0,0-1.26-1.26A8.64,8.64,0,0,1,8.5,15.42,4.42,4.42,0,0,1,13,19.09a8.05,8.05,0,0,1,3.37-.73,1,1,0,0,0,.14-1.05,1,1,0,0,0-1.05-.14,6.05,6.05,0,0,0-3,.45A2.42,2.42,0,0,0,8.5,16.5,6.64,6.64,0,0,0,16.5,8.5a2.42,2.42,0,0,0,.45-3,1,1,0,0,0-.14-1.05A1,1,0,0,0,13,4.5a6.05,6.05,0,0,0-.45,3,2.42,2.42,0,0,0-2,2,6.64,6.64,0,0,0,6,6,2.42,2.42,0,0,0,2-2A6.05,6.05,0,0,0,21.64,13Z" />
        </svg>
      );
    }
    if (theme === 'light') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,18A6,6,0,1,1,18,12,6,6,0,0,1,12,18ZM12,2A1,1,0,0,0,11,3V5a1,1,0,0,0,2,0V3A1,1,0,0,0,12,2Zm0,22a1,1,0,0,0,1-1V21a1,1,0,0,0-2,0v2A1,1,0,0,0,12,24ZM4.22,4.22a1,1,0,0,0,1.41,0l1.41-1.41a1,1,0,0,0-1.41-1.41L4.22,2.81A1,1,0,0,0,4.22,4.22ZM19.78,19.78a1,1,0,0,0,1.41,0l1.41-1.41a1,1,0,0,0-1.41-1.41L19.78,18.37A1,1,0,0,0,19.78,19.78ZM2,13H4a1,1,0,0,0,0-2H2a1,1,0,0,0,0,2Zm18,0h2a1,1,0,0,0,0-2H20a1,1,0,0,0,0,2ZM13,2V4a1,1,0,0,0,2,0V2a1,1,0,0,0-2,0Zm0,18v2a1,1,0,0,0,2,0V20a1,1,0,0,0-2,0Z" />
        </svg>
      );
    }
    // system - 电脑图标（扁平风格）
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20,18H4V6H20M20,4H4A2,2,0,0,0,2,6V18a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4ZM4,18V6H20V18ZM6,8H18V16H6Z" />
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