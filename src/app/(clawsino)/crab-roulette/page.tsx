'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import GameWrapper from '@/components/games/shared/GameWrapper';
import GameResultModal from '@/components/games/shared/GameResultModal';

const CrabRouletteCanvas = dynamic(
  () => import('@/components/games/crab-roulette/CrabRouletteCanvas'),
  { ssr: false }
);

export default function CrabRoulettePage() {
  const [balance, setBalance] = useState(100);
  const [phase, setPhase] = useState<'betting' | 'spinning' | 'result'>('betting');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [result, setResult] = useState<{ number: number; color: string } | null>(null);
  const [playerBets, setPlayerBets] = useState<Array<{ type: string; value: string | number; amount: number }>>([]);
  const [payout, setPayout] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const betsPlacedRef = useRef(false);

  // Fetch initial balance on mount
  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch('/api/economy/balance', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.balance !== undefined) {
            setBalance(data.data.balance);
          }
        }
      } catch {
        // Silently fall back to default balance for unauthenticated users
      }
    }
    fetchBalance();
  }, []);

  // Betting countdown
  useEffect(() => {
    if (phase !== 'betting') return;
    if (timeRemaining <= 0) {
      // Auto-spin when timer runs out (only if bets were placed)
      if (playerBets.length > 0 && betsPlacedRef.current) {
        handleSpin();
      } else {
        // Reset timer if no bets placed
        setTimeRemaining(30);
      }
      return;
    }
    const timer = setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeRemaining]);

  const handleBet = useCallback((bets: Array<{ type: string; value: string | number; amount: number }>) => {
    const total = bets.reduce((sum, b) => sum + b.amount, 0);
    if (total > balance) {
      setError('Not enough CrustyCoins for that bet!');
      return;
    }
    setError(null);
    setPlayerBets(bets);
    betsPlacedRef.current = true;
  }, [balance]);

  const handleSpin = useCallback(async () => {
    if (playerBets.length === 0) {
      setError('Place at least one bet first!');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setPhase('spinning');

    try {
      const res = await fetch('/api/games/crab-roulette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bets: playerBets }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Handle auth errors gracefully
        if (res.status === 401) {
          setError('Login to play for real CrustyCoins! Playing in demo mode.');
          // Fall back to local demo mode
          fallbackLocalSpin();
          return;
        }
        setError(data.error || 'Something went wrong. Try again.');
        setPhase('betting');
        setIsSubmitting(false);
        return;
      }

      const { result: apiResult, totalPayout, balance: newBalance } = data.data;

      // Set result from API for the spin animation
      setResult({ number: apiResult.number, color: apiResult.color });

      // After spin animation completes, show the result
      setTimeout(() => {
        setPhase('result');
        setPayout(totalPayout);
        setBalance(newBalance);
        setTimeout(() => setShowResult(true), 500);
      }, 4500);
    } catch {
      setError('Network error. Playing in demo mode.');
      fallbackLocalSpin();
    } finally {
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerBets, isSubmitting]);

  // Fallback local spin for when API is unavailable (demo mode)
  const fallbackLocalSpin = useCallback(() => {
    const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const number = Math.floor(Math.random() * 37);
    const color = number === 0 ? 'gold' : RED_NUMBERS.includes(number) ? 'red' : 'blue';

    // Simple payout calc for demo
    let totalPayout = 0;
    const totalBet = playerBets.reduce((sum, b) => sum + b.amount, 0);
    for (const bet of playerBets) {
      if (bet.type === 'straight' && bet.value === number) {
        totalPayout += bet.amount * 35;
      } else if (bet.type === 'color' && bet.value === color) {
        totalPayout += bet.amount * 2;
      } else if (bet.type === 'parity') {
        if (number !== 0) {
          const isOdd = number % 2 !== 0;
          if ((bet.value === 'odd' && isOdd) || (bet.value === 'even' && !isOdd)) {
            totalPayout += bet.amount * 2;
          }
        }
      } else if (bet.type === 'half') {
        if (number !== 0) {
          if (bet.value === '1-18' && number <= 18) totalPayout += bet.amount * 2;
          if (bet.value === '19-36' && number >= 19) totalPayout += bet.amount * 2;
        }
      } else if (bet.type === 'dozen') {
        if (number !== 0) {
          if (bet.value === '1-12' && number <= 12) totalPayout += bet.amount * 3;
          if (bet.value === '13-24' && number >= 13 && number <= 24) totalPayout += bet.amount * 3;
          if (bet.value === '25-36' && number >= 25) totalPayout += bet.amount * 3;
        }
      } else if (bet.type === 'column') {
        if (number !== 0) {
          const col1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
          const col2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
          const col3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
          if (bet.value === '1st' && col1.includes(number)) totalPayout += bet.amount * 3;
          if (bet.value === '2nd' && col2.includes(number)) totalPayout += bet.amount * 3;
          if (bet.value === '3rd' && col3.includes(number)) totalPayout += bet.amount * 3;
        }
      }
    }

    setResult({ number, color });

    setTimeout(() => {
      setPhase('result');
      setPayout(totalPayout);
      setBalance((prev) => prev - totalBet + totalPayout);
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
    setError(null);
    betsPlacedRef.current = false;
  }, []);

  return (
    <GameWrapper
      title="Crabby Wheel of Fortune"
      emoji="\u{1F980}"
      balance={balance}
      timeRemaining={phase === 'betting' ? timeRemaining : undefined}
      showTimer={phase === 'betting'}
    >
      {error && (
        <div
          className="mb-4 px-4 py-2 rounded-sm text-center text-sm"
          style={{
            backgroundColor: 'rgba(255,45,85,0.15)',
            border: '1px solid #ff2d55',
            color: '#ff2d55',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          {error}
        </div>
      )}

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
