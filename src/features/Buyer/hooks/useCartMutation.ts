// src/features/Buyer/hooks/useCartMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartFetchEngine } from '../services/cartFetchEngine';
import { UpdateCartPayload } from '../types/cart.types';

const dev = process.env.NODE_ENV === 'development';

export function useCartMutation() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCartPayload) => cartFetchEngine.updateCartItem(payload),
    onSuccess: (_, variables) => {
      // if (variables.quantity === 0) {
      //   toast.success('Item removed from cart', { duration: 3000 });
      // } else {
      //   toast.success('Cart updated', { duration: 3000 });
      // }
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateCartItem]', error);
      toast.error('Failed to update cart', { description: error.message, duration: 6000 });
    },
  });

  return {
    updateCartItem: updateMutation.mutate,
    updateCartItemAsync: updateMutation.mutateAsync,
    isUpdatingCart: updateMutation.isPending,
  };
}