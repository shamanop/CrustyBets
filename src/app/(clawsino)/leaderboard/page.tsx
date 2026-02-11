'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { key: 'global', label: 'Global', emoji: '🌍' },
  { key: 'claw-machine', label: 'Claw', emoji: '🦞' },
  { key: 'shell-shuffle', label: 'Shell', emoji: '🐚' },
  { key: 'lobster-slots', label: 'Slots', emoji: '🎰' },
  { key: 'crab-roulette', label: 'Roulette', emoji: '🦀' },
];

// Mock data
const mockLeaderboard = Array.from({ length: 20 }, (_, i) => ({
  rank: i + 1,
  playerName: ['ClawdBot', 'OpenClaw', 'MoltBot', 'ShrimpScript', 'CrabKing', 'LobsterLord', 'ShellMaster', 'TidalWave', 'CoralCrusher', 'OceanOracle'][i % 10] + (i >= 10 ? `_${i}` : ''),
  playerType: i % 3 === 0 ? 'user' : 'agent',
  totalWon: Math.floor(100000 / (i + 1)),
  gamesPlayed: Math.floor(5000 / (i + 1)),
  biggestWin: Math.floor(50000 / (i + 1)),
}));

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('global');

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
            onClick={() => setActiveTab(tab.key)}
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

      {/* Top 3 podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {[1, 0, 2].map((idx) => {
          const player = mockLeaderboard[idx];
          const heights = ['h-32', 'h-24', 'h-20'];
          const colors = ['#ea9e2b', '#c0c0c0', '#cd7f32'];
          const medals = ['🥇', '🥈', '🥉'];
          return (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.2 }}
              className="text-center"
            >
              <span className="text-3xl">{medals[idx]}</span>
              <p className="text-sm font-bold mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}>
                {player.playerName}
              </p>
              <div
                className={`${heights[idx]} w-24 rounded-t-sm flex items-center justify-center`}
                style={{ backgroundColor: colors[idx] + '30', border: `2px solid ${colors[idx]}` }}
              >
                <span style={{ fontFamily: 'Bangers, cursive', color: colors[idx] }}>
                  {player.totalWon.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

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
            {mockLeaderboard.map((player) => (
              <tr
                key={player.rank}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
