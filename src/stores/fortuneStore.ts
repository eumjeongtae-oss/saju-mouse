import { create } from 'zustand';
import type { FortuneTheme, SajuInput } from '@/types/api';

interface FortuneStore {
  selectedTheme: FortuneTheme | null;
  sajuInput: SajuInput | null;
  partnerInput: SajuInput | null; // 궁합 모드에서 상대방 사주 입력
  setTheme: (theme: FortuneTheme) => void;
  setSajuInput: (input: SajuInput) => void;
  setPartnerInput: (input: SajuInput) => void;
  reset: () => void;
}

export const useFortuneStore = create<FortuneStore>((set) => ({
  selectedTheme: null,
  sajuInput: null,
  partnerInput: null,
  setTheme: (theme) => set({ selectedTheme: theme }),
  setSajuInput: (input) => set({ sajuInput: input }),
  setPartnerInput: (input) => set({ partnerInput: input }),
  reset: () => set({ selectedTheme: null, sajuInput: null, partnerInput: null }),
}));
