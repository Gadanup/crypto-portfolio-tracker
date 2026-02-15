export const THEME_STORAGE_KEY = 'crypto-tracker-theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];
