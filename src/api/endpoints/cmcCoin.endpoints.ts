import { cmcClient } from '@/api/cmcClient';
import {
  mapCmcListingItem,
  mapCmcMapItem,
  mapCmcCoinInfo,
} from '@/helpers/utils';

import type { CoinListingData, CoinMapItem, CoinInfo } from '@/types';
import type {
  RawCmcListingItem,
  RawCmcMapItem,
  RawCmcCoinInfo,
} from '@/helpers/utils/mapApiResponse';

export const getCoinListings = async (
  currency: string,
  start: number,
  limit: number,
): Promise<CoinListingData[]> => {
  const rawItems = await cmcClient.get<RawCmcListingItem[]>(
    '/v1/cryptocurrency/listings/latest',
    { start, limit, convert: currency },
  );

  return rawItems.map(mapCmcListingItem);
};

export const getCoinQuotes = async (
  ids: string,
  currency: string,
): Promise<Record<string, CoinListingData>> => {
  const rawData = await cmcClient.get<Record<string, RawCmcListingItem>>(
    '/v2/cryptocurrency/quotes/latest',
    { id: ids, convert: currency },
  );

  const mapped: Record<string, CoinListingData> = {};

  Object.entries(rawData).forEach(([key, raw]) => {
    mapped[key] = mapCmcListingItem(raw);
  });

  return mapped;
};

export const getCoinMap = async (): Promise<CoinMapItem[]> => {
  const rawItems = await cmcClient.get<RawCmcMapItem[]>(
    '/v1/cryptocurrency/map',
    { listing_status: 'active', sort: 'cmc_rank' },
  );

  return rawItems.map(mapCmcMapItem);
};

export const getCoinInfo = async (
  ids: string,
): Promise<Record<string, CoinInfo>> => {
  const rawData = await cmcClient.get<Record<string, RawCmcCoinInfo>>(
    '/v2/cryptocurrency/info',
    { id: ids },
  );

  const mapped: Record<string, CoinInfo> = {};

  Object.entries(rawData).forEach(([key, raw]) => {
    mapped[key] = mapCmcCoinInfo(raw);
  });

  return mapped;
};
