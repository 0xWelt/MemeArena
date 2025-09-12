import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meme Arena - 表情包竞技场',
  description: '选择你更喜欢的表情包，帮助建立最权威的 meme 排行榜！',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.className} bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <ThemeProvider>
          <Header />
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
