'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Try again, landlubber.');
      } else {
        router.push('/lobby');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. The crabs ate the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0a0a0f' }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 text-6xl opacity-5 animate-float"
          style={{ animationDelay: '0s' }}
        >
          🦞
        </div>
        <div
          className="absolute top-40 right-20 text-4xl opacity-5 animate-float"
          style={{ animationDelay: '2s' }}
        >
          🎰
        </div>
        <div
          className="absolute bottom-20 left-1/4 text-5xl opacity-5 animate-float"
          style={{ animationDelay: '4s' }}
        >
          🦀
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-4xl">🦞</span>
            <h1
              className="text-3xl mt-2"
              style={{
                fontFamily: 'Bungee Shade, cursive',
                color: '#cc2c18',
                textShadow: '3px 3px 0 #0a0a0f',
              }}
            >
              CRUSTY BETS
            </h1>
          </Link>
        </div>

        {/* Login Card */}
        <div
          className="rounded-sm p-8 border"
          style={{
            backgroundColor: '#1a1a2e',
            borderColor: 'rgba(204,44,24,0.3)',
            boxShadow: '0 0 30px rgba(204,44,24,0.1)',
          }}
        >
          <h2
            className="text-2xl text-center mb-6"
            style={{
              fontFamily: 'Permanent Marker, cursive',
              color: '#f5f5f0',
            }}
          >
            Welcome Back, Gambler
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-1.5"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#ea9e2b',
                  letterSpacing: '0.05em',
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="crab@crustybets.com"
                className="w-full px-4 py-3 rounded-sm outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f0',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.95rem',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': '#cc2c18',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-1.5"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#ea9e2b',
                  letterSpacing: '0.05em',
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full px-4 py-3 rounded-sm outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f0',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.95rem',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': '#cc2c18',
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                className="text-sm text-center py-2 px-3 rounded-sm"
                style={{
                  color: '#ff2d55',
                  backgroundColor: 'rgba(255,45,85,0.1)',
                  border: '1px solid rgba(255,45,85,0.2)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-sm text-lg font-bold uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'Bangers, cursive',
                backgroundColor: '#cc2c18',
                color: '#f5f5f0',
                boxShadow: '0 0 20px rgba(204,44,24,0.3)',
                letterSpacing: '0.1em',
              }}
            >
              {loading ? 'Shuffling the Deck...' : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <div
            className="text-center mt-6 text-sm"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              color: 'rgba(245,245,240,0.5)',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: '#39ff14' }}
            >
              Register
            </Link>
          </div>
        </div>

        {/* Bottom decoration */}
        <div
          className="text-center mt-6 text-xs"
          style={{
            fontFamily: 'Bangers, cursive',
            color: 'rgba(245,245,240,0.15)',
            letterSpacing: '0.1em',
          }}
        >
          THE HOUSE ALWAYS WINS... UNLESS YOU&apos;RE A LOBSTER
        </div>
      </div>
    </div>
  );
}
