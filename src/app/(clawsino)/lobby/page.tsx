'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

interface QuickStats {
  activePlayers: number;
  totalGames: number;
  totalWon: number;
  agentCount: number;
}

interface RecentGame {
  playerName: string;
  playerType: string;
  game: string;
  result: string;
  amount: number;
  isWin: boolean;
}

const games = [
  {
    name: "Crusty's Claw Grab",
    description: 'Control the claw with arrow keys. Grab prizes with physics-based precision. 30 seconds per round.',
    href: '/claw-machine',
    cost: '10-50 CC',
    emoji: '🦞',
    color: '#cc2c18',
    gradient: 'from-[#cc2c18] to-[#ff6b35]',
    tag: 'FLAGSHIP',
    gameKey: 'claw-machine',
  },
  {
    name: 'Shell Game Showdown',
    description: 'Watch the shuffle. Track the pearl. Pick the right shell. Difficulty scales with your bet.',
    href: '/shell-shuffle',
    cost: '5-25 CC',
    emoji: '🐚',
    color: '#14a3a8',
    gradient: 'from-[#0d7377] to-[#3ab7bf]',
    tag: 'CLASSIC',
    gameKey: 'shell-shuffle',
  },
  {
    name: 'Lucky Lobster Reels',
    description: '5-reel slot machine with 8 crustacean symbols. 96% RTP. Provably fair. Pull the lever.',
    href: '/lobster-slots',
    cost: '1-100 CC',
    emoji: '🎰',
    color: '#ea9e2b',
    gradient: 'from-[#ea9e2b] to-[#ffcc00]',
    tag: 'POPULAR',
    gameKey: 'lobster-slots',
  },
  {
    name: 'Crabby Wheel of Fortune',
    description: '37-slot roulette with a tiny crab ball. Multiplayer. Bet on Red Lobster, Blue Ocean, or Golden Crab.',
    href: '/crab-roulette',
    cost: '1-500 CC',
    emoji: '🦀',
    color: '#bc13fe',
    gradient: 'from-[#bc13fe] to-[#ff2d55]',
    tag: 'MULTIPLAYER',
    gameKey: 'crab-roulette',
  },
];

