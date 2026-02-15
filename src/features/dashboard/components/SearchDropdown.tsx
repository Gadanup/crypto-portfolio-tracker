import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCoinMap } from '@/api/hooks';
import { useDebounce } from '@/hooks';
import { SearchInput } from '@/components/ui';
import { buildCoinDetailPath, API_CONFIG } from '@/helpers/constants';

import type { CoinMapItem } from '@/types';

const MAX_RESULTS = 8;
const CMC_LOGO_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64';

const SearchDropdown = (): React.JSX.Element => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, API_CONFIG.CMC.SEARCH_DEBOUNCE_MS);
  const { data: coinMap, isLoading: isMapLoading } = useCoinMap();

  const results: CoinMapItem[] = useMemo(() => {
    if (!coinMap || !debouncedQuery.trim()) return [];

    const lowerQuery = debouncedQuery.toLowerCase();

    return coinMap
      .filter(
        (coin) =>
          coin.isActive === 1 &&
          (coin.name.toLowerCase().includes(lowerQuery) ||
            coin.symbol.toLowerCase().includes(lowerQuery)),
      )
      .sort((coinA, coinB) => coinA.rank - coinB.rank)
      .slice(0, MAX_RESULTS);
  }, [coinMap, debouncedQuery]);

  const isSearching = query !== debouncedQuery;
  const showDropdown = isOpen && debouncedQuery.trim().length > 0;

  const selectCoin = useCallback(
    (coin: CoinMapItem) => {
      navigate(buildCoinDetailPath(String(coin.id)));
      setQuery('');
      setIsOpen(false);
      setHighlightIndex(-1);
    },
    [navigate],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightIndex((previous) =>
            previous < results.length - 1 ? previous + 1 : 0,
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightIndex((previous) =>
            previous > 0 ? previous - 1 : results.length - 1,
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightIndex >= 0 && results[highlightIndex]) {
            selectCoin(results[highlightIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setHighlightIndex(-1);
          break;
      }
    },
    [showDropdown, highlightIndex, results, selectCoin],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value);
          setIsOpen(true);
          setHighlightIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        isLoading={isSearching || isMapLoading}
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {results.length === 0 && !isSearching && (
            <div className="px-4 py-6 text-center text-sm text-text-secondary">
              No results found
            </div>
          )}
          {results.map((coin, index) => (
            <button
              key={coin.id}
              onClick={() => selectCoin(coin)}
              onMouseEnter={() => setHighlightIndex(index)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                index === highlightIndex
                  ? 'bg-elevated'
                  : 'hover:bg-elevated/50'
              }`}
            >
              <img
                src={`${CMC_LOGO_URL}/${coin.id}.png`}
                alt={coin.name}
                className="h-6 w-6 rounded-full"
                loading="lazy"
              />
              <div className="flex flex-1 items-center gap-2">
                <span className="text-sm font-medium text-text-primary">
                  {coin.name}
                </span>
                <span className="text-xs text-text-secondary">
                  {coin.symbol}
                </span>
              </div>
              <span className="text-xs text-text-secondary">#{coin.rank}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
