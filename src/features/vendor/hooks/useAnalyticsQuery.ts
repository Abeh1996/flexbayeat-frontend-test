// src/features/Vendor/hooks/useAnalyticsQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { analyticsFetchEngine } from '../services/analyticsFetchEngine';
import { VendorAnalytics } from '../types/analytics.types';

export function useAnalyticsQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<VendorAnalytics>({
    queryKey: ['vendor-analytics'],
    queryFn: analyticsFetchEngine.getAnalytics,
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    analytics: query.data ?? null,
    isLoadingAnalytics: query.isLoading,
    isErrorAnalytics: query.isError,
    refetchAnalytics: query.refetch,
  };
}