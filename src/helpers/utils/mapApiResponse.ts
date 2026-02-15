import type {
  CoinListingData,
  CoinQuote,
  CoinMapItem,
  CoinInfo,
  CoinUrls,
  CoinPlatform,
  GlobalMarketData,
  CoinCapHistoryPoint,
  CoinCapAsset,
} from '@/types';

// ─── Raw CMC Response Interfaces (snake_case) ──────────────────────────

interface RawCmcQuote {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
}

export interface RawCmcListingItem {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  date_added: string;
  tags: string[];
  quote: Record<string, RawCmcQuote>;
}

export interface RawCmcMapItem {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  rank: number;
  is_active: number;
  first_historical_data: string;
  last_historical_data: string;
  platform: RawCmcPlatform | null;
}

interface RawCmcPlatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

export interface RawCmcCoinInfo {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  category: string;
  description: string;
  date_added: string;
  date_launched: string | null;
  tags: string[];
  logo: string;
  urls: RawCmcCoinUrls;
}

interface RawCmcCoinUrls {
  website: string[];
  technical_doc: string[];
  twitter: string[];
  reddit: string[];
  message_board: string[];
  chat: string[];
  explorer: string[];
  source_code: string[];
}

export interface RawCmcGlobalData {
  active_cryptocurrencies: number;
  total_cryptocurrencies: number;
  active_market_pairs: number;
  active_exchanges: number;
  btc_dominance: number;
  eth_dominance: number;
  quote: Record<
    string,
    {
      total_market_cap: number;
      total_volume_24h: number;
      total_market_cap_yesterday_percentage_change: number;
      total_volume_24h_yesterday_percentage_change: number;
      last_updated: string;
    }
  >;
}

// ─── Raw CoinCap Response Interfaces ────────────────────────────────────

export interface RawCoinCapHistoryPoint {
  priceUsd: string;
  time: number;
  date: string;
}

export interface RawCoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

// ─── CMC Mappers ────────────────────────────────────────────────────────

const mapCmcQuote = (raw: RawCmcQuote): CoinQuote => ({
  price: raw.price,
  volume24h: raw.volume_24h,
  volumeChange24h: raw.volume_change_24h,
  percentChange1h: raw.percent_change_1h,
  percentChange24h: raw.percent_change_24h,
  percentChange7d: raw.percent_change_7d,
  percentChange30d: raw.percent_change_30d,
  marketCap: raw.market_cap,
  marketCapDominance: raw.market_cap_dominance,
  fullyDilutedMarketCap: raw.fully_diluted_market_cap,
  lastUpdated: raw.last_updated,
});

const mapCmcQuoteRecord = (
  raw: Record<string, RawCmcQuote>,
): Record<string, CoinQuote> => {
  const mapped: Record<string, CoinQuote> = {};

  Object.entries(raw).forEach(([currency, quote]) => {
    mapped[currency] = mapCmcQuote(quote);
  });

  return mapped;
};

export const mapCmcListingItem = (raw: RawCmcListingItem): CoinListingData => ({
  id: raw.id,
  name: raw.name,
  symbol: raw.symbol,
  slug: raw.slug,
  cmcRank: raw.cmc_rank,
  circulatingSupply: raw.circulating_supply,
  totalSupply: raw.total_supply,
  maxSupply: raw.max_supply,
  dateAdded: raw.date_added,
  tags: raw.tags,
  quote: mapCmcQuoteRecord(raw.quote),
});

const mapCmcPlatform = (raw: RawCmcPlatform): CoinPlatform => ({
  id: raw.id,
  name: raw.name,
  symbol: raw.symbol,
  slug: raw.slug,
  tokenAddress: raw.token_address,
});

export const mapCmcMapItem = (raw: RawCmcMapItem): CoinMapItem => ({
  id: raw.id,
  name: raw.name,
  symbol: raw.symbol,
  slug: raw.slug,
  rank: raw.rank,
  isActive: raw.is_active,
  firstHistoricalData: raw.first_historical_data,
  lastHistoricalData: raw.last_historical_data,
  platform: raw.platform ? mapCmcPlatform(raw.platform) : null,
});

const mapCmcCoinUrls = (raw: RawCmcCoinUrls): CoinUrls => ({
  website: raw.website,
  technicalDoc: raw.technical_doc,
  twitter: raw.twitter,
  reddit: raw.reddit,
  messageBoard: raw.message_board,
  chat: raw.chat,
  explorer: raw.explorer,
  sourceCode: raw.source_code,
});

export const mapCmcCoinInfo = (raw: RawCmcCoinInfo): CoinInfo => ({
  id: raw.id,
  name: raw.name,
  symbol: raw.symbol,
  slug: raw.slug,
  category: raw.category,
  description: raw.description,
  dateAdded: raw.date_added,
  dateLaunched: raw.date_launched,
  tags: raw.tags,
  logo: raw.logo,
  urls: mapCmcCoinUrls(raw.urls),
});

export const mapCmcGlobalData = (
  raw: RawCmcGlobalData,
  currency: string,
): GlobalMarketData => {
  const currencyQuote = raw.quote[currency];

  return {
    activeCryptocurrencies: raw.active_cryptocurrencies,
    totalCryptocurrencies: raw.total_cryptocurrencies,
    activeMarketPairs: raw.active_market_pairs,
    activeExchanges: raw.active_exchanges,
    btcDominance: raw.btc_dominance,
    ethDominance: raw.eth_dominance,
    totalMarketCap: currencyQuote.total_market_cap,
    totalVolume24h: currencyQuote.total_volume_24h,
    totalMarketCapYesterdayPercentageChange:
      currencyQuote.total_market_cap_yesterday_percentage_change,
    totalVolume24hYesterdayPercentageChange:
      currencyQuote.total_volume_24h_yesterday_percentage_change,
    lastUpdated: currencyQuote.last_updated,
  };
};

// ─── CoinCap Mappers ────────────────────────────────────────────────────

export const mapCoinCapHistoryPoint = (
  raw: RawCoinCapHistoryPoint,
): CoinCapHistoryPoint => ({
  priceUsd: raw.priceUsd,
  time: raw.time,
  date: raw.date,
});

export const mapCoinCapAsset = (raw: RawCoinCapAsset): CoinCapAsset => ({
  id: raw.id,
  rank: raw.rank,
  symbol: raw.symbol,
  name: raw.name,
  supply: raw.supply,
  maxSupply: raw.maxSupply,
  marketCapUsd: raw.marketCapUsd,
  volumeUsd24Hr: raw.volumeUsd24Hr,
  priceUsd: raw.priceUsd,
  changePercent24Hr: raw.changePercent24Hr,
  vwap24Hr: raw.vwap24Hr,
});
