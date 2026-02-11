'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

interface CrabRouletteProps {
  onBet: (bets: Array<{ type: string; value: string | number; amount: number }>) => void;
  result?: { number: number; color: string } | null;
  phase: 'betting' | 'spinning' | 'result';
  timeRemaining: number;
  disabled: boolean;
}

const CANVAS_SIZE = 500;
const CENTER = CANVAS_SIZE / 2;
const WHEEL_RADIUS = 200;
const INNER_RADIUS = 140;
const SEGMENTS = 37; // 0-36

// Roulette colors: 0 = green (Golden Crab), odd/even pattern for red(lobster)/blue(ocean)
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function getSegmentColor(n: number): string {
  if (n === 0) return '#ea9e2b'; // Golden Crab
  return RED_NUMBERS.includes(n) ? '#cc2c18' : '#0d7377'; // Lobster Red / Ocean Blue
}

export default function CrabRouletteCanvas({ onBet, result, phase, timeRemaining, disabled }: CrabRouletteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [crabAngle, setCrabAngle] = useState(0);
  const [selectedBets, setSelectedBets] = useState<Array<{ type: string; value: string | number; amount: number }>>([]);
  const [betAmount, setBetAmount] = useState(10);
  const animRef = useRef<number>(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, wheelRotation: number, crabPos: number) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    ctx.translate(CENTER, CENTER);
    ctx.rotate(wheelRotation);

    // Draw segments
    const segmentAngle = (Math.PI * 2) / SEGMENTS;
    for (let i = 0; i < SEGMENTS; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, WHEEL_RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = getSegmentColor(i);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245,245,240,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Number
      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.translate(WHEEL_RADIUS - 30, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#f5f5f0';
      ctx.font = 'bold 11px "Bangers", cursive';
      ctx.textAlign = 'center';
      ctx.fillText(String(i), 0, 0);
      ctx.restore();
    }

    // Inner circle
    ctx.beginPath();
    ctx.arc(0, 0, INNER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#ea9e2b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center decoration
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#cc2c18';
    ctx.fill();
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u{1F980}', 0, 0);

    ctx.restore();

    // Crab ball (outside wheel rotation)
    if (phase === 'spinning' || phase === 'result') {
      const crabR = WHEEL_RADIUS - 15;
      const cx = CENTER + Math.cos(crabPos) * crabR;
      const cy = CENTER + Math.sin(crabPos) * crabR;

      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('\u{1F980}', cx, cy);

      // Glow
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234,158,43,0.2)';
      ctx.fill();
    }

    // Pointer at top
    ctx.fillStyle = '#39ff14';
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER - WHEEL_RADIUS - 5);
    ctx.lineTo(CENTER - 10, CENTER - WHEEL_RADIUS - 25);
    ctx.lineTo(CENTER + 10, CENTER - WHEEL_RADIUS - 25);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Phase text
    ctx.fillStyle = '#f5f5f0';
    ctx.font = '16px "Permanent Marker", cursive';
    ctx.textAlign = 'center';

    if (phase === 'betting') {
      ctx.fillStyle = '#39ff14';
      ctx.fillText(`Place your bets! ${timeRemaining}s`, CENTER, 30);
    } else if (phase === 'spinning') {
      ctx.fillStyle = '#ffcc00';
      ctx.fillText('No more bets!', CENTER, 30);
    } else if (phase === 'result' && result) {
      ctx.fillStyle = getSegmentColor(result.number);
      ctx.font = '20px "Permanent Marker", cursive';
      ctx.fillText(`Result: ${result.number}`, CENTER, 30);
    }

    // Outer border
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, WHEEL_RADIUS + 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#ea9e2b';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [phase, timeRemaining, result]);

  // Render loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    draw(ctx, rotation, crabAngle);
  }, [draw, rotation, crabAngle]);

  // Spin animation
  useEffect(() => {
    if (phase !== 'spinning' || !result) return;

    const targetSegment = result.number;
    const segmentAngle = (Math.PI * 2) / SEGMENTS;
    const targetRotation = Math.PI * 2 * 5 + targetSegment * segmentAngle; // 5 full rotations + target
    const duration = 4000;
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentRotation = startRotation + targetRotation * eased;
      setRotation(currentRotation);

      // Crab ball moves opposite direction, slowing down
      const crabSpeed = (1 - eased) * 0.3;
      setCrabAngle(prev => prev + crabSpeed);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, result]);

  const addBet = useCallback((type: string, value: string | number) => {
    if (phase !== 'betting' || disabled) return;
    setSelectedBets(prev => [...prev, { type, value, amount: betAmount }]);
  }, [phase, disabled, betAmount]);

  const placeBets = useCallback(() => {
    if (selectedBets.length === 0) return;
    onBet(selectedBets);
  }, [selectedBets, onBet]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="rounded-full"
      />

      {/* Betting controls */}
      {phase === 'betting' && (
        <div className="flex flex-col gap-3 items-center">
          <div className="flex gap-2 items-center">
            <span style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>Chip: </span>
            {[1, 5, 10, 25, 50, 100].map(v => (
              <button
                key={v}
                onClick={() => setBetAmount(v)}
                className={`w-10 h-10 rounded-full border-2 text-xs font-bold ${betAmount === v ? 'scale-110' : ''}`}
                style={{
                  backgroundColor: betAmount === v ? '#ea9e2b' : 'rgba(234,158,43,0.2)',
                  borderColor: '#ea9e2b',
                  color: betAmount === v ? '#0a0a0f' : '#ea9e2b',
                  fontFamily: 'Bangers, cursive',
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={() => addBet('color', 'red')} className="px-4 py-2 rounded-sm border text-sm font-bold" style={{ borderColor: '#cc2c18', color: '#cc2c18', fontFamily: 'Bangers, cursive' }}>
              {'\u{1F99E}'} Red
            </button>
            <button onClick={() => addBet('color', 'blue')} className="px-4 py-2 rounded-sm border text-sm font-bold" style={{ borderColor: '#0d7377', color: '#14a3a8', fontFamily: 'Bangers, cursive' }}>
              {'\u{1F30A}'} Blue
            </button>
            <button onClick={() => addBet('straight', 0)} className="px-4 py-2 rounded-sm border text-sm font-bold" style={{ borderColor: '#ea9e2b', color: '#ea9e2b', fontFamily: 'Bangers, cursive' }}>
              {'\u{1F980}'} Golden (0)
            </button>
          </div>

          {selectedBets.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {selectedBets.length} bet(s) — Total: {selectedBets.reduce((sum, b) => sum + b.amount, 0)} CC
              </span>
              <button
                onClick={placeBets}
                className="px-6 py-2 rounded-sm border-2 border-white font-bold"
                style={{ fontFamily: 'Bangers, cursive', backgroundColor: '#39ff14', color: '#0a0a0f' }}
              >
                PLACE BETS
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
