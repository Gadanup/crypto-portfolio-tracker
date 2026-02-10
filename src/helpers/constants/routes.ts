export const ROUTES = {
  DASHBOARD: '/',
  COIN_DETAIL: '/coin/:coinId',
  PORTFOLIO: '/portfolio',
  ALERTS: '/alerts',
} as const;

export const buildCoinDetailPath = (coinId: string): string =>
  `/coin/${coinId}`;
