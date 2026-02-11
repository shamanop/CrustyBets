'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// Types
// ============================================================

interface ActivityEntry {
  id: string;
  playerName: string;
  game: 'claw' | 'shell' | 'slots' | 'roulette';
  amount: number;
  isWin: boolean;
  isBigWin: boolean;
  x: number;
  timestamp: number;
  settled: boolean;
  bottomPos: number;
}

interface BurstParticle {
  id: string;
  parentId: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

// ============================================================
// Constants
// ============================================================

const PLAYER_NAMES = [
  'ClawdBot_v3',
  'CrabKing99',
  'ShrimpScript',
  'LobsterLord',
  'OpenClaw_AI',
  'MoltMaster',
  'PinchBot',
  'ReefRunner',
  'TidalTrader',
  'BarnacleBreaker',
];

const GAMES: ActivityEntry['game'][] = ['claw', 'shell', 'slots', 'roulette'];

const GAME_ICONS: Record<ActivityEntry['game'], string> = {
  claw: '\u{1F99E}',    // lobster
  shell: '\u{1F41A}',   // shell
  slots: '\u{1F3B0}',   // slot machine
  roulette: '\u{1F980}', // crab
};

const BACKGROUND_SYMBOLS = ['7', '\u{1F352}', 'BAR', '\u{1F48E}', '7', '\u{1F352}', 'BAR', '\u{1F48E}', '7', '\u{1F352}', 'BAR', '\u{1F48E}', '7', '\u{1F352}', 'BAR'];

const MAX_ENTRIES = 20;
const SETTLE_DELAY = 1500; // ms for coin-fall animation

// ============================================================
// Helpers
// ============================================================

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEntry(settledCount: number): ActivityEntry {
  const amount = randomBetween(5, 500);
  const isWin = Math.random() < 0.6;
  const isBigWin = amount > 100 && isWin;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    playerName: pickRandom(PLAYER_NAMES),
    game: pickRandom(GAMES),
    amount,
    isWin,
    isBigWin,
    x: randomBetween(5, 85),
    timestamp: Date.now(),
    settled: false,
    bottomPos: settledCount * 12,
  };
}

// ============================================================
// Sub-components
// ============================================================

