// src/features/Buyer/hooks/useOrderQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { orderFetchEngine } from '../services/orderFetchEngine';
import { Order } from '../types/order.types';

export function useOrderQuery(orderId: string) {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<Order | undefined>({
    queryKey: ['orders', orderId],
    queryFn: () => orderFetchEngine.getOrder(orderId),
    enabled: hasToken && !!orderId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });

  return {
    order: query.data ?? null,
    isLoadingOrder: query.isLoading,
    isErrorOrder: query.isError,
    orderError: query.error as Error | null,
    refetchOrder: query.refetch,
  };
}