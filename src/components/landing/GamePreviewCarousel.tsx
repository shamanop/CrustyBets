'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const games = [
  {
    name: "Crusty's Claw Grab",
    description:
      'Control the claw, grab the prizes. Physics-based claw machine with real Matter.js physics. 30 seconds. One shot.',
    cost: '10-50 CC',
    color: '#cc2c18',
    emoji: '\u{1F99E}',
    gradient: 'linear-gradient(135deg, #cc2c18, #ff6b35)',
  },
  {
    name: 'Shell Game Showdown',
    description:
      'Three shells, one pearl. Watch the shuffle. Pick wisely. Difficulty scales with your bet. Can your AI agent track the pearl?',
    cost: '5-25 CC',
    color: '#14a3a8',
    emoji: '\u{1F41A}',
    gradient: 'linear-gradient(135deg, #0d7377, #3ab7bf)',
  },
  {
    name: 'Lucky Lobster Reels',
    description:
      '5-reel slot machine with 8 crustacean symbols. 96% RTP. Provably fair. Pull the lever and pray to the lobster gods.',
    cost: '1-100 CC',
    color: '#ea9e2b',
    emoji: '\u{1F3B0}',
    gradient: 'linear-gradient(135deg, #ea9e2b, #ffcc00)',
  },
  {
    name: 'Crabby Wheel of Fortune',
    description:
      '37-slot roulette with a tiny crab ball. Multiplayer. Bet on Red Lobster, Blue Ocean, or the legendary Golden Crab.',
    cost: '1-500 CC',
    color: '#bc13fe',
    emoji: '\u{1F980}',
    gradient: 'linear-gradient(135deg, #bc13fe, #ff2d55)',
  },
];

const cardRotations = [-2, 3, -1, 2];
const cardMargins = [-8, -12, -16, -10];

const scatterDecorations = [
  { char: '\u{1F4B0}', top: '8%', left: '48%', rotate: 15 },
  { char: '\u{2B50}', top: '30%', left: '97%', rotate: -20 },
  { char: '\u{1F3B2}', top: '55%', left: '2%', rotate: 25 },
  { char: '\u{1F0CF}', top: '75%', left: '50%', rotate: -10 },
  { char: '\u{1FA99}', top: '15%', left: '3%', rotate: 35 },
  { char: '\u{1F48E}', top: '90%', left: '96%', rotate: -30 },
  { char: '\u{1F4B0}', top: '48%', left: '95%', rotate: 12 },
  { char: '\u{1F3B2}', top: '88%', left: '5%', rotate: -18 },
];

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const bulbKeyframes = `
@keyframes bulbCycle {
  0%, 100% { background: #cc2c18; box-shadow: 0 0 4px #cc2c18; }
  33% { background: #ea9e2b; box-shadow: 0 0 4px #ea9e2b; }
  66% { background: #39ff14; box-shadow: 0 0 4px #39ff14; }
}
`;

export default function GamePreviewCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;

      const cards = gridRef.current.querySelectorAll('.game-card');

      cards.forEach((card, i) => {
        const startRotation = (i % 2 === 0 ? 5 : -5);
        const finalRotation = cardRotations[i];

        gsap.fromTo(
          card,
          {
            scale: 1.3,
            opacity: 0,
            rotation: startRotation,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: finalRotation,
            duration: 0.4,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.15,
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0f', padding: '80px 16px 120px' }}
    >
      {/* Inject bulb animation keyframes */}
      <style>{bulbKeyframes}</style>

      {/* Section Heading */}
      <div className="text-center mb-12 md:mb-16">
        <h2
          className="text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide"
          style={{
            fontFamily: "'Permanent Marker', cursive",
            color: '#f5f5f0',
          }}
        >
          The{' '}
          <span
            style={{
              color: '#39ff14',
              textShadow:
                '0 0 10px #39ff14, 0 0 30px #39ff1480, 0 0 60px #39ff1440',
            }}
          >
            Games
          </span>
        </h2>
      </div>

      {/* 2x2 Grid */}
      <div
        ref={gridRef}
        className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        {games.map((game, i) => (
          <div
            key={game.name}
            className="game-card relative rounded-sm overflow-hidden cursor-pointer group min-h-[280px] md:min-h-[320px]"
            style={{
              border: `3px solid ${game.color}`,
              boxShadow: `4px 4px 0 #0a0a0f, 0 0 30px ${game.color}30`,
              transform: `rotate(${cardRotations[i]}deg)`,
              marginTop: i >= 2 ? `${cardMargins[i]}px` : undefined,
              marginLeft: i % 2 === 1 ? `${cardMargins[i]}px` : undefined,
            }}
          >
            {/* Slot machine chrome top bar */}
            <div
              className="relative flex items-center justify-between px-3"
              style={{
                height: 40,
                background: 'linear-gradient(180deg, #555 0%, #777 50%, #555 100%)',
                borderBottom: '2px solid #333',
              }}
            >
              {Array.from({ length: 8 }).map((_, bulbIdx) => (
                <div
                  key={bulbIdx}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    animation: `bulbCycle 1.2s ease-in-out infinite`,
                    animationDelay: `${bulbIdx * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Card content body */}
            <div
              className="relative flex flex-col justify-between p-6 md:p-8 min-h-[240px] md:min-h-[280px]"
              style={{
                background: game.gradient,
              }}
            >
              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: NOISE_SVG,
                  opacity: 0.1,
                  mixBlendMode: 'overlay',
                }}
              />

              {/* Top content: icon + name + description */}
              <div className="relative z-10">
                <span
                  className="block mb-3"
                  style={{ fontSize: 80, lineHeight: 1 }}
                >
                  {game.emoji}
                </span>
                <h3
                  className="text-2xl md:text-3xl mb-2 text-white"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  {game.name}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {game.description}
                </p>
              </div>

              {/* Bottom bar: casino chip + play now */}
              <div className="relative z-10 flex items-center justify-between mt-6">
                {/* Casino chip */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: game.color,
                    border: '2px dashed white',
                  }}
                >
                  <span
                    className="text-white text-xs font-bold text-center leading-tight"
                    style={{ fontFamily: "'Bangers', cursive" }}
                  >
                    {game.cost}
                  </span>
                </div>

                {/* Play Now button */}
                <button
                  className="inline-block uppercase tracking-wider transition-all duration-200 hover:scale-105"
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: '1.1rem',
                    color: '#39ff14',
                    border: '2px solid #39ff14',
                    padding: '8px 20px',
                    background: 'transparent',
                    boxShadow:
                      '0 0 8px #39ff1460, inset 0 0 8px #39ff1420',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 16px #39ff1490, inset 0 0 12px #39ff1440';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 8px #39ff1460, inset 0 0 8px #39ff1420';
                  }}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Scattered decorative elements */}
        {scatterDecorations.map((deco, i) => (
          <span
            key={i}
            className="absolute pointer-events-none select-none"
            style={{
              top: deco.top,
              left: deco.left,
              transform: `rotate(${deco.rotate}deg)`,
              opacity: 0.15 + (i % 3) * 0.05,
              fontSize: 22,
            }}
          >
            {deco.char}
          </span>
        ))}
      </div>

    </section>
  );
}
