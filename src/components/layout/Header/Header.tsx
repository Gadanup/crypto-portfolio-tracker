import { Sun, Moon, Search } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import { useCurrency } from '@/hooks/useCurrency';

import type { SupportedCurrency } from '@/types';

const CURRENCY_OPTIONS: SupportedCurrency[] = ['USD', 'EUR', 'BTC'];

const Header = (): React.JSX.Element => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-tight text-accent">
          CryptoTracker
        </span>
      </div>

      <div className="hidden flex-1 justify-center px-8 md:flex">
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search coins..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={currency}
          onChange={(event) =>
            setCurrency(event.target.value as SupportedCurrency)
          }
          className="h-8 rounded-md border border-border bg-background px-2 text-xs font-medium text-text-primary focus:border-accent focus:outline-none"
          aria-label="Select currency"
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
