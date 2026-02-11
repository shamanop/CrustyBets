'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const navLinks = [
  { name: 'Games', href: '/lobby', glowColor: '#cc2c18' },
  { name: 'Leaderboard', href: '/leaderboard', glowColor: '#ea9e2b' },
  { name: 'API Docs', href: '/docs', glowColor: '#39ff14' },
];

/* Small inline SVGs used in the navbar */
const CoinSVG = () => (
  <svg width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0">
    <defs>
      <linearGradient id="nav-gcoin" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f5d442" />
        <stop offset="50%" stopColor="#ea9e2b" />
        <stop offset="100%" stopColor="#c47a1a" />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#nav-gcoin)" stroke="#c47a1a" strokeWidth="3" />
    <circle cx="30" cy="30" r="22" fill="none" stroke="#f5d442" strokeWidth="1.5" strokeDasharray="4 3" />
    <text x="30" y="36" textAnchor="middle" fill="#7a4a0a" fontSize="18" fontWeight="bold" fontFamily="Bangers, cursive">CC</text>
  </svg>
);

const LeverSVG = () => (
  <svg width="10" height="16" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1">
    <circle cx="5" cy="4" r="3.5" fill="#cc2c18" stroke="#8b1a10" strokeWidth="1" />
    <rect x="3.5" y="7" width="3" height="12" rx="1" fill="#cc2c18" stroke="#8b1a10" strokeWidth="0.8" />
  </svg>
);

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoggedIn = status === 'authenticated' && session?.user;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🦞</span>
          <span
            className="text-xl font-bold tracking-wider"
            style={{
              fontFamily: 'Bungee Shade, cursive',
              color: '#cc2c18',
              textShadow: '2px 2px 0 #0a0a0f',
            }}
          >
            CRUSTY
            <LeverSVG />
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="nav-link-glow text-sm uppercase tracking-wider opacity-70 hover:opacity-100 transition-all"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#f5f5f0',
                letterSpacing: '0.1em',
                '--glow-color': link.glowColor,
              } as React.CSSProperties}
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              {/* User name */}
              <span
                className="text-sm"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#f5f5f0',
                  letterSpacing: '0.05em',
                }}
              >
                {session.user.name}
              </span>

              {/* Coin balance display */}
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  border: '1px solid rgba(234,158,43,0.19)',
                }}
              >
                <CoinSVG />
                <span
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#ea9e2b',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {session.user.crustyCoins?.toLocaleString() ?? '0'} CC
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-sm border transition-all hover:scale-105"
                style={{
                  fontFamily: 'Bangers, cursive',
                  borderColor: 'rgba(255,45,85,0.4)',
                  color: '#ff2d55',
                  letterSpacing: '0.05em',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-sm border transition-all hover:scale-105"
                style={{
                  fontFamily: 'Bangers, cursive',
                  borderColor: 'rgba(204,44,24,0.4)',
                  color: '#cc2c18',
                  letterSpacing: '0.05em',
                }}
              >
                Login
              </Link>

              {/* Register */}
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-sm border-2 transition-all hover:scale-105"
                style={{
                  fontFamily: 'Bangers, cursive',
                  borderColor: '#39ff14',
                  color: '#39ff14',
                  boxShadow: '0 0 10px rgba(57,255,20,0.2)',
                  letterSpacing: '0.05em',
                }}
              >
                Register
              </Link>
            </>
          )}

          <Link
            href="/lobby"
            className="px-5 py-2 text-sm font-bold uppercase tracking-wider rounded-sm border-2 transition-all hover:scale-105"
            style={{
              fontFamily: 'Bangers, cursive',
              borderColor: '#39ff14',
              color: '#39ff14',
              boxShadow: '0 0 10px rgba(57,255,20,0.2)',
              letterSpacing: '0.1em',
            }}
          >
            Play Now
          </Link>
        </div>

        {/* Nav link hover glow styles */}
        <style>{`
          .nav-link-glow:hover {
            text-shadow: 0 0 8px var(--glow-color), 0 0 16px var(--glow-color);
          }
        `}</style>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-[#f5f5f0] transition-all ${
                mobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-[#f5f5f0] transition-all ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-[#f5f5f0] transition-all ${
                mobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: 'rgba(10,10,15,0.98)' }}
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="nav-link-glow text-lg uppercase tracking-wider py-2 transition-all"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#f5f5f0',
                    '--glow-color': link.glowColor,
                  } as React.CSSProperties}
                >
                  {link.name}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  {/* Mobile user info + balance */}
                  <div className="flex items-center gap-3 py-2">
                    <span
                      style={{
                        fontFamily: 'Bangers, cursive',
                        color: '#f5f5f0',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {session.user.name}
                    </span>
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1"
                      style={{ border: '1px solid rgba(234,158,43,0.19)' }}
                    >
                      <CoinSVG />
                      <span
                        style={{
                          fontFamily: 'Bangers, cursive',
                          color: '#ea9e2b',
                          fontSize: '0.85rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {session.user.crustyCoins?.toLocaleString() ?? '0'} CC
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="inline-block px-6 py-3 text-lg font-bold uppercase text-center rounded-sm border mt-2"
                    style={{
                      fontFamily: 'Bangers, cursive',
                      borderColor: 'rgba(255,45,85,0.4)',
                      color: '#ff2d55',
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile auth links */}
                  <div className="flex gap-3 mt-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 px-4 py-3 text-lg font-bold uppercase text-center rounded-sm border"
                      style={{
                        fontFamily: 'Bangers, cursive',
                        borderColor: 'rgba(204,44,24,0.4)',
                        color: '#cc2c18',
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 px-4 py-3 text-lg font-bold uppercase text-center rounded-sm border-2"
                      style={{
                        fontFamily: 'Bangers, cursive',
                        borderColor: '#39ff14',
                        color: '#39ff14',
                      }}
                    >
                      Register
                    </Link>
                  </div>
                </>
              )}

              <Link
                href="/lobby"
                onClick={() => setMobileOpen(false)}
                className="inline-block px-6 py-3 text-lg font-bold uppercase text-center rounded-sm border-2 mt-2"
                style={{
                  fontFamily: 'Bangers, cursive',
                  borderColor: '#39ff14',
                  color: '#39ff14',
                }}
              >
                Play Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
