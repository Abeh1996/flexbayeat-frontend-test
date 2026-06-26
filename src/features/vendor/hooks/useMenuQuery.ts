// src/features/Vendor/hooks/useMenuQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { menuFetchEngine } from '../services/menuFetchEngine';
import { MenuCategory, MenuItem } from '../types/menu.types';

export function useCategoriesQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<MenuCategory[]>({
    queryKey: ['vendor-categories'],
    queryFn: menuFetchEngine.getCategories,
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  // Fix #2 — filter out soft-deleted items (backend sets deletedAt instead of removing)
  // Fix field name — backend returns menuItems not items
  const allItems: MenuItem[] = (query.data ?? [])
    .flatMap((cat) => cat.menuItems ?? [])
    .filter((item) => item.deletedAt === null || item.deletedAt === undefined);

  return {
    categories: query.data ?? [],
    hasCategories: (query.data?.length ?? 0) > 0,
    allItems,
    isLoadingCategories: query.isLoading,
    isErrorCategories: query.isError,
    refetchCategories: query.refetch,
  };
}