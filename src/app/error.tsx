'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
        color: '#f5f5f0',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {/* Big crab */}
      <div
        style={{
          fontSize: '8rem',
          lineHeight: 1,
          marginBottom: '1.5rem',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        🦀
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'Permanent Marker, cursive',
          fontSize: '3rem',
          marginBottom: '0.75rem',
          color: '#cc2c18',
          textShadow: '0 0 20px rgba(204,44,24,0.4)',
        }}
      >
        Something Went Wrong!
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '1.1rem',
          opacity: 0.6,
          marginBottom: '0.5rem',
          maxWidth: '480px',
        }}
      >
        The crustacean servers hit a reef. Our lobster engineers are on the case.
      </p>

      {error.digest && (
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            opacity: 0.3,
            marginBottom: '2rem',
          }}
        >
          Error ID: {error.digest}
        </p>
      )}

      {/* Try Again button */}
      <button
        onClick={reset}
        style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '1.25rem',
          letterSpacing: '0.05em',
          padding: '0.75rem 2.5rem',
          backgroundColor: '#cc2c18',
          color: '#f5f5f0',
          border: '2px solid #f5f5f0',
          borderRadius: '2px',
          cursor: 'pointer',
          boxShadow: '4px 4px 0 #0a0a0f, 0 0 20px rgba(204,44,24,0.3)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '6px 6px 0 #0a0a0f, 0 0 30px rgba(204,44,24,0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '4px 4px 0 #0a0a0f, 0 0 20px rgba(204,44,24,0.3)';
        }}
      >
        TRY AGAIN
      </button>

      {/* Home link */}
      <a
        href="/"
        style={{
          fontFamily: 'Bangers, cursive',
          color: '#39ff14',
          marginTop: '1.5rem',
          fontSize: '1rem',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          opacity: 0.7,
          transition: 'opacity 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
      >
        BACK TO SHORE
      </a>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
