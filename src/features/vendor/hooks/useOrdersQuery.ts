// src/features/Vendor/hooks/useOrdersQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { ordersFetchEngine } from '../services/ordersFetchEngine';
import { Order } from '../types/orders.types';

export function useActiveOrdersQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<Order[]>({
    queryKey: ['vendor-orders-active'],
    queryFn: ordersFetchEngine.getActiveOrders,
    enabled: hasToken,
    refetchInterval: 1000 * 30, // poll every 30s — orders are time sensitive
    staleTime: 1000 * 15,
  });

  return {
    activeOrders: query.data ?? [],
    isLoadingActiveOrders: query.isLoading,
    isErrorActiveOrders: query.isError,
    refetchActiveOrders: query.refetch,
  };
}

export function useOrderHistoryQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<Order[]>({
    queryKey: ['vendor-orders-history'],
    queryFn: ordersFetchEngine.getOrderHistory,
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
  });

  return {
    orderHistory: query.data ?? [],
    isLoadingHistory: query.isLoading,
    isErrorHistory: query.isError,
  };
}