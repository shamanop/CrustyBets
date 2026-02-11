import { create } from 'zustand';

interface GameState {
  // Current game
  currentGame: string | null;
  sessionId: string | null;
  isPlaying: boolean;
  isSpectating: boolean;

  // Claw machine state
  clawPosition: { x: number; y: number };
  clawOpen: boolean;
  isDropping: boolean;
  timeRemaining: number;

  // Shell shuffle state
  selectedShell: number | null;
  shufflePhase: 'watching' | 'guessing' | 'revealed' | null;

  // Lobster slots state
  reels: number[][];
  spinning: boolean;

  // Crab roulette state
  rouletteBets: Array<{ type: string; value: string | number; amount: number }>;
  roulettePhase: 'betting' | 'spinning' | 'result' | null;
  rouletteTimeRemaining: number;

  // Actions
  setCurrentGame: (game: string | null) => void;
  setSessionId: (id: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsSpectating: (spectating: boolean) => void;
  updateClawPosition: (pos: { x: number; y: number }) => void;
  setClawOpen: (open: boolean) => void;
  setIsDropping: (dropping: boolean) => void;
  setTimeRemaining: (time: number) => void;
  setSelectedShell: (shell: number | null) => void;
  setShufflePhase: (phase: 'watching' | 'guessing' | 'revealed' | null) => void;
  setReels: (reels: number[][]) => void;
  setSpinning: (spinning: boolean) => void;
  addRouletteBet: (bet: { type: string; value: string | number; amount: number }) => void;
  clearRouletteBets: () => void;
  setRoulettePhase: (phase: 'betting' | 'spinning' | 'result' | null) => void;
  setRouletteTimeRemaining: (time: number) => void;
  resetGame: () => void;
}

const initialState = {
  currentGame: null,
  sessionId: null,
  isPlaying: false,
  isSpectating: false,
  clawPosition: { x: 250, y: 50 },
  clawOpen: true,
  isDropping: false,
  timeRemaining: 30,
  selectedShell: null,
  shufflePhase: null,
  reels: [],
  spinning: false,
  rouletteBets: [],
  roulettePhase: null,
  rouletteTimeRemaining: 30,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  setCurrentGame: (game) => set({ currentGame: game }),
  setSessionId: (id) => set({ sessionId: id }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsSpectating: (spectating) => set({ isSpectating: spectating }),
  updateClawPosition: (pos) => set({ clawPosition: pos }),
  setClawOpen: (open) => set({ clawOpen: open }),
  setIsDropping: (dropping) => set({ isDropping: dropping }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setSelectedShell: (shell) => set({ selectedShell: shell }),
  setShufflePhase: (phase) => set({ shufflePhase: phase }),
  setReels: (reels) => set({ reels }),
  setSpinning: (spinning) => set({ spinning: spinning }),
  addRouletteBet: (bet) => set((state) => ({ rouletteBets: [...state.rouletteBets, bet] })),
  clearRouletteBets: () => set({ rouletteBets: [] }),
  setRoulettePhase: (phase) => set({ roulettePhase: phase }),
  setRouletteTimeRemaining: (time) => set({ rouletteTimeRemaining: time }),
  resetGame: () => set(initialState),
}));
