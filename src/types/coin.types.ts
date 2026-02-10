export interface CoinListingData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmcRank: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  dateAdded: string;
  tags: string[];
  quote: Record<string, CoinQuote>;
}

export interface CoinQuote {
  price: number;
  volume24h: number;
  volumeChange24h: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  percentChange30d: number;
  marketCap: number;
  marketCapDominance: number;
  fullyDilutedMarketCap: number;
  lastUpdated: string;
}

export interface CoinMapItem {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  rank: number;
  isActive: number;
  firstHistoricalData: string;
  lastHistoricalData: string;
  platform: CoinPlatform | null;
}

export interface CoinPlatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  tokenAddress: string;
}

export interface CoinInfo {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  category: string;
  description: string;
  dateAdded: string;
  dateLaunched: string | null;
  tags: string[];
  logo: string;
  urls: CoinUrls;
}

export interface CoinUrls {
  website: string[];
  technicalDoc: string[];
  twitter: string[];
  reddit: string[];
  messageBoard: string[];
  chat: string[];
  explorer: string[];
  sourceCode: string[];
}

export interface TrendingCoin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmcRank: number;
  quote: Record<string, CoinQuote>;
}

export interface CoinCapHistoryPoint {
  priceUsd: string;
  time: number;
  date: string;
}

export interface CoinCapAsset {
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

export interface GlobalMarketData {
  activeCryptocurrencies: number;
  totalCryptocurrencies: number;
  activeMarketPairs: number;
  activeExchanges: number;
  btcDominance: number;
  ethDominance: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalMarketCapYesterdayPercentageChange: number;
  totalVolume24hYesterdayPercentageChange: number;
  lastUpdated: string;
}
