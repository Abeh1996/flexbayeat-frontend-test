// src/features/Rider/hooks/useRiderMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { riderFetchEngine } from '../services/fetchEngine';
import { RiderProfilePayload, RiderLocationPayload } from '../types';

const dev = process.env.NODE_ENV === 'development';

export function useRiderMutation() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['rider-profile'] });

  const createMutation = useMutation({
    mutationFn: (payload: RiderProfilePayload) => riderFetchEngine.createProfile(payload),
    onSuccess: () => {
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[createRiderProfile]', error);
      toast.error('Submission failed', { description: error.message, duration: 6000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<RiderProfilePayload>) => riderFetchEngine.updateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated', { duration: 4000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateRiderProfile]', error);
      toast.error('Update failed', { description: error.message, duration: 6000 });
    },
  });

  // Silent — fires frequently in the background, no toast spam
  const locationMutation = useMutation({
    mutationFn: (payload: RiderLocationPayload) => riderFetchEngine.updateLocation(payload),
    onError: (error: Error) => {
      if (dev) console.error('[updateRiderLocation]', error);
    },
  });

  return {
    createRiderProfile: createMutation.mutate,
    createRiderProfileAsync: createMutation.mutateAsync,
    isCreatingRiderProfile: createMutation.isPending,

    updateRiderProfile: updateMutation.mutate,
    isUpdatingRiderProfile: updateMutation.isPending,

    updateLocation: locationMutation.mutate,
    isUpdatingLocation: locationMutation.isPending,
  };
}