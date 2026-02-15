import { useQuery } from '@tanstack/react-query';

import { getCoinInfo } from '@/api/endpoints';
import { API_CONFIG, QUERY_KEYS } from '@/helpers/constants';

import type { CoinInfo } from '@/types';

export const useCoinInfo = (coinId: string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.COINS.INFO(coinId ?? ''),
    queryFn: async (): Promise<CoinInfo> => {
      const result = await getCoinInfo(coinId!);
      return result[coinId!];
    },
    enabled: !!coinId,
    staleTime: API_CONFIG.CMC.STALE_TIMES.INFO,
  });
};
