import Link from 'next/link';

export default function NotFound() {
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
      {/* Decorative wave top */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0d7377, #14a3a8, #3ab7bf, #14a3a8, #0d7377)',
          opacity: 0.6,
        }}
      />

      {/* Empty shell */}
      <div style={{ fontSize: '7rem', lineHeight: 1, marginBottom: '1rem' }}>
        🐚
      </div>

      {/* 404 number */}
      <h1
        style={{
          fontFamily: 'Bungee Shade, cursive',
          fontSize: '5rem',
          color: '#14a3a8',
          textShadow: '0 0 30px rgba(20,163,168,0.3)',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}
      >
        404
      </h1>

      {/* Heading */}
      <h2
        style={{
          fontFamily: 'Permanent Marker, cursive',
          fontSize: '2rem',
          marginBottom: '0.75rem',
          color: '#f5f5f0',
        }}
      >
        This Shell is Empty
      </h2>

      {/* Subtext */}
      <p
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '1rem',
          opacity: 0.5,
          marginBottom: '2.5rem',
          maxWidth: '440px',
        }}
      >
        You have drifted into uncharted waters. This page has been washed away by the tide, or maybe it never existed at all.
      </p>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.15rem',
            letterSpacing: '0.05em',
            padding: '0.7rem 2rem',
            backgroundColor: '#cc2c18',
            color: '#f5f5f0',
            border: '2px solid #f5f5f0',
            borderRadius: '2px',
            textDecoration: 'none',
            boxShadow: '4px 4px 0 #0a0a0f, 0 0 20px rgba(204,44,24,0.3)',
            transition: 'transform 0.15s ease',
          }}
        >
          BACK TO SHORE
        </Link>

        <Link
          href="/lobby"
          style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '1.15rem',
            letterSpacing: '0.05em',
            padding: '0.7rem 2rem',
            backgroundColor: 'transparent',
            color: '#39ff14',
            border: '2px solid #39ff14',
            borderRadius: '2px',
            textDecoration: 'none',
            boxShadow: '0 0 10px rgba(57,255,20,0.15)',
            transition: 'transform 0.15s ease',
          }}
        >
          ENTER CLAWSINO
        </Link>
      </div>

      {/* Bottom decorative text */}
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          opacity: 0.2,
          marginTop: '3rem',
        }}
      >
        Lost at sea since the request was made.
      </p>
    </div>
  );
}
