import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RoutePath } from '@/helpers/constants/enums';

const DashboardPage = lazy(() => import('@/features/dashboard'));
const CoinDetailPage = lazy(() => import('@/features/coin-detail'));
const PortfolioPage = lazy(() => import('@/features/portfolio'));
const AlertsPage = lazy(() => import('@/features/alerts'));
const NotFoundPage = lazy(() => import('@/features/NotFoundPage'));

const PageLoader = (): React.JSX.Element => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-elevated border-t-accent" />
  </div>
);

const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={RoutePath.DASHBOARD} element={<DashboardPage />} />
          <Route path={RoutePath.COIN_DETAIL} element={<CoinDetailPage />} />
          <Route path={RoutePath.PORTFOLIO} element={<PortfolioPage />} />
          <Route path={RoutePath.ALERTS} element={<AlertsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
