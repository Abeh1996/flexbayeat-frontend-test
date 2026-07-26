// src/app/admin/(dashboard)/dashboard/page.tsx
'use client';
import { usePendingVendorsQuery } from '@/features/Admin/hooks/usePendingVendorsQuery';
import { usePendingRidersQuery } from '@/features/Admin/hooks/usePendingRidersQuery';
import { Users, Bike, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const StatCardSkeleton = () => (
  <div className="bg-white border border-zinc-200 p-6">
    <div className="w-2/3 h-6 bg-zinc-100 animate-pulse mb-3"></div>
    <div className="w-1/3 h-4 bg-zinc-100 animate-pulse"></div>
  </div>
);

const QuickLinkSkeleton = () => (
    <div className="bg-white border border-zinc-200 p-6">
      <div className="w-1/2 h-5 bg-zinc-100 animate-pulse"></div>
    </div>
)

export default function AdminDashboardPage() {
  const { pendingVendors, isLoading: isLoadingVendors } = usePendingVendorsQuery();
  const { pendingRiders, isLoading: isLoadingRiders } = usePendingRidersQuery();

  const isLoading = isLoadingVendors || isLoadingRiders;
  const totalPending = (pendingVendors?.length || 0) + (pendingRiders?.length || 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white border-l-4 border-amber-500 p-6">
              <div className="flex items-center gap-4">
                <Users size={24} className="text-zinc-400" />
                <div>
                  <h3 className="text-2xl font-black text-zinc-900">{pendingVendors.length}</h3>
                  <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Pending Vendors</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-l-4 border-amber-500 p-6">
                <div className="flex items-center gap-4">
                    <Bike size={24} className="text-zinc-400" />
                    <div>
                        <h3 className="text-2xl font-black text-zinc-900">{pendingRiders.length}</h3>
                        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Pending Riders</p>
                    </div>
                </div>
            </div>
          </>
        )}
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickLinkSkeleton />
            <QuickLinkSkeleton />
         </div>
      ) : totalPending > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/dashboard/vendors" className="bg-white border border-zinc-200 p-6 flex justify-between items-center hover:border-amber-500 transition-colors">
            <h4 className="text-base font-bold text-zinc-900">Review Vendors</h4>
            <ArrowRight size={20} className="text-zinc-400" />
          </Link>
          <Link href="/admin/dashboard/riders" className="bg-white border border-zinc-200 p-6 flex justify-between items-center hover:border-amber-500 transition-colors">
            <h4 className="text-base font-bold text-zinc-900">Review Riders</h4>
            <ArrowRight size={20} className="text-zinc-400" />
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 p-12 text-center">
            <CheckCircle size={40} className="mx-auto text-emerald-500" />
            <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mt-4">All Caught Up!</h3>
            <p className="text-sm font-medium text-zinc-600 mt-1">There are no pending vendors or riders awaiting approval.</p>
        </div>
      )}
    </div>
  );
}
