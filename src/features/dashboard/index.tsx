import { ErrorBoundary } from '@/components/ui';

import GlobalStatsBar from './components/GlobalStatsBar';
import CoinTable from './components/CoinTable';

const DashboardPage = (): React.JSX.Element => {
  return (
    <ErrorBoundary>
      <div>
        <GlobalStatsBar />
        <div className="p-4 md:p-6">
          <CoinTable />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardPage;
