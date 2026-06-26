// src/features/Rider/hooks/useRiderProfileQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { riderFetchEngine } from '../services/fetchEngine';
import { RiderProfile } from '../types';

export function useRiderProfileQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<RiderProfile, AxiosError>({
    queryKey: ['rider-profile'],
    queryFn: riderFetchEngine.getProfile,
    enabled: hasToken,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 404) {
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