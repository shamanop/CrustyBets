'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
  { name: 'Games', href: '/lobby' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'API Docs', href: '/docs' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity"
              style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0', letterSpacing: '0.1em' }}
            >
              {link.name}
            </Link>
          ))}
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
                  className="text-lg uppercase tracking-wider py-2"
                  style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}
                >
                  {link.name}
                </Link>
              ))}
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
