'use client';
import { useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'transactions'>('stats');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-20 h-20 rounded-sm border-2 border-white flex items-center justify-center text-4xl"
          style={{ backgroundColor: '#cc2c18', boxShadow: '4px 4px 0 #0a0a0f' }}
        >
          🦞
        </div>
        <div>
          <h1 className="text-3xl" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
            Player Profile
          </h1>
          <p className="opacity-60 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Member since today
          </p>
        </div>
      </div>

      {/* Balance card */}
      <div
        className="p-6 rounded-sm mb-8 border-2"
        style={{ borderColor: '#ea9e2b', backgroundColor: 'rgba(234,158,43,0.05)' }}
      >
        <p className="text-sm uppercase tracking-wider mb-1" style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>
          CrustyCoin Balance
        </p>
        <p className="text-5xl font-bold" style={{ fontFamily: 'Bungee Shade, cursive', color: '#ea9e2b' }}>
          🪙 100
        </p>
      </div>

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

      {/* Content */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Games Played', value: '0', emoji: '🎮' },
            { label: 'Total Won', value: '0 CC', emoji: '🪙' },
            { label: 'Total Wagered', value: '0 CC', emoji: '🎲' },
            { label: 'Biggest Win', value: '0 CC', emoji: '🏆' },
            { label: 'Claw Grabs', value: '0', emoji: '🦞' },
            { label: 'Shell Wins', value: '0', emoji: '🐚' },
            { label: 'Slot Spins', value: '0', emoji: '🎰' },
            { label: 'Roulette Rounds', value: '0', emoji: '🦀' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-sm text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="text-2xl block mb-1">{stat.emoji}</span>
              <span className="text-lg font-bold block" style={{ fontFamily: 'Bangers, cursive', color: '#39ff14' }}>
                {stat.value}
              </span>
              <span className="text-xs opacity-50" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="text-center py-12 opacity-40">
          <span className="text-6xl block mb-4">📦</span>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No prizes yet. Go grab some from the claw machine!</p>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="text-center py-12 opacity-40">
          <span className="text-6xl block mb-4">📜</span>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No transactions yet. Start playing to see your history!</p>
        </div>
      )}
    </div>
  );
}
