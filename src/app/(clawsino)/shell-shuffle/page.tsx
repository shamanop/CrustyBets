'use client';
import { useState, useCallback } from 'react';
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

export default function ShellShufflePage() {
  const [balance] = useState(100);
  const [bet, setBet] = useState(10);
  const [difficulty, setDifficulty] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleSequence, setShuffleSequence] = useState<[number, number][]>([]);
  const [result, setResult] = useState<{ won: boolean; pearlPosition: number } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startGame = useCallback(() => {
    // Generate a local game for now (in production, this comes from the API)
    const pearlPosition = Math.floor(Math.random() * 3);
    const shuffleCount = 3 + difficulty * 2;
    const sequence: [number, number][] = [];
    for (let i = 0; i < shuffleCount; i++) {
      const a = Math.floor(Math.random() * 3);
      let b = Math.floor(Math.random() * 2);
      if (b >= a) b += 1;
      sequence.push([a, b]);
    }
    setShuffleSequence(sequence);
    setResult(null);
    setShowResult(false);
    setIsPlaying(true);

    // Store pearl position for local verification
    (window as any).__shellPearl = pearlPosition;
    (window as any).__shellSequence = sequence;
  }, [difficulty]);

  const handleGuess = useCallback((shell: number) => {
    // Track pearl through shuffles
    const pearlStart = (window as any).__shellPearl || 0;
    const seq = (window as any).__shellSequence || [];
    let currentPos = pearlStart;
    for (const [a, b] of seq) {
      if (currentPos === a) currentPos = b;
      else if (currentPos === b) currentPos = a;
    }

    const won = shell === currentPos;
    setResult({ won, pearlPosition: currentPos });
    setTimeout(() => setShowResult(true), 1500);
  }, []);

  return (
    <GameWrapper title="Shell Game Showdown" emoji="🐚" balance={balance} betAmount={isPlaying ? bet : undefined}>
      {!isPlaying ? (
        <div className="text-center py-12">
          <div className="text-8xl mb-6">🐚</div>
          <h2 className="text-3xl mb-4" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
            Find the Pearl
          </h2>
          <p className="text-base opacity-60 mb-8 max-w-md mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Watch carefully as the shells shuffle. Pick the one hiding the pearl. Higher difficulty = more shuffles = bigger reward.
          </p>

          {/* Difficulty */}
          <div className="mb-6">
            <span className="block mb-2" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>Difficulty:</span>
            <div className="flex gap-2 justify-center flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.level}
                  onClick={() => setDifficulty(d.level)}
                  className={`px-4 py-2 rounded-sm border-2 text-sm font-bold ${difficulty === d.level ? 'scale-105' : 'opacity-50'}`}
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
                className={`px-4 py-2 rounded-sm border-2 font-bold ${bet === b ? 'scale-105' : 'opacity-60'}`}
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
            className="px-10 py-4 rounded-sm border-2 border-white font-bold text-2xl transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: 'Bangers, cursive',
              backgroundColor: '#0d7377',
              color: '#f5f5f0',
              boxShadow: '6px 6px 0 #0a0a0f',
            }}
          >
            START GAME 🐚
          </button>
        </div>
      ) : (
        <ShellShuffleCanvas
          shuffleSequence={shuffleSequence}
          difficulty={difficulty}
          onGuess={handleGuess}
          result={result}
          disabled={!!result}
        />
      )}

      <GameResultModal
        isOpen={showResult}
        onClose={() => {
          setShowResult(false);
          setIsPlaying(false);
        }}
        won={result?.won ?? false}
        payout={result?.won ? bet * 2 : 0}
        message={result?.won ? 'You found the pearl!' : 'The pearl was under a different shell.'}
      />
    </GameWrapper>
  );
}
