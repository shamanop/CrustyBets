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

  return <>{display.toLocaleString()}</>;
}

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
      {/* Marquee container */}
      <div className="flex items-center gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
        {[...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex-shrink-0 flex items-center gap-4 px-6">
            <span
              className="text-4xl sm:text-5xl md:text-6xl font-bold"
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
            <span className="text-2xl opacity-30">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
