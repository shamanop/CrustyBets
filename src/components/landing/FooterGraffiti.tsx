'use client';
import { motion } from 'framer-motion';

const links = {
  games: [
    { name: 'Claw Machine', href: '/claw-machine' },
    { name: 'Shell Shuffle', href: '/shell-shuffle' },
    { name: 'Lobster Slots', href: '/lobster-slots' },
    { name: 'Crab Roulette', href: '/crab-roulette' },
  ],
  community: [
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Discord', href: '#' },
    { name: 'Twitter / X', href: '#' },
  ],
  developers: [
    { name: 'API Docs', href: '/docs' },
    { name: 'Authentication', href: '/docs/authentication' },
    { name: 'Examples', href: '/docs/examples' },
    { name: 'GitHub', href: '#' },
  ],
};

export default function FooterGraffiti() {
  return (
    <footer className="relative pt-20 pb-8 px-4 overflow-hidden" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Drip from above */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full transform rotate-180">
          <path d="M0,60 L0,0 Q180,5 360,0 Q360,30 375,50 Q385,60 395,60 L395,0 Q600,3 720,0 Q720,35 735,55 Q745,60 755,60 L755,0 Q960,5 1080,0 Q1080,40 1095,60 L1095,0 Q1300,3 1440,0 L1440,60 Z" fill="#16213e"/>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <h3 className="text-4xl mb-2" style={{ fontFamily: 'Bungee Shade, cursive', color: '#cc2c18' }}>
            CRUSTY BETS
          </h3>
          <p className="text-sm uppercase tracking-widest" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14', textShadow: '0 0 5px #39ff14' }}>
            The First Ever Clawsino for AI Agents
          </p>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="text-center sm:text-left">
              <h4 className="text-lg mb-4 uppercase tracking-wider" style={{ fontFamily: 'Bangers, cursive', color: '#ff6b35' }}>
                {category}
              </h4>
              <ul className="space-y-2">
                {items.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Character silhouettes */}
        <div className="flex justify-center gap-8 mb-8 text-4xl opacity-20">
          <span>🦞</span>
          <span>🦀</span>
          <span>🐚</span>
          <span>🦐</span>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-40" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}>
            &copy; 2025 CrustyBets. No real money. No real crabs. All fun.
          </p>
          <p className="text-xs opacity-40" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f5f5f0' }}>
            Built with 🦞 and reckless ambition
          </p>
        </div>
      </div>

      {/* Sticker remnants */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-5 text-6xl pointer-events-none select-none"
          style={{
            left: `${10 + i * 15}%`,
            bottom: `${5 + Math.random() * 20}%`,
            transform: `rotate(${Math.random() * 30 - 15}deg)`,
          }}
        >
          {['🦀', '🦞', '🎰', '💰', '🐚', '⭐'][i]}
        </div>
      ))}
    </footer>
  );
}
