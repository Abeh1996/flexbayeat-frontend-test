// src/features/Buyer/hooks/useAllMealsQuery.ts
'use client';
import { useQueries } from '@tanstack/react-query';
import { useVendorsQuery } from './useVendorsQuery';
import { vendorFetchEngine } from '../services/vendorFetchEngine';
import { MenuItem, MenuCategory } from '../types/vendor.types';

export interface BrowsableMeal extends MenuItem {
  vendorId: string;
  vendorName: string;
  categoryName?: string;
}

// NOTE: fetches every active vendor's menu client-side (N+1). Fine at your
// current vendor count. Once vendor count grows meaningfully, this needs to
// become a real backend endpoint (GET /product/meals?search=&category=&page=)
// instead of the frontend assembling it from N requests. Flagging now so
// it's a known tradeoff, not a surprise later.
export function useAllMealsQuery() {
  const { vendors, isLoadingVendors, isErrorVendors } = useVendorsQuery();
  const activeVendors = vendors.filter((v) => v.status === 'ACTIVE');

  const menuQueries = useQueries({
    queries: activeVendors.map((vendor) => ({
      queryKey: ['vendor-menu', vendor.id],
      queryFn: () => vendorFetchEngine.getVendorMenu(vendor.id),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    })),
  });

  const isLoadingMeals = isLoadingVendors || menuQueries.some((q) => q.isLoading);
  const isErrorMeals = isErrorVendors || (activeVendors.length > 0 && menuQueries.every((q) => q.isError));
  const error = menuQueries.find((q) => q.isError)?.error || (isErrorVendors ? new Error('Failed to fetch vendors') : null);

  const meals: BrowsableMeal[] = menuQueries.flatMap((q, i) => {
    const vendor = activeVendors[i];
    if (!q.data || !vendor) return [];
    return q.data.flatMap((category: MenuCategory) =>
      category.menuItems
        .filter((item) => item.status === 'AVAILABLE')
        .map((item) => ({
          ...item,
          vendorId: vendor.id,
          vendorName: vendor.businessName,
          categoryName: category.name,
        }))
    );
  });

  const categoryNames = Array.from(new Set(meals.map((m) => m.categoryName))).sort();

  return { meals, categoryNames, isLoadingMeals, isErrorMeals, error };
}