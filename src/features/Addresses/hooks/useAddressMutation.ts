// src/features/Addresses/hooks/useAddressMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addressFetchEngine } from '../services/fetchEngine';
import { AddressPayload } from '../types';

const dev = process.env.NODE_ENV === 'development';

export function useAddressMutation() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['addresses'] });

  const createMutation = useMutation({
    mutationFn: (payload: AddressPayload) => addressFetchEngine.create(payload),
    onSuccess: () => {
      toast.success('Address saved', { duration: 4000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[createAddress]', error);
      toast.error('Failed to save address', { description: error.message, duration: 6000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) =>
      addressFetchEngine.update(id, payload),
    onSuccess: () => {
      toast.success('Address updated', { duration: 4000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateAddress]', error);
      toast.error('Failed to update address', { description: error.message, duration: 6000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => addressFetchEngine.delete(id),
    onSuccess: () => {
      toast.success('Address removed', { duration: 4000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[deleteAddress]', error);
      toast.error('Failed to remove address', { description: error.message, duration: 6000 });
    },
  });

  return {
    createAddress: createMutation.mutate,
    createAddressAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateAddress: updateMutation.mutate,
    isUpdating: updateMutation.isPending,

    deleteAddress: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}