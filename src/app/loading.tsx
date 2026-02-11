export default function Loading() {
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
      }}
    >
      {/* Animated crab */}
      <div
        style={{
          fontSize: '4rem',
          lineHeight: 1,
          marginBottom: '1.5rem',
          animation: 'crab-walk 1.5s ease-in-out infinite',
        }}
      >
        🦀
      </div>

      {/* Loading text */}
      <p
        style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '1.25rem',
          letterSpacing: '0.1em',
          color: '#f5f5f0',
          opacity: 0.7,
        }}
      >
        Loading
        <span style={{ animation: 'dots 1.5s steps(3, end) infinite' }}>...</span>
      </p>

      <style>{`
        @keyframes crab-walk {
          0%, 100% { transform: translateX(0) scaleX(1); }
          25% { transform: translateX(20px) scaleX(1); }
          50% { transform: translateX(0) scaleX(-1); }
          75% { transform: translateX(-20px) scaleX(-1); }
        }
        @keyframes dots {
          0% { content: ''; opacity: 0.3; }
          33% { opacity: 0.5; }
          66% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
