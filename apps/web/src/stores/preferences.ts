import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ColorMode = "light" | "dark" | "system";

interface PreferencesState {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

/** Key is also read by the inline script in index.html to avoid a theme flash. */
export const PREFERENCES_STORAGE_KEY = "unfoldresearch:preferences";

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      colorMode: "system",
      setColorMode: (colorMode) => set({ colorMode }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ colorMode }) => ({ colorMode }),
    },
  ),
);
