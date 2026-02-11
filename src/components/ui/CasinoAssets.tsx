'use client';

import React from 'react';

/* ============================================================================
   CrustyBets Casino Asset Library
   ============================================================================
   Color Palette:
     Lobster red:   #cc2c18
     Crab orange:   #ff6b35
     Gold:          #ea9e2b
     Deep teal:     #0d7377
     Bright teal:   #14a3a8
     Neon green:    #39ff14
     Hot pink:      #ff2d55
     Purple:        #bc13fe
     Yellow:        #ffcc00
     Sticker white: #f5f5f0
   ============================================================================ */

type SvgProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
  style?: React.CSSProperties;
};

type WrapperSvgProps = SvgProps & {
  children?: React.ReactNode;
};

type ChipProps = SvgProps & {
  chipColor?: string;
};

type DiceProps = SvgProps & {
  face?: 1 | 2 | 3 | 4 | 5 | 6;
};

/* --------------------------------------------------------------------------
   1. SlotMachineFrame
   A detailed slot machine border/frame with brushed metal, rivets, light bulbs
   across the top. Works as a wrapper that accepts children.
   -------------------------------------------------------------------------- */
export const SlotMachineFrame: React.FC<WrapperSvgProps> = ({
  children,
  className,
  style,
  ...props
}) => {
  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <svg
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        {...props}
      >
        <defs>
          {/* Brushed metal gradient */}
          <linearGradient id="crusty-metal-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c0c0c0" />
            <stop offset="15%" stopColor="#a8a8a8" />
            <stop offset="30%" stopColor="#d0d0d0" />
            <stop offset="50%" stopColor="#b0b0b0" />
            <stop offset="70%" stopColor="#c8c8c8" />
            <stop offset="85%" stopColor="#a0a0a0" />
            <stop offset="100%" stopColor="#b8b8b8" />
          </linearGradient>
          {/* Frame bevel highlight */}
          <linearGradient id="crusty-bevel-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#909090" />
          </linearGradient>
          {/* Inner shadow */}
          <filter id="crusty-frame-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
          </filter>
          {/* Rivet gradient */}
          <radialGradient id="crusty-rivet-grad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#e0e0e0" />
            <stop offset="50%" stopColor="#a0a0a0" />
            <stop offset="100%" stopColor="#707070" />
          </radialGradient>
          {/* Bulb glow */}
          <filter id="crusty-bulb-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer frame */}
        <rect x="2" y="2" width="396" height="496" rx="18" ry="18"
          fill="url(#crusty-metal-grad)" stroke="#666" strokeWidth="2"
          filter="url(#crusty-frame-shadow)" />

        {/* Top bevel strip */}
        <rect x="8" y="8" width="384" height="40" rx="10" ry="10"
          fill="url(#crusty-bevel-top)" opacity="0.8" />

        {/* Bottom bevel strip */}
        <rect x="8" y="452" width="384" height="40" rx="10" ry="10"
          fill="url(#crusty-bevel-top)" opacity="0.6" />

        {/* Inner cutout area */}
        <rect x="24" y="56" width="352" height="388" rx="10" ry="10"
          fill="#1a1a2e" stroke="#555" strokeWidth="2" />

        {/* Inner bevel highlight */}
        <rect x="26" y="58" width="348" height="2" rx="1" ry="1"
          fill="#888" opacity="0.5" />

        {/* Light bulbs across the top */}
        {Array.from({ length: 16 }).map((_, i) => {
          const cx = 32 + i * 22;
          const colors = ['#cc2c18', '#ea9e2b', '#39ff14', '#ff2d55', '#bc13fe', '#ffcc00'];
          const color = colors[i % colors.length];
          return (
            <g key={`bulb-${i}`}>
              <circle cx={cx} cy="28" r="6" fill={color} opacity="0.9"
                filter="url(#crusty-bulb-glow)" />
              <circle cx={cx - 1.5} cy="26" r="2" fill="#fff" opacity="0.6" />
            </g>
          );
        })}

        {/* Rivets - corners */}
        {[
          [18, 18], [382, 18], [18, 482], [382, 482],
          [18, 56], [382, 56], [18, 444], [382, 444],
          [200, 12], [200, 488],
        ].map(([cx, cy], i) => (
          <g key={`rivet-${i}`}>
            <circle cx={cx} cy={cy} r="5" fill="url(#crusty-rivet-grad)" stroke="#666" strokeWidth="0.5" />
            <circle cx={cx - 1} cy={cy - 1} r="1.5" fill="#ddd" opacity="0.7" />
          </g>
        ))}

        {/* Side decorative strips */}
        <rect x="10" y="60" width="8" height="380" rx="3" ry="3"
          fill="#888" opacity="0.4" />
        <rect x="382" y="60" width="8" height="380" rx="3" ry="3"
          fill="#888" opacity="0.4" />

        {/* Bottom plate engraving lines */}
        <line x1="60" y1="466" x2="340" y2="466" stroke="#888" strokeWidth="0.5" opacity="0.5" />
        <line x1="80" y1="472" x2="320" y2="472" stroke="#888" strokeWidth="0.5" opacity="0.5" />
        <line x1="100" y1="478" x2="300" y2="478" stroke="#888" strokeWidth="0.5" opacity="0.5" />
      </svg>
      <div style={{
        position: 'relative',
        padding: '60px 28px 52px 28px',
        zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
};


/* --------------------------------------------------------------------------
   2. ChasingLights
   A row of animated circles that cycle through red, gold, green.
   -------------------------------------------------------------------------- */
export const ChasingLights: React.FC<SvgProps> = ({ className, style, ...props }) => {
  const numLights = 20;
  return (
    <svg
      viewBox={`0 0 ${numLights * 24} 24`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', ...style }}
      {...props}
    >
      <defs>
        <filter id="crusty-chase-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes crustyChase {
            0%, 100% { opacity: 1; }
            33% { opacity: 0.2; }
            66% { opacity: 0.5; }
          }
          .crusty-chase-0 { animation: crustyChase 1.5s ease-in-out infinite; }
          .crusty-chase-1 { animation: crustyChase 1.5s ease-in-out 0.5s infinite; }
          .crusty-chase-2 { animation: crustyChase 1.5s ease-in-out 1s infinite; }
        `}</style>
      </defs>
      {Array.from({ length: numLights }).map((_, i) => {
        const colors = ['#cc2c18', '#ea9e2b', '#39ff14'];
        const color = colors[i % 3];
        return (
          <g key={`chase-${i}`}>
            <circle
              cx={12 + i * 24}
              cy="12"
              r="8"
              fill={color}
              className={`crusty-chase-${i % 3}`}
              filter="url(#crusty-chase-glow)"
            />
            <circle
              cx={10 + i * 24}
              cy="9"
              r="3"
              fill="#fff"
              opacity="0.4"
              className={`crusty-chase-${i % 3}`}
            />
            {/* Socket ring */}
            <circle
              cx={12 + i * 24}
              cy="12"
              r="9.5"
              fill="none"
              stroke="#888"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </svg>
  );
};


/* --------------------------------------------------------------------------
   3. GoldCoin
   Gold coin with "CC" monogram, 3D tilt, shiny gradient.
   -------------------------------------------------------------------------- */
export const GoldCoin: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <radialGradient id="crusty-coin-face" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#fff5a0" />
        <stop offset="25%" stopColor="#ffcc00" />
        <stop offset="55%" stopColor="#ea9e2b" />
        <stop offset="80%" stopColor="#c78520" />
        <stop offset="100%" stopColor="#8b6914" />
      </radialGradient>
      <linearGradient id="crusty-coin-edge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c78520" />
        <stop offset="50%" stopColor="#8b6914" />
        <stop offset="100%" stopColor="#6b5010" />
      </linearGradient>
      <filter id="crusty-coin-shadow">
        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
      </filter>
      <filter id="crusty-coin-emboss">
        <feDiffuseLighting surfaceScale="3" diffuseConstant="0.8" result="light">
          <fePointLight x="40" y="30" z="60" />
        </feDiffuseLighting>
        <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="1" k2="0.4" k3="0" k4="0" />
      </filter>
    </defs>

    {/* 3D edge (ellipse to simulate tilt) */}
    <ellipse cx="50" cy="54" rx="42" ry="40" fill="url(#crusty-coin-edge)" />
    <ellipse cx="50" cy="54" rx="42" ry="40" fill="#6b5010" opacity="0.4" />

    {/* Main coin face */}
    <ellipse cx="50" cy="50" rx="42" ry="40" fill="url(#crusty-coin-face)"
      filter="url(#crusty-coin-shadow)" />

    {/* Outer ring */}
    <ellipse cx="50" cy="50" rx="38" ry="36" fill="none" stroke="#c78520" strokeWidth="2" />

    {/* Inner ring with notches */}
    <ellipse cx="50" cy="50" rx="33" ry="31" fill="none" stroke="#c78520" strokeWidth="1.5"
      strokeDasharray="4 3" />

    {/* CC Monogram */}
    <text x="50" y="56" textAnchor="middle" fontFamily="Georgia, serif"
      fontSize="26" fontWeight="bold" fill="#8b6914" opacity="0.6">
      CC
    </text>
    <text x="49" y="55" textAnchor="middle" fontFamily="Georgia, serif"
      fontSize="26" fontWeight="bold" fill="#fff5a0">
      CC
    </text>

    {/* Shine highlight */}
    <ellipse cx="36" cy="36" rx="18" ry="14" fill="#fff" opacity="0.15"
      transform="rotate(-20 36 36)" />

    {/* Tiny star sparkles */}
    <circle cx="72" cy="28" r="2" fill="#fff" opacity="0.7" />
    <circle cx="76" cy="32" r="1" fill="#fff" opacity="0.5" />
    <circle cx="30" cy="70" r="1.5" fill="#fff" opacity="0.4" />

    {/* Edge ridges (coin reeding) */}
    {Array.from({ length: 36 }).map((_, i) => {
      const angle = (i * 10) * Math.PI / 180;
      const x1 = 50 + 42 * Math.cos(angle);
      const y1 = 50 + 40 * Math.sin(angle);
      const x2 = 50 + 44 * Math.cos(angle);
      const y2 = 50 + 42 * Math.sin(angle);
      return (
        <line key={`reed-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#a08030" strokeWidth="0.5" opacity="0.5" />
      );
    })}
  </svg>
);


