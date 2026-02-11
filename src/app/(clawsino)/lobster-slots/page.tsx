'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import GameWrapper from '@/components/games/shared/GameWrapper';
import GameResultModal from '@/components/games/shared/GameResultModal';

const LobsterSlotsCanvas = dynamic(
  () => import('@/components/games/lobster-slots/LobsterSlotsCanvas'),
  { ssr: false }
);

type SpinResult = {
  reels: { id: number; name: string }[];
  payout: number;
  matches: number;
  winningSymbol: string | null;
};

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export default function LobsterSlotsPage() {
  const [balance, setBalance] = useState(0);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<string | null>(null);
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch initial balance and check auth status
  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        if (!res.ok) {
          setAuthState('unauthenticated');
          return;
        }
        const session = await res.json();
        if (session?.user?.id) {
          if (!cancelled) {
            setAuthState('authenticated');
            setBalance(session.user.crustyCoins ?? 0);
          }
        } else {
          if (!cancelled) {
            setAuthState('unauthenticated');
          }
        }
      } catch {
        if (!cancelled) {
          setAuthState('unauthenticated');
        }
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, []);

  const handleSpin = useCallback(async (bet: number, lines: number) => {
    if (spinning) return;

    setError(null);
    setSpinning(true);

    try {
      const res = await fetch('/api/games/lobster-slots/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bet, lines }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setAuthState('unauthenticated');
          setError('Please log in to play.');
        } else if (data?.error?.includes('Insufficient')) {
          setError('Not enough CrustyCoins! Claim your daily reward or win some back.');
        } else {
          setError(data?.error || 'Something went wrong. Try again.');
        }
        setSpinning(false);
        return;
      }

      if (!data.success || !data.data) {
        setError('Unexpected server response. Try again.');
        setSpinning(false);
        return;
      }

      const apiResult = data.data;

      // Map API response to the format LobsterSlotsCanvas expects
      const result: SpinResult = {
        reels: apiResult.reels, // Already in { id, name } format
        payout: apiResult.payout,
        matches: apiResult.matches,
        winningSymbol: apiResult.winningSymbol,
      };

      // Pass result to canvas immediately so animation starts
      // The canvas handles the spin animation timing internally
      setTimeout(() => {
        setLastResult(result);

        // Update balance from API response after animation
        setBalance(apiResult.balance);

        // Show win modal after animation completes (~1.8s for last reel + buffer)
        resultTimerRef.current = setTimeout(() => {
          if (result.payout > 0) {
            setShowResult(true);
          }
          setSpinning(false);
        }, 1800);
      }, 200);
    } catch (err) {
      setError('Network error. Check your connection and try again.');
      setSpinning(false);
    }
  }, [spinning]);

  // Login prompt for unauthenticated users
  if (authState === 'unauthenticated') {
    return (
      <GameWrapper title="Lucky Lobster Reels" emoji="" balance={0}>
        <div
          className="flex flex-col items-center justify-center py-16 px-8 rounded-sm border-2 max-w-md mx-auto"
          style={{
            backgroundColor: 'rgba(22,33,62,0.6)',
            borderColor: '#cc2c18',
            boxShadow: '0 0 30px rgba(204,44,24,0.2)',
          }}
        >
          <span className="text-6xl mb-4">🎰</span>
          <h2
            className="text-2xl mb-2 text-center"
            style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
          >
            Login to Play
          </h2>
          <p
            className="text-sm mb-6 text-center opacity-70"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}
          >
            Sign in with your CrustyBets account to spin the Lucky Lobster Reels and win CrustyCoins!
          </p>
          <a
            href="/login"
            className="px-8 py-3 rounded-sm border-2 border-white font-bold text-xl transition-all hover:scale-105"
            style={{
              fontFamily: 'Bangers, cursive',
              backgroundColor: '#cc2c18',
              color: '#f5f5f0',
              boxShadow: '0 0 20px rgba(204,44,24,0.4)',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            LOG IN
          </a>
          <a
            href="/api/auth/register"
            className="mt-3 text-sm transition-all hover:opacity-100"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#ea9e2b',
              opacity: 0.7,
              textDecoration: 'underline',
            }}
          >
            Don&apos;t have an account? Register
          </a>
        </div>
      </GameWrapper>
    );
  }

  // Loading state
  if (authState === 'loading') {
    return (
      <GameWrapper title="Lucky Lobster Reels" emoji="" balance={0}>
        <div className="flex flex-col items-center justify-center py-16">
          <div
            className="text-xl animate-pulse"
            style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}
          >
            Loading Lobster Slots...
          </div>
        </div>
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="Lucky Lobster Reels" emoji="" balance={balance}>
      {/* Error banner */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-sm border text-center max-w-lg mx-auto"
          style={{
            borderColor: '#ff2d55',
            backgroundColor: 'rgba(255,45,85,0.1)',
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#ff2d55',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <LobsterSlotsCanvas
        onSpin={handleSpin}
        result={lastResult}
        balance={balance}
        disabled={spinning || authState !== 'authenticated'}
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
