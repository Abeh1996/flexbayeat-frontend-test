// src/features/Vendor/hooks/useOrdersMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ordersFetchEngine } from '../services/ordersFetchEngine';
import { AcceptOrderPayload, RejectOrderPayload, UpdateOrderStatusPayload } from '../types/orders.types';

const dev = process.env.NODE_ENV === 'development';

export function useOrdersMutation() {
  const queryClient = useQueryClient();

  const refetchOrders = () => {
    queryClient.refetchQueries({ queryKey: ['vendor-orders-active'] });
    queryClient.refetchQueries({ queryKey: ['vendor-orders-history'] });
  };

  const acceptMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AcceptOrderPayload }) =>
      ordersFetchEngine.acceptOrder(id, payload),
    onSuccess: () => {
      toast.success('Order accepted', { duration: 3000 });
      refetchOrders();
    },
    onError: (error: Error) => {
      if (dev) console.error('[acceptOrder]', error);
      toast.error('Failed to accept order', { description: error.message, duration: 5000 });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectOrderPayload }) =>
      ordersFetchEngine.rejectOrder(id, payload),
    onSuccess: () => {
      toast.success('Order rejected', { duration: 3000 });
      refetchOrders();
    },
    onError: (error: Error) => {
      if (dev) console.error('[rejectOrder]', error);
      toast.error('Failed to reject order', { description: error.message, duration: 5000 });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderStatusPayload }) =>
      ordersFetchEngine.updateOrderStatus(id, payload),
    onSuccess: (_, { payload }) => {
      const label =
        payload.status === 'PREPARING' ? 'Now preparing' : 'Ready for pickup';
      toast.success(label, { duration: 3000 });
      refetchOrders();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateOrderStatus]', error);
      toast.error('Failed to update status', { description: error.message, duration: 5000 });
    },
  });

  return {
    acceptOrder: acceptMutation.mutate,
    isAccepting: acceptMutation.isPending,
    acceptingId: acceptMutation.variables?.id,

    rejectOrder: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,
    rejectingId: rejectMutation.variables?.id,

    updateOrderStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    updatingStatusId: updateStatusMutation.variables?.id,
  };
}