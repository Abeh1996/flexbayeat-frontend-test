// src/features/Admin/hooks/useAdminMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { adminFetchEngine } from '../services/fetchEngine';
import { AdminProfilePayload } from '../types';

export function useAdminMutation() {
  const queryClient = useQueryClient();

  const createAdminProfile = useMutation({
    mutationFn: (payload: AdminProfilePayload) => adminFetchEngine.createProfile(payload),
    onSuccess: () => {
      toast.success('Admin profile created successfully.', { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating admin profile:', error);
      }
      toast.error(error.response?.data?.message || 'Failed to create profile.', {
        duration: 6000,
      });
    },
  });

  const updateAdminProfile = useMutation({
    mutationFn: (payload: AdminProfilePayload) => adminFetchEngine.updateProfile(payload),
    onSuccess: () => {
      toast.success('Admin profile updated successfully.', { duration: 4000 });
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating admin profile:', error);
      }
      toast.error(error.response?.data?.message || 'Failed to update profile.', {
        duration: 6000,
      });
    },
  });

  return {
    createAdminProfile: createAdminProfile.mutateAsync,
    isCreatingAdminProfile: createAdminProfile.isPending,
    updateAdminProfile: updateAdminProfile.mutateAsync,
    isUpdatingAdminProfile: updateAdminProfile.isPending,
  };
}
