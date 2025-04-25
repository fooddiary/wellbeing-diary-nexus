
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export const useTheme = () => {
  const [appState, appActions] = useAppStore();
  
  // Функция для применения темы
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
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
  };
  
  useEffect(() => {
    // Применяем тему при загрузке компонента
    applyTheme(appState.settings.theme);
    
    // Добавляем слушатель для системных изменений темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (appState.settings.theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [appState.settings.theme]);

  return {
    theme: appState.settings.theme,
    setTheme: (theme: 'light' | 'dark' | 'system') => {
      appActions.updateSettings({ theme });
    }
  };
};
