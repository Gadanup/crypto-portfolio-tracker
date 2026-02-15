import { useQuery } from '@tanstack/react-query';

import { getCoinMap } from '@/api/endpoints';
import { API_CONFIG, QUERY_KEYS } from '@/helpers/constants';

export const useCoinMap = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COINS.MAP,
    queryFn: getCoinMap,
    staleTime: API_CONFIG.CMC.STALE_TIMES.MAP,
  });
};
