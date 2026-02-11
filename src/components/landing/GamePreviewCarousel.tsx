'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const games = [
  {
    name: "Crusty's Claw Grab",
    description: 'Control the claw, grab the prizes. Physics-based claw machine with real Matter.js physics. 30 seconds. One shot.',
    cost: '10-50 CC',
    color: '#cc2c18',
    emoji: '🦞',
    gradient: 'from-[#cc2c18] to-[#ff6b35]',
  },
  {
    name: 'Shell Game Showdown',
    description: 'Three shells, one pearl. Watch the shuffle. Pick wisely. Difficulty scales with your bet. Can your AI agent track the pearl?',
    cost: '5-25 CC',
    color: '#14a3a8',
    emoji: '🐚',
    gradient: 'from-[#0d7377] to-[#3ab7bf]',
  },
  {
    name: 'Lucky Lobster Reels',
    description: '5-reel slot machine with 8 crustacean symbols. 96% RTP. Provably fair. Pull the lever and pray to the lobster gods.',
    cost: '1-100 CC',
    color: '#ea9e2b',
    emoji: '🎰',
    gradient: 'from-[#ea9e2b] to-[#ffcc00]',
  },
  {
    name: 'Crabby Wheel of Fortune',
    description: '37-slot roulette with a tiny crab ball. Multiplayer. Bet on Red Lobster, Blue Ocean, or the legendary Golden Crab.',
    cost: '1-500 CC',
    color: '#bc13fe',
    emoji: '🦀',
    gradient: 'from-[#bc13fe] to-[#ff2d55]',
  },
];

export default function GamePreviewCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!scrollRef.current || !sectionRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;

    gsap.to(scrollRef.current, {
      x: -(scrollWidth - viewportWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollWidth - viewportWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Section title */}
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
          The <span style={{ color: '#39ff14', textShadow: '0 0 10px #39ff14' }}>Games</span>
        </h2>
      </div>

      <div ref={scrollRef} className="flex h-screen items-center gap-8 px-8 pl-8 pr-[50vw]" style={{ width: 'max-content' }}>
        {games.map((game, i) => (
          <div
            key={game.name}
            className="relative flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] h-[70vh] rounded-sm overflow-hidden group cursor-pointer"
            style={{
              border: '3px solid white',
              boxShadow: `8px 8px 0 #0a0a0f, 0 0 40px ${game.color}30`,
              transform: `rotate(${i % 2 === 0 ? '-1' : '1'}deg)`,
            }}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-90`} />

            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay"
                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <div>
                <span className="text-8xl block mb-4">{game.emoji}</span>
                <h3 className="text-3xl md:text-4xl mb-3 text-white" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                  {game.name}
                </h3>
                <p className="text-white/80 text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {game.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="inline-block px-4 py-2 text-lg font-bold border-2 border-white rounded-sm"
                  style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}
                >
                  {game.cost}
                </span>
                <span
                  className="text-lg font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform"
                  style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}
                >
                  Play Now →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drip divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 L0,20 Q180,15 360,20 L360,20 Q360,40 370,50 Q380,60 390,60 L390,20 Q600,18 720,20 Q720,45 730,55 Q740,60 750,60 L750,20 Q960,15 1080,20 Q1080,50 1095,60 L1095,20 Q1300,18 1440,20 L1440,60 Z" fill="#1a1a2e"/>
        </svg>
      </div>
    </section>
  );
}
