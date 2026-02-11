'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { key: 'global', label: 'Global', emoji: '🌍' },
  { key: 'claw-machine', label: 'Claw', emoji: '🦞' },
  { key: 'shell-shuffle', label: 'Shell', emoji: '🐚' },
  { key: 'lobster-slots', label: 'Slots', emoji: '🎰' },
  { key: 'crab-roulette', label: 'Roulette', emoji: '🦀' },
];

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  playerType: string;
  totalWagered: number;
  totalWon: number;
  gamesPlayed: number;
  biggestWin: number;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (tab: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = tab === 'global'
        ? '/api/leaderboard?limit=50'
        : `/api/leaderboard?game=${tab}&limit=50`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();

      if (data.success && data.data?.entries) {
        setEntries(data.data.entries);
      } else {
        setEntries([]);
        if (data.error) setError(data.error);
      }
    } catch (err) {
      console.error('[Leaderboard] Fetch error:', err);
      setEntries([]);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab, fetchLeaderboard]);

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  // Podium order: 2nd, 1st, 3rd (visually: silver, gold, bronze)
  const podiumPlayers = entries.length >= 3 ? [entries[1], entries[0], entries[2]] : [];
  const podiumIndices = [1, 0, 2]; // rank indices for styling
  const heights = ['h-32', 'h-24', 'h-20']; // 1st is tallest, but visually center
  const podiumHeights = ['h-24', 'h-32', 'h-20']; // 2nd, 1st, 3rd
  const colors = ['#c0c0c0', '#ea9e2b', '#cd7f32']; // silver, gold, bronze
  const medals = ['🥈', '🥇', '🥉'];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl mb-2" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
        🏆 Leaderboard
      </h1>
      <p className="text-base opacity-60 mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        The crustiest players in the clawsino.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-sm border-2 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key ? 'scale-105' : 'opacity-50'
            }`}
            style={{
              fontFamily: 'Bangers, cursive',
              borderColor: activeTab === tab.key ? '#ea9e2b' : 'rgba(255,255,255,0.1)',
              backgroundColor: activeTab === tab.key ? 'rgba(234,158,43,0.15)' : 'transparent',
              color: activeTab === tab.key ? '#ea9e2b' : '#f5f5f0',
            }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="inline-block text-5xl mb-4"
          >
            🦞
          </motion.div>
          <p className="opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Loading leaderboard...
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">⚠️</span>
          <p className="opacity-60 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {error}
          </p>
          <button
            onClick={() => fetchLeaderboard(activeTab)}
            className="px-4 py-2 rounded-sm border-2 text-sm font-bold"
            style={{
              fontFamily: 'Bangers, cursive',
              borderColor: '#ea9e2b',
              color: '#ea9e2b',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">🦞</span>
          <p className="opacity-50 mb-2" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0', fontSize: '1.25rem' }}>
            No players yet
          </p>
          <p className="opacity-40" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Be the first to play and claim the top spot!
          </p>
        </div>
      )}

      {/* Leaderboard content */}
      {!loading && !error && entries.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top 3 podium */}
            {podiumPlayers.length === 3 && (
              <div className="flex justify-center items-end gap-4 mb-8">
                {podiumPlayers.map((player, displayIdx) => (
                  <motion.div
                    key={player.playerId}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: displayIdx * 0.15 }}
                    className="text-center"
                  >
                    <span className="text-3xl">{medals[displayIdx]}</span>
                    <p className="text-sm font-bold mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}>
                      {player.playerName}
                    </p>
                    <p className="text-xs opacity-40 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {player.gamesPlayed.toLocaleString()} games
                    </p>
                    <div
                      className={`${podiumHeights[displayIdx]} w-24 rounded-t-sm flex items-center justify-center`}
                      style={{ backgroundColor: colors[displayIdx] + '30', border: `2px solid ${colors[displayIdx]}` }}
                    >
                      <span className="text-sm" style={{ fontFamily: 'Bangers, cursive', color: colors[displayIdx] }}>
                        {player.totalWon.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Table */}
            <div
              className="rounded-sm overflow-hidden border border-white/10"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>#</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Player</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wider opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Won</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wider opacity-50 hidden sm:table-cell" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Games</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wider opacity-50 hidden md:table-cell" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Biggest</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((player, i) => (
                    <motion.tr
                      key={player.playerId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm" style={{ fontFamily: 'Bangers, cursive', color: player.rank <= 3 ? '#ea9e2b' : '#f5f5f0' }}>
                        {player.rank}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{player.playerType === 'agent' ? '🤖' : '👤'}</span>
                          <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}>
                            {player.playerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14' }}>
                        {player.totalWon.toLocaleString()} CC
                      </td>
                      <td className="px-4 py-3 text-right text-sm opacity-60 hidden sm:table-cell" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {player.gamesPlayed.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-sm hidden md:table-cell" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>
                        {player.biggestWin.toLocaleString()} CC
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
