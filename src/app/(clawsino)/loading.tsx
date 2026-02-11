export default function ClawsinoLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      {/* Spinning coin */}
      <div
        style={{
          fontSize: '3.5rem',
          lineHeight: 1,
          marginBottom: '1.25rem',
          animation: 'coin-spin 1s linear infinite',
        }}
      >
        🪙
      </div>

      {/* Loading game text */}
      <p
        style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '1.5rem',
          letterSpacing: '0.08em',
          color: '#ea9e2b',
        }}
      >
        Loading Game
        <span style={{ display: 'inline-block', animation: 'pulse-dots 1.5s infinite' }}>...</span>
      </p>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '0.85rem',
          opacity: 0.4,
          marginTop: '0.5rem',
        }}
      >
        Shuffling the deck, polishing the claws...
      </p>

      <style>{`
        @keyframes coin-spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes pulse-dots {
          0%, 20% { opacity: 0.2; }
          40% { opacity: 0.6; }
          60% { opacity: 1; }
          80%, 100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
