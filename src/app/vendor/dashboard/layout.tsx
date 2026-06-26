// src/app/vendor/(dashboard)/layout.tsx
'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { useVendorAccessStatus } from '@/features/vendor/hooks/useVendorAccessStatus';
import { PendingApprovalScreen } from '@/features/vendor/components/PendingApprovalScreen';
import { RejectedScreen } from '@/features/vendor/components/RejectedScreen';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';

// Maps a pathname to the title shown in the topbar.
// Extend this as new dashboard pages are added.
function getPageTitle(pathname: string): string {
  if (pathname === '/vendor/dashboard') return 'Overview';
  if (pathname.startsWith('/vendor/dashboard/orders')) return 'Orders';
  if (pathname.startsWith('/vendor/dashboard/menu')) return 'Menu';
  if (pathname.startsWith('/vendor/dashboard/earnings')) return 'Earnings';
  if (pathname.startsWith('/vendor/dashboard/settings')) return 'Settings';
  return 'Dashboard';
}

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { state, vendorProfile, rejectionReason } = useVendorAccessStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 size={22} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4 max-w-md">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Could not load your account</p>
            <p className="text-xs text-red-600 mt-1">
              Something went wrong loading your vendor account. Try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending verification ─────────────────────────────────────────────────
  if (state === 'pending') {
    return <PendingApprovalScreen />;
  }

  // ── Rejected / suspended / inactive ──────────────────────────────────────
  // if (state === 'rejected') {
  //   return <RejectedScreen rejectionReason={rejectionReason} />;
  // }

  // ── Active — full dashboard chrome ───────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-stone-50">
      <Sidebar
        businessName={vendorProfile?.businessName}
        logoUrl={vendorProfile?.logoUrl ?? undefined}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64">
        <Topbar
          businessName={vendorProfile?.businessName}
          logoUrl={vendorProfile?.logoUrl ?? undefined}
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={getPageTitle(pathname)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}