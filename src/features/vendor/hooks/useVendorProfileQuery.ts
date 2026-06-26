// src/features/Vendor/hooks/useVendorProfileQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { vendorFetchEngine } from '../services/fetchEngine';
import { VendorProfile } from '../types';

export function useVendorProfileQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<VendorProfile, AxiosError>({
    queryKey: ['vendor-profile'],
    queryFn: vendorFetchEngine.getProfile,
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
    vendorProfile: query.data ?? null,
    isLoadingVendorProfile: query.isLoading,
    isErrorVendorProfile: query.isError,
    refetchVendorProfile: query.refetch,
  };
}