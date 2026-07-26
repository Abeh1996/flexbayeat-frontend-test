// src/features/Buyer/hooks/useTrendingMealsQuery.ts
'use client';
import { useQueries } from '@tanstack/react-query';
import { useVendorsQuery } from './useVendorsQuery';
import { vendorFetchEngine } from '../services/vendorFetchEngine';
import { MenuItem, MenuCategory } from '../types/vendor.types';

export interface TrendingMeal extends MenuItem {
  vendorId: string;
  vendorName: string;
}

// Caps how many vendors' menus get fetched for this section. Real "trending"
// data needs a dedicated backend endpoint (e.g. aggregated by order volume
// across ALL vendors) — this is a homepage-only approximation limited to a
// small sample so it doesn't fire N requests for every vendor in the system.
const VENDOR_SAMPLE_SIZE = 5;

export function useTrendingMealsQuery(limit = 8) {
  const { vendors, isLoadingVendors } = useVendorsQuery();
  const sampleVendors = vendors.slice(0, VENDOR_SAMPLE_SIZE);

  const menuQueries = useQueries({
    queries: sampleVendors.map((vendor) => ({
      queryKey: ['vendor-menu', vendor.id],
      queryFn: () => vendorFetchEngine.getVendorMenu(vendor.id),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    })),
  });

  const isLoadingMeals = isLoadingVendors || menuQueries.some((q) => q.isLoading);
  const isErrorMeals = sampleVendors.length > 0 && menuQueries.every((q) => q.isError);

  const meals: TrendingMeal[] = menuQueries.flatMap((q, i) => {
    const vendor = sampleVendors[i];
    if (!q.data || !vendor) return [];
    return q.data.flatMap((category: MenuCategory) =>
      category.menuItems
        .filter((item) => item.status === 'AVAILABLE')
        .map((item) => ({ ...item, vendorId: vendor.id, vendorName: vendor.businessName }))
    );
  });

  // NOTE: totalOrders is 0 across your current sample data, so this sort
  // won't visibly reorder anything until real orders exist. That's expected,
  // not a bug in this hook.
  const trendingMeals = [...meals]
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, limit);

  return { trendingMeals, isLoadingMeals, isErrorMeals };
}