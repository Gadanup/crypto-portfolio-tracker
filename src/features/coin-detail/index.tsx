import { useParams } from 'react-router-dom';

const CoinDetailPage = (): React.JSX.Element => {
  const { coinId } = useParams<{ coinId: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary">Coin Detail</h1>
      <p className="mt-2 text-text-secondary">
        Viewing details for coin ID: {coinId}
      </p>
    </div>
  );
};

export default CoinDetailPage;