/* --------------------------------------------------------------------------
   4. CasinoChip
   Casino chip with dashed inner ring, customizable color, 3D bevel.
   -------------------------------------------------------------------------- */
export const CasinoChip: React.FC<ChipProps> = ({
  chipColor = '#cc2c18',
  className,
  style,
  ...props
}) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <radialGradient id={`crusty-chip-face-${chipColor.replace('#', '')}`} cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor={chipColor} stopOpacity="1" />
        <stop offset="70%" stopColor={chipColor} stopOpacity="0.85" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
      </radialGradient>
      <filter id="crusty-chip-bevel">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* 3D edge */}
    <circle cx="50" cy="53" r="44" fill="#222" opacity="0.5" />

    {/* Main chip body */}
    <circle cx="50" cy="50" r="44" fill={`url(#crusty-chip-face-${chipColor.replace('#', '')})`}
      filter="url(#crusty-chip-bevel)" />

    {/* Outer white edge stripes */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45) * Math.PI / 180;
      const x1 = 50 + 38 * Math.cos(angle);
      const y1 = 50 + 38 * Math.sin(angle);
      const x2 = 50 + 44 * Math.cos(angle);
      const y2 = 50 + 44 * Math.sin(angle);
      return (
        <line key={`stripe-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#f5f5f0" strokeWidth="5" strokeLinecap="round" />
      );
    })}

    {/* Inner ring */}
    <circle cx="50" cy="50" r="34" fill="none" stroke="#f5f5f0" strokeWidth="1.5" />

    {/* Dashed inner ring */}
    <circle cx="50" cy="50" r="28" fill="none" stroke="#f5f5f0" strokeWidth="1"
      strokeDasharray="6 4" />

    {/* Center value circle */}
    <circle cx="50" cy="50" r="20" fill={chipColor} stroke="#f5f5f0" strokeWidth="1.5" />

    {/* CC Logo */}
    <text x="50" y="55" textAnchor="middle" fontFamily="Georgia, serif"
      fontSize="16" fontWeight="bold" fill="#f5f5f0">
      CC
    </text>

    {/* Highlight */}
    <ellipse cx="38" cy="38" rx="16" ry="12" fill="#fff" opacity="0.1"
      transform="rotate(-30 38 38)" />

    {/* Edge detail ring */}
    <circle cx="50" cy="50" r="43" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
  </svg>
);


/* --------------------------------------------------------------------------
   5. LuckySeven
   Stylized "7" like slot machine reels.
   -------------------------------------------------------------------------- */
export const LuckySeven: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 80 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-seven-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff2d55" />
        <stop offset="40%" stopColor="#cc2c18" />
        <stop offset="100%" stopColor="#8b1a0e" />
      </linearGradient>
      <linearGradient id="crusty-seven-shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id="crusty-seven-shadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
      </filter>
      <filter id="crusty-seven-glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Outer glow */}
    <text x="40" y="82" textAnchor="middle" fontFamily="Impact, sans-serif"
      fontSize="90" fontWeight="bold" fill="#ff2d55" opacity="0.3"
      filter="url(#crusty-seven-glow)">
      7
    </text>

    {/* Shadow layer */}
    <text x="42" y="84" textAnchor="middle" fontFamily="Impact, sans-serif"
      fontSize="90" fontWeight="bold" fill="#4a0a08" opacity="0.6">
      7
    </text>

    {/* Main 7 */}
    <text x="40" y="82" textAnchor="middle" fontFamily="Impact, sans-serif"
      fontSize="90" fontWeight="bold" fill="url(#crusty-seven-grad)"
      stroke="#ea9e2b" strokeWidth="2"
      filter="url(#crusty-seven-shadow)">
      7
    </text>

    {/* Gold outline */}
    <text x="40" y="82" textAnchor="middle" fontFamily="Impact, sans-serif"
      fontSize="90" fontWeight="bold" fill="none"
      stroke="#ffcc00" strokeWidth="1" opacity="0.6">
      7
    </text>

    {/* Shine overlay */}
    <rect x="8" y="5" width="40" height="45" fill="url(#crusty-seven-shine)"
      clipPath="url(#crusty-seven-clip)" opacity="0.4" rx="4" />

    {/* Sparkle accents */}
    <circle cx="60" cy="15" r="3" fill="#ffcc00" opacity="0.8" />
    <circle cx="65" cy="20" r="1.5" fill="#fff" opacity="0.6" />
    <circle cx="15" cy="80" r="2" fill="#ea9e2b" opacity="0.5" />

    {/* Star sparkle top right */}
    <path d="M62 10 L63 7 L64 10 L67 11 L64 12 L63 15 L62 12 L59 11 Z"
      fill="#ffcc00" opacity="0.9" />
  </svg>
);


/* --------------------------------------------------------------------------
   6. Cherry
   Classic slot cherry symbol with stem and two cherries.
   -------------------------------------------------------------------------- */
export const Cherry: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <radialGradient id="crusty-cherry-grad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#ff4060" />
        <stop offset="40%" stopColor="#cc2c18" />
        <stop offset="100%" stopColor="#7a1a0e" />
      </radialGradient>
      <radialGradient id="crusty-cherry-grad2" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#ff5070" />
        <stop offset="40%" stopColor="#cc2c18" />
        <stop offset="100%" stopColor="#6a1208" />
      </radialGradient>
      <linearGradient id="crusty-stem-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2d7a2d" />
        <stop offset="50%" stopColor="#4a9e4a" />
        <stop offset="100%" stopColor="#2d7a2d" />
      </linearGradient>
      <filter id="crusty-cherry-shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Stem - curved path */}
    <path d="M50 8 Q50 25 38 42" fill="none" stroke="url(#crusty-stem-grad)"
      strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 8 Q55 28 68 40" fill="none" stroke="url(#crusty-stem-grad)"
      strokeWidth="3.5" strokeLinecap="round" />

    {/* Leaf */}
    <path d="M48 10 Q40 2 30 8 Q36 14 48 10 Z" fill="#3da33d" stroke="#2d7a2d"
      strokeWidth="0.5" />
    <path d="M52 10 Q58 0 66 5 Q60 12 52 10 Z" fill="#4ab84a" stroke="#2d7a2d"
      strokeWidth="0.5" />
    {/* Leaf veins */}
    <path d="M48 10 Q40 6 34 8" fill="none" stroke="#2d7a2d" strokeWidth="0.5" opacity="0.6" />
    <path d="M52 10 Q58 5 62 6" fill="none" stroke="#2d7a2d" strokeWidth="0.5" opacity="0.6" />

    {/* Left cherry shadow */}
    <ellipse cx="34" cy="72" rx="22" ry="20" fill="#3a0808" opacity="0.3" />

    {/* Left cherry */}
    <ellipse cx="32" cy="68" rx="22" ry="22" fill="url(#crusty-cherry-grad)"
      filter="url(#crusty-cherry-shadow)" />
    {/* Left cherry highlight */}
    <ellipse cx="24" cy="58" rx="8" ry="6" fill="#fff" opacity="0.25"
      transform="rotate(-20 24 58)" />
    <circle cx="22" cy="56" r="3" fill="#fff" opacity="0.35" />
    {/* Left cherry bottom shadow */}
    <ellipse cx="36" cy="80" rx="12" ry="5" fill="#5a0a0a" opacity="0.3" />

    {/* Right cherry shadow */}
    <ellipse cx="72" cy="70" rx="20" ry="18" fill="#3a0808" opacity="0.3" />

    {/* Right cherry */}
    <ellipse cx="70" cy="66" rx="20" ry="20" fill="url(#crusty-cherry-grad2)"
      filter="url(#crusty-cherry-shadow)" />
    {/* Right cherry highlight */}
    <ellipse cx="63" cy="57" rx="7" ry="5" fill="#fff" opacity="0.25"
      transform="rotate(-20 63 57)" />
    <circle cx="61" cy="55" r="2.5" fill="#fff" opacity="0.35" />
    {/* Right cherry bottom shadow */}
    <ellipse cx="74" cy="78" rx="10" ry="4" fill="#5a0a0a" opacity="0.3" />
  </svg>
);


/* --------------------------------------------------------------------------
   7. Bar
   Classic slot BAR symbol.
   -------------------------------------------------------------------------- */
export const Bar: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 120 60"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '2em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-bar-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a2a2a" />
        <stop offset="50%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <linearGradient id="crusty-bar-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffdd44" />
        <stop offset="30%" stopColor="#ea9e2b" />
        <stop offset="70%" stopColor="#c78520" />
        <stop offset="100%" stopColor="#ffdd44" />
      </linearGradient>
      <filter id="crusty-bar-shadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.5" />
      </filter>
    </defs>

    {/* Background bar shape */}
    <rect x="2" y="2" width="116" height="56" rx="8" ry="8"
      fill="url(#crusty-bar-bg)" stroke="#ea9e2b" strokeWidth="3" />

    {/* Inner border */}
    <rect x="6" y="6" width="108" height="48" rx="5" ry="5"
      fill="none" stroke="#ea9e2b" strokeWidth="1" opacity="0.5" />

    {/* Top highlight */}
    <rect x="8" y="4" width="104" height="8" rx="4" ry="4"
      fill="#fff" opacity="0.08" />

    {/* BAR text - shadow */}
    <text x="62" y="42" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif"
      fontSize="36" fontWeight="bold" fill="#000" opacity="0.5"
      letterSpacing="6">
      BAR
    </text>

    {/* BAR text - main */}
    <text x="60" y="41" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif"
      fontSize="36" fontWeight="bold" fill="url(#crusty-bar-gold)"
      stroke="#8b6914" strokeWidth="0.5" letterSpacing="6"
      filter="url(#crusty-bar-shadow)">
      BAR
    </text>

    {/* Shine line */}
    <line x1="15" y1="16" x2="105" y2="16" stroke="#fff" strokeWidth="0.5" opacity="0.15" />

    {/* Corner accents */}
    <circle cx="12" cy="12" r="2" fill="#ea9e2b" opacity="0.6" />
    <circle cx="108" cy="12" r="2" fill="#ea9e2b" opacity="0.6" />
    <circle cx="12" cy="48" r="2" fill="#ea9e2b" opacity="0.6" />
    <circle cx="108" cy="48" r="2" fill="#ea9e2b" opacity="0.6" />
  </svg>
);


/* --------------------------------------------------------------------------
   8. Diamond
   Sparkling diamond gem.
   -------------------------------------------------------------------------- */
export const Diamond: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-diamond-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b0e0ff" />
        <stop offset="50%" stopColor="#14a3a8" />
        <stop offset="100%" stopColor="#0d7377" />
      </linearGradient>
      <linearGradient id="crusty-diamond-left" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0d7377" />
        <stop offset="100%" stopColor="#063a3c" />
      </linearGradient>
      <linearGradient id="crusty-diamond-right" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14a3a8" />
        <stop offset="100%" stopColor="#0d7377" />
      </linearGradient>
      <linearGradient id="crusty-diamond-center" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a0f0ff" />
        <stop offset="100%" stopColor="#14a3a8" />
      </linearGradient>
      <filter id="crusty-diamond-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="crusty-diamond-shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
      </filter>
    </defs>

    <g filter="url(#crusty-diamond-shadow)">
      {/* Crown (top) */}
      {/* Top left facet */}
      <polygon points="50,5 20,35 50,35" fill="url(#crusty-diamond-top)" />
      {/* Top right facet */}
      <polygon points="50,5 80,35 50,35" fill="url(#crusty-diamond-right)" />
      {/* Far left crown */}
      <polygon points="50,5 20,35 8,35" fill="#0d7377" />
      {/* Far right crown */}
      <polygon points="50,5 80,35 92,35" fill="#14a3a8" />

      {/* Pavilion (bottom) */}
      {/* Bottom left large facet */}
      <polygon points="8,35 50,95 35,35" fill="url(#crusty-diamond-left)" />
      {/* Bottom center left */}
      <polygon points="35,35 50,95 50,35" fill="url(#crusty-diamond-center)" />
      {/* Bottom center right */}
      <polygon points="50,35 50,95 65,35" fill="#14a3a8" />
      {/* Bottom right large facet */}
      <polygon points="65,35 50,95 92,35" fill="url(#crusty-diamond-right)" />

      {/* Girdle line */}
      <line x1="8" y1="35" x2="92" y2="35" stroke="#a0f0ff" strokeWidth="1" opacity="0.6" />

      {/* Facet lines */}
      <line x1="50" y1="5" x2="35" y2="35" stroke="#a0f0ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="50" y1="5" x2="65" y2="35" stroke="#a0f0ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="35" x2="50" y2="95" stroke="#80d0e0" strokeWidth="0.5" opacity="0.2" />
      <line x1="80" y1="35" x2="50" y2="95" stroke="#80d0e0" strokeWidth="0.5" opacity="0.2" />
    </g>

    {/* Sparkles */}
    <g filter="url(#crusty-diamond-glow)">
      <path d="M76 15 L78 10 L80 15 L85 17 L80 19 L78 24 L76 19 L71 17 Z"
        fill="#fff" opacity="0.9" />
      <path d="M20 20 L21 17 L22 20 L25 21 L22 22 L21 25 L20 22 L17 21 Z"
        fill="#fff" opacity="0.7" />
      <circle cx="50" cy="20" r="2" fill="#fff" opacity="0.6" />
      <circle cx="88" cy="38" r="1.5" fill="#a0f0ff" opacity="0.8" />
    </g>
  </svg>
);


/* --------------------------------------------------------------------------
   9. CardSuits - Spade, Heart, Diamond, Club
   -------------------------------------------------------------------------- */
export const Spade: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 80 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-spade-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#444" />
        <stop offset="50%" stopColor="#1a1a2e" />
        <stop offset="100%" stopColor="#000" />
      </linearGradient>
      <filter id="crusty-spade-shadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#crusty-spade-shadow)">
      {/* Spade body */}
      <path d="M40 5 C40 5 5 40 5 58 C5 72 18 80 30 72 C34 69 37 65 40 60
               C43 65 46 69 50 72 C62 80 75 72 75 58 C75 40 40 5 40 5 Z"
        fill="url(#crusty-spade-grad)" stroke="#333" strokeWidth="1" />
      {/* Stem */}
      <path d="M36 65 L36 90 Q36 95 40 95 Q44 95 44 90 L44 65"
        fill="url(#crusty-spade-grad)" stroke="#333" strokeWidth="0.5" />
      {/* Base */}
      <ellipse cx="40" cy="93" rx="14" ry="5" fill="url(#crusty-spade-grad)"
        stroke="#333" strokeWidth="0.5" />
      {/* Highlight */}
      <path d="M40 12 C40 12 20 38 18 52 C17 58 22 62 28 60"
        fill="none" stroke="#666" strokeWidth="1.5" opacity="0.3" />
      <circle cx="28" cy="40" r="3" fill="#fff" opacity="0.1" />
    </g>
  </svg>
);

export const Heart: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <radialGradient id="crusty-heart-grad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ff5070" />
        <stop offset="50%" stopColor="#cc2c18" />
        <stop offset="100%" stopColor="#7a1a0e" />
      </radialGradient>
      <filter id="crusty-heart-shadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#crusty-heart-shadow)">
      <path d="M40 75 C40 75 5 48 5 25 C5 12 15 5 25 5 C32 5 37 9 40 15
               C43 9 48 5 55 5 C65 5 75 12 75 25 C75 48 40 75 40 75 Z"
        fill="url(#crusty-heart-grad)" stroke="#8b1a0e" strokeWidth="1" />
      {/* Highlight */}
      <path d="M22 12 C16 14 10 22 10 30"
        fill="none" stroke="#ff8090" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <circle cx="20" cy="18" r="3" fill="#fff" opacity="0.2" />
      <ellipse cx="24" cy="22" rx="6" ry="8" fill="#fff" opacity="0.08"
        transform="rotate(-20 24 22)" />
    </g>
  </svg>
);

export const DiamondSuit: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 60 80"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-diamondsuit-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff5050" />
        <stop offset="50%" stopColor="#cc2c18" />
        <stop offset="100%" stopColor="#8b1a0e" />
      </linearGradient>
      <filter id="crusty-diamondsuit-shadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#crusty-diamondsuit-shadow)">
      <path d="M30 5 L55 40 L30 75 L5 40 Z"
        fill="url(#crusty-diamondsuit-grad)" stroke="#8b1a0e" strokeWidth="1" />
      {/* Inner facet lines */}
      <line x1="30" y1="5" x2="30" y2="75" stroke="#ff8080" strokeWidth="0.5" opacity="0.2" />
      <line x1="5" y1="40" x2="55" y2="40" stroke="#ff8080" strokeWidth="0.5" opacity="0.2" />
      {/* Highlight */}
      <path d="M30 10 L18 35 L30 35 Z" fill="#fff" opacity="0.1" />
      <circle cx="24" cy="28" r="2" fill="#fff" opacity="0.15" />
    </g>
  </svg>
);

export const Club: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 80 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <radialGradient id="crusty-club-grad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#444" />
        <stop offset="50%" stopColor="#1a1a2e" />
        <stop offset="100%" stopColor="#000" />
      </radialGradient>
      <filter id="crusty-club-shadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#crusty-club-shadow)">
      {/* Top lobe */}
      <circle cx="40" cy="25" r="18" fill="url(#crusty-club-grad)" stroke="#333" strokeWidth="0.5" />
      {/* Left lobe */}
      <circle cx="22" cy="48" r="18" fill="url(#crusty-club-grad)" stroke="#333" strokeWidth="0.5" />
      {/* Right lobe */}
      <circle cx="58" cy="48" r="18" fill="url(#crusty-club-grad)" stroke="#333" strokeWidth="0.5" />
      {/* Stem */}
      <path d="M36 55 L36 88 Q36 93 40 93 Q44 93 44 88 L44 55"
        fill="url(#crusty-club-grad)" stroke="#333" strokeWidth="0.5" />
      {/* Base */}
      <ellipse cx="40" cy="92" rx="14" ry="5" fill="url(#crusty-club-grad)"
        stroke="#333" strokeWidth="0.5" />
      {/* Highlights */}
      <circle cx="34" cy="20" r="4" fill="#fff" opacity="0.08" />
      <circle cx="16" cy="42" r="4" fill="#fff" opacity="0.08" />
      <circle cx="52" cy="42" r="4" fill="#fff" opacity="0.08" />
    </g>
  </svg>
);


/* --------------------------------------------------------------------------
   10. Dice
   A die showing a configurable face (1-6).
   -------------------------------------------------------------------------- */
export const Dice: React.FC<DiceProps> = ({ face = 6, className, style, ...props }) => {
  const dotPositions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 25], [70, 25], [30, 50], [70, 50], [30, 75], [70, 75]],
  };

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '1em', height: '1em', ...style }}
      {...props}
    >
      <defs>
        <linearGradient id="crusty-dice-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f5f5f0" />
          <stop offset="100%" stopColor="#d0d0c8" />
        </linearGradient>
        <filter id="crusty-dice-shadow">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
        <radialGradient id="crusty-dot-grad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#444" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
      </defs>

      {/* Die body */}
      <rect x="8" y="8" width="84" height="84" rx="14" ry="14"
        fill="url(#crusty-dice-grad)" stroke="#aaa" strokeWidth="1.5"
        filter="url(#crusty-dice-shadow)" />

      {/* Inner bevel highlight */}
      <rect x="10" y="10" width="80" height="40" rx="12" ry="12"
        fill="#fff" opacity="0.15" />

      {/* Edge highlight */}
      <rect x="10" y="10" width="80" height="2" rx="1"
        fill="#fff" opacity="0.3" />

      {/* Dots */}
      {(dotPositions[face] || dotPositions[6]).map(([cx, cy], i) => (
        <g key={`dot-${i}`}>
          <circle cx={cx + 1} cy={cy + 1} r="9" fill="#222" opacity="0.2" />
          <circle cx={cx} cy={cy} r="9" fill="url(#crusty-dot-grad)" />
          <circle cx={cx - 2} cy={cy - 2} r="3" fill="#555" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
};


/* --------------------------------------------------------------------------
   11. ClawGrabber
   Mechanical claw for claw machine game icon.
   -------------------------------------------------------------------------- */
export const ClawGrabber: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 100 120"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-claw-metal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a0a0a0" />
        <stop offset="30%" stopColor="#d8d8d8" />
        <stop offset="50%" stopColor="#e8e8e8" />
        <stop offset="70%" stopColor="#d0d0d0" />
        <stop offset="100%" stopColor="#909090" />
      </linearGradient>
      <linearGradient id="crusty-claw-rod" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#888" />
        <stop offset="50%" stopColor="#ccc" />
        <stop offset="100%" stopColor="#888" />
      </linearGradient>
      <filter id="crusty-claw-shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#crusty-claw-shadow)">
      {/* Cable */}
      <rect x="47" y="0" width="6" height="25" fill="url(#crusty-claw-rod)" rx="2" />
      <rect x="48" y="0" width="2" height="25" fill="#ddd" opacity="0.4" />

      {/* Motor housing */}
      <rect x="30" y="22" width="40" height="20" rx="6" ry="6"
        fill="url(#crusty-claw-metal)" stroke="#777" strokeWidth="1" />
      <rect x="32" y="24" width="36" height="4" rx="2" fill="#fff" opacity="0.15" />
      {/* Bolts on housing */}
      <circle cx="37" cy="32" r="2.5" fill="#999" stroke="#777" strokeWidth="0.5" />
      <circle cx="63" cy="32" r="2.5" fill="#999" stroke="#777" strokeWidth="0.5" />

      {/* Center rod */}
      <rect x="47" y="42" width="6" height="18" fill="url(#crusty-claw-rod)" rx="1" />

      {/* Hub joint */}
      <circle cx="50" cy="62" r="7" fill="url(#crusty-claw-metal)" stroke="#888" strokeWidth="1" />
      <circle cx="50" cy="62" r="3" fill="#777" />
      <circle cx="48" cy="60" r="1.5" fill="#ddd" opacity="0.5" />

      {/* Left claw arm */}
      <path d="M43 62 Q30 78 18 95 Q14 102 20 106 Q26 108 30 100 Q38 86 44 70"
        fill="none" stroke="url(#crusty-claw-metal)" strokeWidth="6"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Left claw tip */}
      <path d="M20 100 Q16 108 22 112 Q28 110 26 102"
        fill="#c0c0c0" stroke="#888" strokeWidth="1" />
      {/* Left inner detail */}
      <path d="M38 72 Q30 82 24 96"
        fill="none" stroke="#ddd" strokeWidth="1" opacity="0.3" />

      {/* Right claw arm */}
      <path d="M57 62 Q70 78 82 95 Q86 102 80 106 Q74 108 70 100 Q62 86 56 70"
        fill="none" stroke="url(#crusty-claw-metal)" strokeWidth="6"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Right claw tip */}
      <path d="M80 100 Q84 108 78 112 Q72 110 74 102"
        fill="#c0c0c0" stroke="#888" strokeWidth="1" />
      {/* Right inner detail */}
      <path d="M62 72 Q70 82 76 96"
        fill="none" stroke="#ddd" strokeWidth="1" opacity="0.3" />

      {/* Center claw arm */}
      <path d="M50 66 L50 100 Q50 108 50 110"
        fill="none" stroke="url(#crusty-claw-metal)" strokeWidth="5"
        strokeLinecap="round" />
      {/* Center claw tip */}
      <ellipse cx="50" cy="112" rx="4" ry="5" fill="#c0c0c0" stroke="#888" strokeWidth="1" />
    </g>
  </svg>
);


/* --------------------------------------------------------------------------
   12. ShellPearl
   Open shell with pearl inside (for shell shuffle game icon).
   -------------------------------------------------------------------------- */
export const ShellPearl: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 120 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <radialGradient id="crusty-pearl-grad" cx="35%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="20%" stopColor="#f0e8e0" />
        <stop offset="50%" stopColor="#e8d8cc" />
        <stop offset="80%" stopColor="#c8b0a0" />
        <stop offset="100%" stopColor="#a08878" />
      </radialGradient>
      <linearGradient id="crusty-shell-outer" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff6b35" />
        <stop offset="40%" stopColor="#cc5020" />
        <stop offset="100%" stopColor="#8a3510" />
      </linearGradient>
      <linearGradient id="crusty-shell-inner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffccaa" />
        <stop offset="50%" stopColor="#ffb088" />
        <stop offset="100%" stopColor="#ff9966" />
      </linearGradient>
      <filter id="crusty-pearl-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="crusty-shell-shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#crusty-shell-shadow)">
      {/* Bottom shell half */}
      <path d="M10 65 Q10 90 60 92 Q110 90 110 65 Q100 70 60 72 Q20 70 10 65 Z"
        fill="url(#crusty-shell-outer)" stroke="#8a3510" strokeWidth="1" />
      {/* Bottom shell inner */}
      <path d="M18 68 Q18 84 60 86 Q102 84 102 68 Q92 72 60 73 Q28 72 18 68 Z"
        fill="url(#crusty-shell-inner)" />

      {/* Bottom shell ridges */}
      <path d="M25 72 Q40 82 60 84" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.5" />
      <path d="M40 70 Q50 80 60 82" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.5" />
      <path d="M95 72 Q80 82 60 84" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.5" />
      <path d="M80 70 Q70 80 60 82" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.5" />

      {/* Top shell half (opened, tilted back) */}
      <path d="M10 65 Q8 30 30 12 Q48 2 60 5 Q72 2 90 12 Q112 30 110 65
               Q100 60 60 58 Q20 60 10 65 Z"
        fill="url(#crusty-shell-outer)" stroke="#8a3510" strokeWidth="1" />

      {/* Top shell inner surface */}
      <path d="M16 60 Q15 34 35 18 Q50 10 60 12 Q70 10 85 18 Q105 34 104 60
               Q94 56 60 54 Q26 56 16 60 Z"
        fill="url(#crusty-shell-inner)" />

      {/* Shell ridges on top */}
      <path d="M60 12 L60 54" fill="none" stroke="#cc5020" strokeWidth="1" opacity="0.3" />
      <path d="M40 16 Q48 35 52 54" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.3" />
      <path d="M80 16 Q72 35 68 54" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.3" />
      <path d="M28 25 Q40 42 46 54" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.3" />
      <path d="M92 25 Q80 42 74 54" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.3" />
      <path d="M20 40 Q35 48 42 54" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.3" />
      <path d="M100 40 Q85 48 78 54" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.3" />

      {/* Pearl */}
      <circle cx="60" cy="68" r="12" fill="url(#crusty-pearl-grad)"
        filter="url(#crusty-pearl-glow)" />
      {/* Pearl highlight */}
      <ellipse cx="55" cy="63" rx="5" ry="4" fill="#fff" opacity="0.5"
        transform="rotate(-15 55 63)" />
      <circle cx="53" cy="61" r="2" fill="#fff" opacity="0.7" />
      {/* Pearl subtle iridescence */}
      <circle cx="64" cy="72" r="4" fill="#ffd0e8" opacity="0.15" />
      <circle cx="58" cy="74" r="3" fill="#d0e8ff" opacity="0.1" />
    </g>
  </svg>
);


/* --------------------------------------------------------------------------
   13. SlotReel
   A mini slot reel showing 3 symbols (for slots game icon).
   -------------------------------------------------------------------------- */
export const SlotReel: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 120 50"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '2.4em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-reel-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5f5f0" />
        <stop offset="50%" stopColor="#e8e8e0" />
        <stop offset="100%" stopColor="#d8d8d0" />
      </linearGradient>
      <linearGradient id="crusty-reel-frame" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c0c0c0" />
        <stop offset="50%" stopColor="#888" />
        <stop offset="100%" stopColor="#666" />
      </linearGradient>
      <filter id="crusty-reel-shadow">
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Frame */}
    <rect x="1" y="1" width="118" height="48" rx="6" ry="6"
      fill="url(#crusty-reel-frame)" stroke="#555" strokeWidth="1" />

    {/* Reel windows */}
    {[0, 1, 2].map((i) => (
      <g key={`reel-${i}`}>
        <rect x={6 + i * 38} y="5" width="34" height="40" rx="3" ry="3"
          fill="url(#crusty-reel-bg)" stroke="#aaa" strokeWidth="0.5"
          filter="url(#crusty-reel-shadow)" />
        {/* Inner shadow top */}
        <rect x={7 + i * 38} y="5" width="32" height="6" rx="2"
          fill="#000" opacity="0.08" />
        {/* Inner shadow bottom */}
        <rect x={7 + i * 38} y="39" width="32" height="6" rx="2"
          fill="#000" opacity="0.06" />
      </g>
    ))}

    {/* Symbol 1: Seven */}
    <text x="23" y="33" textAnchor="middle" fontFamily="Impact, sans-serif"
      fontSize="22" fontWeight="bold" fill="#cc2c18">
      7
    </text>

    {/* Symbol 2: Cherry (simplified) */}
    <g transform="translate(61, 25)">
      <path d="M0 -6 Q0 -2 -4 4" fill="none" stroke="#3a8a3a" strokeWidth="1.5" />
      <path d="M0 -6 Q2 -1 5 3" fill="none" stroke="#3a8a3a" strokeWidth="1.5" />
      <circle cx="-5" cy="6" r="4.5" fill="#cc2c18" />
      <circle cx="6" cy="5" r="4" fill="#cc2c18" />
      <circle cx="-6.5" cy="4" r="1.5" fill="#fff" opacity="0.25" />
      <circle cx="4.5" cy="3" r="1.2" fill="#fff" opacity="0.25" />
    </g>

    {/* Symbol 3: Star/diamond */}
    <path d="M99 15 L103 23 L99 31 L95 23 Z" fill="#ea9e2b" stroke="#c78520" strokeWidth="0.5" />
    <path d="M99 17 L101 23 L99 29" fill="#ffdd44" opacity="0.4" />

    {/* Center payline */}
    <line x1="3" y1="25" x2="117" y2="25" stroke="#ff2d55" strokeWidth="1.5"
      strokeDasharray="3 2" opacity="0.6" />

    {/* Dividers */}
    <line x1="40" y1="3" x2="40" y2="47" stroke="#999" strokeWidth="1" />
    <line x1="78" y1="3" x2="78" y2="47" stroke="#999" strokeWidth="1" />
  </svg>
);


/* --------------------------------------------------------------------------
   14. RouletteWheel
   A simplified roulette wheel icon.
   -------------------------------------------------------------------------- */
export const RouletteWheel: React.FC<SvgProps> = ({ className, style, ...props }) => {
  const numSlots = 18;
  const colors = ['#cc2c18', '#1a1a2e', '#cc2c18', '#1a1a2e', '#cc2c18', '#1a1a2e',
    '#cc2c18', '#1a1a2e', '#cc2c18', '#1a1a2e', '#cc2c18', '#1a1a2e',
    '#cc2c18', '#1a1a2e', '#cc2c18', '#1a1a2e', '#0d7377', '#1a1a2e'];

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '1em', height: '1em', ...style }}
      {...props}
    >
      <defs>
        <radialGradient id="crusty-roulette-outer" cx="50%" cy="50%">
          <stop offset="85%" stopColor="#5a3a1a" />
          <stop offset="95%" stopColor="#3a2510" />
          <stop offset="100%" stopColor="#2a1a08" />
        </radialGradient>
        <filter id="crusty-roulette-shadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#crusty-roulette-shadow)">
        {/* Outer wooden rim */}
        <circle cx="50" cy="50" r="48" fill="url(#crusty-roulette-outer)"
          stroke="#2a1a08" strokeWidth="1" />

        {/* Gold ring */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="#ea9e2b" strokeWidth="2" />

        {/* Number ring / colored sectors */}
        {Array.from({ length: numSlots }).map((_, i) => {
          const startAngle = (i * (360 / numSlots)) * Math.PI / 180;
          const endAngle = ((i + 1) * (360 / numSlots)) * Math.PI / 180;
          const r = 40;
          const ir = 22;
          const x1 = 50 + r * Math.cos(startAngle);
          const y1 = 50 + r * Math.sin(startAngle);
          const x2 = 50 + r * Math.cos(endAngle);
          const y2 = 50 + r * Math.sin(endAngle);
          const ix1 = 50 + ir * Math.cos(startAngle);
          const iy1 = 50 + ir * Math.sin(startAngle);
          const ix2 = 50 + ir * Math.cos(endAngle);
          const iy2 = 50 + ir * Math.sin(endAngle);
          return (
            <path
              key={`slot-${i}`}
              d={`M${ix1} ${iy1} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} L${ix2} ${iy2} A${ir} ${ir} 0 0 0 ${ix1} ${iy1} Z`}
              fill={colors[i]}
              stroke="#333" strokeWidth="0.3"
            />
          );
        })}

        {/* Inner gold ring */}
        <circle cx="50" cy="50" r="22" fill="none" stroke="#ea9e2b" strokeWidth="1.5" />

        {/* Center cone */}
        <circle cx="50" cy="50" r="18" fill="#2a2a3e" />
        <circle cx="50" cy="50" r="14" fill="#1a1a2e" stroke="#ea9e2b" strokeWidth="0.5" />

        {/* Center diamond pattern */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          return (
            <line key={`spoke-${i}`}
              x1={50 + 6 * Math.cos(angle)} y1={50 + 6 * Math.sin(angle)}
              x2={50 + 14 * Math.cos(angle)} y2={50 + 14 * Math.sin(angle)}
              stroke="#ea9e2b" strokeWidth="0.5" opacity="0.6" />
          );
        })}

        {/* Center point */}
        <circle cx="50" cy="50" r="4" fill="#ea9e2b" />
        <circle cx="48" cy="48" r="1.5" fill="#ffdd44" opacity="0.6" />

        {/* Ball */}
        <circle cx="68" cy="22" r="3" fill="#d0d0d0" stroke="#aaa" strokeWidth="0.5" />
        <circle cx="67" cy="21" r="1" fill="#fff" opacity="0.6" />

        {/* Outer rim highlight */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.15" />
      </g>
    </svg>
  );
};


/* --------------------------------------------------------------------------
   15. CrabSilhouette
   A crab silhouette in the crustacean theme.
   -------------------------------------------------------------------------- */
export const CrabSilhouette: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 120 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1.2em', height: '1em', ...style }}
    {...props}
  >
    <defs>
      <radialGradient id="crusty-crab-grad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ff6b35" />
        <stop offset="60%" stopColor="#cc5020" />
        <stop offset="100%" stopColor="#8a3510" />
      </radialGradient>
      <filter id="crusty-crab-shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#crusty-crab-shadow)">
      {/* Body */}
      <ellipse cx="60" cy="55" rx="30" ry="22" fill="url(#crusty-crab-grad)"
        stroke="#8a3510" strokeWidth="1" />

      {/* Shell texture */}
      <ellipse cx="60" cy="50" rx="22" ry="14" fill="none" stroke="#cc5020" strokeWidth="0.8" opacity="0.5" />
      <ellipse cx="60" cy="48" rx="14" ry="8" fill="none" stroke="#cc5020" strokeWidth="0.5" opacity="0.4" />
      <circle cx="52" cy="50" r="3" fill="#dd6030" opacity="0.4" />
      <circle cx="68" cy="50" r="3" fill="#dd6030" opacity="0.4" />

      {/* Eyes on stalks */}
      <path d="M48 38 Q46 28 42 24" fill="none" stroke="#cc5020" strokeWidth="3" strokeLinecap="round" />
      <circle cx="41" cy="22" r="4" fill="#1a1a2e" stroke="#cc5020" strokeWidth="1.5" />
      <circle cx="40" cy="21" r="1.5" fill="#fff" opacity="0.6" />

      <path d="M72 38 Q74 28 78 24" fill="none" stroke="#cc5020" strokeWidth="3" strokeLinecap="round" />
      <circle cx="79" cy="22" r="4" fill="#1a1a2e" stroke="#cc5020" strokeWidth="1.5" />
      <circle cx="78" cy="21" r="1.5" fill="#fff" opacity="0.6" />

      {/* Left claw arm */}
      <path d="M32 48 Q18 38 12 32" fill="none" stroke="#cc5020" strokeWidth="4" strokeLinecap="round" />
      {/* Left claw pincer */}
      <path d="M12 32 Q6 24 4 20 Q8 22 12 26 Q10 22 8 16 Q14 22 14 28 Z"
        fill="url(#crusty-crab-grad)" stroke="#8a3510" strokeWidth="1" />

      {/* Right claw arm */}
      <path d="M88 48 Q102 38 108 32" fill="none" stroke="#cc5020" strokeWidth="4" strokeLinecap="round" />
      {/* Right claw pincer */}
      <path d="M108 32 Q114 24 116 20 Q112 22 108 26 Q110 22 112 16 Q106 22 106 28 Z"
        fill="url(#crusty-crab-grad)" stroke="#8a3510" strokeWidth="1" />

      {/* Legs - left side */}
      <path d="M36 58 Q22 62 14 68" fill="none" stroke="#cc5020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 64 Q20 70 12 78" fill="none" stroke="#cc5020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M35 70 Q24 78 18 88" fill="none" stroke="#cc5020" strokeWidth="2" strokeLinecap="round" />

      {/* Legs - right side */}
      <path d="M84 58 Q98 62 106 68" fill="none" stroke="#cc5020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 64 Q100 70 108 78" fill="none" stroke="#cc5020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M85 70 Q96 78 102 88" fill="none" stroke="#cc5020" strokeWidth="2" strokeLinecap="round" />

      {/* Mouth */}
      <path d="M54 62 Q60 66 66 62" fill="none" stroke="#8a3510" strokeWidth="1" opacity="0.5" />

      {/* Body highlight */}
      <ellipse cx="54" cy="44" rx="12" ry="6" fill="#fff" opacity="0.08"
        transform="rotate(-10 54 44)" />
    </g>
  </svg>
);


/* --------------------------------------------------------------------------
   16. LobsterSilhouette
   A lobster silhouette.
   -------------------------------------------------------------------------- */
export const LobsterSilhouette: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 100 140"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1.4em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-lobster-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#cc2c18" />
        <stop offset="50%" stopColor="#aa2414" />
        <stop offset="100%" stopColor="#881a0e" />
      </linearGradient>
      <filter id="crusty-lobster-shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#crusty-lobster-shadow)">
      {/* Antennae */}
      <path d="M42 22 Q30 8 18 2" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 20 Q28 12 22 6" fill="none" stroke="#cc2c18" strokeWidth="1" strokeLinecap="round" />
      <path d="M58 22 Q70 8 82 2" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 20 Q72 12 78 6" fill="none" stroke="#cc2c18" strokeWidth="1" strokeLinecap="round" />

      {/* Head */}
      <ellipse cx="50" cy="30" rx="16" ry="12" fill="url(#crusty-lobster-grad)"
        stroke="#881a0e" strokeWidth="0.5" />

      {/* Eyes */}
      <circle cx="42" cy="25" r="3" fill="#1a1a2e" stroke="#cc2c18" strokeWidth="1" />
      <circle cx="41" cy="24" r="1" fill="#fff" opacity="0.5" />
      <circle cx="58" cy="25" r="3" fill="#1a1a2e" stroke="#cc2c18" strokeWidth="1" />
      <circle cx="57" cy="24" r="1" fill="#fff" opacity="0.5" />

      {/* Claw arms */}
      <path d="M36 32 Q22 28 16 22" fill="none" stroke="#cc2c18" strokeWidth="4" strokeLinecap="round" />
      <path d="M64 32 Q78 28 84 22" fill="none" stroke="#cc2c18" strokeWidth="4" strokeLinecap="round" />

      {/* Left claw */}
      <path d="M16 22 Q8 14 6 10 Q10 14 14 18 Q10 12 8 6 Q16 14 16 22 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="1" />
      <path d="M16 22 Q12 26 8 28 Q12 24 14 20 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="0.5" />

      {/* Right claw */}
      <path d="M84 22 Q92 14 94 10 Q90 14 86 18 Q90 12 92 6 Q84 14 84 22 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="1" />
      <path d="M84 22 Q88 26 92 28 Q88 24 86 20 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="0.5" />

      {/* Body segments */}
      <ellipse cx="50" cy="45" rx="14" ry="8" fill="url(#crusty-lobster-grad)"
        stroke="#881a0e" strokeWidth="0.5" />
      <ellipse cx="50" cy="58" rx="13" ry="7" fill="url(#crusty-lobster-grad)"
        stroke="#881a0e" strokeWidth="0.5" />
      <ellipse cx="50" cy="70" rx="12" ry="6.5" fill="url(#crusty-lobster-grad)"
        stroke="#881a0e" strokeWidth="0.5" />
      <ellipse cx="50" cy="81" rx="11" ry="6" fill="url(#crusty-lobster-grad)"
        stroke="#881a0e" strokeWidth="0.5" />
      <ellipse cx="50" cy="91" rx="10" ry="5.5" fill="url(#crusty-lobster-grad)"
        stroke="#881a0e" strokeWidth="0.5" />
      <ellipse cx="50" cy="100" rx="9" ry="5" fill="url(#crusty-lobster-grad)"
        stroke="#881a0e" strokeWidth="0.5" />

      {/* Segment lines */}
      <line x1="37" y1="50" x2="63" y2="50" stroke="#881a0e" strokeWidth="0.5" opacity="0.5" />
      <line x1="38" y1="63" x2="62" y2="63" stroke="#881a0e" strokeWidth="0.5" opacity="0.5" />
      <line x1="39" y1="75" x2="61" y2="75" stroke="#881a0e" strokeWidth="0.5" opacity="0.5" />
      <line x1="40" y1="86" x2="60" y2="86" stroke="#881a0e" strokeWidth="0.5" opacity="0.5" />

      {/* Legs - left */}
      <path d="M38 42 Q26 44 20 50" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M38 52 Q26 56 20 62" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M39 62 Q28 68 22 74" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 72 Q30 78 26 84" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />

      {/* Legs - right */}
      <path d="M62 42 Q74 44 80 50" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M62 52 Q74 56 80 62" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M61 62 Q72 68 78 74" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 72 Q70 78 74 84" fill="none" stroke="#cc2c18" strokeWidth="1.5" strokeLinecap="round" />

      {/* Tail fan */}
      <path d="M42 104 Q38 112 30 120 Q40 118 44 110 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="0.5" />
      <path d="M46 104 Q46 114 44 124 Q50 120 50 110 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="0.5" />
      <path d="M50 104 Q50 116 50 126 Q54 118 54 108 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="0.5" />
      <path d="M54 104 Q54 114 56 124 Q54 114 54 108 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="0.5" />
      <path d="M58 104 Q62 112 70 120 Q60 118 56 110 Z"
        fill="url(#crusty-lobster-grad)" stroke="#881a0e" strokeWidth="0.5" />

      {/* Body highlight */}
      <ellipse cx="46" cy="44" rx="6" ry="4" fill="#fff" opacity="0.06"
        transform="rotate(-10 46 44)" />
    </g>
  </svg>
);


/* --------------------------------------------------------------------------
   17. NeonSign
   A neon sign border component that wraps text with glowing tube effect.
   -------------------------------------------------------------------------- */
export const NeonSign: React.FC<WrapperSvgProps> = ({
  children,
  className,
  style,
  ...props
}) => {
  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <svg
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        {...props}
      >
        <defs>
          <filter id="crusty-neon-outer-glow">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feFlood floodColor="#ff2d55" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur1" operator="in" result="glow1" />
            <feMerge>
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="crusty-neon-inner-glow">
            <feGaussianBlur stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            @keyframes crustyNeonFlicker {
              0%, 95%, 100% { opacity: 1; }
              96% { opacity: 0.7; }
              97% { opacity: 1; }
              98% { opacity: 0.8; }
            }
            .crusty-neon-tube {
              animation: crustyNeonFlicker 4s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* Background dark panel */}
        <rect x="5" y="5" width="290" height="90" rx="8" ry="8"
          fill="#0a0a12" stroke="#222" strokeWidth="2" />

        {/* Neon tube border - outer glow layer */}
        <rect x="12" y="12" width="276" height="76" rx="6" ry="6"
          fill="none" stroke="#ff2d55" strokeWidth="3" opacity="0.3"
          filter="url(#crusty-neon-outer-glow)" />

        {/* Neon tube border - main tube */}
        <rect x="12" y="12" width="276" height="76" rx="6" ry="6"
          fill="none" stroke="#ff2d55" strokeWidth="2"
          className="crusty-neon-tube"
          filter="url(#crusty-neon-inner-glow)" />

        {/* Inner bright core of tube */}
        <rect x="12" y="12" width="276" height="76" rx="6" ry="6"
          fill="none" stroke="#ffaacc" strokeWidth="0.8" opacity="0.7"
          className="crusty-neon-tube" />

        {/* Corner accents */}
        <circle cx="16" cy="16" r="2" fill="#ff2d55" opacity="0.8" />
        <circle cx="284" cy="16" r="2" fill="#ff2d55" opacity="0.8" />
        <circle cx="16" cy="84" r="2" fill="#ff2d55" opacity="0.8" />
        <circle cx="284" cy="84" r="2" fill="#ff2d55" opacity="0.8" />

        {/* Mounting brackets */}
        <rect x="60" y="2" width="14" height="6" rx="2" fill="#555" stroke="#444" strokeWidth="0.5" />
        <rect x="226" y="2" width="14" height="6" rx="2" fill="#555" stroke="#444" strokeWidth="0.5" />
        <rect x="60" y="92" width="14" height="6" rx="2" fill="#555" stroke="#444" strokeWidth="0.5" />
        <rect x="226" y="92" width="14" height="6" rx="2" fill="#555" stroke="#444" strokeWidth="0.5" />

        {/* Wires to brackets */}
        <path d="M67 8 L67 12" stroke="#666" strokeWidth="0.5" />
        <path d="M233 8 L233 12" stroke="#666" strokeWidth="0.5" />
      </svg>
      <div style={{
        position: 'relative',
        padding: '18px 24px',
        zIndex: 1,
        textAlign: 'center',
      }}>
        {children}
      </div>
    </div>
  );
};


/* --------------------------------------------------------------------------
   18. PullLever
   A slot machine pull lever.
   -------------------------------------------------------------------------- */
export const PullLever: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 50 140"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '0.5em', height: '1.4em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-lever-rod" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#888" />
        <stop offset="30%" stopColor="#ccc" />
        <stop offset="50%" stopColor="#e0e0e0" />
        <stop offset="70%" stopColor="#ccc" />
        <stop offset="100%" stopColor="#888" />
      </linearGradient>
      <radialGradient id="crusty-lever-ball" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#ff5050" />
        <stop offset="40%" stopColor="#cc2c18" />
        <stop offset="100%" stopColor="#7a1a0e" />
      </radialGradient>
      <linearGradient id="crusty-lever-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c0c0c0" />
        <stop offset="50%" stopColor="#909090" />
        <stop offset="100%" stopColor="#707070" />
      </linearGradient>
      <filter id="crusty-lever-shadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>

    <g filter="url(#crusty-lever-shadow)">
      {/* Base plate */}
      <rect x="10" y="100" width="30" height="35" rx="4" ry="4"
        fill="url(#crusty-lever-base)" stroke="#666" strokeWidth="1" />
      {/* Base plate screws */}
      <circle cx="17" cy="108" r="2" fill="#888" stroke="#666" strokeWidth="0.5" />
      <circle cx="33" cy="108" r="2" fill="#888" stroke="#666" strokeWidth="0.5" />
      <circle cx="17" cy="128" r="2" fill="#888" stroke="#666" strokeWidth="0.5" />
      <circle cx="33" cy="128" r="2" fill="#888" stroke="#666" strokeWidth="0.5" />
      {/* Base slot */}
      <rect x="20" y="96" width="10" height="10" rx="3" fill="#555" stroke="#444" strokeWidth="0.5" />

      {/* Pivot joint */}
      <circle cx="25" cy="98" r="5" fill="url(#crusty-lever-base)" stroke="#777" strokeWidth="1" />
      <circle cx="25" cy="98" r="2" fill="#666" />

      {/* Rod */}
      <rect x="22" y="18" width="6" height="80" rx="3" ry="3"
        fill="url(#crusty-lever-rod)" stroke="#777" strokeWidth="0.5" />
      {/* Rod highlight */}
      <rect x="24" y="18" width="2" height="80" rx="1"
        fill="#e8e8e8" opacity="0.3" />

      {/* Ball grip */}
      <circle cx="25" cy="16" r="14" fill="url(#crusty-lever-ball)"
        stroke="#7a1a0e" strokeWidth="1" />
      {/* Ball highlight */}
      <ellipse cx="20" cy="10" rx="6" ry="5" fill="#fff" opacity="0.2"
        transform="rotate(-15 20 10)" />
      <circle cx="18" cy="9" r="2.5" fill="#fff" opacity="0.3" />

      {/* Rod ring detail */}
      <rect x="20" y="30" width="10" height="3" rx="1" fill="#aaa" stroke="#888" strokeWidth="0.3" />
      <rect x="20" y="85" width="10" height="3" rx="1" fill="#aaa" stroke="#888" strokeWidth="0.3" />
    </g>
  </svg>
);


/* --------------------------------------------------------------------------
   19. StarBurst
   An impact/explosion star burst for animations.
   -------------------------------------------------------------------------- */
export const StarBurst: React.FC<SvgProps> = ({ className, style, ...props }) => {
  const points = 12;
  const outerR = 48;
  const innerR = 24;
  const cx = 50;
  const cy = 50;

  let pathD = '';
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pathD += (i === 0 ? 'M' : 'L') + `${x} ${y} `;
  }
  pathD += 'Z';

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '1em', height: '1em', ...style }}
      {...props}
    >
      <defs>
        <radialGradient id="crusty-burst-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcc00" />
          <stop offset="40%" stopColor="#ea9e2b" />
          <stop offset="80%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#cc2c18" />
        </radialGradient>
        <filter id="crusty-burst-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes crustyBurstPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.9; }
          }
          .crusty-burst-pulse {
            animation: crustyBurstPulse 1.5s ease-in-out infinite;
            transform-origin: center;
          }
        `}</style>
      </defs>

      {/* Outer glow */}
      <path d={pathD} fill="#ffcc00" opacity="0.2" filter="url(#crusty-burst-glow)"
        transform="scale(1.1) translate(-5 -5)" />

      {/* Main burst */}
      <path d={pathD} fill="url(#crusty-burst-grad)" stroke="#ea9e2b" strokeWidth="1"
        className="crusty-burst-pulse"
        filter="url(#crusty-burst-glow)" />

      {/* Inner highlight */}
      <circle cx="50" cy="46" r="16" fill="#fff" opacity="0.15" />
      <circle cx="50" cy="50" r="10" fill="#ffdd66" opacity="0.3" />

      {/* Sparkle dots */}
      <circle cx="50" cy="8" r="2" fill="#fff" opacity="0.8" />
      <circle cx="90" cy="30" r="1.5" fill="#fff" opacity="0.7" />
      <circle cx="90" cy="70" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="50" cy="92" r="2" fill="#fff" opacity="0.7" />
      <circle cx="10" cy="70" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="10" cy="30" r="1.5" fill="#fff" opacity="0.7" />

      {/* Mini star sparkle */}
      <path d="M50 42 L51 38 L52 42 L56 43 L52 44 L51 48 L50 44 L46 43 Z"
        fill="#fff" opacity="0.5" />
    </svg>
  );
};


