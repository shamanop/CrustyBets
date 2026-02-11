'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import GameWrapper from '@/components/games/shared/GameWrapper';
import GameResultModal from '@/components/games/shared/GameResultModal';

const LobsterSlotsCanvas = dynamic(
  () => import('@/components/games/lobster-slots/LobsterSlotsCanvas'),
  { ssr: false }
);

const SYMBOLS = [
  { id: 0, name: 'Golden Lobster', multipliers: { 3: 50, 4: 200, 5: 500 } },
  { id: 1, name: 'King Crab', multipliers: { 3: 25, 4: 100, 5: 250 } },
  { id: 2, name: 'Pearl', multipliers: { 3: 10, 4: 50, 5: 100 } },
  { id: 3, name: 'Treasure Chest', multipliers: { 3: 5, 4: 25, 5: 50 } },
  { id: 4, name: 'Anchor', multipliers: { 3: 3, 4: 10, 5: 25 } },
  { id: 5, name: 'Shell', multipliers: { 3: 2, 4: 5, 5: 10 } },
  { id: 6, name: 'Seaweed', multipliers: { 3: 1, 4: 3, 5: 5 } },
  { id: 7, name: 'Barnacle', multipliers: { 3: 0.5, 4: 1, 5: 2 } },
];

const WEIGHTS = [1, 2, 4, 6, 8, 12, 16, 20];
const TOTAL_WEIGHT = WEIGHTS.reduce((a, b) => a + b, 0);

function weightedRandom(): number {
  let r = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < WEIGHTS.length; i++) {
    r -= WEIGHTS[i];
    if (r <= 0) return i;
  }
  return WEIGHTS.length - 1;
}

export default function LobsterSlotsPage() {
  const [balance, setBalance] = useState(100);
  const [lastResult, setLastResult] = useState<{
    reels: { id: number; name: string }[];
    payout: number;
    matches: number;
    winningSymbol: string | null;
  } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSpin = useCallback((bet: number, lines: number) => {
    const totalBet = bet * lines;
    if (balance < totalBet) return;

    setBalance((prev) => prev - totalBet);

    // Generate local result (in production, from API)
    const reels = Array.from({ length: 5 }, () => weightedRandom());

    // Check for consecutive matches from left
    const first = reels[0];
    let matches = 1;
    for (let i = 1; i < reels.length; i++) {
      if (reels[i] === first) matches++;
      else break;
    }

    let payout = 0;
    let winningSymbol: string | null = null;
    if (matches >= 3) {
      const sym = SYMBOLS[first];
      const mult = sym.multipliers[matches as 3 | 4 | 5] || 0;
      payout = Math.floor(totalBet * mult);
      winningSymbol = sym.name;
    }

    const result = {
      reels: reels.map((r) => ({ id: r, name: SYMBOLS[r].name })),
      payout,
      matches,
      winningSymbol,
    };

    // Delay result to allow spin animation
    setTimeout(() => {
      setLastResult(result);
      if (payout > 0) {
        setBalance((prev) => prev + payout);
      }
      setTimeout(() => {
        if (payout > 0) setShowResult(true);
      }, 1800);
    }, 200);
  }, [balance]);

  return (
    <GameWrapper title="Lucky Lobster Reels" emoji="🎰" balance={balance}>
      <LobsterSlotsCanvas
        onSpin={handleSpin}
        result={lastResult}
        balance={balance}
        disabled={false}
      />

      <GameResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        won={true}
        payout={lastResult?.payout ?? 0}
        message={`${lastResult?.matches}x ${lastResult?.winningSymbol}!`}
        details={`You matched ${lastResult?.matches} ${lastResult?.winningSymbol} symbols in a row!`}
      />
    </GameWrapper>
  );
}
