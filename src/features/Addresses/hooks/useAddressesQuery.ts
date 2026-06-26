// src/features/Addresses/hooks/useAddressesQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { addressFetchEngine } from '../services/fetchEngine';
import { Address } from '../types';
import Cookies from 'js-cookie';

export function useAddressesQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: addressFetchEngine.getAll,
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    addresses: query.data ?? [],
    hasAddresses: (query.data?.length ?? 0) > 0,
    isLoadingAddresses: query.isLoading,
    isErrorAddresses: query.isError,
    refetchAddresses: query.refetch,
  };
}