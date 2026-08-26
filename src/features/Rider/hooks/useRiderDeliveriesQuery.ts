// src/features/Rider/hooks/useRiderDeliveriesQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { riderFetchEngine } from '../services/fetchEngine';
import type { DeliveryTask } from '../types';

export function useAvailableDeliveriesQuery() {
  const hasToken = !!Cookies.get('fb_session');

  return useQuery<DeliveryTask[], Error>({
    queryKey: ['rider-available-deliveries'],
    queryFn: riderFetchEngine.getAvailableDeliveries,
    enabled: hasToken,
    // Sockets handle real-time updates — stale time keeps UI fresh on mount
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useAssignedDeliveriesQuery() {
  const hasToken = !!Cookies.get('fb_session');

  return useQuery<DeliveryTask[], Error>({
    queryKey: ['rider-assigned-deliveries'],
    queryFn: riderFetchEngine.getAssignedDeliveries,
    enabled: hasToken,
    staleTime: 1000 * 30,
    retry: 1,
  });
}