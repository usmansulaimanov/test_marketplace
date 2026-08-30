import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const applyThemeClass = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Базовый режим тёмный
      toggleTheme: () => {
        const nextTheme: Theme = get().theme === 'light' ? 'dark' : 'light';
        applyThemeClass(nextTheme);
        set({ theme: nextTheme });
      },
      setTheme: (theme: Theme) => {
        applyThemeClass(theme);
        set({ theme });
      },
    }),
    {
      name: 'kitapall-theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeClass(state.theme);
        }
      },
    }
  )
);
