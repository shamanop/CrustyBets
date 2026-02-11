'use client';
import { useCallback } from 'react';

interface ClawControlsProps {
  onMove: (direction: 'left' | 'right') => void;
  onDrop: () => void;
  disabled: boolean;
  isDropping: boolean;
}

export default function ClawControls({ onMove, onDrop, disabled, isDropping }: ClawControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {/* Direction controls */}
      <div className="flex items-center gap-6">
        <button
          onMouseDown={() => onMove('left')}
          onTouchStart={() => onMove('left')}
          disabled={disabled || isDropping}
          className="w-16 h-16 rounded-sm border-2 border-white/30 flex items-center justify-center text-2xl font-bold transition-all active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: 'rgba(204,44,24,0.3)', fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}
        >
          ←
        </button>

        <button
          onClick={onDrop}
          disabled={disabled || isDropping}
          className="w-20 h-20 rounded-full border-3 flex items-center justify-center text-lg font-bold transition-all active:scale-95 disabled:opacity-30"
          style={{
            backgroundColor: isDropping ? 'rgba(57,255,20,0.2)' : 'rgba(57,255,20,0.4)',
            borderColor: '#39ff14',
            boxShadow: '0 0 20px rgba(57,255,20,0.3)',
            fontFamily: 'Bangers, cursive',
            color: '#39ff14',
          }}
        >
          {isDropping ? '...' : 'DROP'}
        </button>

        <button
          onMouseDown={() => onMove('right')}
          onTouchStart={() => onMove('right')}
          disabled={disabled || isDropping}
          className="w-16 h-16 rounded-sm border-2 border-white/30 flex items-center justify-center text-2xl font-bold transition-all active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: 'rgba(204,44,24,0.3)', fontFamily: 'Bangers, cursive', color: '#f5f5f0' }}
        >
          →
        </button>
      </div>

      {/* Instructions */}
      <p className="text-xs opacity-50 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Arrow keys / A,D to move • Space to drop
      </p>
    </div>
  );
}
