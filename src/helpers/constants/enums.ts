export enum CoinCapInterval {
  FIVE_MIN = 'm5',
  FIFTEEN_MIN = 'm15',
  ONE_HOUR = 'h1',
  SIX_HOUR = 'h6',
  ONE_DAY = 'd1',
}

export enum TimeRange {
  DAY = '1',
  WEEK = '7',
  MONTH = '30',
  THREE_MONTHS = '90',
  YEAR = '365',
}

export const TIME_RANGE_TO_COINCAP_INTERVAL: Record<
  TimeRange,
  CoinCapInterval
> = {
  [TimeRange.DAY]: CoinCapInterval.FIVE_MIN,
  [TimeRange.WEEK]: CoinCapInterval.FIFTEEN_MIN,
  [TimeRange.MONTH]: CoinCapInterval.ONE_HOUR,
  [TimeRange.THREE_MONTHS]: CoinCapInterval.SIX_HOUR,
  [TimeRange.YEAR]: CoinCapInterval.ONE_DAY,
};

export enum SortColumn {
  RANK = 'cmcRank',
  NAME = 'name',
  PRICE = 'price',
  CHANGE_1H = 'percentChange1h',
  CHANGE_24H = 'percentChange24h',
  CHANGE_7D = 'percentChange7d',
  MARKET_CAP = 'marketCap',
  VOLUME = 'volume24h',
}

export enum RoutePath {
  DASHBOARD = '/',
  COIN_DETAIL = '/coin/:coinId',
  PORTFOLIO = '/portfolio',
  ALERTS = '/alerts',
}
