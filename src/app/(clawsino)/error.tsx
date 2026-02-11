'use client';

import { useEffect } from 'react';

export default function ClawsinoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ClawsinoError]', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      {/* Slot machine fail */}
      <div
        style={{
          fontSize: '5rem',
          lineHeight: 1,
          marginBottom: '1rem',
          animation: 'shake 0.5s ease-in-out infinite alternate',
        }}
      >
        🎰
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'Permanent Marker, cursive',
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          color: '#cc2c18',
          textShadow: '0 0 15px rgba(204,44,24,0.4)',
        }}
      >
        Game Error!
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '1rem',
          opacity: 0.6,
          marginBottom: '0.5rem',
          maxWidth: '420px',
        }}
      >
        The machine jammed mid-spin. Even our luckiest lobsters could not fix this one.
      </p>

      {error.digest && (
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            opacity: 0.3,
            marginBottom: '2rem',
          }}
        >
          Error ID: {error.digest}
        </p>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            padding: '0.6rem 2rem',
            backgroundColor: '#cc2c18',
            color: '#f5f5f0',
            border: '2px solid #f5f5f0',
            borderRadius: '2px',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #0a0a0f, 0 0 15px rgba(204,44,24,0.3)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          TRY AGAIN
        </button>

        <a
          href="/lobby"
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            padding: '0.6rem 2rem',
            backgroundColor: 'transparent',
            color: '#39ff14',
            border: '2px solid #39ff14',
            borderRadius: '2px',
            textDecoration: 'none',
            boxShadow: '0 0 10px rgba(57,255,20,0.15)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          BACK TO LOBBY
        </a>
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: rotate(-2deg); }
          100% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
