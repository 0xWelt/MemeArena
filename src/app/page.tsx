import { BattleArena } from '@/components/battle-arena';
import { ClientLeaderboard } from '@/components/client-leaderboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
            🎭 Meme Arena
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto drop-shadow">
            选择你更喜欢的表情包，帮助建立最权威的 meme 排行榜！
          </p>
        </div>

        {/* Battle Arena */}
        <section className="mb-16 animate-slide-up">
          <BattleArena />
        </section>

        {/* Leaderboard */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <ClientLeaderboard />
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 text-primary-foreground/70 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>© 2024 Meme Arena - 让表情包找到它们应有的排名</p>
        </footer>
      </div>
    </main>
  );
}