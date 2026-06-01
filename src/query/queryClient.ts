import { QueryClient } from '@tanstack/react-query';

const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheTtl(): number {
  const envValue = import.meta.env.VITE_CACHE_TTL;
  if (envValue) {
    const parsed = Number(envValue);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_CACHE_TTL;
}

export const cacheTtl = getCacheTtl();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheTtl,
      gcTime: cacheTtl * 2,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
