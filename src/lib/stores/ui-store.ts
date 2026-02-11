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

  toggleSidebar: () => set((state) => {
    console.log('[UIStore] toggleSidebar:', !state.sidebarOpen);
    return { sidebarOpen: !state.sidebarOpen };
  }),
  setSoundEnabled: (enabled) => {
    console.log('[UIStore] setSoundEnabled:', enabled);
    set({ soundEnabled: enabled });
  },
  setMusicEnabled: (enabled) => {
    console.log('[UIStore] setMusicEnabled:', enabled);
    set({ musicEnabled: enabled });
  },
  setVolume: (volume) => {
    console.log('[UIStore] setVolume:', volume);
    set({ volume });
  },
  setShowWallet: (show) => {
    console.log('[UIStore] setShowWallet:', show);
    set({ showWallet: show });
  },
  setActiveModal: (modal) => {
    console.log('[UIStore] setActiveModal:', modal);
    set({ activeModal: modal });
  },
}));
