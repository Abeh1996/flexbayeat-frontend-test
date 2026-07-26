// src/features/Admin/hooks/usePendingVendorsQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { adminFetchEngine } from '../services/fetchEngine';
import { PendingVendor } from '../types';

export function usePendingVendorsQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<PendingVendor[], AxiosError>({
    queryKey: ['admin-pending-vendors'],
    queryFn: adminFetchEngine.getPendingVendors,
    enabled: hasToken,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return {
    pendingVendors: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
