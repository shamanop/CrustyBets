'use client';

import { useMemo } from 'react';

/**
 * StickerScatter - Decorative environmental layer
 * Renders 35 absolutely positioned SVG casino elements scattered across the full page height.
 * Each element has random position, rotation, scale, and low opacity.
 * Purely decorative - no animation, no interaction.
 */

// Simple inline SVG casino symbols
const symbols = [
  // Poker chip
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="6" fill={color} />
      <line x1="24" y1="2" x2="24" y2="10" stroke={color} strokeWidth="2" />
      <line x1="24" y1="38" x2="24" y2="46" stroke={color} strokeWidth="2" />
      <line x1="2" y1="24" x2="10" y2="24" stroke={color} strokeWidth="2" />
      <line x1="38" y1="24" x2="46" y2="24" stroke={color} strokeWidth="2" />
    </svg>
  ),
  // Dice
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="40" rx="6" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="16" cy="16" r="3" fill={color} />
      <circle cx="32" cy="16" r="3" fill={color} />
      <circle cx="24" cy="24" r="3" fill={color} />
      <circle cx="16" cy="32" r="3" fill={color} />
      <circle cx="32" cy="32" r="3" fill={color} />
    </svg>
  ),
  // Lucky 7
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="12" y="38" fontSize="36" fontWeight="bold" fontFamily="Bangers, cursive" fill={color}>7</text>
    </svg>
  ),
  // Cherry
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="36" r="8" fill={color} />
      <circle cx="32" cy="32" r="8" fill={color} />
      <path d="M16 28 Q20 8 24 6 Q28 8 32 24" stroke={color} strokeWidth="2" fill="none" />
      <ellipse cx="26" cy="6" rx="6" ry="4" fill={color} opacity="0.6" />
    </svg>
  ),
  // Coin
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="15" stroke={color} strokeWidth="1" fill="none" />
      <text x="16" y="30" fontSize="18" fontWeight="bold" fontFamily="Bangers, cursive" fill={color}>$</text>
    </svg>
  ),
  // Spade
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6 C24 6 6 22 6 30 C6 36 10 40 16 40 C20 40 23 38 24 35 C25 38 28 40 32 40 C38 40 42 36 42 30 C42 22 24 6 24 6Z" fill={color} />
      <rect x="22" y="35" width="4" height="10" fill={color} />
    </svg>
  ),
  // Heart
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 42 C24 42 4 28 4 16 C4 8 10 4 16 4 C20 4 23 6 24 10 C25 6 28 4 32 4 C38 4 44 8 44 16 C44 28 24 42 24 42Z" fill={color} />
    </svg>
  ),
  // Diamond
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4 L42 24 L24 44 L6 24 Z" fill={color} />
    </svg>
  ),
  // Club
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="9" fill={color} />
      <circle cx="14" cy="26" r="9" fill={color} />
      <circle cx="34" cy="26" r="9" fill={color} />
      <rect x="22" y="30" width="4" height="12" fill={color} />
    </svg>
  ),
  // Star
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4 L28.9 17.6 L43.4 17.6 L31.3 26.4 L36.2 40 L24 31.2 L11.8 40 L16.7 26.4 L4.6 17.6 L19.1 17.6 Z" fill={color} />
    </svg>
  ),
  // Crab/Lobster silhouette
  (color: string) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="28" rx="14" ry="10" fill={color} />
      <circle cx="18" cy="20" r="4" fill={color} />
      <circle cx="30" cy="20" r="4" fill={color} />
      <path d="M8 28 Q2 22 4 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M40 28 Q46 22 44 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M4 16 L2 12 M4 16 L8 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 16 L46 12 M44 16 L40 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="19" r="1.5" fill="#0a0a0f" />
      <circle cx="30" cy="19" r="1.5" fill="#0a0a0f" />
    </svg>
  ),
];

// Colors for variety
const stickerColors = [
  '#cc2c18', '#ff6b35', '#ea9e2b', '#39ff14', '#14a3a8',
  '#bc13fe', '#ff2d55', '#ffcc00', '#3ab7bf', '#f5f5f0',
];

// Deterministic seeded random for SSR consistency
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface StickerScatterProps {
  children: React.ReactNode;
}

export default function StickerScatter({ children }: StickerScatterProps) {
  const stickers = useMemo(() => {
    const count = 35;
    const items = [];

    for (let i = 0; i < count; i++) {
      const seed = i * 7 + 42;
      const symbolIndex = Math.floor(seededRandom(seed) * symbols.length);
      const colorIndex = Math.floor(seededRandom(seed + 1) * stickerColors.length);
      const left = seededRandom(seed + 2) * 95;
      const top = (i / count) * 100 + seededRandom(seed + 3) * (100 / count);
      const rotation = seededRandom(seed + 4) * 50 - 25;
      const scale = 0.5 + seededRandom(seed + 5) * 0.7;
      const opacity = 0.08 + seededRandom(seed + 6) * 0.07;

      items.push({
        id: i,
        symbolIndex,
        color: stickerColors[colorIndex],
        left: `${left}%`,
        top: `${top}%`,
        rotation,
        scale,
        opacity,
      });
    }

    return items;
  }, []);

  return (
    <div className="relative">
      {/* Sticker scatter layer - behind content, above background */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="absolute"
            style={{
              left: sticker.left,
              top: sticker.top,
              width: `${32 * sticker.scale}px`,
              height: `${32 * sticker.scale}px`,
              transform: `rotate(${sticker.rotation}deg)`,
              opacity: sticker.opacity,
              filter: 'drop-shadow(1px 1px 0 rgba(255,255,255,0.3))',
            }}
          >
            {symbols[sticker.symbolIndex](sticker.color)}
          </div>
        ))}
      </div>

      {/* Page content - above stickers */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