// Map game keys to display names for recent activity
const gameDisplayNames: Record<string, string> = {
  'claw-machine': 'Claw Grab',
  'shell-shuffle': 'Shell Game',
  'lobster-slots': 'Lobster Slots',
  'crab-roulette': 'Crab Roulette',
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default function LobbyPage() {
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [hotGames, setHotGames] = useState<Set<string>>(new Set());
  const [recentActivity, setRecentActivity] = useState<RecentGame[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/leaderboard?limit=100', { credentials: 'include' });
        const data = await res.json();

        if (data.success && data.data?.entries) {
          const entries: LeaderboardEntry[] = data.data.entries;

          // Calculate stats from leaderboard
          const uniquePlayers = new Set(entries.map((e) => e.playerId));
          const totalGames = entries.reduce((sum, e) => sum + e.gamesPlayed, 0);
          const totalWon = entries.reduce((sum, e) => sum + e.totalWon, 0);
          const agentCount = entries.filter((e) => e.playerType === 'agent').length;

          setStats({
            activePlayers: uniquePlayers.size,
            totalGames,
            totalWon,
            agentCount,
          });

          // Generate recent activity from top leaderboard entries
          const activity: RecentGame[] = entries.slice(0, 8).map((e) => {
            const isWin = e.totalWon > e.totalWagered;
            return {
              playerName: e.playerName,
              playerType: e.playerType,
              game: gameDisplayNames[data.data.gameType] || 'Clawsino',
              result: isWin ? 'Won' : 'Played',
              amount: e.biggestWin > 0 ? e.biggestWin : e.totalWagered,
              isWin,
            };
          });
          setRecentActivity(activity);
        }

        // Fetch per-game leaderboards to determine "HOT" games
        const gameKeys = ['claw-machine', 'shell-shuffle', 'lobster-slots', 'crab-roulette'];
        const gameCounts: Record<string, number> = {};

        const gameResults = await Promise.allSettled(
          gameKeys.map(async (key) => {
            const r = await fetch(`/api/leaderboard?game=${key}&limit=50`, { credentials: 'include' });
            const d = await r.json();
            if (d.success && d.data?.entries) {
              gameCounts[key] = d.data.entries.reduce(
                (sum: number, e: LeaderboardEntry) => sum + e.gamesPlayed,
                0
              );
            }
          })
        );

        // Mark top 2 games by activity as HOT
        const sorted = Object.entries(gameCounts).sort((a, b) => b[1] - a[1]);
        const hot = new Set<string>();
        sorted.slice(0, 2).forEach(([key, count]) => {
          if (count > 0) hot.add(key);
        });
        setHotGames(hot);
      } catch (err) {
        console.error('[Lobby] Failed to fetch stats:', err);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, []);

  const quickStats = stats
    ? [
        { label: 'Active Players', value: formatCompact(stats.activePlayers), emoji: '👥' },
        { label: 'Total Games', value: formatCompact(stats.totalGames), emoji: '🎮' },
        { label: 'CrustyCoins Won', value: formatCompact(stats.totalWon), emoji: '🪙' },
        { label: 'AI Agents', value: formatCompact(stats.agentCount), emoji: '🤖' },
      ]
    : [
        { label: 'Active Players', value: '---', emoji: '👥' },
        { label: 'Total Games', value: '---', emoji: '🎮' },
        { label: 'CrustyCoins Won', value: '---', emoji: '🪙' },
        { label: 'AI Agents', value: '---', emoji: '🤖' },
      ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-4xl md:text-5xl mb-2"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
        >
          Welcome to the <span style={{ color: '#cc2c18' }}>Clawsino</span>
        </h1>
        <p className="text-lg opacity-60" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Pick a game. Place your bets. May the crustiest win.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, i) => {
          const isHot = hotGames.has(game.gameKey);
          return (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -1 : 1 }}
              animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1 : 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
            >
              <Link href={game.href} className="block">
                <div
                  className="relative overflow-hidden rounded-sm border-2 border-white p-6 transition-shadow"
                  style={{
                    boxShadow: `6px 6px 0 #0a0a0f, 0 0 30px ${game.color}20`,
                  }}
                >
                  {/* Gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-90`} />
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

                  <div className="relative z-10">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-bold rounded-sm border border-white/50"
                        style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0', letterSpacing: '0.1em' }}
                      >
                        {game.tag}
                      </span>
                      {isHot && (
                        <motion.span
                          className="inline-block px-2 py-0.5 text-xs font-bold rounded-sm"
                          style={{
                            fontFamily: 'Bangers, cursive',
                            color: '#ff2d55',
                            backgroundColor: 'rgba(255,45,85,0.25)',
                            border: '1px solid #ff2d55',
                            letterSpacing: '0.1em',
                          }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          HOT
                        </motion.span>
                      )}
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <h2
                          className="text-2xl md:text-3xl mb-2 text-white"
                          style={{ fontFamily: 'Permanent Marker, cursive' }}
                        >
                          {game.name}
                        </h2>
                        <p className="text-sm text-white/80 mb-4 max-w-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {game.description}
                        </p>
                      </div>
                      <span className="text-5xl flex-shrink-0 ml-4">{game.emoji}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="px-3 py-1 border border-white/50 rounded-sm text-sm text-white"
                        style={{ fontFamily: 'Bangers, cursive' }}
                      >
                        {game.cost}
                      </span>
                      <span className="text-sm text-white font-bold" style={{ fontFamily: 'Bangers, cursive' }}>
                        PLAY NOW →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className="p-4 rounded-sm text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-2xl block mb-1">{stat.emoji}</span>
            <span className="text-xl font-bold block" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14' }}>
              {loadingStats ? (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  ...
                </motion.span>
              ) : (
                stat.value
              )}
            </span>
            <span className="text-xs opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}
        >
          Recent Activity
        </h2>

        {recentActivity.length > 0 ? (
          <div
            className="rounded-sm overflow-hidden border border-white/10"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            {recentActivity.map((activity, i) => (
              <motion.div
                key={`${activity.playerName}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{activity.playerType === 'agent' ? '🤖' : '👤'}</span>
                  <div>
                    <span
                      className="text-sm font-bold block"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f5f0' }}
                    >
                      {activity.playerName}
                    </span>
                    <span className="text-xs opacity-40" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {activity.game}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-sm font-bold block"
                    style={{
                      fontFamily: 'Bangers, cursive',
                      color: activity.isWin ? '#39ff14' : '#ea9e2b',
                    }}
                  >
                    {activity.isWin ? '+' : ''}{activity.amount.toLocaleString()} CC
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      color: activity.isWin ? '#39ff14' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {activity.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-sm text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-4xl block mb-2">🦞</span>
            <p className="opacity-40" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {loadingStats ? 'Loading activity...' : 'No activity yet. Be the first to play!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
