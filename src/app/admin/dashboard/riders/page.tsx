// src/app/admin/(dashboard)/dashboard/riders/page.tsx
'use client';

import { usePendingRidersQuery } from '@/features/Admin/hooks/usePendingRidersQuery';
import { PendingRiderCard } from '@/features/Admin/components/PendingRiderCard';
import { AlertCircle, FileQuestion } from 'lucide-react';

const CardSkeleton = () => (
    <div className="bg-white border border-zinc-200 p-6">
        <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-zinc-100 animate-pulse rounded-full shrink-0"></div>
            <div className="flex-1 space-y-2">
                <div className="w-1/2 h-5 bg-zinc-100 animate-pulse"></div>
                <div className="w-2/3 h-4 bg-zinc-100 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-24 h-10 bg-zinc-100 animate-pulse"></div>
                <div className="w-24 h-10 bg-zinc-100 animate-pulse"></div>
            </div>
        </div>
    </div>
);

export default function PendingRidersPage() {
  const { pendingRiders, isLoading, isError, error, refetch } = usePendingRidersQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-white border border-red-200 p-8 text-center">
            <AlertCircle size={40} className="mx-auto text-red-500" />
            <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mt-4">Failed to load riders</h3>
            <p className="text-sm font-medium text-red-600 mt-1">{error?.message || 'An unexpected error occurred.'}</p>
            <button 
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 text-sm font-bold text-white bg-zinc-800 uppercase tracking-widest"
            >
                Retry
            </button>
        </div>
      );
    }

    if (pendingRiders.length === 0) {
      return (
        <div className="bg-white border border-zinc-200 p-12 text-center">
            <FileQuestion size={40} className="mx-auto text-zinc-400" />
            <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mt-4">No Pending Riders</h3>
            <p className="text-sm font-medium text-zinc-600 mt-1">There are currently no new riders awaiting approval.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingRiders.map((rider) => (
          <PendingRiderCard key={rider.id} rider={rider} />
        ))}
      </div>
    );
  };

  return (
    <div>
        <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Awaiting Approval ({pendingRiders?.length || 0})
            </h2>
        </div>
        {renderContent()}
    </div>
  );
}
