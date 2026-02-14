import { coinCapClient } from '@/api/coinCapClient';
import { mapCoinCapHistoryPoint, mapCoinCapAsset } from '@/helpers/utils';

import type { CoinCapHistoryPoint, CoinCapAsset } from '@/types';
import type {
  RawCoinCapHistoryPoint,
  RawCoinCapAsset,
} from '@/helpers/utils/mapApiResponse';

export const getAssetHistory = async (
  assetId: string,
  interval: string,
  start?: number,
  end?: number,
): Promise<CoinCapHistoryPoint[]> => {
  const params: Record<string, string | number | boolean> = { interval };

  if (start !== undefined) {
    params.start = start;
  }

  if (end !== undefined) {
    params.end = end;
  }

  const rawItems = await coinCapClient.get<RawCoinCapHistoryPoint[]>(
    `/assets/${assetId}/history`,
    params,
  );

  return rawItems.map(mapCoinCapHistoryPoint);
};

export const getAsset = async (assetId: string): Promise<CoinCapAsset> => {
  const rawData = await coinCapClient.get<RawCoinCapAsset>(
    `/assets/${assetId}`,
  );

  return mapCoinCapAsset(rawData);
};

export const getAssets = async (
  limit: number = 100,
): Promise<CoinCapAsset[]> => {
  const rawItems = await coinCapClient.get<RawCoinCapAsset[]>('/assets', {
    limit,
  });

  return rawItems.map(mapCoinCapAsset);
};
