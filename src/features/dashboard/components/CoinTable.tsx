import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

import { useCoinListings } from '@/api/hooks';
import { useCurrency } from '@/hooks/useCurrency';
import { ErrorFallback, Pagination } from '@/components/ui';
import { TEXT_CONTENT } from '@/helpers/constants';

import CoinTableRow from './CoinTableRow';
import CoinTableSkeleton from './CoinTableSkeleton';

import type { CoinListingData } from '@/types';

type SortKey =
  | 'rank'
  | 'name'
  | 'price'
  | 'change24h'
  | 'change7d'
  | 'marketCap'
  | 'volume';
type SortDirection = 'asc' | 'desc';

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

const TOTAL_COINS = 500;
const DEFAULT_PER_PAGE = 50;

const HEADERS: {
  key: SortKey;
  label: string;
  className: string;
  sortable: boolean;
}[] = [
  { key: 'rank', label: '#', className: 'text-left', sortable: true },
  {
    key: 'name',
    label: TEXT_CONTENT.DASHBOARD.TABLE.COIN,
    className: 'text-left',
    sortable: true,
  },
  {
    key: 'price',
    label: TEXT_CONTENT.DASHBOARD.TABLE.PRICE,
    className: 'text-right',
    sortable: true,
  },
  {
    key: 'change24h',
    label: TEXT_CONTENT.DASHBOARD.TABLE.CHANGE_24H,
    className: 'text-right',
    sortable: true,
  },
  {
    key: 'change7d',
    label: TEXT_CONTENT.DASHBOARD.TABLE.CHANGE_7D,
    className: 'hidden text-right md:table-cell',
    sortable: true,
  },
  {
    key: 'marketCap',
    label: TEXT_CONTENT.DASHBOARD.TABLE.MARKET_CAP,
    className: 'hidden text-right lg:table-cell',
    sortable: true,
  },
  {
    key: 'volume',
    label: TEXT_CONTENT.DASHBOARD.TABLE.VOLUME_24H,
    className: 'hidden text-right xl:table-cell',
    sortable: true,
  },
];

const getSortValue = (
  coin: CoinListingData,
  key: SortKey,
  currency: string,
): number | string => {
  const quote = coin.quote[currency];

  switch (key) {
    case 'rank':
      return coin.cmcRank;
    case 'name':
      return coin.name.toLowerCase();
    case 'price':
      return quote?.price ?? 0;
    case 'change24h':
      return quote?.percentChange24h ?? 0;
    case 'change7d':
      return quote?.percentChange7d ?? 0;
    case 'marketCap':
      return quote?.marketCap ?? 0;
    case 'volume':
      return quote?.volume24h ?? 0;
  }
};

const CoinTable = (): React.JSX.Element => {
  const { currency } = useCurrency();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [sort, setSort] = useState<SortState>({
    key: 'rank',
    direction: 'asc',
  });

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCoinListings(currency, page, perPage);

  const totalPages = Math.ceil(TOTAL_COINS / perPage);

  const handleSort = (key: SortKey) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSort({ key: 'rank', direction: 'asc' });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    setSort({ key: 'rank', direction: 'asc' });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((coinA, coinB) => {
      const valueA = getSortValue(coinA, sort.key, currency);
      const valueB = getSortValue(coinB, sort.key, currency);

      const comparison =
        typeof valueA === 'string' && typeof valueB === 'string'
          ? valueA.localeCompare(valueB)
          : (valueA as number) - (valueB as number);

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sort, currency]);

  const SortIcon = sort.direction === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border">
              {HEADERS.map((header) => (
                <th
                  key={header.key}
                  onClick={
                    header.sortable ? () => handleSort(header.key) : undefined
                  }
                  className={`px-3 py-2.5 text-xs font-medium text-text-secondary ${header.className} ${header.sortable ? 'cursor-pointer select-none hover:text-text-primary' : ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {header.label}
                    {sort.key === header.key && (
                      <SortIcon size={12} className="text-accent" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isFetching && !isLoading ? 'opacity-60' : ''}>
            {isLoading && <CoinTableSkeleton />}
            {isError && (
              <tr>
                <td colSpan={HEADERS.length}>
                  <ErrorFallback
                    message={error?.message}
                    onRetry={() => void refetch()}
                  />
                </td>
              </tr>
            )}
            {sortedData.map((coin) => (
              <CoinTableRow key={coin.id} coin={coin} currency={currency} />
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && !isError && (
        <div className="border-t border-border px-3">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CoinTable;
