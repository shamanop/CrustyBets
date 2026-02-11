'use client';
import { useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { useUIStore } from '@/lib/stores/ui-store';

const soundCache = new Map<string, Howl>();

const SOUNDS = {
  'coin-drop': '/sounds/coin-drop.mp3',
  'coin-win': '/sounds/coin-win.mp3',
  'claw-grab': '/sounds/claw-grab.mp3',
  'claw-drop': '/sounds/claw-drop.mp3',
  'claw-move': '/sounds/claw-move.mp3',
  'shell-shuffle': '/sounds/shell-shuffle.mp3',
  'shell-reveal': '/sounds/shell-reveal.mp3',
  'slot-spin': '/sounds/slot-spin.mp3',
  'slot-stop': '/sounds/slot-stop.mp3',
  'slot-win': '/sounds/slot-win.mp3',
  'roulette-spin': '/sounds/roulette-spin.mp3',
  'roulette-ball': '/sounds/roulette-ball.mp3',
  'button-click': '/sounds/button-click.mp3',
  'win-big': '/sounds/win-big.mp3',
  'lose': '/sounds/lose.mp3',
} as const;

type SoundName = keyof typeof SOUNDS;

function getOrCreateSound(name: SoundName): Howl {
  if (!soundCache.has(name)) {
    soundCache.set(name, new Howl({
      src: [SOUNDS[name]],
      preload: false,
      volume: 0.5,
    }));
  }
  return soundCache.get(name)!;
}

export function useSound() {
  const soundEnabled = useUIStore((s) => s.soundEnabled);
  const volume = useUIStore((s) => s.volume);

  const play = useCallback((name: SoundName) => {
    if (!soundEnabled) return;
    const sound = getOrCreateSound(name);
    sound.volume(volume);
    sound.play();
  }, [soundEnabled, volume]);

  const stop = useCallback((name: SoundName) => {
    const sound = soundCache.get(name);
    if (sound) sound.stop();
  }, []);

  const stopAll = useCallback(() => {
    soundCache.forEach((sound) => sound.stop());
  }, []);

  return { play, stop, stopAll };
}