/* --------------------------------------------------------------------------
   20. CoinStack
   A stack of gold coins.
   -------------------------------------------------------------------------- */
export const CoinStack: React.FC<SvgProps> = ({ className, style, ...props }) => (
  <svg
    viewBox="0 0 80 120"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '1em', height: '1.5em', ...style }}
    {...props}
  >
    <defs>
      <linearGradient id="crusty-coinstack-face" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffdd44" />
        <stop offset="50%" stopColor="#ea9e2b" />
        <stop offset="100%" stopColor="#c78520" />
      </linearGradient>
      <linearGradient id="crusty-coinstack-edge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c78520" />
        <stop offset="100%" stopColor="#8b6914" />
      </linearGradient>
      <filter id="crusty-coinstack-shadow">
        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#crusty-coinstack-shadow)">
      {/* Stack of coins from bottom to top */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 100 - i * 13;
        const xOffset = i % 2 === 0 ? 0 : 1;
        return (
          <g key={`stack-${i}`}>
            {/* Coin edge (side visible) */}
            <ellipse cx={40 + xOffset} cy={y + 4} rx="30" ry="8"
              fill="url(#crusty-coinstack-edge)" />
            <rect x={10 + xOffset} y={y} width="60" height="4" fill="url(#crusty-coinstack-edge)" />

            {/* Coin face (top) */}
            <ellipse cx={40 + xOffset} cy={y} rx="30" ry="8"
              fill="url(#crusty-coinstack-face)" stroke="#c78520" strokeWidth="0.5" />

            {/* Coin inner ring */}
            <ellipse cx={40 + xOffset} cy={y} rx="22" ry="5.5"
              fill="none" stroke="#c78520" strokeWidth="0.5" opacity="0.6" />

            {/* Coin face highlight */}
            <ellipse cx={34 + xOffset} cy={y - 1.5} rx="14" ry="3"
              fill="#fff" opacity="0.12" />

            {/* Edge ridging */}
            {i < 7 && (
              <>
                <line x1={12 + xOffset} y1={y + 2} x2={12 + xOffset} y2={y + 4}
                  stroke="#a08030" strokeWidth="0.3" opacity="0.4" />
                <line x1={68 + xOffset} y1={y + 2} x2={68 + xOffset} y2={y + 4}
                  stroke="#a08030" strokeWidth="0.3" opacity="0.4" />
              </>
            )}
          </g>
        );
      })}

      {/* Top coin CC monogram */}
      <text x="41" y="12" textAnchor="middle" fontFamily="Georgia, serif"
        fontSize="8" fontWeight="bold" fill="#8b6914" opacity="0.5">
        CC
      </text>
      <text x="40" y="11" textAnchor="middle" fontFamily="Georgia, serif"
        fontSize="8" fontWeight="bold" fill="#fff5a0" opacity="0.8">
        CC
      </text>

      {/* Sparkle on top */}
      <path d="M62 4 L63 1 L64 4 L67 5 L64 6 L63 9 L62 6 L59 5 Z"
        fill="#fff" opacity="0.8" />
      <circle cx="20" cy="8" r="1" fill="#fff" opacity="0.5" />
    </g>
  </svg>
);
