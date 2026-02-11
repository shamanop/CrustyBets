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

/* ------------------------------------------------------------------ */
/*  Inline SVG casino assets for footer sticker remnants              */
/* ------------------------------------------------------------------ */
const footerStickerSVGs = [
  // Gold Coin
  (id: string) => (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`ft-gc-${id}`} x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5d442" />
          <stop offset="50%" stopColor="#ea9e2b" />
          <stop offset="100%" stopColor="#c47a1a" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill={`url(#ft-gc-${id})`} stroke="#c47a1a" strokeWidth="3" />
      <circle cx="30" cy="30" r="22" fill="none" stroke="#f5d442" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="30" y="36" textAnchor="middle" fill="#7a4a0a" fontSize="18" fontWeight="bold" fontFamily="Bangers, cursive">CC</text>
    </svg>
  ),
  // Casino Chip
  (_id: string) => (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" fill="#cc2c18" stroke="#8b1a10" strokeWidth="3" />
      <circle cx="30" cy="30" r="20" fill="none" stroke="#f5f5f0" strokeWidth="2" strokeDasharray="6 4" />
      <circle cx="30" cy="30" r="10" fill="#8b1a10" />
    </svg>
  ),
  // Lucky 7
  (id: string) => (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`ft-g7-${id}`} x1="15" y1="5" x2="45" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#cc2c18" />
        </linearGradient>
      </defs>
      <text x="30" y="50" textAnchor="middle" fill={`url(#ft-g7-${id})`} fontSize="52" fontWeight="bold" fontFamily="Bangers, cursive">7</text>
    </svg>
  ),
  // Cherry
  (_id: string) => (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 8 Q35 20 22 32" stroke="#3a7d1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 8 Q32 22 40 30" stroke="#3a7d1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="40" r="12" fill="#cc2c18" />
      <circle cx="40" cy="38" r="11" fill="#cc2c18" />
    </svg>
  ),
  // Star
  (id: string) => (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`ft-gs-${id}`} x1="10" y1="5" x2="50" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5d442" />
          <stop offset="100%" stopColor="#ea9e2b" />
        </linearGradient>
      </defs>
      <polygon points="30,4 36,22 56,22 40,34 46,52 30,42 14,52 20,34 4,22 24,22" fill={`url(#ft-gs-${id})`} stroke="#c47a1a" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  // Diamond
  (id: string) => (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`ft-gd-${id}`} x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      <rect x="15" y="15" width="30" height="30" rx="3" fill={`url(#ft-gd-${id})`} transform="rotate(45 30 30)" />
    </svg>
  ),
];

/* Stable positions for footer sticker remnants */
const footerStickerPositions = Array.from({ length: 6 }, (_, i) => ({
  left: `${10 + i * 15}%`,
  bottom: `${5 + ((i * 7 + 3) % 20)}%`,
  rotation: ((i * 13 + 5) % 30) - 15,
}));

export default function FooterGraffiti() {
  return (
    <footer className="relative pt-20 pb-8 px-4 overflow-hidden" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Logo - full neon sign treatment */}
        <div className="text-center mb-12">
          <h3
            className="text-4xl mb-2"
            style={{
              fontFamily: 'Bungee Shade, cursive',
              color: '#cc2c18',
              textShadow: '0 0 7px #cc2c18, 0 0 10px #cc2c18, 0 0 21px #cc2c18, 0 0 42px rgba(204,44,24,0.25)',
              animation: 'neon-flicker 3s infinite',
            }}
          >
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
                      className="footer-link text-sm opacity-60 hover:opacity-100 transition-all uppercase"
                      style={{
                        fontFamily: 'Bangers, cursive',
                        color: '#f5f5f0',
                        letterSpacing: '0.15em',
                      }}
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
            &copy; 2026 CrustyBets. No real money. No real crabs. All fun.
          </p>
          <p
            className="text-xs footer-tagline"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: '#f5f5f0',
              animation: 'neon-pulse 2s ease-in-out infinite',
            }}
          >
            Built with 🦞 and reckless ambition
          </p>
        </div>
      </div>

      {/* Sticker remnants - SVG casino assets */}
      {footerStickerPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: pos.left,
            bottom: pos.bottom,
            transform: `rotate(${pos.rotation}deg)`,
            opacity: 0.07,
          }}
        >
          {footerStickerSVGs[i % footerStickerSVGs.length](`ft-${i}`)}
        </div>
      ))}

      {/* Footer link hover styles */}
      <style>{`
        .footer-link:hover {
          text-shadow: 0 0 5px currentColor;
        }
      `}</style>
    </footer>
  );
}
