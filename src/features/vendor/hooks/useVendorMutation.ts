// src/features/Vendor/hooks/useVendorMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorFetchEngine } from '../services/fetchEngine';
import { VendorProfilePayload } from '../types';

const dev = process.env.NODE_ENV === 'development';

export function useVendorMutation() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });

  const createMutation = useMutation({
    mutationFn: (payload: VendorProfilePayload) =>
      vendorFetchEngine.createProfile(payload),
    onSuccess: () => {
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[createVendorProfile]', error);
      toast.error('Submission failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<VendorProfilePayload>) =>
      vendorFetchEngine.updateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated', { duration: 4000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateVendorProfile]', error);
      toast.error('Update failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  return {
    createVendorProfile: createMutation.mutate,
    createVendorProfileAsync: createMutation.mutateAsync,
    isCreatingVendorProfile: createMutation.isPending,

    updateVendorProfile: updateMutation.mutate,
    isUpdatingVendorProfile: updateMutation.isPending,
  };
}