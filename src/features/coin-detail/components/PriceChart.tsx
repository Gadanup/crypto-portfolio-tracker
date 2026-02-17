import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { usePriceHistory } from '@/api/hooks';
import { Skeleton } from '@/components/ui';
import { formatCurrency } from '@/helpers/utils';
import { TimeRange } from '@/helpers/constants/enums';

interface PriceChartProps {
  assetId: string | undefined;
  timeRange: TimeRange;
  currency: string;
}

interface ChartPoint {
  timestamp: number;
  price: number;
}

const formatXAxisTick = (timestamp: number, timeRange: TimeRange): string => {
  const date = new Date(timestamp);

  if (timeRange === TimeRange.DAY) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  if (timeRange === TimeRange.YEAR) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatTooltipDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const ChartSkeleton = (): React.JSX.Element => (
  <Skeleton variant="rectangle" className="h-[300px] w-full rounded-lg" />
);

const PriceChart = ({
  assetId,
  timeRange,
  currency,
}: PriceChartProps): React.JSX.Element => {
  const {
    data: historyData,
    isLoading,
    isError,
  } = usePriceHistory(assetId, timeRange);

  const chartData: ChartPoint[] = useMemo(() => {
    if (!historyData) return [];

    return historyData.map((point) => ({
      timestamp: point.time,
      price: parseFloat(point.priceUsd),
    }));
  }, [historyData]);

  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].price >= chartData[0].price;
  }, [chartData]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError || chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-text-secondary">
        {isError
          ? 'Failed to load chart data. Please try again later.'
          : 'No chart data available'}
      </div>
    );
  }

  const strokeColor = isPositive ? 'var(--color-profit)' : 'var(--color-loss)';
  const gradientId = isPositive ? 'chartGradientGreen' : 'chartGradientRed';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(tick: number) => formatXAxisTick(tick, timeRange)}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
          minTickGap={40}
        />
        <YAxis domain={['auto', 'auto']} hide />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const point = payload[0].payload as ChartPoint;
            return (
              <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-lg">
                <p className="text-xs text-text-secondary">
                  {formatTooltipDate(point.timestamp)}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(point.price, currency)}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{
            r: 4,
            fill: strokeColor,
            stroke: 'var(--color-surface)',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
