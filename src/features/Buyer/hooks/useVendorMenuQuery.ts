// src/features/Buyer/hooks/useVendorMenuQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { vendorFetchEngine } from '../services/vendorFetchEngine';
import { MenuCategory } from '../types/vendor.types';

export function useVendorMenuQuery(vendorId: string) {
  const query = useQuery<MenuCategory[]>({
    queryKey: ['vendor-menu', vendorId],
    queryFn: () => vendorFetchEngine.getVendorMenu(vendorId),
    enabled: !!vendorId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    menuCategories: query.data ?? [],
    hasMenu: (query.data?.length ?? 0) > 0,
    isLoadingMenu: query.isLoading,
    isErrorMenu: query.isError,
    menuError: query.error as Error | null,
    refetchMenu: query.refetch,
  };
}