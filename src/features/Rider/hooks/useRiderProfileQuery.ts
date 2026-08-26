// src/features/Rider/hooks/useRiderProfileQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { riderFetchEngine } from '../services/fetchEngine';
import { RiderProfile } from '../types';

export function useRiderProfileQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<RiderProfile, Error>({
    queryKey: ['rider-profile'],
    queryFn: riderFetchEngine.getProfile,
    enabled: hasToken,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    retry: (failureCount, error) => {
      // api.ts normalizes all errors to plain Error — check message instead of status
      if (
        error.message?.toLowerCase().includes('401') ||
        error.message?.toLowerCase().includes('not found') ||
        error.message?.toLowerCase().includes('session expired')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  return {
    riderProfile: query.data ?? null,
    isLoadingRiderProfile: query.isLoading,
    isErrorRiderProfile: query.isError,
    refetchRiderProfile: query.refetch,
  };
}