export const API_CONFIG = {
  CMC: {
    BASE_URL: import.meta.env.VITE_CMC_BASE_URL as string,
    API_KEY: import.meta.env.VITE_CMC_API_KEY as string,
    DEFAULT_PER_PAGE: 100,
    SEARCH_DEBOUNCE_MS: 300,
    POLLING_INTERVAL_MS: 90_000,
    STALE_TIMES: {
      LISTINGS: 90_000,
      QUOTES: 90_000,
      MAP: 24 * 60 * 60_000,
      INFO: 60 * 60_000,
      GLOBAL: 5 * 60_000,
      FIAT_MAP: 24 * 60 * 60_000,
      CATEGORIES: 60 * 60_000,
    },
    RETRY_COUNT: 3,
  },
  COINCAP: {
    BASE_URL: import.meta.env.VITE_COINCAP_BASE_URL as string,
    STALE_TIMES: {
      HISTORY_SHORT: 2 * 60_000,
      HISTORY_LONG: 10 * 60_000,
      ASSET: 5 * 60_000,
    },
    WS_URL: 'wss://ws.coincap.io/prices',
  },
} as const;
