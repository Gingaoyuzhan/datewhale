import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // 默认浅色主题

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        // 更新 document class
        updateDocumentTheme(newTheme);
      },

      setTheme: (theme) => {
        set({ theme });
        updateDocumentTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // 恢复主题时更新 document class
        if (state?.theme) {
          updateDocumentTheme(state.theme);
        }
      },
    }
  )
);

// 更新 document 的主题 class
function updateDocumentTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

// 初始化主题（在应用启动时调用）
export function initializeTheme() {
  const stored = localStorage.getItem('theme-storage');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      updateDocumentTheme(state.theme || 'light');
    } catch {
      updateDocumentTheme('light');
    }
  } else {
    updateDocumentTheme('light');
  }
}
