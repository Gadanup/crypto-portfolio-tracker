import { useQuery } from '@tanstack/react-query';

import { getTrendingCoins } from '@/api/endpoints';
import { API_CONFIG, QUERY_KEYS } from '@/helpers/constants';

export const useTrendingCoins = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COINS.TRENDING,
    queryFn: getTrendingCoins,
    staleTime: API_CONFIG.CMC.STALE_TIMES.TRENDING,
  });
};
