// src/features/Admin/hooks/useAdminProfileQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { adminFetchEngine } from '../services/fetchEngine';
import { AdminProfile } from '../types';

export function useAdminProfileQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<AdminProfile, AxiosError>({
    queryKey: ['admin-profile'],
    queryFn: adminFetchEngine.getProfile,
    enabled: hasToken,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return {
    adminProfile: query.data ?? null,
    isLoadingAdminProfile: query.isLoading,
    isErrorAdminProfile: query.isError,
    error: query.error,
    refetchAdminProfile: query.refetch,
  };
}
