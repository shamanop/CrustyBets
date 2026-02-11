'use client';
import { useUIStore } from '@/lib/stores/ui-store';

export default function SoundToggle() {
  const soundEnabled = useUIStore((s) => s.soundEnabled);
  const setSoundEnabled = useUIStore((s) => s.setSoundEnabled);

  return (
    <button
      onClick={() => setSoundEnabled(!soundEnabled)}
      className="p-2 rounded-sm border border-white/20 transition-all hover:border-white/40"
      style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
    </button>
  );
}
