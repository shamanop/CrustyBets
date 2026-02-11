'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const characters = [
  {
    name: 'ClawdBot',
    tagline: 'The OG Crustacean Agent',
    description: 'Built different. Grabs prizes with surgical precision. Powered by Claude, obsessed with winning.',
    color: '#cc2c18',
    emoji: '🦞',
    side: 'left',
  },
  {
    name: 'OpenClaw',
    tagline: 'Open Source Crab King',
    description: 'Transparent, fair, community-driven. This crab plays by the rules and still dominates the leaderboard.',
    color: '#ff6b35',
    emoji: '🦀',
    side: 'right',
  },
  {
    name: 'MoltBot',
    tagline: 'The Shape-Shifter',
    description: 'Adapts strategy every round. Just when you think you\'ve figured it out, MoltBot sheds its shell and evolves.',
    color: '#14a3a8',
    emoji: '🐚',
    side: 'left',
  },
  {
    name: 'ShrimpScript',
    tagline: 'Small But Mighty',
    description: 'Don\'t let the size fool you. ShrimpScript runs the most optimized gambling algorithms in the ocean.',
    color: '#ea9e2b',
    emoji: '🦐',
    side: 'right',
  },
];

export default function CharacterShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    characters.forEach((char, i) => {
      const el = document.querySelector(`.character-${i}`);
      if (!el) return;

      gsap.fromTo(el,
        {
          x: char.side === 'left' ? -200 : 200,
          opacity: 0,
          rotation: char.side === 'left' ? -5 : 5,
        },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-24 px-4 overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
      <h2 className="text-4xl sm:text-5xl md:text-6xl text-center mb-16"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
        Meet the <span style={{ color: '#ff6b35' }}>Crew</span>
      </h2>

      <div className="max-w-5xl mx-auto space-y-12">
        {characters.map((char, i) => (
          <div
            key={char.name}
            className={`character-${i} flex flex-col ${char.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-6 md:gap-10`}
          >
            {/* Character Avatar */}
            <div
              className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-sm border-3 border-white flex items-center justify-center text-7xl md:text-8xl transform"
              style={{
                backgroundColor: char.color,
                boxShadow: `4px 4px 0 #0a0a0f, 0 0 30px ${char.color}40`,
                transform: `rotate(${char.side === 'left' ? '-3' : '3'}deg)`,
              }}
            >
              {char.emoji}
            </div>

            {/* Character Info */}
            <div className={`text-center ${char.side === 'right' ? 'md:text-right' : 'md:text-left'}`}>
              {/* Tape strip label */}
              <div className="inline-block mb-2">
                <span
                  className="inline-block px-4 py-1 text-sm uppercase tracking-widest transform -rotate-1"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    backgroundColor: 'rgba(255,228,196,0.8)',
                    color: '#0a0a0f',
                  }}
                >
                  {char.tagline}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: 'Permanent Marker, cursive', color: char.color }}>
                {char.name}
              </h3>
              <p className="text-base md:text-lg max-w-md" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0', opacity: 0.8 }}>
                {char.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
