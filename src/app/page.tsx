import { BattleArena } from '@/components/battle-arena';
import { ClientLeaderboard } from '@/components/client-leaderboard';

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎭 Meme Arena
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
            选择你更喜欢的表情包，帮助建立最权威的 meme 排行榜！
          </p>
        </div>

        {/* Battle Arena */}
        <section className="mb-16">
          <BattleArena />
        </section>

        {/* Leaderboard */}
        <section>
          <ClientLeaderboard />
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 text-white/70">
          <p>© 2024 Meme Arena - 让表情包找到它们应有的排名</p>
        </footer>
      </div>
    </main>
  );
}