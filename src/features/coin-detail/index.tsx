import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useCoinInfo, useCoinQuotes } from '@/api/hooks';
import { useCurrency } from '@/hooks/useCurrency';
import { ErrorBoundary, ErrorFallback } from '@/components/ui';
import { getCoinCapId } from '@/helpers/utils';
import { TimeRange } from '@/helpers/constants/enums';

import CoinHero from './components/CoinHero';
import TimeRangeSelector from './components/TimeRangeSelector';
import PriceChart from './components/PriceChart';
import CoinStats from './components/CoinStats';

const CoinDetailContent = (): React.JSX.Element => {
  const { coinId } = useParams<{ coinId: string }>();
  const { currency } = useCurrency();
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.WEEK);

  const {
    data: coinInfo,
    isLoading: isInfoLoading,
    isError: isInfoError,
    error: infoError,
    refetch: refetchInfo,
  } = useCoinInfo(coinId);

  const coinIdNum = coinId ? Number(coinId) : 0;
  const coinIds = useMemo(
    () => (coinIdNum > 0 ? [coinIdNum] : []),
    [coinIdNum],
  );

  const {
    data: quotesMap,
    isLoading: isQuotesLoading,
    isError: isQuotesError,
    error: quotesError,
    refetch: refetchQuotes,
  } = useCoinQuotes(coinIds, currency);

  const quoteData = quotesMap?.[String(coinIdNum)];
  const coinCapAssetId = coinInfo ? getCoinCapId(coinInfo.slug) : undefined;
  const isLoading = isInfoLoading || isQuotesLoading;

  if (isInfoError || isQuotesError) {
    const errorMessage =
      infoError?.message ?? quotesError?.message ?? 'Failed to load coin data';
    const handleRetry = () => {
      void refetchInfo();
      void refetchQuotes();
    };

    return (
      <div className="p-4 md:p-6">
        <ErrorFallback message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <CoinHero
          coinInfo={coinInfo}
          quoteData={quoteData}
          currency={currency}
          isLoading={isLoading}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              Price Chart
            </h2>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <PriceChart
              assetId={coinCapAssetId}
              timeRange={timeRange}
              currency={currency}
            />
          </div>
        </div>

        <CoinStats
          quoteData={quoteData}
          currency={currency}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

const CoinDetailPage = (): React.JSX.Element => {
  return (
    <ErrorBoundary>
      <CoinDetailContent />
    </ErrorBoundary>
  );
};

export default CoinDetailPage;
