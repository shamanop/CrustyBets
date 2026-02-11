'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/lib/stores/game-store';
import { ClawPhysicsEngine, Prize } from './ClawPhysicsEngine';

const MACHINE_WIDTH = 500;
const MACHINE_HEIGHT = 600;

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

interface ClawMachineCanvasProps {
  onPrizeWon?: (prize: Prize) => void;
}

export default function ClawMachineCanvas({ onPrizeWon }: ClawMachineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ClawPhysicsEngine | null>(null);
  const animFrameRef = useRef<number>(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const {
    clawPosition,
    updateClawPosition,
    isDropping,
    setIsDropping,
    timeRemaining,
    setTimeRemaining,
    isPlaying,
  } = useGameStore();

  // Initialize physics engine
  useEffect(() => {
    console.log('[ClawMachineCanvas] mounted, initializing physics engine');
    let engine: ClawPhysicsEngine;
    try {
      engine = new ClawPhysicsEngine({
        width: MACHINE_WIDTH,
        height: MACHINE_HEIGHT,
        prizeCount: 15,
      });
    } catch (err) {
      console.error('[ClawMachineCanvas] failed to create physics engine:', err);
      return;
    }

    engine.onPrizeWon = (prize) => {
      console.log('[ClawMachineCanvas] prize won callback:', prize.name, 'value:', prize.value);
      setWonPrize(prize);
      onPrizeWon?.(prize);
    };

    engine.start();
    engineRef.current = engine;
    console.log('[ClawMachineCanvas] physics engine started successfully');

    return () => {
      console.log('[ClawMachineCanvas] unmounting, destroying physics engine');
      engine.destroy();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      console.error('[ClawMachineCanvas] canvas or 2d context unavailable');
      return;
    }
    console.log('[ClawMachineCanvas] render loop starting');

    const render = () => {
      const engine = engineRef.current;
      if (!engine) return;

      ctx.clearRect(0, 0, MACHINE_WIDTH, MACHINE_HEIGHT);

      // Background - machine interior
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, MACHINE_WIDTH, MACHINE_HEIGHT);

      // Grid lines for depth
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < MACHINE_WIDTH; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, MACHINE_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < MACHINE_HEIGHT; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(MACHINE_WIDTH, y);
        ctx.stroke();
      }

      // Draw drop chute
      ctx.fillStyle = 'rgba(57, 255, 20, 0.1)';
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 2;
      ctx.fillRect(MACHINE_WIDTH - 70, MACHINE_HEIGHT - 100, 60, 80);
      ctx.strokeRect(MACHINE_WIDTH - 70, MACHINE_HEIGHT - 100, 60, 80);

      ctx.fillStyle = '#39ff14';
      ctx.font = '10px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DROP', MACHINE_WIDTH - 40, MACHINE_HEIGHT - 55);
      ctx.fillText('ZONE', MACHINE_WIDTH - 40, MACHINE_HEIGHT - 42);

      // Draw prizes
      const prizes = engine.getPrizePositions();
      for (const prize of prizes) {
        ctx.save();
        ctx.translate(prize.x, prize.y);
        ctx.rotate(prize.angle);

        // Prize body
        const color = RARITY_COLORS[prize.rarity] || '#9ca3af';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        // Glow for rare+
        if (prize.rarity !== 'common') {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Prize emoji
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const emojis: Record<string, string> = {
          common: '🦀',
          uncommon: '🐚',
          rare: '💎',
          epic: '👑',
          legendary: '🦞',
        };
        ctx.fillText(emojis[prize.rarity] || '🦀', 0, 0);

        ctx.restore();
      }

      // Draw cable
      const clawPos = engine.getClawPosition();
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(clawPos.x, 10);
      ctx.lineTo(clawPos.x, clawPos.y - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw claw base
      ctx.fillStyle = '#cc2c18';
      ctx.fillRect(clawPos.x - 20, clawPos.y - 10, 40, 20);

      // Draw claw jaws
      const jawOffset = engine.clawOpen ? 18 : 8;

      // Left jaw
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.moveTo(clawPos.x - jawOffset, clawPos.y + 10);
      ctx.lineTo(clawPos.x - jawOffset - 8, clawPos.y + 45);
      ctx.lineTo(clawPos.x - jawOffset + 8, clawPos.y + 45);
      ctx.closePath();
      ctx.fill();

      // Right jaw
      ctx.beginPath();
      ctx.moveTo(clawPos.x + jawOffset, clawPos.y + 10);
      ctx.lineTo(clawPos.x + jawOffset - 8, clawPos.y + 45);
      ctx.lineTo(clawPos.x + jawOffset + 8, clawPos.y + 45);
      ctx.closePath();
      ctx.fill();

      // Glass reflection effect
      const gradient = ctx.createLinearGradient(0, 0, MACHINE_WIDTH, 0);
      gradient.addColorStop(0, 'rgba(255,255,255,0.02)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.06)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, MACHINE_WIDTH, MACHINE_HEIGHT);

      // Machine border
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, MACHINE_WIDTH - 4, MACHINE_HEIGHT - 4);

      // Update store
      updateClawPosition(clawPos);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [updateClawPosition]);

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying) {
      console.log('[ClawMachineCanvas] keyboard controls inactive (not playing)');
      return;
    }
    console.log('[ClawMachineCanvas] keyboard controls activated');

    const keys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase());

      if (e.key === ' ' && !isDropping) {
        e.preventDefault();
        console.log('[ClawMachineCanvas] spacebar pressed - initiating claw drop');
        engineRef.current?.dropClaw();
        setIsDropping(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
    };

    // Movement loop
    const moveInterval = setInterval(() => {
      if (!engineRef.current || isDropping) return;
      if (keys.has('arrowleft') || keys.has('a')) engineRef.current.moveClaw('left');
      if (keys.has('arrowright') || keys.has('d')) engineRef.current.moveClaw('right');
    }, 16);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(moveInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, isDropping, setIsDropping]);

  // Timer
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) {
      if (isPlaying && timeRemaining <= 0) {
        console.log('[ClawMachineCanvas] game timer expired');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining, setTimeRemaining]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={MACHINE_WIDTH}
        height={MACHINE_HEIGHT}
        className="rounded-sm border-2 border-white/20"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Won prize overlay */}
      {wonPrize && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-sm z-10">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Permanent Marker, cursive', color: RARITY_COLORS[wonPrize.rarity] }}>
              {wonPrize.name}!
            </h3>
            <p className="text-lg" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>
              +{wonPrize.value} CrustyCoins
            </p>
            <button
              onClick={() => setWonPrize(null)}
              className="mt-4 px-6 py-2 rounded-sm border-2 border-white font-bold"
              style={{ fontFamily: 'Bangers, cursive', backgroundColor: '#cc2c18', color: '#f5f5f0' }}
            >
              NICE!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
