// src/features/Buyer/hooks/useOrderMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orderFetchEngine } from '../services/orderFetchEngine';
import { CheckoutPayload, ReviewPayload } from '../types/order.types';

const dev = process.env.NODE_ENV === 'development';

export function useOrderMutation() {
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
    mutationFn: (payload: CheckoutPayload) => orderFetchEngine.checkout(payload),
    onSuccess: () => {
      toast.success('Order placed', { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      if (dev) console.error('[checkout]', error);
      toast.error('Checkout failed', { description: error.message, duration: 6000 });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (orderId: string) => orderFetchEngine.reorder(orderId),
    onSuccess: () => {
      toast.success('Items added to cart', { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      if (dev) console.error('[reorder]', error);
      toast.error('Failed to reorder', { description: error.message, duration: 6000 });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: ReviewPayload }) =>
      orderFetchEngine.review(orderId, payload),
    onSuccess: (_, variables) => {
      toast.success('Review submitted', { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // not strictly needed since GET /buyer/orders is the source of truth,
      // but keeps the specific order's cache fresh if you ever add a
      // single-order query later
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
    onError: (error: Error) => {
      if (dev) console.error('[review]', error);
      toast.error('Failed to submit review', { description: error.message, duration: 6000 });
    },
  });

  return {
    checkout: checkoutMutation.mutate,
    checkoutAsync: checkoutMutation.mutateAsync,
    isCheckingOut: checkoutMutation.isPending,

    reorder: reorderMutation.mutate,
    isReordering: reorderMutation.isPending,

    submitReview: reviewMutation.mutate,
    isSubmittingReview: reviewMutation.isPending,
  };
}