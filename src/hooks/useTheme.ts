import { useState, useEffect, useCallback } from 'react';

import { THEME_STORAGE_KEY } from '@/helpers/constants';

import type { ThemeMode } from '@/helpers/constants';

const getSystemPreference = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getStoredTheme = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }

  return 'system';
};

const applyTheme = (mode: ThemeMode): void => {
  const resolved = mode === 'system' ? getSystemPreference() : mode;

  document.documentElement.classList.toggle('dark', resolved === 'dark');
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => applyTheme('system');

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? getSystemPreference() : theme;

  return { theme, resolvedTheme, setTheme, toggleTheme };
};
