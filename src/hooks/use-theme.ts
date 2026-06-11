import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let stored: Theme = 'system';
    try {
      stored = (localStorage.getItem('theme') as Theme) || 'system';
    } catch {
      // localStorage unavailable (private browsing, etc.)
      stored = 'system';
    }
    setThemeState(stored);

    const applyTheme = (themeToApply: Theme) => {
      const isDarkMode =
        themeToApply === 'dark' ||
        (themeToApply === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setIsDark(isDarkMode);
    };

    applyTheme(stored);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (stored === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const isDarkMode =
      newTheme === 'dark' ||
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsDark(isDarkMode);
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  };
}
