// src/app/rider/dashboard/layout.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { useRiderAccessStatus } from '@/features/Rider/hooks/useRiderAccessStatus';
import { useRiderLocation } from '@/features/Rider/hooks/useRiderLocation';
import { RiderSidebar } from '@/features/Rider/components/RiderSidebar';
import { RiderTopbar } from '@/features/Rider/components/RiderTopbar';
import { PendingApprovalScreen } from '@/features/Rider/components/PendingApprovalScreen';
import { RejectedScreen } from '@/features/Rider/components/RejectedScreen';

function getPageTitle(pathname: string): string {
  const base = '/rider/dashboard';
  if (pathname === base) return 'Overview';
  if (pathname.startsWith(`${base}/deliveries`)) return 'Deliveries';
  if (pathname.startsWith(`${base}/earnings`)) return 'Earnings';
  if (pathname.startsWith(`${base}/profile`)) return 'Profile';
  if (pathname.startsWith(`${base}/settings`)) return 'Settings';
  return 'Dashboard';
}

export default function RiderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hydration guard — js-cookie reads document.cookie which doesn't exist on server
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { state, isLoading, rejectionReason } = useRiderAccessStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Location / GPS tracking — lives at layout level so it persists across pages
  const locationCtrl = useRiderLocation();

  // ── Server render / not yet mounted ────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={18} className="animate-spin text-zinc-300" />
          <p className="text-xs font-medium text-zinc-300">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={18} className="animate-spin text-zinc-300" />
          <p className="text-xs font-medium text-zinc-400">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Error / no profile ─────────────────────────────────────────────────────
  if (state === 'error' || state === 'no_profile') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4 max-w-md">
          <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {state === 'no_profile'
                ? 'Profile Not Found'
                : 'Something went wrong'}
            </p>
            <p className="text-xs text-red-600 mt-1">
              {state === 'no_profile'
                ? 'Your rider profile could not be loaded. Please complete registration first.'
                : 'Unable to load your rider information. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending approval gate ──────────────────────────────────────────────────
  if (state === 'pending') {
    return <PendingApprovalScreen />;
  }

  // ── Rejected gate ──────────────────────────────────────────────────────────
  if (state === 'rejected') {
    return <RejectedScreen reason={rejectionReason} />;
  }

  // ── Active / dashboard ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <RiderSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <RiderTopbar
          pageTitle={getPageTitle(pathname)}
          onMenuClick={() => setSidebarOpen(true)}
          gpsStatus={locationCtrl.gpsStatus}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}