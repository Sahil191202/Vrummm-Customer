import { create } from 'zustand';

export const useUiStore = create((set) => ({
  theme: 'dark', // 'dark' (default look) | 'light' | 'system'
  language: 'en', // 'en' | 'hi' | 'mr'
  hasCompletedOnboarding: false,
  draftPickup: null,
  draftDrop: null,

  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setOnboardingComplete: (completed) => set({ hasCompletedOnboarding: completed }),
  setDraftPickup: (draftPickup) => set({ draftPickup }),
  setDraftDrop: (draftDrop) => set({ draftDrop }),
  resetDraft: () => set({ draftPickup: null, draftDrop: null }),
}));

export default useUiStore;
