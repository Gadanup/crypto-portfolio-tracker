import { useQuery } from '@tanstack/react-query';

import { getCoinQuotes } from '@/api/endpoints';
import { API_CONFIG, QUERY_KEYS } from '@/helpers/constants';

export const useCoinQuotes = (coinIds: number[], currency: string) => {
  const idsString = [...coinIds]
    .sort((first, second) => first - second)
    .join(',');

  return useQuery({
    queryKey: QUERY_KEYS.PORTFOLIO.QUOTES(idsString, currency),
    queryFn: () => getCoinQuotes(idsString, currency),
    enabled: coinIds.length > 0,
    staleTime: API_CONFIG.CMC.STALE_TIMES.QUOTES,
    refetchInterval: API_CONFIG.CMC.POLLING_INTERVAL_MS,
  });
};
