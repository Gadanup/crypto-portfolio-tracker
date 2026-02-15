import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui';
import { buildCoinDetailPath } from '@/helpers/constants';
import { formatCurrency } from '@/helpers/utils';

import type { CoinListingData } from '@/types';

interface CoinTableRowProps {
  coin: CoinListingData;
  currency: string;
}

const CMC_LOGO_URL = 'https://s2.coinmarketcap.com/static/img/coins/64x64';

const CoinTableRow = ({
  coin,
  currency,
}: CoinTableRowProps): React.JSX.Element => {
  const navigate = useNavigate();
  const quote = coin.quote[currency];

  const handleClick = () => {
    navigate(buildCoinDetailPath(String(coin.id)));
  };

  return (
    <tr
      onClick={handleClick}
      className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-elevated/50"
    >
      <td className="px-3 py-3 text-sm text-text-secondary">{coin.cmcRank}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <img
            src={`${CMC_LOGO_URL}/${coin.id}.png`}
            alt={coin.name}
            className="h-7 w-7 rounded-full"
            loading="lazy"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              {coin.name}
            </span>
            <span className="text-xs text-text-secondary">{coin.symbol}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-right text-sm font-medium text-text-primary">
        {quote ? formatCurrency(quote.price, currency) : '—'}
      </td>
      <td className="px-3 py-3 text-right">
        {quote ? <Badge value={quote.percentChange24h} /> : '—'}
      </td>
      <td className="hidden px-3 py-3 text-right md:table-cell">
        {quote ? <Badge value={quote.percentChange7d} /> : '—'}
      </td>
      <td className="hidden px-3 py-3 text-right text-sm text-text-primary lg:table-cell">
        {quote ? formatCurrency(quote.marketCap, currency, true) : '—'}
      </td>
      <td className="hidden px-3 py-3 text-right text-sm text-text-secondary xl:table-cell">
        {quote ? formatCurrency(quote.volume24h, currency, true) : '—'}
      </td>
    </tr>
  );
};

export default CoinTableRow;
