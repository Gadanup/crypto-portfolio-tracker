import { useQuery } from '@tanstack/react-query';

import { getAssetHistory } from '@/api/endpoints';
import { API_CONFIG, QUERY_KEYS, CoinCapInterval } from '@/helpers/constants';
import { buildCoinCapHistoryParams } from '@/helpers/utils';

import type { TimeRange } from '@/helpers/constants/enums';
import { TIME_RANGE_TO_COINCAP_INTERVAL } from '@/helpers/constants/enums';

const DAYS_MAP: Record<TimeRange, number> = {
  '1': 1,
  '7': 7,
  '30': 30,
  '90': 90,
  '365': 365,
};

const getStaleTime = (interval: CoinCapInterval): number => {
  const shortIntervals: CoinCapInterval[] = [
    CoinCapInterval.FIVE_MIN,
    CoinCapInterval.FIFTEEN_MIN,
  ];

  if (shortIntervals.includes(interval)) {
    return API_CONFIG.COINCAP.STALE_TIMES.HISTORY_SHORT;
  }

  return API_CONFIG.COINCAP.STALE_TIMES.HISTORY_LONG;
};

export const usePriceHistory = (
  assetId: string | undefined,
  timeRange: TimeRange,
) => {
  const interval = TIME_RANGE_TO_COINCAP_INTERVAL[timeRange];
  const days = DAYS_MAP[timeRange];
  const { start, end } = buildCoinCapHistoryParams(interval, days);

  return useQuery({
    queryKey: QUERY_KEYS.CHARTS.HISTORY(assetId ?? '', interval),
    queryFn: () => getAssetHistory(assetId!, interval, start, end),
    enabled: !!assetId,
    staleTime: getStaleTime(interval),
  });
};
