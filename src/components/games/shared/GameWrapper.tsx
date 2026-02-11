'use client';
import { ReactNode } from 'react';
import CoinBalance from './CoinBalance';

interface GameWrapperProps {
  title: string;
  emoji: string;
  children: ReactNode;
  balance: number;
  betAmount?: number;
  timeRemaining?: number;
  showTimer?: boolean;
}

export default function GameWrapper({ title, emoji, children, balance, betAmount, timeRemaining, showTimer }: GameWrapperProps) {
  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <h1 className="text-2xl" style={{ fontFamily: 'Permanent Marker, cursive', color: '#f5f5f0' }}>
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {showTimer && timeRemaining !== undefined && (
              <div
                className="px-4 py-2 rounded-sm border-2"
                style={{
                  borderColor: timeRemaining <= 10 ? '#ff2d55' : '#39ff14',
                  color: timeRemaining <= 10 ? '#ff2d55' : '#39ff14',
                  fontFamily: 'Bangers, cursive',
                  fontSize: '1.25rem',
                  boxShadow: timeRemaining <= 10 ? '0 0 10px rgba(255,45,85,0.3)' : '0 0 10px rgba(57,255,20,0.2)',
                }}
              >
                {timeRemaining}s
              </div>
            )}

            {betAmount !== undefined && (
              <div className="px-3 py-1 rounded-sm" style={{ backgroundColor: 'rgba(234,158,43,0.2)', border: '1px solid #ea9e2b' }}>
                <span style={{ fontFamily: 'Bangers, cursive', color: '#ea9e2b' }}>Bet: {betAmount} CC</span>
              </div>
            )}

            <CoinBalance balance={balance} />
          </div>
        </div>

        {/* Game area */}
        <div className="flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
