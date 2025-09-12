'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggleImproved() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();

  // 获取当前实际主题（处理 SSR 和水合）
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const actualTheme = resolvedTheme || currentTheme || 'system';

  // 主题顺序: 系统 -> 浅色 -> 深色
  const themes = ['system', 'light', 'dark'] as const;
  const currentIndex = themes.indexOf(theme as (typeof themes)[number]);
  const nextIndex = (currentIndex + 1) % themes.length;

  // 切换主题
  const handleClick = () => {
    setTheme(themes[nextIndex]);
  };

  // 获取滑块位置 - 视觉调试法，找到真正居中
  const getSliderPosition = () => {
    // 新尺寸: 容器52px，滑块24px (w-6 h-6)
    // light和dark模式左右各留4px边距
    // 实际可用空间: 52px - 24px = 28px
    switch (theme) {
      case 'system':
        return 'translate-x-[14px]'; // 居中: 28px / 2 = 14px
      case 'light':
        return 'translate-x-[4px]'; // 左侧，留4px边距
      case 'dark':
        return 'translate-x-[24px]'; // 右侧，留4px边距 (28px-4px)
      default:
        return 'translate-x-[4px]';
    }
  };

  // 获取当前图标 - 使用更现代的设计
  const getCurrentIcon = () => {
    // 当主题是 system 时，显示显示器图标，否则根据实际主题显示对应图标
    if (theme === 'system') {
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    }

    if (actualTheme === 'dark') {
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    }

    // light theme
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  };

  // 获取当前主题的中文名称
  const getThemeName = () => {
    switch (theme) {
      case 'system':
        return '跟随系统';
      case 'light':
        return '浅色模式';
      case 'dark':
        return '深色模式';
      default:
        return '主题设置';
    }
  };

  return (
    <div className="relative group">
      {/* 整个可点击区域 - 修复边界对齐 */}
      <button
        onClick={handleClick}
        className={`
          relative w-[52px] h-7 rounded-full p-0 shadow-inner transition-all duration-300 hover:border-primary/60 group
          focus:outline-none border border-border/30
          bg-gray-200 dark:bg-gray-700
        `}
        aria-label={`当前主题: ${getThemeName()}，点击切换`}
        title={getThemeName()}
      >
        {/* 滑块指示器 - 完美垂直居中 */}
        <div
          className={`
          absolute top-1/2 -translate-y-1/2 ${getSliderPosition()} w-6 h-6 rounded-full transition-all duration-300 ease-in-out
          ${actualTheme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-100'}
          flex items-center justify-center pointer-events-none
        `}
        >
          {/* 滑块内图标 - 保留滑动效果，移除颜色闪烁 */}
          <div
            className={`
            ${actualTheme === 'dark' ? 'text-blue-400' : actualTheme === 'light' ? 'text-yellow-500' : 'text-gray-600'}
            transition-transform duration-300
          `}
          >
            {getCurrentIcon()}
          </div>
        </div>
      </button>

      {/* 悬停提示 - 更优雅 */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-border/50 backdrop-blur-sm">
          <div className="font-medium">{getThemeName()}</div>
          <div className="text-xs text-muted-foreground mt-0.5">点击切换主题</div>
        </div>
      </div>
    </div>
  );
}
