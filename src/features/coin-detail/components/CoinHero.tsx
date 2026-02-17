import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Badge, Skeleton } from '@/components/ui';
import { TEXT_CONTENT } from '@/helpers/constants';
import { formatCurrency } from '@/helpers/utils';

import type { CoinInfo, CoinListingData } from '@/types';

interface CoinHeroProps {
  coinInfo: CoinInfo | undefined;
  quoteData: CoinListingData | undefined;
  currency: string;
  isLoading: boolean;
}

const CoinHeroSkeleton = (): React.JSX.Element => (
  <div className="flex flex-col gap-4">
    <Skeleton variant="text" className="h-4 w-32" />
    <div className="flex items-center gap-4">
      <Skeleton variant="circle" className="h-12 w-12" />
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" className="h-6 w-40" />
        <Skeleton variant="text" className="h-4 w-20" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton variant="text" className="h-8 w-36" />
      <Skeleton variant="text" className="h-5 w-20" />
    </div>
  </div>
);

const CoinHero = ({
  coinInfo,
  quoteData,
  currency,
  isLoading,
}: CoinHeroProps): React.JSX.Element => {
  const navigate = useNavigate();
  const quote = quoteData?.quote[currency];

  if (isLoading) {
    return <CoinHeroSkeleton />;
  }

  if (!coinInfo) return <></>;

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        {TEXT_CONTENT.COIN_DETAIL.BACK}
      </button>

      <div className="flex items-center gap-4">
        <img
          src={coinInfo.logo}
          alt={coinInfo.name}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary">
              {coinInfo.name}
            </h1>
            <span className="text-sm font-medium text-text-secondary">
              {coinInfo.symbol}
            </span>
          </div>
          {quoteData && (
            <span className="inline-block rounded bg-elevated px-1.5 py-0.5 text-xs font-medium text-text-secondary">
              Rank #{quoteData.cmcRank}
            </span>
          )}
        </div>
      </div>

      {quote && (
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-text-primary">
            {formatCurrency(quote.price, currency)}
          </span>
          <Badge value={quote.percentChange24h} />
        </div>
      )}
    </div>
  );
};

export default CoinHero;
