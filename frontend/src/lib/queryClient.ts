import { QueryClient } from '@tanstack/react-query';

const MINUTE = 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 60 * MINUTE,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * MINUTE,
    },
  },
});
