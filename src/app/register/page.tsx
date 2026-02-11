'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBonus, setShowBonus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Even a crab can double-check.');
      return;
    }

    setLoading(true);

    try {
      // Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. The crabs are acting up.');
        setLoading(false);
        return;
      }

      // Show bonus animation
      setShowBonus(true);

      // Auto-login after a brief delay to show the bonus
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Account created but login failed. Try logging in manually.');
          setLoading(false);
        } else {
          router.push('/lobby');
          router.refresh();
        }
      }, 2000);
    } catch {
      setError('Something went wrong. A lobster is sitting on the server.');
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
          className="absolute top-20 right-10 text-6xl opacity-5 animate-float"
          style={{ animationDelay: '1s' }}
        >
          🦞
        </div>
        <div
          className="absolute bottom-40 left-20 text-4xl opacity-5 animate-float"
          style={{ animationDelay: '3s' }}
        >
          🪙
        </div>
        <div
          className="absolute top-1/3 left-10 text-5xl opacity-5 animate-float"
          style={{ animationDelay: '5s' }}
        >
          🐚
        </div>
      </div>

      {/* Bonus overlay */}
      {showBonus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="text-center animate-sticker-pop">
            <div className="text-6xl mb-4">🪙</div>
            <h2
              className="text-4xl mb-2"
              style={{
                fontFamily: 'Permanent Marker, cursive',
                color: '#39ff14',
                textShadow: '0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.3)',
              }}
            >
              +100 CrustyCoins
            </h2>
            <p
              className="text-xl"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#ea9e2b',
                letterSpacing: '0.05em',
              }}
            >
              Signup Bonus!
            </p>
            <p
              className="text-sm mt-2 opacity-60"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}
            >
              Taking you to the Clawsino...
            </p>
          </div>
        </div>
      )}

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

        {/* Register Card */}
        <div
          className="rounded-sm p-8 border"
          style={{
            backgroundColor: '#1a1a2e',
            borderColor: 'rgba(57,255,20,0.2)',
            boxShadow: '0 0 30px rgba(57,255,20,0.05)',
          }}
        >
          <h2
            className="text-2xl text-center mb-2"
            style={{
              fontFamily: 'Permanent Marker, cursive',
              color: '#f5f5f0',
            }}
          >
            Join the Clawsino
          </h2>
          <p
            className="text-center mb-6 text-sm"
            style={{
              fontFamily: 'Bangers, cursive',
              color: '#39ff14',
              letterSpacing: '0.05em',
            }}
          >
            Get 100 Free CrustyCoins!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm mb-1.5"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#ea9e2b',
                  letterSpacing: '0.05em',
                }}
              >
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={30}
                placeholder="LobsterKing42"
                className="w-full px-4 py-3 rounded-sm outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f0',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.95rem',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': '#39ff14',
                }}
              />
            </div>

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
                  '--tw-ring-color': '#39ff14',
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
                minLength={6}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-sm outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f0',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.95rem',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': '#39ff14',
                }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm mb-1.5"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#ea9e2b',
                  letterSpacing: '0.05em',
                }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Type it again"
                className="w-full px-4 py-3 rounded-sm outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f0',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.95rem',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': '#39ff14',
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
                backgroundColor: '#39ff14',
                color: '#0a0a0f',
                boxShadow: '0 0 20px rgba(57,255,20,0.3)',
                letterSpacing: '0.1em',
              }}
            >
              {loading ? 'Hatching Your Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <div
            className="text-center mt-6 text-sm"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              color: 'rgba(245,245,240,0.5)',
            }}
          >
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold transition-colors hover:underline"
              style={{ color: '#cc2c18' }}
            >
              Login
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
          NO CRABS WERE HARMED IN THE MAKING OF THIS CASINO
        </div>
      </div>
    </div>
  );
}
