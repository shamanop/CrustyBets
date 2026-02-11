'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCrustyCoins } from '@/lib/hooks/useCrustyCoins';

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    crustyCoins: number;
    createdAt: number;
  };
  stats: {
    gamesPlayed: number;
    totalWagered: number;
    totalWon: number;
    biggestWin: number;
    perGame: Record<string, { gamesPlayed: number; totalWon: number }>;
  };
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  gameSessionId: string | null;
  createdAt: number;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(timestamp);
}

const txnTypeLabels: Record<string, { label: string; emoji: string; color: string }> = {
  bet: { label: 'Bet', emoji: '🎲', color: '#ff2d55' },
  win: { label: 'Win', emoji: '🏆', color: '#39ff14' },
  'daily-claim': { label: 'Daily Reward', emoji: '🎁', color: '#ea9e2b' },
  'signup-bonus': { label: 'Signup Bonus', emoji: '🎉', color: '#ea9e2b' },
  refund: { label: 'Refund', emoji: '↩️', color: '#14a3a8' },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'transactions'>('stats');
  const { balance, loading: balanceLoading, isAuthenticated } = useCrustyCoins();

  // Profile data
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txnLoading, setTxnLoading] = useState(false);
  const [txnLoaded, setTxnLoaded] = useState(false);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/session/profile', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (err) {
        console.error('[Profile] Failed to fetch profile:', err);
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Fetch transactions when tab is activated
  useEffect(() => {
    if (activeTab !== 'transactions' || txnLoaded) return;

    async function fetchTransactions() {
      setTxnLoading(true);
      try {
        const res = await fetch('/api/economy/transactions?limit=50', { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.data?.transactions) {
          setTransactions(data.data.transactions);
        }
      } catch (err) {
        console.error('[Profile] Failed to fetch transactions:', err);
      } finally {
        setTxnLoading(false);
        setTxnLoaded(true);
      }
    }
    fetchTransactions();
  }, [activeTab, txnLoaded]);

  // Unauthenticated state
  if (!balanceLoading && !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <span className="text-6xl block mb-4">🦞</span>
        <h1
          className="text-3xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
        >
          Login to see your profile
        </h1>
        <p className="opacity-50 mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Track your stats, view transactions, and manage your CrustyCoins.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-sm border-2 text-lg font-bold transition-all hover:scale-105"
          style={{
            fontFamily: 'Bangers, cursive',
            borderColor: '#cc2c18',
            color: '#cc2c18',
            letterSpacing: '0.05em',
          }}
        >
          Login Now
        </Link>
      </div>
    );
  }

  const displayBalance = balanceLoading ? '...' : (balance ?? 0).toLocaleString();
  const memberSince = profile?.user?.createdAt
    ? formatDate(profile.user.createdAt)
    : 'Loading...';
  const userName = profile?.user?.name || 'Player';

  const stats = profile?.stats;
  const perGame = stats?.perGame || {};

  const statCards = [
    { label: 'Games Played', value: stats ? stats.gamesPlayed.toLocaleString() : '...', emoji: '🎮' },
    { label: 'Total Won', value: stats ? `${stats.totalWon.toLocaleString()} CC` : '...', emoji: '🪙' },
    { label: 'Total Wagered', value: stats ? `${stats.totalWagered.toLocaleString()} CC` : '...', emoji: '🎲' },
    { label: 'Biggest Win', value: stats ? `${stats.biggestWin.toLocaleString()} CC` : '...', emoji: '🏆' },
    { label: 'Claw Grabs', value: perGame['claw-machine']?.gamesPlayed?.toLocaleString() || '0', emoji: '🦞' },
    { label: 'Shell Wins', value: perGame['shell-shuffle']?.gamesPlayed?.toLocaleString() || '0', emoji: '🐚' },
    { label: 'Slot Spins', value: perGame['lobster-slots']?.gamesPlayed?.toLocaleString() || '0', emoji: '🎰' },
    { label: 'Roulette Rounds', value: perGame['crab-roulette']?.gamesPlayed?.toLocaleString() || '0', emoji: '🦀' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-20 h-20 rounded-sm border-2 border-white flex items-center justify-center text-4xl"
          style={{ backgroundColor: '#cc2c18', boxShadow: '4px 4px 0 #0a0a0f' }}
        >
          🦞
        </div>
        <div>
          <h1 className="text-3xl" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
            {profileLoading ? 'Loading...' : userName}
          </h1>
          <p className="opacity-60 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Member since {memberSince}
          </p>
          {profile?.user?.email && (
            <p className="opacity-40 text-xs mt-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {profile.user.email}
            </p>
          )}
        </div>
      </div>

      {/* Balance card */}
      <motion.div
        className="p-6 rounded-sm mb-8 border-2"
        style={{ borderColor: '#ea9e2b', backgroundColor: 'rgba(234,158,43,0.05)' }}
        key={balance}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm uppercase tracking-wider mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>
          CrustyCoin Balance
        </p>
        <p className="text-5xl font-bold" style={{ fontFamily: 'Bungee Shade, cursive', color: '#ea9e2b' }}>
          🪙 {displayBalance}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['stats', 'inventory', 'transactions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-sm border text-sm font-bold capitalize ${activeTab === tab ? '' : 'opacity-40'}`}
            style={{
              fontFamily: 'Bangers, cursive',
              borderColor: activeTab === tab ? '#ff6b35' : 'rgba(255,255,255,0.1)',
              color: activeTab === tab ? '#ff6b35' : '#f5f5f0',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-sm text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="text-2xl block mb-1">{stat.emoji}</span>
              <span className="text-lg font-bold block" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14' }}>
                {profileLoading ? '...' : stat.value}
              </span>
              <span className="text-xs opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Inventory tab */}
      {activeTab === 'inventory' && (
        <div className="text-center py-12 opacity-40">
          <span className="text-6xl block mb-4">📦</span>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No prizes yet. Go grab some from the claw machine!</p>
        </div>
      )}

      {/* Transactions tab */}
      {activeTab === 'transactions' && (
        <>
          {txnLoading && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="inline-block text-4xl mb-4"
              >
                🦞
              </motion.div>
              <p className="opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Loading transactions...
              </p>
            </div>
          )}

          {!txnLoading && transactions.length === 0 && (
            <div className="text-center py-12 opacity-40">
              <span className="text-6xl block mb-4">📜</span>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No transactions yet. Start playing to see your history!</p>
            </div>
          )}

          {!txnLoading && transactions.length > 0 && (
            <div
              className="rounded-sm overflow-hidden border border-white/10"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              {transactions.map((txn, i) => {
                const meta = txnTypeLabels[txn.type] || { label: txn.type, emoji: '🔄', color: '#f5f5f0' };
                const isPositive = txn.amount > 0;

                return (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{meta.emoji}</span>
                      <div>
                        <span
                          className="text-sm font-bold block"
                          style={{ fontFamily: 'Bangers, cursive', color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="text-xs opacity-40 block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {txn.description || meta.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-sm font-bold block"
                        style={{
                          fontFamily: 'Bangers, cursive',
                          color: isPositive ? '#39ff14' : '#ff2d55',
                        }}
                      >
                        {isPositive ? '+' : ''}{txn.amount.toLocaleString()} CC
                      </span>
                      <span className="text-xs opacity-30 block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {formatRelativeTime(txn.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
