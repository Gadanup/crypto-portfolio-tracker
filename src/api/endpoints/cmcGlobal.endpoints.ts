import { cmcClient } from '@/api/cmcClient';
import { mapCmcGlobalData } from '@/helpers/utils';

import type { GlobalMarketData } from '@/types';
import type { RawCmcGlobalData } from '@/helpers/utils/mapApiResponse';

interface RawFiatMapItem {
  id: number;
  name: string;
  sign: string;
  symbol: string;
}

interface RawPriceConversion {
  id: number;
  symbol: string;
  name: string;
  amount: number;
  last_updated: string;
  quote: Record<string, { price: number; last_updated: string }>;
}

export interface FiatMapItem {
  id: number;
  name: string;
  sign: string;
  symbol: string;
}

export interface PriceConversionResult {
  id: number;
  symbol: string;
  name: string;
  amount: number;
  lastUpdated: string;
  quote: Record<string, { price: number; lastUpdated: string }>;
}

export const getGlobalMetrics = async (
  currency: string,
): Promise<GlobalMarketData> => {
  const rawData = await cmcClient.get<RawCmcGlobalData>(
    '/v1/global-metrics/quotes/latest',
    { convert: currency },
  );

  return mapCmcGlobalData(rawData, currency);
};

export const getFiatMap = async (): Promise<FiatMapItem[]> => {
  const rawItems = await cmcClient.get<RawFiatMapItem[]>('/v1/fiat/map');

  return rawItems;
};

export const convertPrice = async (
  amount: number,
  id: number,
  convert: string,
): Promise<PriceConversionResult> => {
  const rawData = await cmcClient.get<RawPriceConversion>(
    '/v1/tools/price-conversion',
    { amount, id, convert },
  );

  return {
    id: rawData.id,
    symbol: rawData.symbol,
    name: rawData.name,
    amount: rawData.amount,
    lastUpdated: rawData.last_updated,
    quote: Object.fromEntries(
      Object.entries(rawData.quote).map(([key, value]) => [
        key,
        { price: value.price, lastUpdated: value.last_updated },
      ]),
    ),
  };
};
