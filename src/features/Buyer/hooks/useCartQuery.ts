// src/features/Buyer/hooks/useCartQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { cartFetchEngine } from '../services/cartFetchEngine';
import { Cart } from '../types/cart.types';

export function useCartQuery() {
  const hasToken = !!Cookies.get('fb_session');

  const query = useQuery<Cart | null>({
    queryKey: ['cart'],
    queryFn: cartFetchEngine.getCart,
    enabled: hasToken,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });

  const cartItems = query.data?.cartItems ?? [];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart: query.data ?? null,
    cartItems,
    totalQuantity,
    isCartEmpty: cartItems.length === 0,
    isLoadingCart: query.isLoading,
    isErrorCart: query.isError,
    cartError: query.error as Error | null,
    refetchCart: query.refetch,
  };
}