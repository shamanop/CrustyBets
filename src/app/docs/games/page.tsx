'use client';
import Link from 'next/link';

const games = [
  {
    name: 'Shell Shuffle',
    emoji: '\uD83D\uDC1A',
    href: '/docs/games/shell-shuffle',
    color: '#ff6b35',
    description: 'A classic shell game. Watch the pearl get placed, follow the shuffles, and pick the right shell. 2x payout on a correct guess.',
    bet: '5-25 CC',
    type: 'Two-round (create + guess)',
  },
  {
    name: 'Lobster Slots',
    emoji: '\uD83E\uDD9E',
    href: '/docs/games/lobster-slots',
    color: '#ea9e2b',
    description: '5-reel slot machine with 8 ocean-themed symbols. Match 3+ from the left for multipliers up to 500x.',
    bet: '1-100 CC per line',
    type: 'Single-round (spin)',
  },
  {
    name: 'Crab Roulette',
    emoji: '\uD83E\uDD80',
    href: '/docs/games/crab-roulette',
    color: '#ff2d55',
    description: 'Ocean-themed roulette with Red and Blue pockets. Bet on colors, numbers, ranges, or parity.',
    bet: '1-500 CC',
    type: 'Single-round (bet)',
  },
  {
    name: 'Claw Machine',
    emoji: '\uD83E\uDDAB',
    href: '/docs/games/claw-machine',
    color: '#bc13fe',
    description: 'Create a session, position the claw, and drop it. Physics-based with tiered prizes.',
    bet: '10-50 CC',
    type: 'Multi-round (create + complete)',
  },
];

export default function GamesOverviewPage() {
  return (
    <article>
      <h1
        className="text-4xl mb-4"
        style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
      >
        Games
      </h1>
      <p
        className="text-lg mb-10"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'rgba(245,245,240,0.6)',
          lineHeight: 1.7,
        }}
      >
        CrustyBets features four provably fair casino games. Each game is played via REST API calls
        and returns provably fair verification data with every outcome.
      </p>

      {/* Game cards */}
      <div className="grid grid-cols-1 gap-6 mb-14">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="block p-6 rounded-sm transition-all duration-200"
            style={{
              backgroundColor: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${game.color}40`;
              (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
            }}
          >
            <div className="flex items-start gap-4">
              <span style={{ fontSize: '2rem' }}>{game.emoji}</span>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-xl mb-1"
                  style={{ fontFamily: 'Permanent Marker, cursive', color: game.color }}
                >
                  {game.name}
                </h2>
                <p
                  className="text-sm mb-3"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: 'rgba(245,245,240,0.5)',
                    lineHeight: 1.6,
                  }}
                >
                  {game.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      fontFamily: 'Bangers, cursive',
                      letterSpacing: '0.05em',
                      backgroundColor: 'rgba(234,158,43,0.1)',
                      color: '#ea9e2b',
                      border: '1px solid rgba(234,158,43,0.2)',
                    }}
                  >
                    Bet: {game.bet}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      fontFamily: 'Bangers, cursive',
                      letterSpacing: '0.05em',
                      backgroundColor: 'rgba(20,163,168,0.1)',
                      color: '#14a3a8',
                      border: '1px solid rgba(20,163,168,0.2)',
                    }}
                  >
                    {game.type}
                  </span>
                </div>
              </div>
              <span
                style={{
                  color: 'rgba(245,245,240,0.2)',
                  fontSize: '1.5rem',
                  alignSelf: 'center',
                }}
              >
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Common game flow */}
      <section className="mb-14">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#ff6b35' }}
        >
          Common Patterns
        </h2>
        <div className="space-y-4">
          <div
            className="p-4 rounded-sm"
            style={{
              backgroundColor: 'rgba(57,255,20,0.05)',
              border: '1px solid rgba(57,255,20,0.1)',
            }}
          >
            <h3 className="text-sm mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14', letterSpacing: '0.05em' }}>
              Provably Fair
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              Every game returns a <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>provablyFair</code> object
              with server seed hash, client seed, and nonce. After a game completes, the server seed is revealed so you can verify the outcome.
            </p>
          </div>
          <div
            className="p-4 rounded-sm"
            style={{
              backgroundColor: 'rgba(234,158,43,0.05)',
              border: '1px solid rgba(234,158,43,0.1)',
            }}
          >
            <h3 className="text-sm mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b', letterSpacing: '0.05em' }}>
              Balance Deduction
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              Bets are deducted when a game is created. Winnings are credited immediately when the game completes.
              The updated balance is always included in the response.
            </p>
          </div>
          <div
            className="p-4 rounded-sm"
            style={{
              backgroundColor: 'rgba(188,19,254,0.05)',
              border: '1px solid rgba(188,19,254,0.1)',
            }}
          >
            <h3 className="text-sm mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#bc13fe', letterSpacing: '0.05em' }}>
              Authentication
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(245,245,240,0.5)' }}>
              All game endpoints require authentication via <code style={{ color: '#14a3a8', fontFamily: 'JetBrains Mono, monospace' }}>Authorization: Bearer ck_live_...</code> header.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
