// src/hooks/useNetworkStatus.ts
'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useNetworkStatus(): void {
  useEffect(() => {
    // 1. Double-check that we are executing completely on the client side
    if (typeof window === 'undefined' || !navigator) return;

    // Track the true initial state safely inside the client instance
    let lastStatus = navigator.onLine;

    const handleOnline = (): void => {
      if (lastStatus === true) return; 
      lastStatus = true;
      
      toast.success('Back Online', {
        description: 'Your internet connection has been successfully restored.',
        duration: 4000,
        id: 'network-status',
      });
    };

    const handleOffline = (): void => {
      if (lastStatus === false) return; 
      lastStatus = false;

      toast.error('Connection Lost', {
        description: 'You are currently working offline. Some features may be limited.',
        duration: Infinity, 
        id: 'network-status',
      });
    };

    // 2. Hardware state event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 3. Force check immediately on mount to catch true state
    if (!navigator.onLine) {
      handleOffline();
    }

    // 4. Polling loop to catch immediate physical router drops
    const activeCheckInterval = setInterval(() => {
      if (navigator.onLine) {
        handleOnline();
      } else {
        handleOffline();
      }
    }, 1500); // 1.5 seconds evaluation intervals

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(activeCheckInterval);
    };
  }, []);
}