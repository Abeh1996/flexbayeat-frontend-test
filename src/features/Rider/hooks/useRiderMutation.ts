// src/features/Rider/hooks/useRiderMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { riderFetchEngine } from '../services/fetchEngine';
import type {
  RiderProfilePayload,
  UpdateRiderProfilePayload,
  RiderLocationPayload,
  AcceptDeliveryDto,
  DeclineDeliveryDto,
  ConfirmPickupDto,
  ConfirmDeliveryDto,
  UpdateDeliveryStatusDto,
  RequestPayoutPayload,
  ReportIssuePayload,
} from '../types';

const dev = process.env.NODE_ENV === 'development';

export function useRiderMutation() {
  const queryClient = useQueryClient();

  const invalidateProfile = () =>
    queryClient.invalidateQueries({ queryKey: ['rider-profile'] });

  const invalidateDeliveries = () => {
    queryClient.invalidateQueries({ queryKey: ['rider-available-deliveries'] });
    queryClient.invalidateQueries({ queryKey: ['rider-assigned-deliveries'] });
  };

  // ── Profile ───────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: RiderProfilePayload) =>
      riderFetchEngine.createProfile(payload),
    onSuccess: () => invalidateProfile(),
    onError: (error: Error) => {
      if (dev) console.error('[createRiderProfile]', error);
      toast.error('Submission failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateRiderProfilePayload) =>
      riderFetchEngine.updateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated', { duration: 4000 });
      invalidateProfile();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateRiderProfile]', error);
      toast.error('Update failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  // ── Location (silent — no toasts, called by GPS hook) ─────────────────────
  const locationMutation = useMutation({
    mutationFn: (payload: RiderLocationPayload) =>
      riderFetchEngine.updateLocation(payload),
    onError: (error: Error) => {
      if (dev) console.error('[updateRiderLocation]', error);
    },
  });

  // ── Delivery mutations ────────────────────────────────────────────────────
  // After REST calls, the backend emits socket events which invalidate caches.
  // We still invalidate locally for immediate feedback.

  const acceptDeliveryMutation = useMutation({
    mutationFn: (payload: AcceptDeliveryDto) =>
      riderFetchEngine.acceptDelivery(payload),
    onSuccess: () => {
      toast.success('Delivery accepted!', { duration: 4000 });
      invalidateDeliveries();
    },
    onError: (error: Error) => {
      if (dev) console.error('[acceptDelivery]', error);
      toast.error('Could not accept delivery', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const declineDeliveryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DeclineDeliveryDto }) =>
      riderFetchEngine.declineDelivery(id, payload),
    onSuccess: () => {
      toast.success('Delivery declined', { duration: 3000 });
      invalidateDeliveries();
    },
    onError: (error: Error) => {
      if (dev) console.error('[declineDelivery]', error);
      toast.error('Could not decline delivery', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDeliveryStatusDto }) =>
      riderFetchEngine.updateDeliveryStatus(id, payload),
    onSuccess: () => {
      toast.success('Status updated', { duration: 3000 });
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateDeliveryStatus]', error);
      toast.error('Status update failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const confirmPickupMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ConfirmPickupDto }) =>
      riderFetchEngine.confirmPickup(id, payload),
    onSuccess: () => {
      toast.success('Pickup confirmed!', { duration: 4000 });
    },
    onError: (error: Error) => {
      if (dev) console.error('[confirmPickup]', error);
      toast.error('Pickup confirmation failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const confirmDeliveryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ConfirmDeliveryDto }) =>
      riderFetchEngine.confirmDelivery(id, payload),
    onSuccess: () => {
      toast.success('Delivery completed!', { duration: 5000 });
    },
    onError: (error: Error) => {
      if (dev) console.error('[confirmDelivery]', error);
      toast.error('Delivery confirmation failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  // ── Payout ───────────────────────────────────────────────────────────────────
  const requestPayoutMutation = useMutation({
    mutationFn: (payload: RequestPayoutPayload) =>
      riderFetchEngine.requestPayout(payload),
    onSuccess: () => {
      toast.success('Payout requested!', { duration: 5000 });
      queryClient.invalidateQueries({ queryKey: ['rider-payouts'] });
      queryClient.invalidateQueries({ queryKey: ['rider-earnings-summary'] });
    },
    onError: (error: Error) => {
      if (dev) console.error('[requestPayout]', error);
      toast.error('Payout request failed', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  // ── Issue reporting ──────────────────────────────────────────────────────────
  const reportIssueMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReportIssuePayload }) =>
      riderFetchEngine.reportIssue(id, payload),
    onSuccess: () => {
      toast.success('Issue reported', { duration: 5000 });
    },
    onError: (error: Error) => {
      if (dev) console.error('[reportIssue]', error);
      toast.error('Failed to report issue', {
        description: error.message,
        duration: 6000,
      });
    },
  });

  return {
    createRiderProfile: createMutation.mutate,
    createRiderProfileAsync: createMutation.mutateAsync,
    isCreatingRiderProfile: createMutation.isPending,
    updateRiderProfile: updateProfileMutation.mutate,
    isUpdatingRiderProfile: updateProfileMutation.isPending,
    updateLocation: locationMutation.mutate,
    isUpdatingLocation: locationMutation.isPending,
    acceptDelivery: acceptDeliveryMutation.mutate,
    acceptDeliveryAsync: acceptDeliveryMutation.mutateAsync,
    isAcceptingDelivery: acceptDeliveryMutation.isPending,
    declineDelivery: declineDeliveryMutation.mutate,
    isDecliningDelivery: declineDeliveryMutation.isPending,
    updateDeliveryStatus: updateStatusMutation.mutate,
    confirmPickup: confirmPickupMutation.mutate,
    confirmPickupAsync: confirmPickupMutation.mutateAsync,
    isConfirmingPickup: confirmPickupMutation.isPending,
    confirmDelivery: confirmDeliveryMutation.mutate,
    confirmDeliveryAsync: confirmDeliveryMutation.mutateAsync,
    isConfirmingDelivery: confirmDeliveryMutation.isPending,
    requestPayout: requestPayoutMutation.mutate,
    requestPayoutAsync: requestPayoutMutation.mutateAsync,
    isRequestingPayout: requestPayoutMutation.isPending,
    reportIssue: reportIssueMutation.mutate,
    reportIssueAsync: reportIssueMutation.mutateAsync,
    isReportingIssue: reportIssueMutation.isPending,
  };
}