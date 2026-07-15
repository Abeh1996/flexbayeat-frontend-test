'use client';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function NetworkListener() {
  useNetworkStatus();
  return null;
}
