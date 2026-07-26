// src/features/Buyer/hooks/useOrdersQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { orderFetchEngine } from '../services/orderFetchEngine';
import { Order } from '../types/order.types';

export function useOrdersQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: orderFetchEngine.getOrders,
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    orders: query.data ?? [],
    hasOrders: (query.data?.length ?? 0) > 0,
    isLoadingOrders: query.isLoading,
    isErrorOrders: query.isError,
    ordersError: query.error as Error | null,
    refetchOrders: query.refetch,
  };
}