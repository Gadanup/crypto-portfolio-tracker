import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppLayout } from '@/components/layout';
import { RoutePath } from '@/helpers/constants/enums';

const DashboardPage = lazy(() => import('@/features/dashboard'));
const CoinDetailPage = lazy(() => import('@/features/coin-detail'));
const PortfolioPage = lazy(() => import('@/features/portfolio'));
const AlertsPage = lazy(() => import('@/features/alerts'));
const NotFoundPage = lazy(() => import('@/features/NotFoundPage'));

const PageLoader = (): React.JSX.Element => (
  <div className="flex h-full min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-elevated border-t-accent" />
  </div>
);

const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path={RoutePath.DASHBOARD}
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path={RoutePath.COIN_DETAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <CoinDetailPage />
              </Suspense>
            }
          />
          <Route
            path={RoutePath.PORTFOLIO}
            element={
              <Suspense fallback={<PageLoader />}>
                <PortfolioPage />
              </Suspense>
            }
          />
          <Route
            path={RoutePath.ALERTS}
            element={
              <Suspense fallback={<PageLoader />}>
                <AlertsPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
