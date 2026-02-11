'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/lib/stores/game-store';
import GameWrapper from '@/components/games/shared/GameWrapper';
import ClawControls from '@/components/games/claw-machine/ClawControls';

const ClawMachineCanvas = dynamic(
  () => import('@/components/games/claw-machine/ClawMachineCanvas'),
  { ssr: false }
);

const BET_OPTIONS = [10, 25, 50];

export default function ClawMachinePage() {
  const [selectedBet, setSelectedBet] = useState(10);
  const [balance] = useState(100);
  const {
    isPlaying,
    setIsPlaying,
    isDropping,
    setIsDropping,
    timeRemaining,
    setTimeRemaining,
    resetGame,
  } = useGameStore();

  const startGame = useCallback(() => {
    resetGame();
    setIsPlaying(true);
    setTimeRemaining(30);
  }, [resetGame, setIsPlaying, setTimeRemaining]);

  const handleMove = useCallback((direction: 'left' | 'right') => {
    // Handled by keyboard in ClawMachineCanvas
  }, []);

  const handleDrop = useCallback(() => {
    setIsDropping(true);
  }, [setIsDropping]);

  return (
    <GameWrapper
      title="Crusty's Claw Grab"
      emoji="🦞"
      balance={balance}
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
          <p className="text-base opacity-60 mb-8 max-w-md mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Use arrow keys or A/D to move the claw. Press SPACE to drop and grab.
            You have 30 seconds to grab a prize!
          </p>

          {/* Bet selection */}
          <div className="flex items-center justify-center gap-3 mb-6">
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
                  backgroundColor: selectedBet === bet ? 'rgba(234,158,43,0.2)' : 'transparent',
                  color: selectedBet === bet ? '#ea9e2b' : '#f5f5f0',
                }}
              >
                {bet} CC
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            disabled={balance < selectedBet}
            className="px-10 py-4 rounded-sm border-2 border-white font-bold text-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
            style={{
              fontFamily: 'Bangers, cursive',
              backgroundColor: '#cc2c18',
              color: '#f5f5f0',
              boxShadow: '6px 6px 0 #0a0a0f, 0 0 30px rgba(204,44,24,0.4)',
              letterSpacing: '0.05em',
            }}
          >
            START GAME 🎮
          </button>
        </div>
      ) : (
        <>
          <ClawMachineCanvas />
          <ClawControls
            onMove={handleMove}
            onDrop={handleDrop}
            disabled={!isPlaying}
            isDropping={isDropping}
          />
        </>
      )}
    </GameWrapper>
  );
}
