'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggleProfessional() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 防止水合不匹配
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-card/80 hover:bg-card/60 border border-border/50 transition-all duration-200">
        <div className="w-5 h-5 bg-muted-foreground rounded-full animate-pulse"></div>
      </button>
    );
  }

  // 获取当前实际主题
  const currentTheme = theme === 'system' ? systemTheme : theme;

  // 切换主题：系统 -> 浅色 -> 深色 -> 系统
  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  // 获取图标
  const getIcon = () => {
    if (currentTheme === 'dark') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  // 获取当前主题标签
  const getThemeLabel = () => {
    if (theme === 'system') return '跟随系统';
    if (theme === 'light') return '浅色模式';
    return '深色模式';
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-card/80 hover:bg-card/60 border border-border/50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`当前主题: ${getThemeLabel()}，点击切换`}
      title={getThemeLabel()}
    >
      <div className="relative">
        {getIcon()}
        {/* 系统模式指示点 */}
        {theme === 'system' && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
        )}
      </div>
      
      {/* 悬停提示 */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-border/50 backdrop-blur-sm">
          <div className="font-medium">{getThemeLabel()}</div>
          <div className="text-xs text-muted-foreground mt-0.5">点击切换</div>
        </div>
      </div>
    </button>
  );
}