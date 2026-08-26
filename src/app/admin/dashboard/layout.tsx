// src/app/admin/dashboard/layout.tsx
'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAdminProfileQuery } from '@/features/Admin/hooks/useAdminProfileQuery';
import { Sidebar } from '@/features/Admin/components/Sidebar';
import { Topbar } from '@/features/Admin/components/Topbar';

function getPageTitle(pathname: string): string {
  const adminBase = '/admin/dashboard';
  if (pathname === adminBase) return 'Overview';
  if (pathname.startsWith(`${adminBase}/vendors`)) return 'Pending Vendors';
  if (pathname.startsWith(`${adminBase}/riders`)) return 'Pending Riders';
  if (pathname.startsWith(`${adminBase}/deliveries`)) return 'Deliveries';
  if (pathname.startsWith(`${adminBase}/settings`)) return 'Settings';
  return 'Dashboard';
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { adminProfile, isLoadingAdminProfile, isErrorAdminProfile, error } = useAdminProfileQuery();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (isLoadingAdminProfile) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={22} className="text-amber-500 animate-spin" />
          <p className="text-xs font-medium text-zinc-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (isErrorAdminProfile) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 rounded-xl px-5 py-4 max-w-md shadow-sm">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Error Loading Dashboard</p>
            <p className="text-xs text-red-600 mt-1">
              {error?.message || 'An unexpected error occurred.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 size={22} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64">
        <Topbar
          adminRole={adminProfile?.adminRole}
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={getPageTitle(pathname)}
        />
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}