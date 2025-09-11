'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggleProfessional } from './theme-toggle-professional';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左侧区域：图标 + 标题 + 搜索 */}
        <div className="flex items-center gap-4 flex-1">
          {/* Logo 和标题 */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-2xl group-hover:scale-110 transition-transform">🎭</div>
            <div className="space-y-0.5">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Meme Arena
              </h1>
              <p className="text-xs text-muted-foreground">表情包竞技场</p>
            </div>
          </Link>

          {/* 搜索栏 */}
          <div className="hidden md:flex items-center relative max-w-xs flex-1">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="搜索表情包..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-card/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧区域：导航链接 + 主题切换 + GitHub */}
        <div className="flex items-center gap-3">
          {/* 导航链接 */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              关于
            </Link>
            <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              排行榜
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              博客
            </Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              帮助
            </Link>
          </nav>

          {/* 主题切换 */}
          <ThemeToggleProfessional />

          {/* GitHub 链接 */}
          <a
            href="https://github.com/your-username/meme-arena"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-card/50 hover:bg-card/60 border border-border/50 transition-all duration-200 group"
            aria-label="GitHub 仓库"
            title="GitHub 仓库"
          >
            <svg className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}