/** Individual coin disc */
function CoinDisc({ entry, onSettled }: { entry: ActivityEntry; onSettled: (id: string) => void }) {
  const coinRef = useRef<HTMLDivElement>(null);
  const truncatedName = entry.playerName.slice(0, 8);
  const size = entry.isBigWin ? 100 : randomBetween(60, 80);
  const icon = GAME_ICONS[entry.game];

  useEffect(() => {
    const timer = setTimeout(() => {
      onSettled(entry.id);
    }, SETTLE_DELAY);
    return () => clearTimeout(timer);
  }, [entry.id, onSettled]);

  const bgGradient = entry.isWin
    ? 'linear-gradient(135deg, #ea9e2b, #ffcc00)'
    : 'linear-gradient(135deg, #cc2c18, #8b1a10)';

  const coinStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${entry.x}%`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: bgGradient,
    border: '2px solid rgba(255,255,255,0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: entry.settled
      ? undefined
      : 'coin-fall 1.5s ease-in forwards',
    bottom: entry.settled ? `${entry.bottomPos}px` : undefined,
    top: entry.settled ? undefined : '0',
    transform: entry.settled ? 'translateY(0)' : undefined,
    zIndex: entry.isBigWin ? 10 : 5,
    boxShadow: entry.isBigWin
      ? '0 0 20px #ea9e2b, 0 0 40px #ea9e2b, 0 0 60px #ffcc00, inset 0 0 10px rgba(255,255,255,0.3)'
      : '0 2px 8px rgba(0,0,0,0.4), inset 0 0 6px rgba(255,255,255,0.15)',
    cursor: 'default',
    overflow: 'hidden',
    transition: entry.settled ? 'bottom 0.3s ease-out' : undefined,
  };

  if (entry.isBigWin) {
    coinStyle.animation = entry.settled
      ? 'neon-box-pulse 2s ease-in-out infinite'
      : 'coin-fall 1.5s ease-in forwards';
  }

  return (
    <div ref={coinRef} style={coinStyle}>
      <span
        style={{
          fontFamily: 'Bangers, cursive',
          fontSize: entry.isBigWin ? '11px' : '10px',
          fontWeight: 'bold',
          color: entry.isWin ? '#1a1a2e' : '#ffe4c4',
          lineHeight: 1,
          textShadow: entry.isWin ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        {truncatedName}
      </span>
      <span style={{ fontSize: entry.isBigWin ? '20px' : '16px', lineHeight: 1.1 }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: 'Bangers, cursive',
          fontSize: entry.isBigWin ? '12px' : '10px',
          fontWeight: 'bold',
          color: entry.isWin ? '#1a1a2e' : '#ffe4c4',
          lineHeight: 1,
          textShadow: entry.isWin ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {entry.isWin ? '+' : '-'}{entry.amount} CC
      </span>
    </div>
  );
}

/** Jackpot burst particles */
function JackpotBurst({ particles }: { particles: BurstParticle[] }) {
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: `${p.y}px`,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffcc00, #ea9e2b)',
            animation: 'jackpot-burst 0.8s ease-out forwards',
            transform: `translate(${Math.cos(p.angle) * p.distance}px, ${Math.sin(p.angle) * p.distance}px)`,
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />
      ))}
    </>
  );
}

/** Background floating symbols */
function FloatingSymbols() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {BACKGROUND_SYMBOLS.map((symbol, i) => (
        <span
          key={`bg-sym-${i}`}
          style={{
            position: 'absolute',
            left: `${(i / BACKGROUND_SYMBOLS.length) * 100}%`,
            bottom: `${randomBetween(-10, 30)}%`,
            fontSize: `${randomBetween(24, 48)}px`,
            opacity: 0.07,
            animation: `float-up ${randomBetween(15, 25)}s linear infinite`,
            animationDelay: `${randomBetween(0, 15)}s`,
            color: '#ea9e2b',
            userSelect: 'none',
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}

/** Scanline CRT overlay */
function ScanlineOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    />
  );
}

/** Chase light bulbs across top of frame */
function ChaseLights() {
  const bulbs = Array.from({ length: 12 });
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        padding: '0 16px',
      }}
    >
      {bulbs.map((_, i) => (
        <div
          key={`bulb-${i}`}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            animation: 'chase-lights 1.5s infinite',
            animationDelay: `${i * 0.125}s`,
            boxShadow: '0 0 4px rgba(234,158,43,0.6)',
          }}
        />
      ))}
    </div>
  );
}

/** Corner rivet */
function Rivet({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #777, #333)',
        border: '1px solid #222',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.5)',
        zIndex: 30,
        ...style,
      }}
    />
  );
}

// ============================================================
// Main Component
// ============================================================

export default function TheBucket() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settledCountRef = useRef(0);

  const handleSettled = useCallback((id: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, settled: true } : e
      )
    );
  }, []);

  // Spawn burst particles for big wins
  const spawnBurst = useCallback((entry: ActivityEntry) => {
    const count = randomBetween(8, 12);
    const newParticles: BurstParticle[] = Array.from({ length: count }, (_, i) => ({
      id: `burst-${entry.id}-${i}`,
      parentId: entry.id,
      x: entry.x,
      y: entry.bottomPos + 40,
      angle: (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25),
      distance: randomBetween(30, 80),
    }));

    setBurstParticles((prev) => [...prev, ...newParticles]);

    // Clean up burst particles after animation
    setTimeout(() => {
      setBurstParticles((prev) =>
        prev.filter((p) => p.parentId !== entry.id)
      );
    }, 900);
  }, []);

  // Spawn new entries on interval
  useEffect(() => {
    const scheduleNext = () => {
      const delay = randomBetween(1000, 3000);
      intervalRef.current = setTimeout(() => {
        setEntries((prev) => {
          const currentSettled = prev.filter((e) => e.settled).length;
          settledCountRef.current = currentSettled;

          const newEntry = generateEntry(currentSettled % 8);

          // If big win, schedule burst after fall animation completes
          if (newEntry.isBigWin) {
            setTimeout(() => spawnBurst(newEntry), SETTLE_DELAY + 100);
          }

          // Trim old entries to prevent memory growth
          const trimmed = prev.length >= MAX_ENTRIES ? prev.slice(-MAX_ENTRIES + 1) : prev;

          return [...trimmed, newEntry];
        });

        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [spawnBurst]);

  return (
    <section
      className="relative py-16 px-4 overflow-hidden"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* ===== NEON HEADER ===== */}
      <h2
        style={{
          fontFamily: '"Bungee Shade", cursive',
          color: '#ea9e2b',
          textShadow:
            '0 0 7px #ea9e2b, 0 0 10px #ea9e2b, 0 0 21px #ea9e2b, 0 0 42px #d4891a, 0 0 82px #d4891a40',
          animation: 'neon-flicker 3s infinite',
          textAlign: 'center',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          marginBottom: '24px',
          letterSpacing: '0.05em',
          userSelect: 'none',
        }}
      >
        THE BUCKET
      </h2>

      {/* ===== SLOT MACHINE CHROME FRAME ===== */}
      <div
        className="max-w-4xl mx-auto relative"
        style={{
          background: 'linear-gradient(145deg, #444, #888, #555)',
          borderRadius: '12px',
          padding: '4px',
        }}
      >
        {/* Corner rivets */}
        <Rivet style={{ top: '6px', left: '6px' }} />
        <Rivet style={{ top: '6px', right: '6px' }} />
        <Rivet style={{ bottom: '6px', left: '6px' }} />
        <Rivet style={{ bottom: '6px', right: '6px' }} />

        {/* Top chrome bar with chase lights */}
        <div
          style={{
            background: 'linear-gradient(180deg, #666, #4a4a4a)',
            borderRadius: '8px 8px 0 0',
            padding: '8px 0',
            borderBottom: '2px solid #333',
          }}
        >
          <ChaseLights />
        </div>

        {/* Inner frame - the waterfall area */}
        <div
          style={{
            position: 'relative',
            minHeight: '400px',
            maxHeight: '500px',
            background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 40%, #111827 100%)',
            borderRadius: '0 0 8px 8px',
            overflow: 'hidden',
          }}
        >
          {/* Background floating symbols */}
          <FloatingSymbols />

          {/* Coin waterfall area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              zIndex: 5,
            }}
          >
            {entries.map((entry) => (
              <CoinDisc key={entry.id} entry={entry} onSettled={handleSettled} />
            ))}

            {/* Jackpot burst particles */}
            <JackpotBurst particles={burstParticles} />
          </div>

          {/* Scanline CRT overlay */}
          <ScanlineOverlay />

          {/* Bottom glow / bucket floor */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background:
                'linear-gradient(0deg, rgba(234,158,43,0.08) 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        </div>
      </div>

      {/* ===== SUBTITLE ===== */}
      <p
        style={{
          fontFamily: 'Bangers, cursive',
          color: '#f5f5f0',
          opacity: 0.5,
          textAlign: 'center',
          fontSize: '14px',
          marginTop: '16px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Live Activity Feed &bull; Mock Data
      </p>
    </section>
  );
}
