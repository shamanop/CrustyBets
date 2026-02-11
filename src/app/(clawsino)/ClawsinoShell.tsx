'use client';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCrustyCoins } from '@/lib/hooks/useCrustyCoins';

const sidebarLinks = [
  { name: 'Lobby', href: '/lobby', emoji: '🏠' },
  { name: 'Claw Machine', href: '/claw-machine', emoji: '🦞' },
  { name: 'Shell Shuffle', href: '/shell-shuffle', emoji: '🐚' },
  { name: 'Lobster Slots', href: '/lobster-slots', emoji: '🎰' },
  { name: 'Crab Roulette', href: '/crab-roulette', emoji: '🦀' },
  { name: 'Leaderboard', href: '/leaderboard', emoji: '🏆' },
  { name: 'Profile', href: '/profile', emoji: '👤' },
];

export default function ClawsinoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { balance, loading, isAuthenticated, claimDaily } = useCrustyCoins();

  // Daily claim state
  const [claimFeedback, setClaimFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [cooldownText, setCooldownText] = useState<string | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);

  // Countdown timer for cooldown
  useEffect(() => {
    if (!cooldownEnd) return;
    const tick = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = cooldownEnd - now;
      if (remaining <= 0) {
        setCooldownText(null);
        setCooldownEnd(null);
        return;
      }
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      setCooldownText(`${h}h ${m}m ${s}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cooldownEnd]);

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (!claimFeedback) return;
    const timeout = setTimeout(() => setClaimFeedback(null), 4000);
    return () => clearTimeout(timeout);
  }, [claimFeedback]);

  const handleClaimDaily = async () => {
    if (claiming || cooldownText) return;
    setClaiming(true);
    const result = await claimDaily();
    setClaiming(false);

    if (result.success) {
      setClaimFeedback({ type: 'success', message: `+${result.amount} CC claimed!` });
      // After successful claim, set 24h cooldown
      setCooldownEnd(Math.floor(Date.now() / 1000) + 24 * 60 * 60);
    } else {
      setClaimFeedback({ type: 'error', message: result.error || 'Claim failed' });
      if (result.remainingSeconds) {
        setCooldownEnd(Math.floor(Date.now() / 1000) + result.remainingSeconds);
      }
    }
  };

  const displayBalance = loading ? '...' : balance !== null ? balance.toLocaleString() : '---';

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

        {/* Daily reward section */}
        <div className="p-4 border-t border-white/5">
          {/* Feedback toast */}
          <AnimatePresence>
            {claimFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-2 px-3 py-2 rounded-sm text-xs font-bold text-center"
                style={{
                  backgroundColor: claimFeedback.type === 'success'
                    ? 'rgba(57,255,20,0.15)'
                    : 'rgba(255,45,85,0.15)',
                  color: claimFeedback.type === 'success' ? '#39ff14' : '#ff2d55',
                  border: `1px solid ${claimFeedback.type === 'success' ? '#39ff14' : '#ff2d55'}40`,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {claimFeedback.message}
              </motion.div>
            )}
          </AnimatePresence>

          {isAuthenticated ? (
            <>
              {cooldownText ? (
                <div className="text-center">
                  <div
                    className="w-full px-4 py-2.5 rounded-sm border-2 text-sm font-bold"
                    style={{
                      fontFamily: 'Bangers, cursive',
                      borderColor: 'rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Next claim: {cooldownText}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleClaimDaily}
                  disabled={claiming}
                  className="w-full px-4 py-2.5 rounded-sm border-2 text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    borderColor: '#39ff14',
                    color: '#39ff14',
                    boxShadow: '0 0 10px rgba(57,255,20,0.15)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {claiming ? 'Claiming...' : '🎁 Claim Daily Reward'}
                </button>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="w-full block text-center px-4 py-2.5 rounded-sm border-2 text-sm font-bold transition-all hover:scale-[1.02]"
              style={{
                fontFamily: 'Bangers, cursive',
                borderColor: '#ea9e2b',
                color: '#ea9e2b',
                letterSpacing: '0.05em',
              }}
            >
              Login to Claim Rewards
            </Link>
          )}
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
          {isAuthenticated ? (
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm border"
              style={{ borderColor: '#ea9e2b', backgroundColor: 'rgba(234,158,43,0.1)' }}
              key={balance}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 0.3 }}
            >
              <span>🪙</span>
              <span style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>
                {displayBalance}
              </span>
              <span className="text-xs opacity-50">CC</span>
            </motion.div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-colors hover:bg-white/5"
              style={{ borderColor: 'rgba(234,158,43,0.4)', color: '#ea9e2b' }}
            >
              <span style={{ fontFamily: 'Bangers, cursive', fontSize: '0.875rem' }}>Login</span>
            </Link>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
