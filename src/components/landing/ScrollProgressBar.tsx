'use client';
import { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px]" style={{ backgroundColor: 'rgba(57,255,20,0.1)' }}>
      <div
        className="h-full transition-[width] duration-100"
        style={{
          width: `${progress}%`,
          backgroundColor: '#39ff14',
          boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff1440',
        }}
      />
    </div>
  );
}
