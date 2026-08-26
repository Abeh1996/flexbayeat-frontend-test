// src/features/Rider/hooks/useRiderEarningsQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { riderFetchEngine } from '../services/fetchEngine';
import type { EarningsSummary, EarningsEntry, Payout } from '../types';

export function useEarningsSummaryQuery() {
  const hasToken = !!Cookies.get('fb_session');
  return useQuery<EarningsSummary | null, Error>({
    queryKey: ['rider-earnings-summary'],
    queryFn: riderFetchEngine.getEarningsSummary,
    enabled: hasToken,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useEarningsHistoryQuery() {
  const hasToken = !!Cookies.get('fb_session');
  return useQuery<EarningsEntry[], Error>({
    queryKey: ['rider-earnings-history'],
    queryFn: riderFetchEngine.getEarningsHistory,
    enabled: hasToken,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function usePayoutsQuery() {
  const hasToken = !!Cookies.get('fb_session');
  return useQuery<Payout[], Error>({
    queryKey: ['rider-payouts'],
    queryFn: riderFetchEngine.getPayouts,
    enabled: hasToken,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}