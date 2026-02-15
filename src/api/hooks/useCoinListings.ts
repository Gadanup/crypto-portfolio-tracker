import { useQuery } from '@tanstack/react-query';

import { getCoinListings } from '@/api/endpoints';
import { API_CONFIG, QUERY_KEYS } from '@/helpers/constants';

export const useCoinListings = (
  currency: string,
  page: number,
  perPage: number,
) => {
  const start = (page - 1) * perPage + 1;

  return useQuery({
    queryKey: QUERY_KEYS.COINS.LISTINGS(currency, page, perPage),
    queryFn: () => getCoinListings(currency, start, perPage),
    staleTime: API_CONFIG.CMC.STALE_TIMES.LISTINGS,
    refetchInterval: API_CONFIG.CMC.POLLING_INTERVAL_MS,
  });
};
