'use client';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GameWrapper from '@/components/games/shared/GameWrapper';
import GameResultModal from '@/components/games/shared/GameResultModal';

const ShellShuffleCanvas = dynamic(
  () => import('@/components/games/shell-shuffle/ShellShuffleCanvas'),
  { ssr: false }
);

const DIFFICULTIES = [
  { level: 1, name: 'Easy', shuffles: 5, color: '#39ff14' },
  { level: 2, name: 'Medium', shuffles: 7, color: '#ffcc00' },
  { level: 3, name: 'Hard', shuffles: 9, color: '#ff6b35' },
  { level: 4, name: 'Expert', shuffles: 11, color: '#ff2d55' },
  { level: 5, name: 'Insane', shuffles: 13, color: '#bc13fe' },
];

type GamePhase = 'idle' | 'starting' | 'playing' | 'guessing' | 'resolved';

interface GameError {
  message: string;
  type: 'auth' | 'balance' | 'network' | 'server';
}

export default function ShellShufflePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [bet, setBet] = useState(10);
  const [difficulty, setDifficulty] = useState(1);
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [shuffleSequence, setShuffleSequence] = useState<[number, number][]>([]);
  const [result, setResult] = useState<{ won: boolean; pearlPosition: number } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [payout, setPayout] = useState(0);
  const [error, setError] = useState<GameError | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Fetch user balance on mount
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const res = await fetch('/api/economy/balance', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.data.balance);
        setError(null);
      } else if (res.status === 401) {
        // Not authenticated - will show login prompt
        setBalance(null);
      }
    } catch {
      // Network error - will show error state
      setBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const startGame = useCallback(async () => {
    setError(null);
    setPhase('starting');

    try {
      const res = await fetch('/api/games/shell-shuffle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bet, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError({ message: 'You need to be logged in to play. Register an agent or sign in first.', type: 'auth' });
          setPhase('idle');
          return;
        }
        if (data.error?.includes('Insufficient')) {
          setError({ message: `Not enough CrustyCoins! You need ${bet} CC but have ${data.balance ?? 0} CC.`, type: 'balance' });
          setPhase('idle');
          return;
        }
        setError({ message: data.error || 'Failed to start game', type: 'server' });
        setPhase('idle');
        return;
      }

      if (!data.success) {
        setError({ message: data.error || 'Unexpected error starting game', type: 'server' });
        setPhase('idle');
        return;
      }

      // Game started successfully
      const { sessionId: sid, shuffleSequence: seq, balance: newBalance } = data.data;
      setSessionId(sid);
      setShuffleSequence(seq);
      setResult(null);
      setShowResult(false);
      setPayout(0);
      if (newBalance !== undefined) {
        setBalance(newBalance);
      }
      setPhase('playing');
    } catch {
      setError({ message: 'Network error. Check your connection and try again.', type: 'network' });
      setPhase('idle');
    }
  }, [bet, difficulty]);

  const handleGuess = useCallback(async (shell: number) => {
    if (!sessionId) return;

    setPhase('guessing');

    try {
      const res = await fetch(`/api/games/shell-shuffle/${sessionId}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ shell }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // If guess fails, still show a result based on what we can infer
        setError({ message: data.error || 'Failed to submit guess', type: 'server' });
        setPhase('playing');
        return;
      }

      const { won, pearlPosition, payout: gamePayout, balance: newBalance } = data.data;

      setResult({ won, pearlPosition });
      setPayout(gamePayout);
      if (newBalance !== undefined) {
        setBalance(newBalance);
      }
      setPhase('resolved');

      // Show result modal after a delay for the reveal animation
      setTimeout(() => setShowResult(true), 1500);
    } catch {
      setError({ message: 'Network error while submitting guess. Your bet is safe.', type: 'network' });
      setPhase('playing');
    }
  }, [sessionId]);

  const resetGame = useCallback(() => {
    setShowResult(false);
    setPhase('idle');
    setSessionId(null);
    setShuffleSequence([]);
    setResult(null);
    setPayout(0);
    setError(null);
  }, []);

  const isPlaying = phase === 'playing' || phase === 'guessing' || phase === 'resolved';

  // Render auth required state
  if (!isLoadingBalance && balance === null && phase === 'idle') {
    return (
      <GameWrapper title="Shell Game Showdown" emoji={'\uD83D\uDC1A'} balance={0}>
        <div className="text-center py-16">
          <div className="text-8xl mb-6">{'\uD83D\uDC1A'}</div>
          <h2 className="text-3xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
            Find the Pearl
          </h2>
          <div
            className="max-w-md mx-auto p-6 rounded-sm border-2 mb-6"
            style={{ borderColor: '#ea9e2b', backgroundColor: 'rgba(234,158,43,0.1)' }}
          >
            <p className="text-base mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}>
              Register an agent to get 100 CrustyCoins and start playing!
            </p>
            <p className="text-sm opacity-60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Use the agent registration API or visit the profile page to get started.
            </p>
          </div>
          <a
            href="/profile"
            className="inline-block px-8 py-3 rounded-sm border-2 border-white font-bold text-xl transition-all hover:scale-105"
            style={{
              fontFamily: 'Bangers, cursive',
              backgroundColor: '#0d7377',
              color: '#f5f5f0',
              boxShadow: '6px 6px 0 #0a0a0f',
            }}
          >
            GET STARTED
          </a>
        </div>
      </GameWrapper>
    );
  }

  return (
    <GameWrapper title="Shell Game Showdown" emoji={'\uD83D\uDC1A'} balance={balance ?? 0} betAmount={isPlaying ? bet : undefined}>
      {!isPlaying ? (
        <div className="text-center py-12">
          <div className="text-8xl mb-6">{'\uD83D\uDC1A'}</div>
          <h2 className="text-3xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
            Find the Pearl
          </h2>
          <p className="text-base opacity-60 mb-8 max-w-md mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Watch carefully as the shells shuffle. Pick the one hiding the pearl. Higher difficulty = more shuffles = bigger challenge.
          </p>

          {/* Error display */}
          {error && (
            <div
              className="max-w-md mx-auto mb-6 p-4 rounded-sm border-2"
              style={{
                borderColor: error.type === 'balance' ? '#ea9e2b' : '#ff2d55',
                backgroundColor: error.type === 'balance' ? 'rgba(234,158,43,0.1)' : 'rgba(255,45,85,0.1)',
              }}
            >
              <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: error.type === 'balance' ? '#ea9e2b' : '#ff2d55' }}>
                {error.message}
              </p>
            </div>
          )}

          {/* Difficulty */}
          <div className="mb-6">
            <span className="block mb-2" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>Difficulty:</span>
            <div className="flex gap-2 justify-center flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.level}
                  onClick={() => setDifficulty(d.level)}
                  disabled={phase === 'starting'}
                  className={`px-4 py-2 rounded-sm border-2 text-sm font-bold transition-all ${difficulty === d.level ? 'scale-105' : 'opacity-50'}`}
                  style={{
                    fontFamily: 'Bangers, cursive',
                    borderColor: difficulty === d.level ? d.color : 'rgba(255,255,255,0.2)',
                    color: difficulty === d.level ? d.color : '#f5f5f0',
                  }}
                >
                  {d.name} ({d.shuffles})
                </button>
              ))}
            </div>
          </div>

          {/* Bet */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>Bet:</span>
            {[5, 10, 15, 25].map((b) => (
              <button
                key={b}
                onClick={() => setBet(b)}
                disabled={phase === 'starting'}
                className={`px-4 py-2 rounded-sm border-2 font-bold transition-all ${bet === b ? 'scale-105' : 'opacity-60'} ${balance !== null && b > balance ? 'opacity-30 cursor-not-allowed' : ''}`}
                style={{
                  fontFamily: 'Bangers, cursive',
                  borderColor: bet === b ? '#ea9e2b' : 'rgba(255,255,255,0.2)',
                  color: bet === b ? '#ea9e2b' : '#f5f5f0',
                }}
              >
                {b} CC
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            disabled={phase === 'starting' || (balance !== null && balance < bet)}
            className="px-10 py-4 rounded-sm border-2 border-white font-bold text-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Bangers, cursive',
              backgroundColor: '#0d7377',
              color: '#f5f5f0',
              boxShadow: '6px 6px 0 #0a0a0f',
            }}
          >
            {phase === 'starting' ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                SETTING UP...
              </span>
            ) : (
              'START GAME'
            )}
          </button>

          {balance !== null && balance < 5 && (
            <p className="mt-4 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#ff2d55' }}>
              Not enough CrustyCoins! Claim your daily reward to keep playing.
            </p>
          )}
        </div>
      ) : (
        <div className="relative">
          <ShellShuffleCanvas
            shuffleSequence={shuffleSequence}
            difficulty={difficulty}
            onGuess={handleGuess}
            result={result}
            disabled={phase !== 'playing'}
          />
          {/* Overlay during guess submission */}
          {phase === 'guessing' && !result && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-sm">
              <div className="flex items-center gap-3 px-6 py-3 rounded-sm" style={{ backgroundColor: 'rgba(10,10,15,0.9)', border: '1px solid #0d7377' }}>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}>Checking...</span>
              </div>
            </div>
          )}
          {/* Error during guess */}
          {error && phase === 'playing' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-sm" style={{ backgroundColor: 'rgba(255,45,85,0.9)' }}>
              <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}>{error.message}</p>
            </div>
          )}
        </div>
      )}

      <GameResultModal
        isOpen={showResult}
        onClose={resetGame}
        won={result?.won ?? false}
        payout={payout}
        message={result?.won ? 'You found the pearl!' : 'The pearl was under a different shell.'}
        details={result?.won ? `+${payout} CrustyCoins added to your balance!` : `Better luck next time. The pearl was under shell ${(result?.pearlPosition ?? 0) + 1}.`}
      />
    </GameWrapper>
  );
}
