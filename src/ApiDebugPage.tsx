import { useState } from 'react';

import {
  useCoinListings,
  useCoinMap,
  useGlobalData,
  useTrendingCoins,
  useCoinInfo,
  usePriceHistory,
} from '@/api/hooks';
import { TimeRange } from '@/helpers/constants/enums';

const Section = ({
  title,
  isLoading,
  isError,
  error,
  children,
}: {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  children: React.ReactNode;
}) => (
  <div className="mb-6 rounded-lg bg-surface p-4">
    <h2 className="mb-2 text-lg font-semibold text-accent">{title}</h2>
    {isLoading && <p className="text-text-secondary">Loading...</p>}
    {isError && (
      <p className="text-loss">Error: {error?.message ?? 'Unknown error'}</p>
    )}
    {!isLoading && !isError && children}
  </div>
);

const ApiDebugPage = (): React.JSX.Element => {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.DAY);

  const listings = useCoinListings('USD', 1, 10);
  const coinMap = useCoinMap();
  const globalData = useGlobalData('USD');
  const trending = useTrendingCoins();
  const bitcoinInfo = useCoinInfo('1');
  const bitcoinHistory = usePriceHistory('bitcoin', timeRange);

  return (
    <div className="min-h-screen bg-background p-6 text-text-primary">
      <h1 className="mb-6 text-2xl font-bold text-accent">
        API Debug Page — Phase 1.6
      </h1>
      <p className="mb-6 text-text-secondary">
        Open React Query DevTools (flower icon bottom-right) and the browser
        Network tab to inspect requests.
      </p>

      <Section
        title="1. Coin Listings (top 10, USD)"
        isLoading={listings.isLoading}
        isError={listings.isError}
        error={listings.error}
      >
        <p className="mb-2 text-sm text-text-secondary">
          {listings.data?.length} coins loaded. Polling every 90s.
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-elevated text-left text-text-secondary">
              <th className="py-1">#</th>
              <th className="py-1">Name</th>
              <th className="py-1">Price</th>
              <th className="py-1">24h %</th>
              <th className="py-1">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {listings.data?.map((coin) => {
              const usdQuote = coin.quote['USD'];
              return (
                <tr key={coin.id} className="border-b border-elevated">
                  <td className="py-1">{coin.cmcRank}</td>
                  <td className="py-1">
                    {coin.name} ({coin.symbol})
                  </td>
                  <td className="py-1">
                    $
                    {usdQuote?.price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={`py-1 ${(usdQuote?.percentChange24h ?? 0) >= 0 ? 'text-profit' : 'text-loss'}`}
                  >
                    {usdQuote?.percentChange24h.toFixed(2)}%
                  </td>
                  <td className="py-1">
                    $
                    {usdQuote?.marketCap.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section
        title="2. Coin Map (for search)"
        isLoading={coinMap.isLoading}
        isError={coinMap.isError}
        error={coinMap.error}
      >
        <p className="text-sm text-text-secondary">
          {coinMap.data?.length} coins in map (cached 24h). First 5:{' '}
          {coinMap.data
            ?.slice(0, 5)
            .map((coin) => `${coin.name} (${coin.symbol})`)
            .join(', ')}
        </p>
      </Section>

      <Section
        title="3. Global Market Data"
        isLoading={globalData.isLoading}
        isError={globalData.isError}
        error={globalData.error}
      >
        {globalData.data && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Total Market Cap: $
              {globalData.data.totalMarketCap.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div>
              24h Volume: $
              {globalData.data.totalVolume24h.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div>BTC Dominance: {globalData.data.btcDominance.toFixed(2)}%</div>
            <div>ETH Dominance: {globalData.data.ethDominance.toFixed(2)}%</div>
            <div>Active Cryptos: {globalData.data.activeCryptocurrencies}</div>
            <div>Active Exchanges: {globalData.data.activeExchanges}</div>
          </div>
        )}
      </Section>

      <Section
        title="4. Trending Coins"
        isLoading={trending.isLoading}
        isError={trending.isError}
        error={trending.error}
      >
        <p className="text-sm text-text-secondary">
          {trending.data?.length} trending coins:{' '}
          {trending.data
            ?.slice(0, 5)
            .map((coin) => `${coin.name} (${coin.symbol})`)
            .join(', ')}
        </p>
      </Section>

      <Section
        title="5. Coin Info — Bitcoin"
        isLoading={bitcoinInfo.isLoading}
        isError={bitcoinInfo.isError}
        error={bitcoinInfo.error}
      >
        {bitcoinInfo.data && (
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <img
                src={bitcoinInfo.data.logo}
                alt={bitcoinInfo.data.name}
                className="h-8 w-8"
              />
              <span className="font-semibold">{bitcoinInfo.data.name}</span>
              <span className="text-text-secondary">
                ({bitcoinInfo.data.symbol})
              </span>
            </div>
            <p className="mt-1 text-text-secondary">
              Category: {bitcoinInfo.data.category} | Tags:{' '}
              {bitcoinInfo.data.tags.slice(0, 3).join(', ')}
            </p>
            <p className="mt-1 text-text-secondary">
              Description: {bitcoinInfo.data.description.slice(0, 150)}...
            </p>
          </div>
        )}
      </Section>

      <Section
        title="6. Price History — Bitcoin (CoinCap)"
        isLoading={bitcoinHistory.isLoading}
        isError={bitcoinHistory.isError}
        error={bitcoinHistory.error}
      >
        <div className="mb-2 flex gap-2">
          {Object.entries(TimeRange).map(([label, value]) => (
            <button
              key={value}
              onClick={() => setTimeRange(value)}
              className={`rounded px-3 py-1 text-sm ${
                timeRange === value
                  ? 'bg-accent text-background'
                  : 'bg-elevated text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm text-text-secondary">
          {bitcoinHistory.data?.length} data points loaded for interval:{' '}
          {timeRange}d
        </p>
        {bitcoinHistory.data && bitcoinHistory.data.length > 0 && (
          <p className="mt-1 text-sm text-text-secondary">
            Latest price: $
            {parseFloat(
              bitcoinHistory.data[bitcoinHistory.data.length - 1].priceUsd,
            ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            {' | '}
            Earliest: $
            {parseFloat(bitcoinHistory.data[0].priceUsd).toLocaleString(
              undefined,
              { maximumFractionDigits: 2 },
            )}
          </p>
        )}
      </Section>
    </div>
  );
};

export default ApiDebugPage;
