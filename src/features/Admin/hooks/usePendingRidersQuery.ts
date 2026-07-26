// src/features/Admin/hooks/usePendingRidersQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { adminFetchEngine } from '../services/fetchEngine';
import { PendingRider } from '../types';

export function usePendingRidersQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<PendingRider[], AxiosError>({
    queryKey: ['admin-pending-riders'],
    queryFn: adminFetchEngine.getPendingRiders,
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
    pendingRiders: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
