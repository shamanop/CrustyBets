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
  wonPrize: { name: string; rarity: string; value: number } | null;

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
  setWonPrize: (prize: { name: string; rarity: string; value: number }) => void;
  clearWonPrize: () => void;
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
  wonPrize: null,
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
  setCurrentGame: (game) => {
    console.log('[GameStore] setCurrentGame:', game);
    set({ currentGame: game });
  },
  setSessionId: (id) => {
    console.log('[GameStore] setSessionId:', id);
    set({ sessionId: id });
  },
  setIsPlaying: (playing) => {
    console.log('[GameStore] setIsPlaying:', playing);
    set({ isPlaying: playing });
  },
  setIsSpectating: (spectating) => {
    console.log('[GameStore] setIsSpectating:', spectating);
    set({ isSpectating: spectating });
  },
  updateClawPosition: (pos) => set({ clawPosition: pos }),
  setClawOpen: (open) => {
    console.log('[GameStore] setClawOpen:', open);
    set({ clawOpen: open });
  },
  setIsDropping: (dropping) => {
    console.log('[GameStore] setIsDropping:', dropping);
    set({ isDropping: dropping });
  },
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setWonPrize: (prize) => {
    console.log('[GameStore] setWonPrize:', prize.name, prize.rarity, prize.value);
    set({ wonPrize: prize });
  },
  clearWonPrize: () => {
    console.log('[GameStore] clearWonPrize');
    set({ wonPrize: null });
  },
  setSelectedShell: (shell) => {
    console.log('[GameStore] setSelectedShell:', shell);
    set({ selectedShell: shell });
  },
  setShufflePhase: (phase) => {
    console.log('[GameStore] setShufflePhase:', phase);
    set({ shufflePhase: phase });
  },
  setReels: (reels) => {
    console.log('[GameStore] setReels, reel count:', reels.length);
    set({ reels });
  },
  setSpinning: (spinning) => {
    console.log('[GameStore] setSpinning:', spinning);
    set({ spinning: spinning });
  },
  addRouletteBet: (bet) => {
    console.log('[GameStore] addRouletteBet:', bet.type, bet.value, 'amount:', bet.amount);
    set((state) => ({ rouletteBets: [...state.rouletteBets, bet] }));
  },
  clearRouletteBets: () => {
    console.log('[GameStore] clearRouletteBets');
    set({ rouletteBets: [] });
  },
  setRoulettePhase: (phase) => {
    console.log('[GameStore] setRoulettePhase:', phase);
    set({ roulettePhase: phase });
  },
  setRouletteTimeRemaining: (time) => set({ rouletteTimeRemaining: time }),
  resetGame: () => {
    console.log('[GameStore] resetGame - resetting to initial state');
    set(initialState);
  },
}));
