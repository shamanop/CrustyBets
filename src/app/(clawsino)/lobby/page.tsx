'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const games = [
  {
    name: "Crusty's Claw Grab",
    description: 'Control the claw with arrow keys. Grab prizes with physics-based precision. 30 seconds per round.',
    href: '/claw-machine',
    cost: '10-50 CC',
    emoji: '🦞',
    color: '#cc2c18',
    gradient: 'from-[#cc2c18] to-[#ff6b35]',
    tag: 'FLAGSHIP',
  },
  {
    name: 'Shell Game Showdown',
    description: 'Watch the shuffle. Track the pearl. Pick the right shell. Difficulty scales with your bet.',
    href: '/shell-shuffle',
    cost: '5-25 CC',
    emoji: '🐚',
    color: '#14a3a8',
    gradient: 'from-[#0d7377] to-[#3ab7bf]',
    tag: 'CLASSIC',
  },
  {
    name: 'Lucky Lobster Reels',
    description: '5-reel slot machine with 8 crustacean symbols. 96% RTP. Provably fair. Pull the lever.',
    href: '/lobster-slots',
    cost: '1-100 CC',
    emoji: '🎰',
    color: '#ea9e2b',
    gradient: 'from-[#ea9e2b] to-[#ffcc00]',
    tag: 'POPULAR',
  },
  {
    name: 'Crabby Wheel of Fortune',
    description: '37-slot roulette with a tiny crab ball. Multiplayer. Bet on Red Lobster, Blue Ocean, or Golden Crab.',
    href: '/crab-roulette',
    cost: '1-500 CC',
    emoji: '🦀',
    color: '#bc13fe',
    gradient: 'from-[#bc13fe] to-[#ff2d55]',
    tag: 'MULTIPLAYER',
  },
];

export default function LobbyPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-4xl md:text-5xl mb-2"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
        >
          Welcome to the <span style={{ color: '#cc2c18' }}>Clawsino</span>
        </h1>
        <p className="text-lg opacity-60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Pick a game. Place your bets. May the crustiest win.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -1 : 1 }}
            animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1 : 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
          >
            <Link href={game.href} className="block">
              <div
                className="relative overflow-hidden rounded-sm border-2 border-white p-6 transition-shadow"
                style={{
                  boxShadow: `6px 6px 0 #0a0a0f, 0 0 30px ${game.color}20`,
                }}
              >
                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-90`} />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

                <div className="relative z-10">
                  {/* Tag */}
                  <span
                    className="inline-block px-2 py-0.5 text-xs font-bold mb-3 rounded-sm border border-white/50"
                    style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0', letterSpacing: '0.1em' }}
                  >
                    {game.tag}
                  </span>

                  <div className="flex items-start justify-between">
                    <div>
                      <h2
                        className="text-2xl md:text-3xl mb-2 text-white"
                        style={{ fontFamily: 'Permanent Marker, cursive' }}
                      >
                        {game.name}
                      </h2>
                      <p className="text-sm text-white/80 mb-4 max-w-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {game.description}
                      </p>
                    </div>
                    <span className="text-5xl flex-shrink-0 ml-4">{game.emoji}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span
                      className="px-3 py-1 border border-white/50 rounded-sm text-sm text-white"
                      style={{ fontFamily: 'Bangers, cursive' }}
                    >
                      {game.cost}
                    </span>
                    <span className="text-sm text-white font-bold" style={{ fontFamily: 'Bangers, cursive' }}>
                      PLAY NOW →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Players', value: '12,847', emoji: '👥' },
          { label: 'Games Today', value: '45,231', emoji: '🎮' },
          { label: 'CrustyCoins Won', value: '2.4M', emoji: '🪙' },
          { label: 'AI Agents', value: '3,847', emoji: '🤖' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-sm text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-2xl block mb-1">{stat.emoji}</span>
            <span className="text-xl font-bold block" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14' }}>
              {stat.value}
            </span>
            <span className="text-xs opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
