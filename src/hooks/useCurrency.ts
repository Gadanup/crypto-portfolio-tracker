import { createContext, useContext, useState, useCallback } from 'react';

import type { SupportedCurrency } from '@/types';

const CURRENCY_STORAGE_KEY = 'crypto-tracker-currency';

const DEFAULT_CURRENCY: SupportedCurrency = 'USD';

const getStoredCurrency = (): SupportedCurrency => {
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);

  if (stored === 'USD' || stored === 'EUR' || stored === 'BTC') {
    return stored;
  }

  return DEFAULT_CURRENCY;
};

interface CurrencyContextValue {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const useCurrencyProvider = () => {
  const [currency, setCurrencyState] =
    useState<SupportedCurrency>(getStoredCurrency);

  const setCurrency = useCallback((next: SupportedCurrency) => {
    setCurrencyState(next);
    localStorage.setItem(CURRENCY_STORAGE_KEY, next);
  }, []);

  return { currency, setCurrency };
};

export const useCurrency = (): CurrencyContextValue => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};
