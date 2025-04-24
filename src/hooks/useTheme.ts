
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export const useTheme = () => {
  const [appState, appActions] = useAppStore();
  
  useEffect(() => {
    const theme = appState.settings.theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [appState.settings.theme]);

  return {
    theme: appState.settings.theme,
    setTheme: (theme: 'light' | 'dark' | 'system') => {
      appActions.updateSettings({ theme });
    }
  };
};
