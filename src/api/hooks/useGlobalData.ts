import { useQuery } from '@tanstack/react-query';

import { getGlobalMetrics } from '@/api/endpoints';
import { API_CONFIG, QUERY_KEYS } from '@/helpers/constants';

export const useGlobalData = (currency: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.GLOBAL,
    queryFn: () => getGlobalMetrics(currency),
    staleTime: API_CONFIG.CMC.STALE_TIMES.GLOBAL,
  });
};
