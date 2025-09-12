import { BattleArena } from '@/components/battle-arena';
import { ClientLeaderboard } from '@/components/client-leaderboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* 主要内容区域 */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            🎭 Meme Arena
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            选择你更喜欢的表情包，帮助建立最权威的表情包排行榜
          </p>
        </div>

        {/* Battle Arena */}
        <section className="mb-16 animate-slide-in">
          <div className="glass rounded-2xl p-8 mb-8">
            <BattleArena />
          </div>
        </section>

        {/* Leaderboard */}
        <section className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass rounded-2xl p-8">
            <ClientLeaderboard />
          </div>
        </section>

        {/* Footer */}
        <footer
          className="text-center mt-16 text-muted-foreground animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <p className="text-sm">© 2024 Meme Arena - 让表情包找到它们应有的排名</p>
        </footer>
      </div>
    </main>
  );
}
