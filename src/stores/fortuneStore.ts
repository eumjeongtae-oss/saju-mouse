import { create } from 'zustand';
import type { FortuneTheme, SajuInput } from '@/types/api';

interface FortuneStore {
  selectedTheme: FortuneTheme | null;
  sajuInput: SajuInput | null;
  setTheme: (theme: FortuneTheme) => void;
  setSajuInput: (input: SajuInput) => void;
  reset: () => void;
}

export const useFortuneStore = create<FortuneStore>((set) => ({
  selectedTheme: null,
  sajuInput: null,
  setTheme: (theme) => set({ selectedTheme: theme }),
  setSajuInput: (input) => set({ sajuInput: input }),
  reset: () => set({ selectedTheme: null, sajuInput: null }),
}));
