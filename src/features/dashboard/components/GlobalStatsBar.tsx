import { useGlobalData } from '@/api/hooks';
import { useCurrency } from '@/hooks/useCurrency';
import { Skeleton } from '@/components/ui';
import {
  formatCurrency,
  formatPercentage,
  formatInteger,
} from '@/helpers/utils';
import { TEXT_CONTENT } from '@/helpers/constants';

interface StatItemProps {
  label: string;
  value: string;
  change?: number;
}

const StatItem = ({
  label,
  value,
  change,
}: StatItemProps): React.JSX.Element => (
  <div className="flex flex-shrink-0 flex-col gap-0.5">
    <span className="text-xs text-text-secondary">{label}</span>
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold text-text-primary">{value}</span>
      {change !== undefined && (
        <span
          className={`text-xs font-medium ${change >= 0 ? 'text-profit' : 'text-loss'}`}
        >
          {formatPercentage(change)}
        </span>
      )}
    </div>
  </div>
);

const StatSkeleton = (): React.JSX.Element => (
  <div className="flex flex-shrink-0 flex-col gap-1">
    <Skeleton variant="text" className="h-3 w-20" />
    <Skeleton variant="text" className="h-4 w-28" />
  </div>
);

const GlobalStatsBar = (): React.JSX.Element => {
  const { currency } = useCurrency();
  const { data, isLoading } = useGlobalData(currency);

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto border-b border-border bg-surface px-4 py-3 md:px-6">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  if (!data) return <></>;

  return (
    <div className="flex gap-6 overflow-x-auto border-b border-border bg-surface px-4 py-3 md:gap-8 md:px-6">
      <StatItem
        label={TEXT_CONTENT.DASHBOARD.GLOBAL_STATS.MARKET_CAP}
        value={formatCurrency(data.totalMarketCap, currency, true)}
        change={data.totalMarketCapYesterdayPercentageChange}
      />
      <StatItem
        label={TEXT_CONTENT.DASHBOARD.GLOBAL_STATS.VOLUME_24H}
        value={formatCurrency(data.totalVolume24h, currency, true)}
        change={data.totalVolume24hYesterdayPercentageChange}
      />
      <StatItem
        label={TEXT_CONTENT.DASHBOARD.GLOBAL_STATS.BTC_DOMINANCE}
        value={`${data.btcDominance.toFixed(1)}%`}
      />
      <StatItem
        label={TEXT_CONTENT.DASHBOARD.GLOBAL_STATS.ACTIVE_COINS}
        value={formatInteger(data.activeCryptocurrencies)}
      />
    </div>
  );
};

export default GlobalStatsBar;
