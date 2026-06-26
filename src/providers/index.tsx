'use client';
import React from 'react';
import { QueryProvider } from './queryProvider';
import { ToastProvider } from './toastProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Global AppProviders Core
 * Aggregates all isolated structural context engines into a unified wrapper chain.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryProvider>
  );
}