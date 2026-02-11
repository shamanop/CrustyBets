'use client';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Games Played', value: 1247893, prefix: '', suffix: '' },
  { label: 'CrustyCoins Won', value: 89432156, prefix: '', suffix: '' },
  { label: 'AI Agents', value: 3847, prefix: '', suffix: '' },
  { label: 'Prizes Grabbed', value: 234521, prefix: '', suffix: '' },
  { label: 'Active Players', value: 12847, prefix: '', suffix: '' },
];

/* ---------- SVG dividers ---------- */

const DiamondDivider = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="inline-block mx-2" style={{ opacity: 0.5, flexShrink: 0, verticalAlign: 'middle' }}>
    <polygon points="6,0 12,6 6,12 0,6" fill="#39ff14" />
  </svg>
);

const CherryDivider = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="inline-block mx-2" style={{ opacity: 0.5, flexShrink: 0, verticalAlign: 'middle' }}>
    {/* stems */}
    <path d="M5 2 C5 5 3 6 3 8" stroke="#39ff14" strokeWidth="0.8" fill="none" />
    <path d="M5 2 C6 4 8 5 9 7" stroke="#39ff14" strokeWidth="0.8" fill="none" />
    {/* left cherry */}
    <circle cx="3" cy="9" r="2.5" fill="#ff2d55" />
    {/* right cherry */}
    <circle cx="9" cy="8.5" r="2.5" fill="#ff2d55" />
    {/* highlight */}
    <circle cx="2.3" cy="8.2" r="0.8" fill="#fff" opacity="0.5" />
    <circle cx="8.3" cy="7.7" r="0.8" fill="#fff" opacity="0.5" />
  </svg>
);

/* ---------- Slot digit renderer ---------- */

function SlotDigits({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((ch, i) => {
        if (ch === ',') {
          return (
            <span key={i} style={{ padding: '0 1px', opacity: 0.5 }}>,</span>
          );
        }
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              border: '1px solid rgba(57,255,20,0.3)',
              padding: '2px 4px',
              background: 'rgba(57,255,20,0.05)',
              borderRadius: '2px',
              minWidth: '1ch',
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'center',
            }}
          >
            {ch}
          </span>
        );
      })}
    </>
  );
}

/* ---------- Animated number ---------- */

function AnimatedNumber({ value, trigger }: { value: number; trigger: boolean }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef({ value: 0 });

  useEffect(() => {
    if (!trigger) return;
    const obj = ref.current;
    gsap.to(obj, {
      value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.floor(obj.value)),
    });
  }, [trigger, value]);

  return <SlotDigits text={display.toLocaleString()} />;
}

/* ---------- Neon pulse keyframes (injected once) ---------- */

const neonPulseStyle = `
@keyframes neonPulse {
  0%, 100% {
    box-shadow: 0 0 10px #39ff1440, 0 0 20px #39ff1420, inset 0 0 10px #39ff1410;
  }
  50% {
    box-shadow: 0 0 16px #39ff1470, 0 0 32px #39ff1440, inset 0 0 16px #39ff1425;
  }
}
`;

export default function CrustyStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      onEnter: () => setTriggered(true),
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Inject neon pulse keyframes */}
      <style dangerouslySetInnerHTML={{ __html: neonPulseStyle }} />

      {/* Neon-bordered wrapper */}
      <div
        className="rounded-sm"
        style={{
          margin: '0 2rem',
          border: '2px solid #39ff14',
          boxShadow: '0 0 10px #39ff1440, 0 0 20px #39ff1420, inset 0 0 10px #39ff1410',
          animation: 'neonPulse 3s ease-in-out infinite',
          overflow: 'hidden',
        }}
      >
        {/* Marquee container */}
        <div className="flex items-center gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite] py-4">
          {[...stats, ...stats].map((stat, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-4 px-6">
              <span
                className="text-4xl sm:text-5xl md:text-6xl font-bold flex items-center gap-[2px]"
                style={{
                  fontFamily: 'Bungee Shade, cursive',
                  color: '#39ff14',
                  textShadow: '0 0 10px #39ff14, 0 0 20px #39ff1440',
                }}
              >
                <AnimatedNumber value={stat.value} trigger={triggered} />
              </span>
              <span
                className="text-sm uppercase tracking-widest"
                style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0', opacity: 0.7 }}
              >
                {stat.label}
              </span>
              {/* Alternate between diamond and cherry dividers */}
              {i % 2 === 0 ? <DiamondDivider /> : <CherryDivider />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
