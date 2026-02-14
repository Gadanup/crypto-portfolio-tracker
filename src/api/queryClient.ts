import { QueryClient } from '@tanstack/react-query';

import { API_CONFIG } from '@/helpers/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: API_CONFIG.CMC.STALE_TIMES.LISTINGS,
      retry: API_CONFIG.CMC.RETRY_COUNT,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
