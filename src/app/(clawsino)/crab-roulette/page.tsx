'use client';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GameWrapper from '@/components/games/shared/GameWrapper';
import GameResultModal from '@/components/games/shared/GameResultModal';

const CrabRouletteCanvas = dynamic(
  () => import('@/components/games/crab-roulette/CrabRouletteCanvas'),
  { ssr: false }
);

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function CrabRoulettePage() {
  const [balance, setBalance] = useState(100);
  const [phase, setPhase] = useState<'betting' | 'spinning' | 'result'>('betting');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [result, setResult] = useState<{ number: number; color: string } | null>(null);
  const [playerBets, setPlayerBets] = useState<Array<{ type: string; value: string | number; amount: number }>>([]);
  const [payout, setPayout] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Betting countdown
  useEffect(() => {
    if (phase !== 'betting') return;
    if (timeRemaining <= 0) {
      // Auto-spin when timer runs out
      handleSpin();
      return;
    }
    const timer = setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeRemaining]);

  const handleBet = useCallback((bets: Array<{ type: string; value: string | number; amount: number }>) => {
    const total = bets.reduce((sum, b) => sum + b.amount, 0);
    if (total > balance) return;
    setBalance((prev) => prev - total);
    setPlayerBets(bets);
  }, [balance]);

  const handleSpin = useCallback(() => {
    setPhase('spinning');

    // Generate result
    const number = Math.floor(Math.random() * 37);
    const color = number === 0 ? 'gold' : RED_NUMBERS.includes(number) ? 'red' : 'blue';

    // Calculate payout
    let totalPayout = 0;
    for (const bet of playerBets) {
      if (bet.type === 'straight' && bet.value === number) {
        totalPayout += bet.amount * 35;
      } else if (bet.type === 'color' && bet.value === color) {
        totalPayout += bet.amount * 2;
      }
    }

    setResult({ number, color });

    // Show result after spin animation
    setTimeout(() => {
      setPhase('result');
      setPayout(totalPayout);
      if (totalPayout > 0) {
        setBalance((prev) => prev + totalPayout);
      }
      setTimeout(() => setShowResult(true), 500);
    }, 4500);
  }, [playerBets]);

  const resetRound = useCallback(() => {
    setShowResult(false);
    setPhase('betting');
    setTimeRemaining(30);
    setResult(null);
    setPlayerBets([]);
    setPayout(0);
  }, []);

  return (
    <GameWrapper
      title="Crabby Wheel of Fortune"
      emoji="🦀"
      balance={balance}
      timeRemaining={phase === 'betting' ? timeRemaining : undefined}
      showTimer={phase === 'betting'}
    >
      <CrabRouletteCanvas
        onBet={handleBet}
        result={result}
        phase={phase}
        timeRemaining={timeRemaining}
        disabled={phase !== 'betting'}
      />

      {phase === 'result' && (
        <div className="mt-4 text-center">
          <button
            onClick={resetRound}
            className="px-8 py-3 rounded-sm border-2 border-white font-bold text-xl transition-all hover:scale-105"
            style={{
              fontFamily: 'Bangers, cursive',
              backgroundColor: '#bc13fe',
              color: '#f5f5f0',
              boxShadow: '0 0 20px rgba(188,19,254,0.3)',
            }}
          >
            NEW ROUND
          </button>
        </div>
      )}

      <GameResultModal
        isOpen={showResult}
        onClose={resetRound}
        won={payout > 0}
        payout={payout}
        message={payout > 0 ? `Number ${result?.number} (${result?.color})! You win!` : `Number ${result?.number} (${result?.color}). Better luck next time.`}
      />
    </GameWrapper>
  );
}
