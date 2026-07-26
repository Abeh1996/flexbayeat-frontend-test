// src/features/Buyer/hooks/useVendorsQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { vendorFetchEngine } from '../services/vendorFetchEngine';
import { Vendor } from '../types/vendor.types';

export function useVendorsQuery() {
  const query = useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: vendorFetchEngine.getAllVendors,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    vendors: query.data ?? [],
    hasVendors: (query.data?.length ?? 0) > 0,
    isLoadingVendors: query.isLoading,
    isErrorVendors: query.isError,
    vendorsError: query.error as Error | null,
    refetchVendors: query.refetch,
  };
}