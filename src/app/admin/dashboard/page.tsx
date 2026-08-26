// src/app/admin/dashboard/page.tsx
'use client';
import { usePendingVendorsQuery } from '@/features/Admin/hooks/usePendingVendorsQuery';
import { usePendingRidersQuery } from '@/features/Admin/hooks/usePendingRidersQuery';
import { useUnassignedOrdersQuery, useAssignedOrdersQuery } from '@/features/Admin/hooks/useAdminDeliveryQueries';
import { Users, Bike, Package, Truck, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/features/Admin/components/DataTable';

function StatCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="w-8 h-8 bg-zinc-100 animate-pulse rounded-lg mb-3" />
      <div className="w-16 h-7 bg-zinc-100 animate-pulse rounded mb-1" />
      <div className="w-24 h-4 bg-zinc-100 animate-pulse rounded" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const { pendingVendors, isLoading: isLoadingVendors } = usePendingVendorsQuery();
  const { pendingRiders, isLoading: isLoadingRiders } = usePendingRidersQuery();
  const { data: unassignedData, isLoading: isLoadingUnassigned } = useUnassignedOrdersQuery(1, 5);
  const { data: assignedData, isLoading: isLoadingAssigned } = useAssignedOrdersQuery(1, 10);

  const isLoading = isLoadingVendors || isLoadingRiders || isLoadingUnassigned || isLoadingAssigned;
  const pendingVendorCount = pendingVendors?.length || 0;
  const pendingRiderCount = pendingRiders?.length || 0;
  const unassignedCount = unassignedData?.orders?.length || 0;
  const assignedRecent = (assignedData?.deliveries || []).slice(0, 5);

  const statCards = [
    {
      label: 'Pending Vendors',
      value: pendingVendorCount,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/dashboard/vendors',
    },
    {
      label: 'Pending Riders',
      value: pendingRiderCount,
      icon: Bike,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/dashboard/riders',
    },
    {
      label: 'Unassigned Orders',
      value: unassignedCount,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/dashboard/deliveries?tab=unassigned',
    },
    {
      label: 'Active Deliveries',
      value: (assignedData?.deliveries || []).filter((o) => !['DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED'].includes(o.deliveryStatus || '')).length,
      icon: Truck,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      href: '/admin/dashboard/deliveries?tab=assigned',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Overview</h1>
          <p className="text-sm text-zinc-500 mt-1">Platform activity and pending actions</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon size={17} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">{card.label}</p>
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-medium text-amber-600">View all</span>
                <ArrowRight size={10} className="text-amber-500" />
              </div>
            </Link>
          ))
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="w-1/3 h-5 bg-zinc-100 animate-pulse rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 animate-pulse rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="w-2/3 h-4 bg-zinc-100 animate-pulse rounded" />
                    <div className="w-1/2 h-3 bg-zinc-100 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="w-1/3 h-5 bg-zinc-100 animate-pulse rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 animate-pulse rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="w-2/3 h-4 bg-zinc-100 animate-pulse rounded" />
                    <div className="w-1/2 h-3 bg-zinc-100 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Pending approvals — show if anything needs attention */}
          {(pendingVendorCount > 0 || pendingRiderCount > 0) && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Pending Approvals
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingVendorCount > 0 && (
                  <Link
                    href="/admin/dashboard/vendors"
                    className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-5 py-4 hover:border-amber-300 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Users size={16} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{pendingVendorCount}</p>
                        <p className="text-xs text-zinc-500">Vendors awaiting approval</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-zinc-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                )}
                {pendingRiderCount > 0 && (
                  <Link
                    href="/admin/dashboard/riders"
                    className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-5 py-4 hover:border-amber-300 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Bike size={16} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{pendingRiderCount}</p>
                        <p className="text-xs text-zinc-500">Riders awaiting approval</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                  </Link>
                )}
              </div>

              <div className="h-px bg-zinc-200 my-6" />
            </div>
          )}

          {/* Recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent unassigned */}
            <div className="bg-white border border-zinc-200 rounded-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Recent Unassigned Orders
                </h2>
                <Link href="/admin/dashboard/deliveries?tab=unassigned" className="text-[10px] font-medium text-amber-600 hover:text-amber-700 transition-colors">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-zinc-50">
                {unassignedCount === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <CheckCircle size={20} className="mx-auto text-emerald-400" />
                    <p className="text-xs font-medium text-zinc-500 mt-2">All orders assigned</p>
                  </div>
                ) : (
                  unassignedData!.orders!.slice(0, 5).map((order) => (
                    <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-800 truncate">
                          #{order.orderNumber || order.id?.slice(-8).toUpperCase() || '—'}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {order.vendorProfile?.businessName || 'Vendor'}
                        </p>
                      </div>
                      <Link
                        href="/admin/dashboard/deliveries?tab=unassigned"
                        className="text-[10px] font-medium text-amber-600 hover:text-amber-700 shrink-0"
                      >
                        Assign &rarr;
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent assigned */}
            <div className="bg-white border border-zinc-200 rounded-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Recent Deliveries
                </h2>
                <Link href="/admin/dashboard/deliveries?tab=assigned" className="text-[10px] font-medium text-amber-600 hover:text-amber-700 transition-colors">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-zinc-50">
                {assignedRecent.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Package size={20} className="mx-auto text-zinc-300" />
                    <p className="text-xs font-medium text-zinc-500 mt-2">No active deliveries</p>
                  </div>
                ) : (
                  assignedRecent.map((delivery) => (
                    <div key={delivery.deliveryId || delivery.orderId} className="px-5 py-3 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-800 truncate">
                          #{delivery.order?.orderNumber || delivery.orderId?.slice(-8).toUpperCase() || '—'}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {delivery.order?.vendorProfile?.businessName || 'Vendor'}
                        </p>
                      </div>
                      <StatusBadge status={delivery.deliveryStatus || 'PENDING'} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}