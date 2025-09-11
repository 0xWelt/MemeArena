'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 防止水合不匹配
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="fixed top-6 right-6 p-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 opacity-50 cursor-not-allowed"
        disabled
        aria-label="切换主题"
      >
        <div className="w-6 h-6 bg-muted rounded-full animate-pulse"></div>
      </button>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const getNextTheme = () => {
    if (theme === 'system') return 'light';
    if (theme === 'light') return 'dark';
    return 'system';
  };

  const getThemeIcon = () => {
    if (currentTheme === 'dark') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    if (currentTheme === 'light') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    // system theme
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  };

  const getThemeLabel = () => {
    if (theme === 'system') return '跟随系统';
    if (theme === 'light') return '浅色模式';
    return '深色模式';
  };

  return (
    <div className="fixed top-6 right-6 z-50 group">
      <button
        onClick={() => setTheme(getNextTheme())}
        className="p-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:border-primary/50"
        aria-label={`当前主题: ${getThemeLabel()}，点击切换`}
        title={`当前主题: ${getThemeLabel()}`}
      >
        <div className="relative">
          {getThemeIcon()}
          {/* 主题指示器 */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse"></div>
        </div>
      </button>
      
      {/* 主题切换提示 */}
      <div className="absolute top-full right-0 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-popover text-popover-foreground px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-2xl border border-border/50 backdrop-blur-sm">
          <div className="font-medium">{getThemeLabel()}</div>
          <div className="text-xs text-muted-foreground mt-1">点击切换主题</div>
        </div>
      </div>
    </div>
  );
}