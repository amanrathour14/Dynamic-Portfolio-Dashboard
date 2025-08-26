// Custom hook for polling the backend API.

import useSWR from 'swr';
import { getPortfolio } from '../lib/api';

const fetcher = async () => {
  const data = await getPortfolio();
  return data;
};

const usePortfolioPolling = (interval = 15000) => {
  // Disable on SSR to avoid using a relative URL and mismatched environments
  const key = typeof window === 'undefined' ? null : '/api/portfolio';
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    refreshInterval: interval,
    revalidateOnFocus: true,
  });

  return { portfolio: data, loading: isLoading, error, refresh: () => mutate() };
};

export default usePortfolioPolling;
