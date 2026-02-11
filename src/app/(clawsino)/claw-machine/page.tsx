'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/lib/stores/game-store';
import GameWrapper from '@/components/games/shared/GameWrapper';
import GameResultModal from '@/components/games/shared/GameResultModal';
import ClawControls from '@/components/games/claw-machine/ClawControls';

const ClawMachineCanvas = dynamic(
  () => import('@/components/games/claw-machine/ClawMachineCanvas'),
  { ssr: false }
);

const BET_OPTIONS = [10, 25, 50];

const PRIZE_TIER_LABELS: Record<number, string> = {
  10: 'Common & Uncommon prizes',
  25: 'Uncommon & Rare prizes',
  50: 'Rare, Epic & Legendary prizes',
};

export default function ClawMachinePage() {
  const [selectedBet, setSelectedBet] = useState(10);
  const [balance, setBalance] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    won: boolean;
    payout: number;
    message: string;
    details?: string;
  }>({ isOpen: false, won: false, payout: 0, message: '' });

  // Track whether we already completed this session to avoid double-submit
  const completedRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  const {
    isPlaying,
    setIsPlaying,
    isDropping,
    setIsDropping,
    timeRemaining,
    setTimeRemaining,
    resetGame,
  } = useGameStore();

  // Fetch initial balance
  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch('/api/economy/balance', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setBalance(data.data.balance);
          }
        }
      } catch {
        // Balance will show as loading until fetched
      }
    }
    fetchBalance();
  }, []);

  const completeGame = useCallback(async (
    won: boolean,
    prize?: { name: string; rarity: string; value: number }
  ) => {
    const currentSessionId = sessionIdRef.current;
    if (!currentSessionId || completedRef.current) return;
    completedRef.current = true;

    console.log('[ClawMachinePage] completing game', { sessionId: currentSessionId, won, prize });

    try {
      const res = await fetch(`/api/games/claw-machine/${currentSessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          won,
          prizeRarity: prize?.rarity,
          prizeValue: prize?.value,
          prizeName: prize?.name,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBalance(data.data.balance);

        if (won && data.data.payout > 0) {
          setResultModal({
            isOpen: true,
            won: true,
            payout: data.data.payout,
            message: `You grabbed ${prize?.name || 'a prize'}!`,
            details: prize?.rarity
              ? `Rarity: ${prize.rarity.charAt(0).toUpperCase() + prize.rarity.slice(1)}`
              : undefined,
          });
        } else if (!won) {
          setResultModal({
            isOpen: true,
            won: false,
            payout: 0,
            message: "Time's up! The claw came up empty.",
            details: 'Better luck next time, crusty friend.',
          });
        }
      } else {
        console.error('[ClawMachinePage] complete game error:', data.error);
        setError(data.error || 'Failed to complete game');
      }
    } catch (err) {
      console.error('[ClawMachinePage] complete game network error:', err);
      setError('Network error. Your game result may not have been recorded.');
    }

    // Stop playing state
    setIsPlaying(false);
    setSessionId(null);
    sessionIdRef.current = null;
  }, [setIsPlaying]);

  // Complete game when time runs out without a prize
  useEffect(() => {
    if (isPlaying && timeRemaining <= 0 && sessionIdRef.current && !completedRef.current) {
      completeGame(false);
    }
  }, [isPlaying, timeRemaining, completeGame]);

  const startGame = useCallback(async () => {
    setError(null);
    setIsStarting(true);

    try {
      const res = await fetch('/api/games/claw-machine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bet: selectedBet }),
      });

      const data = await res.json();

      if (!data.success) {
        if (res.status === 401) {
          setError('Please sign in to play.');
        } else {
          setError(data.error || 'Failed to start game');
        }
        setIsStarting(false);
        return;
      }

      // Game started successfully
      const { sessionId: newSessionId, balance: newBalance } = data.data;
      console.log('[ClawMachinePage] game started', {
        sessionId: newSessionId,
        bet: selectedBet,
        balance: newBalance,
      });

      setSessionId(newSessionId);
      sessionIdRef.current = newSessionId;
      completedRef.current = false;
      setBalance(newBalance);

      resetGame();
      setIsPlaying(true);
      setTimeRemaining(30);
    } catch (err) {
      console.error('[ClawMachinePage] start game network error:', err);
      setError('Network error. Please try again.');
    }

    setIsStarting(false);
  }, [selectedBet, resetGame, setIsPlaying, setTimeRemaining]);

  // Callback from ClawMachineCanvas physics engine onPrizeWon
  const handlePrizeWon = useCallback((prize: { name: string; rarity: string; value: number }) => {
    console.log('[ClawMachinePage] prize won callback from canvas', prize);
    completeGame(true, prize);
  }, [completeGame]);

  const handleMove = useCallback((direction: 'left' | 'right') => {
    // Handled by keyboard in ClawMachineCanvas
  }, []);

  const handleDrop = useCallback(() => {
    setIsDropping(true);
  }, [setIsDropping]);

  const handleCloseResult = useCallback(() => {
    setResultModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <GameWrapper
      title="Crusty's Claw Grab"
      emoji="🦞"
      balance={balance ?? 0}
      betAmount={isPlaying ? selectedBet : undefined}
      timeRemaining={timeRemaining}
      showTimer={isPlaying}
    >
      {!isPlaying ? (
        <div className="text-center py-12">
          <div className="text-8xl mb-6">🦞</div>
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
          >
            Ready to Grab?
          </h2>
          <p
            className="text-base opacity-60 mb-8 max-w-md mx-auto"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Use arrow keys or A/D to move the claw. Press SPACE to drop and grab.
            You have 30 seconds to grab a prize!
          </p>

          {/* Bet selection */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>Bet:</span>
            {BET_OPTIONS.map((bet) => (
              <button
                key={bet}
                onClick={() => setSelectedBet(bet)}
                className={`px-4 py-2 rounded-sm border-2 font-bold transition-all ${
                  selectedBet === bet ? 'scale-105' : 'opacity-60'
                }`}
                style={{
                  fontFamily: 'Bangers, cursive',
                  borderColor: selectedBet === bet ? '#ea9e2b' : 'rgba(255,255,255,0.2)',
                  backgroundColor:
                    selectedBet === bet ? 'rgba(234,158,43,0.2)' : 'transparent',
                  color: selectedBet === bet ? '#ea9e2b' : '#f5f5f0',
                }}
              >
                {bet} CC
              </button>
            ))}
          </div>

          {/* Prize tier indicator */}
          <p
            className="text-sm mb-6 opacity-70"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#ff6b35' }}
          >
            {PRIZE_TIER_LABELS[selectedBet]}
          </p>

          {/* Error message */}
          {error && (
            <div
              className="mb-4 px-4 py-2 rounded-sm border-2 inline-block"
              style={{
                borderColor: '#ff2d55',
                backgroundColor: 'rgba(255,45,85,0.1)',
                color: '#ff2d55',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <button
              onClick={startGame}
              disabled={isStarting || (balance !== null && balance < selectedBet)}
              className="px-10 py-4 rounded-sm border-2 border-white font-bold text-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
              style={{
                fontFamily: 'Bangers, cursive',
                backgroundColor: '#cc2c18',
                color: '#f5f5f0',
                boxShadow: '6px 6px 0 #0a0a0f, 0 0 30px rgba(204,44,24,0.4)',
                letterSpacing: '0.05em',
              }}
            >
              {isStarting ? 'STARTING...' : 'START GAME 🎮'}
            </button>
          </div>

          {balance !== null && balance < selectedBet && (
            <p
              className="mt-3 text-sm"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#ff2d55' }}
            >
              Not enough CrustyCoins! You need {selectedBet} CC.
            </p>
          )}
        </div>
      ) : (
        <>
          <ClawMachineCanvas onPrizeWon={handlePrizeWon} />
          <ClawControls
            onMove={handleMove}
            onDrop={handleDrop}
            disabled={!isPlaying}
            isDropping={isDropping}
          />
        </>
      )}

      <GameResultModal
        isOpen={resultModal.isOpen}
        onClose={handleCloseResult}
        won={resultModal.won}
        payout={resultModal.payout}
        message={resultModal.message}
        details={resultModal.details}
      />
    </GameWrapper>
  );
}
