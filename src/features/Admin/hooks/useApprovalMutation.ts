// src/features/Admin/hooks/useApprovalMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { adminFetchEngine } from '../services/fetchEngine';
import { ApproveRiderPayload, ApproveVendorPayload } from '../types';

interface VendorApprovalVariables {
  id: string;
  payload: ApproveVendorPayload;
}

interface RiderApprovalVariables {
  id: string;
  payload: ApproveRiderPayload;
}

export function useApprovalMutation() {
  const queryClient = useQueryClient();
  const [approvingVendorId, setApprovingVendorId] = useState<string | null>(null);
  const [approvingRiderId, setApprovingRiderId] = useState<string | null>(null);

  const approveVendorMutation = useMutation<void, AxiosError<{ message: string }>, VendorApprovalVariables>({
    mutationFn: ({ id, payload }) => adminFetchEngine.approveVendor(id, payload),
    onMutate: ({ id }) => {
      setApprovingVendorId(id);
    },
    onSuccess: (_, { payload }) => {
      toast.success(payload.approved ? 'Vendor approved' : 'Vendor rejected', {
        duration: 4000,
      });
      queryClient.refetchQueries({ queryKey: ['admin-pending-vendors'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error approving vendor:', error);
      }
      toast.error(error.response?.data?.message || 'Failed to process vendor approval.', {
        duration: 6000,
      });
    },
    onSettled: () => {
      setApprovingVendorId(null);
    },
  });

  const approveRiderMutation = useMutation<void, AxiosError<{ message: string }>, RiderApprovalVariables>({
    mutationFn: ({ id, payload }) => adminFetchEngine.approveRider(id, payload),
    onMutate: ({ id }) => {
      setApprovingRiderId(id);
    },
    onSuccess: (_, { payload }) => {
      toast.success(payload.approved ? 'Rider approved' : 'Rider rejected', {
        duration: 4000,
      });
      queryClient.refetchQueries({ queryKey: ['admin-pending-riders'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error approving rider:', error);
      }
      toast.error(error.response?.data?.message || 'Failed to process rider approval.', {
        duration: 6000,
      });
    },
    onSettled: () => {
      setApprovingRiderId(null);
    },
  });

  return {
    approveVendor: approveVendorMutation.mutateAsync,
    isApprovingVendor: approveVendorMutation.isPending,
    approvingVendorId,
    approveRider: approveRiderMutation.mutateAsync,
    isApprovingRider: approveRiderMutation.isPending,
    approvingRiderId,
  };
}
