import { Card, Skeleton } from '@/components/ui';
import { TEXT_CONTENT } from '@/helpers/constants';
import { formatCurrency, formatSupply } from '@/helpers/utils';

import type { CoinListingData } from '@/types';

interface CoinStatsProps {
  quoteData: CoinListingData | undefined;
  currency: string;
  isLoading: boolean;
}

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem = ({ label, value }: StatItemProps): React.JSX.Element => (
  <Card>
    <span className="text-xs text-text-secondary">{label}</span>
    <p className="mt-1 text-sm font-semibold text-text-primary">{value}</p>
  </Card>
);

const StatSkeleton = (): React.JSX.Element => (
  <Card>
    <Skeleton variant="text" className="h-3 w-20" />
    <Skeleton variant="text" className="mt-2 h-4 w-28" />
  </Card>
);

const CoinStats = ({
  quoteData,
  currency,
  isLoading,
}: CoinStatsProps): React.JSX.Element => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!quoteData) return <></>;

  const quote = quoteData.quote[currency];
  const labels = TEXT_CONTENT.COIN_DETAIL.STATS;

  const stats: StatItemProps[] = [
    {
      label: labels.MARKET_CAP,
      value: quote ? formatCurrency(quote.marketCap, currency, true) : '—',
    },
    {
      label: labels.VOLUME_24H,
      value: quote ? formatCurrency(quote.volume24h, currency, true) : '—',
    },
    {
      label: labels.CIRCULATING_SUPPLY,
      value: `${formatSupply(quoteData.circulatingSupply)} ${quoteData.symbol}`,
    },
    {
      label: labels.TOTAL_SUPPLY,
      value: quoteData.totalSupply
        ? `${formatSupply(quoteData.totalSupply)} ${quoteData.symbol}`
        : '—',
    },
    {
      label: labels.MAX_SUPPLY,
      value: quoteData.maxSupply
        ? `${formatSupply(quoteData.maxSupply)} ${quoteData.symbol}`
        : '∞',
    },
    {
      label: labels.RANK,
      value: `#${quoteData.cmcRank}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatItem key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
};

export default CoinStats;
