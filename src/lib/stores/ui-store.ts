import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  showWallet: boolean;
  activeModal: string | null;

  toggleSidebar: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setShowWallet: (show: boolean) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.7,
  showWallet: true,
  activeModal: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
  setVolume: (volume) => set({ volume }),
  setShowWallet: (show) => set({ showWallet: show }),
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
