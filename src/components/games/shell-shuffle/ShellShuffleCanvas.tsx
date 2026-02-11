'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

interface ShellShuffleProps {
  shuffleSequence: [number, number][];
  difficulty: number;
  onGuess: (shell: number) => void;
  result?: { won: boolean; pearlPosition: number } | null;
  disabled: boolean;
}

const SHELL_WIDTH = 100;
const SHELL_HEIGHT = 90;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 350;
const SHELL_Y = 200;
const SHELL_POSITIONS = [100, 250, 400]; // x positions for 3 shells

export default function ShellShuffleCanvas({ shuffleSequence, difficulty, onGuess, result, disabled }: ShellShuffleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'showing' | 'shuffling' | 'guessing' | 'revealed'>('showing');
  const [shellPositions, setShellPositions] = useState([...SHELL_POSITIONS]);
  const [hoveredShell, setHoveredShell] = useState<number | null>(null);
  const [selectedShell, setSelectedShell] = useState<number | null>(null);
  const animRef = useRef<number>(0);

  // Draw function
  const draw = useCallback((ctx: CanvasRenderingContext2D, positions: number[], pearlShell?: number, liftedShell?: number) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Background - table surface
    ctx.fillStyle = '#0d7377';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Table felt texture lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Table edge shadow
    const gradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - 50, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);

    // Draw shells
    positions.forEach((x, i) => {
      const isLifted = liftedShell === i;
      const isHovered = hoveredShell === i && phase === 'guessing';
      const shellY = isLifted ? SHELL_Y - 60 : (isHovered ? SHELL_Y - 5 : SHELL_Y);

      // Shell shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(x, SHELL_Y + SHELL_HEIGHT / 2 + 10, SHELL_WIDTH / 2 - 5, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pearl (visible when shell is lifted or during reveal)
      if ((isLifted || phase === 'revealed') && pearlShell === i) {
        ctx.fillStyle = '#f5f5f0';
        ctx.beginPath();
        ctx.arc(x, SHELL_Y + SHELL_HEIGHT / 2, 15, 0, Math.PI * 2);
        ctx.fill();
        // Pearl shine
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(x - 4, SHELL_Y + SHELL_HEIGHT / 2 - 4, 5, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText('\u{1FAE7}', x, SHELL_Y + SHELL_HEIGHT / 2 + 5);
      }

      // Shell body
      ctx.fillStyle = isHovered ? '#ea9e2b' : '#cc2c18';
      ctx.beginPath();
      ctx.ellipse(x, shellY + SHELL_HEIGHT / 2, SHELL_WIDTH / 2, SHELL_HEIGHT / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shell highlight
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.ellipse(x - 10, shellY + SHELL_HEIGHT / 4, SHELL_WIDTH / 4, SHELL_HEIGHT / 4, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Shell top knob
      ctx.fillStyle = isHovered ? '#ffcc00' : '#ff6b35';
      ctx.beginPath();
      ctx.arc(x, shellY + 5, 12, 0, Math.PI * 2);
      ctx.fill();

      // Shell number
      ctx.fillStyle = '#f5f5f0';
      ctx.font = 'bold 14px "Bangers", cursive';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, x, shellY + SHELL_HEIGHT / 2 + 5);
    });

    // Phase text
    ctx.fillStyle = '#f5f5f0';
    ctx.font = '24px "Permanent Marker", cursive';
    ctx.textAlign = 'center';

    if (phase === 'showing') {
      ctx.fillText('Watch the pearl...', CANVAS_WIDTH / 2, 50);
    } else if (phase === 'shuffling') {
      ctx.fillText('Shuffling...', CANVAS_WIDTH / 2, 50);
    } else if (phase === 'guessing') {
      ctx.fillStyle = '#39ff14';
      ctx.fillText('Pick a shell!', CANVAS_WIDTH / 2, 50);
    } else if (phase === 'revealed') {
      ctx.fillStyle = result?.won ? '#39ff14' : '#ff2d55';
      ctx.fillText(result?.won ? 'You found it!' : 'Wrong shell!', CANVAS_WIDTH / 2, 50);
    }

    // Border
    ctx.strokeStyle = '#14a3a8';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, CANVAS_WIDTH - 3, CANVAS_HEIGHT - 3);
  }, [hoveredShell, phase, result]);

  // Animation sequence
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let positions = [...SHELL_POSITIONS];

    // Phase 1: Show pearl (1.5s)
    setPhase('showing');
    draw(ctx, positions, 0, 0); // Show pearl under shell 0

    const shuffleTimeout = setTimeout(async () => {
      setPhase('shuffling');

      // Phase 2: Shuffle
      for (let s = 0; s < shuffleSequence.length; s++) {
        const [a, b] = shuffleSequence[s];

        // Animate swap
        const startA = positions[a];
        const startB = positions[b];
        const duration = Math.max(200, 400 - difficulty * 40);
        const startTime = Date.now();

        await new Promise<void>((resolve) => {
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 0.5 - Math.cos(progress * Math.PI) / 2;

            positions[a] = startA + (startB - startA) * eased;
            positions[b] = startB + (startA - startB) * eased;

            draw(ctx, positions);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Finalize swap
              const temp = positions[a];
              positions[a] = positions[b];
              positions[b] = temp;
              resolve();
            }
          };
          requestAnimationFrame(animate);
        });

        await new Promise(r => setTimeout(r, 50));
      }

      setShellPositions([...positions]);
      setPhase('guessing');
      draw(ctx, positions);
    }, 1500);

    return () => clearTimeout(shuffleTimeout);
  }, [shuffleSequence, difficulty, draw]);

  // Redraw on phase/hover changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (phase === 'guessing') {
      draw(ctx, shellPositions);
    }
    if (phase === 'revealed' && result) {
      draw(ctx, shellPositions, result.pearlPosition);
    }
  }, [phase, hoveredShell, shellPositions, result, draw]);

  // Mouse interaction
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== 'guessing' || disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);

    // Check which shell was clicked
    for (let i = 0; i < shellPositions.length; i++) {
      const sx = shellPositions[i];
      if (Math.abs(x - sx) < SHELL_WIDTH / 2 && Math.abs(y - SHELL_Y - SHELL_HEIGHT / 2) < SHELL_HEIGHT / 2) {
        setSelectedShell(i);
        onGuess(i);
        return;
      }
    }
  }, [phase, disabled, shellPositions, onGuess]);

  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== 'guessing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);

    let found = null;
    for (let i = 0; i < shellPositions.length; i++) {
      const sx = shellPositions[i];
      if (Math.abs(x - sx) < SHELL_WIDTH / 2 && Math.abs(y - SHELL_Y - SHELL_HEIGHT / 2) < SHELL_HEIGHT / 2) {
        found = i;
        break;
      }
    }
    setHoveredShell(found);
  }, [phase, shellPositions]);

  // Handle result
  useEffect(() => {
    if (result) {
      setPhase('revealed');
    }
  }, [result]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="rounded-sm cursor-pointer"
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMove}
      onMouseLeave={() => setHoveredShell(null)}
    />
  );
}
