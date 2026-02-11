'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

interface LobsterSlotsProps {
  onSpin: (bet: number, lines: number) => void;
  result?: { reels: { id: number; name: string }[]; payout: number; matches: number; winningSymbol: string | null } | null;
  balance: number;
  disabled: boolean;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const REEL_COUNT = 5;
const REEL_WIDTH = CANVAS_WIDTH / REEL_COUNT;
const VISIBLE_SYMBOLS = 3;
const SYMBOL_HEIGHT = 80;

const SYMBOLS = [
  { id: 0, emoji: '\u{1F99E}', name: 'Golden Lobster', color: '#f59e0b' },
  { id: 1, emoji: '\u{1F980}', name: 'King Crab', color: '#ef4444' },
  { id: 2, emoji: '\u{1FAE7}', name: 'Pearl', color: '#e2e8f0' },
  { id: 3, emoji: '\u{1F4E6}', name: 'Treasure Chest', color: '#a855f7' },
  { id: 4, emoji: '\u2693', name: 'Anchor', color: '#6b7280' },
  { id: 5, emoji: '\u{1F41A}', name: 'Shell', color: '#14b8a6' },
  { id: 6, emoji: '\u{1F33F}', name: 'Seaweed', color: '#22c55e' },
  { id: 7, emoji: '\u{1FAA8}', name: 'Barnacle', color: '#78716c' },
];

export default function LobsterSlotsCanvas({ onSpin, result, balance, disabled }: LobsterSlotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [displayReels, setDisplayReels] = useState<number[]>([0, 1, 2, 3, 4]); // Current displayed symbol per reel
  const [reelOffsets, setReelOffsets] = useState([0, 0, 0, 0, 0]);
  const animRef = useRef<number>(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, offsets: number[], finalReels?: number[]) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Machine background
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw each reel
    for (let r = 0; r < REEL_COUNT; r++) {
      const x = r * REEL_WIDTH;
      const offset = offsets[r] % SYMBOL_HEIGHT;

      // Reel background
      ctx.fillStyle = r % 2 === 0 ? '#1a1a2e' : '#16213e';
      ctx.fillRect(x, 40, REEL_WIDTH, CANVAS_HEIGHT - 80);

      // Draw symbols in this reel
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 40, REEL_WIDTH, CANVAS_HEIGHT - 80);
      ctx.clip();

      const baseSymbol = finalReels ? finalReels[r] : displayReels[r];

      for (let s = -1; s <= VISIBLE_SYMBOLS; s++) {
        const symbolIdx = ((baseSymbol + s) % SYMBOLS.length + SYMBOLS.length) % SYMBOLS.length;
        const symbol = SYMBOLS[symbolIdx];
        const sy = 40 + s * SYMBOL_HEIGHT + offset + (CANVAS_HEIGHT - 80 - VISIBLE_SYMBOLS * SYMBOL_HEIGHT) / 2;

        // Symbol background
        if (s >= 0 && s < VISIBLE_SYMBOLS && !spinning && result?.reels && result.reels[r]?.id === symbolIdx && result.matches >= 3) {
          ctx.fillStyle = 'rgba(57, 255, 20, 0.15)';
          ctx.fillRect(x + 2, sy, REEL_WIDTH - 4, SYMBOL_HEIGHT);
        }

        // Symbol emoji
        ctx.font = '36px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol.emoji, x + REEL_WIDTH / 2, sy + SYMBOL_HEIGHT / 2);

        // Symbol name (small)
        ctx.font = '9px "Space Grotesk", sans-serif';
        ctx.fillStyle = 'rgba(245,245,240,0.5)';
        ctx.fillText(symbol.name, x + REEL_WIDTH / 2, sy + SYMBOL_HEIGHT / 2 + 24);
      }

      ctx.restore();

      // Reel divider
      if (r < REEL_COUNT - 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + REEL_WIDTH, 40);
        ctx.lineTo(x + REEL_WIDTH, CANVAS_HEIGHT - 40);
        ctx.stroke();
      }
    }

    // Payline indicator (center row)
    const centerY = 40 + (CANVAS_HEIGHT - 80) / 2;
    ctx.strokeStyle = '#ff2d55';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY - SYMBOL_HEIGHT / 2);
    ctx.lineTo(CANVAS_WIDTH, centerY - SYMBOL_HEIGHT / 2);
    ctx.moveTo(0, centerY + SYMBOL_HEIGHT / 2);
    ctx.lineTo(CANVAS_WIDTH, centerY + SYMBOL_HEIGHT / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Top chrome
    ctx.fillStyle = '#cc2c18';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 40);
    ctx.fillStyle = '#f5f5f0';
    ctx.font = '20px "Permanent Marker", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('LUCKY LOBSTER REELS', CANVAS_WIDTH / 2, 28);

    // Bottom chrome
    ctx.fillStyle = '#cc2c18';
    ctx.fillRect(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 40);

    // Win display
    if (!spinning && result && result.payout > 0) {
      ctx.fillStyle = '#39ff14';
      ctx.font = 'bold 18px "Bangers", cursive';
      ctx.textAlign = 'center';
      ctx.fillText(`WIN: ${result.payout} CC!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 15);
    }

    // Border
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, CANVAS_WIDTH - 3, CANVAS_HEIGHT - 3);
  }, [displayReels, spinning, result]);

  // Initial draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx, reelOffsets);
  }, [draw, reelOffsets]);

  // Spin animation
  const handleSpin = useCallback(() => {
    if (spinning || disabled || balance < bet) return;
    setSpinning(true);
    onSpin(bet, 1);
  }, [spinning, disabled, balance, bet, onSpin]);

  // Animate when result arrives
  useEffect(() => {
    if (!result || !spinning) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const finalSymbols = result.reels.map(r => r.id);
    const spinDurations = [800, 1000, 1200, 1400, 1600]; // Staggered stops
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const newOffsets = [...reelOffsets];
      let allDone = true;

      for (let r = 0; r < REEL_COUNT; r++) {
        const elapsed = now - startTime;
        if (elapsed < spinDurations[r]) {
          allDone = false;
          // Spinning: fast offset cycling
          const spinSpeed = 15 - (elapsed / spinDurations[r]) * 10; // Slow down near end
          newOffsets[r] = (elapsed * spinSpeed / 16) % SYMBOL_HEIGHT;
        } else {
          newOffsets[r] = 0;
        }
      }

      draw(ctx, newOffsets, allDone ? finalSymbols : undefined);

      if (!allDone) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayReels(finalSymbols);
        setReelOffsets([0, 0, 0, 0, 0]);
        setSpinning(false);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [result, spinning, draw, reelOffsets]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-sm"
      />

      {/* Controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>Bet:</span>
          <button
            onClick={() => setBet(Math.max(1, bet - 5))}
            disabled={spinning}
            className="w-8 h-8 rounded-sm border border-white/20 text-sm font-bold disabled:opacity-30"
            style={{ color: '#f5f5f0' }}
          >
            -
          </button>
          <span className="w-12 text-center font-bold" style={{ fontFamily: 'Bangers, cursive', color: '#ffcc00' }}>
            {bet}
          </span>
          <button
            onClick={() => setBet(Math.min(100, bet + 5))}
            disabled={spinning}
            className="w-8 h-8 rounded-sm border border-white/20 text-sm font-bold disabled:opacity-30"
            style={{ color: '#f5f5f0' }}
          >
            +
          </button>
        </div>

        <button
          onClick={handleSpin}
          disabled={spinning || disabled || balance < bet}
          className="px-8 py-3 rounded-sm border-2 border-white font-bold text-xl transition-all active:scale-95 disabled:opacity-30"
          style={{
            fontFamily: 'Bangers, cursive',
            backgroundColor: spinning ? '#555' : '#cc2c18',
            color: '#f5f5f0',
            boxShadow: spinning ? 'none' : '0 0 20px rgba(204,44,24,0.4)',
            letterSpacing: '0.05em',
          }}
        >
          {spinning ? 'SPINNING...' : 'PULL LEVER \u{1F3B0}'}
        </button>
      </div>
    </div>
  );
}
