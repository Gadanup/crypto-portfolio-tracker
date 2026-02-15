export const QUERY_KEYS = {
  COINS: {
    LISTINGS: (currency: string, page: number, perPage: number) =>
      ['coins', 'listings', currency, page, perPage] as const,
    QUOTES: (coinIds: string) => ['coins', 'quotes', coinIds] as const,
    MAP: ['coins', 'map'] as const,
    INFO: (coinId: string) => ['coins', 'info', coinId] as const,
    CATEGORIES: ['coins', 'categories'] as const,
  },
  CHARTS: {
    HISTORY: (assetId: string, interval: string) =>
      ['charts', 'history', assetId, interval] as const,
  },
  PORTFOLIO: {
    QUOTES: (coinIds: string, currency: string) =>
      ['portfolio', 'quotes', coinIds, currency] as const,
  },
  GLOBAL: ['global'] as const,
  FIAT_MAP: ['fiatMap'] as const,
} as const;
