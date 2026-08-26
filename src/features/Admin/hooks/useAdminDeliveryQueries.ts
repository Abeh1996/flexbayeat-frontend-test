// src/features/Admin/hooks/useAdminDeliveryQueries.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { adminFetchEngine } from '../services/fetchEngine';
import type {
  AdminAvailableRider,
  AssignedOrdersResponse,
  AutoAssignPayload,
  ManualAssignPayload,
  UnassignedOrdersResponse,
} from '../types';

// ── Unassigned Orders ─────────────────────────────────────────────────────────

export function useUnassignedOrdersQuery(page = 1, limit = 20) {
  const hasToken = !!Cookies.get('fb_session');

  return useQuery<UnassignedOrdersResponse, AxiosError>({
    queryKey: ['admin-unassigned-orders', page, limit],
    queryFn: () => adminFetchEngine.getUnassignedOrders(page, limit),
    enabled: hasToken,
    staleTime: 1000 * 30,
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

// ── Assigned Orders ───────────────────────────────────────────────────────────

export function useAssignedOrdersQuery(
  page = 1,
  limit = 20,
  status?: string,
  riderId?: string,
) {
  const hasToken = !!Cookies.get('fb_session');

  return useQuery<AssignedOrdersResponse, AxiosError>({
    queryKey: ['admin-assigned-orders', page, limit, status, riderId],
    queryFn: () => adminFetchEngine.getAssignedOrders(page, limit, status, riderId),
    enabled: hasToken,
    staleTime: 1000 * 30,
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

// ── Available Riders ──────────────────────────────────────────────────────────

export function useAvailableRidersQuery(
  latitude: number,
  longitude: number,
  radiusKm: number,
) {
  const hasToken = !!Cookies.get('fb_session');
  const enabled = hasToken && latitude !== 0 && longitude !== 0;

  return useQuery<AdminAvailableRider[], AxiosError>({
    queryKey: ['admin-available-riders', latitude, longitude, radiusKm],
    queryFn: () => adminFetchEngine.getAvailableRiders(latitude, longitude, radiusKm),
    enabled,
    staleTime: 1000 * 15,
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

// ── Admin Delivery Mutations ──────────────────────────────────────────────────

export function useAdminDeliveryMutation() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.refetchQueries({ queryKey: ['admin-unassigned-orders'] });
    queryClient.refetchQueries({ queryKey: ['admin-assigned-orders'] });
    queryClient.refetchQueries({ queryKey: ['admin-available-riders'] });
  };

  const manualAssignMutation = useMutation<void, AxiosError<{ message: string }>, {
    id: string;
    payload: ManualAssignPayload;
  }>({
    mutationFn: ({ id, payload }) => adminFetchEngine.manualAssign(id, payload),
    onSuccess: () => {
      toast.success('Rider assigned', { duration: 4000 });
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to assign rider', {
        duration: 6000,
      });
    },
  });

  const autoAssignMutation = useMutation<void, AxiosError<{ message: string }>, {
    id: string;
    payload: AutoAssignPayload;
  }>({
    mutationFn: ({ id, payload }) => adminFetchEngine.autoAssign(id, payload),
    onSuccess: () => {
      toast.success('Auto-assigned nearest rider', { duration: 4000 });
      invalidate();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Auto-assign failed', {
        duration: 6000,
      });
    },
  });

  return {
    manualAssign: manualAssignMutation.mutateAsync,
    isManualAssigning: manualAssignMutation.isPending,
    autoAssign: autoAssignMutation.mutateAsync,
    isAutoAssigning: autoAssignMutation.isPending,
  };
}