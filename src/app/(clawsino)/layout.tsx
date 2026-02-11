'use client';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarLinks = [
  { name: 'Lobby', href: '/lobby', emoji: '🏠' },
  { name: 'Claw Machine', href: '/claw-machine', emoji: '🦞' },
  { name: 'Shell Shuffle', href: '/shell-shuffle', emoji: '🐚' },
  { name: 'Lobster Slots', href: '/lobster-slots', emoji: '🎰' },
  { name: 'Crab Roulette', href: '/crab-roulette', emoji: '🦀' },
  { name: 'Leaderboard', href: '/leaderboard', emoji: '🏆' },
  { name: 'Profile', href: '/profile', emoji: '👤' },
];

export default function ClawsinoLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('[ClawsinoLayout] mounted, pathname:', pathname);
    return () => {
      console.log('[ClawsinoLayout] unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('[ClawsinoLayout] pathname changed:', pathname);
  }, [pathname]);

  useEffect(() => {
    console.log('[ClawsinoLayout] sidebar toggled, open:', sidebarOpen);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 flex-shrink-0 flex flex-col transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🦞</span>
            <span
              className="text-lg font-bold"
              style={{ fontFamily: 'Bungee Shade, cursive', color: '#cc2c18' }}
            >
              CRUSTY
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all ${
                  isActive ? 'border-l-2' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive ? 'rgba(204,44,24,0.15)' : 'transparent',
                  borderColor: isActive ? '#cc2c18' : 'transparent',
                  fontFamily: 'Bangers, cursive',
                  color: '#f5f5f0',
                  letterSpacing: '0.05em',
                }}
              >
                <span className="text-lg">{link.emoji}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Daily reward button */}
        <div className="p-4 border-t border-white/5">
          <button
            className="w-full px-4 py-2.5 rounded-sm border-2 text-sm font-bold transition-all hover:scale-[1.02]"
            style={{
              fontFamily: 'Bangers, cursive',
              borderColor: '#39ff14',
              color: '#39ff14',
              boxShadow: '0 0 10px rgba(57,255,20,0.15)',
              letterSpacing: '0.05em',
            }}
          >
            🎁 Claim Daily Reward
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: 'rgba(10,10,15,0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span className="text-xl">☰</span>
          </button>

          <div className="flex-1" />

          {/* Wallet display */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm border"
            style={{ borderColor: '#ea9e2b', backgroundColor: 'rgba(234,158,43,0.1)' }}
          >
            <span>🪙</span>
            <span style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>---</span>
            <span className="text-xs opacity-50">CC</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
