// src/app/rider/dashboard/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Bike, Wallet, Store, ArrowRight, MapPin } from 'lucide-react';
import { useAssignedDeliveriesQuery } from '@/features/Rider/hooks/useRiderDeliveriesQuery';
import { useRiderProfileQuery } from '@/features/Rider/hooks/useRiderProfileQuery';
import { useRiderSocket } from '@/features/Rider/hooks/useRiderSocket';
import {
  formatXAF,
  deliveryEarnings,
  deliveryVendorName,
  deliveryDestAddr,
} from '@/features/Rider/utils/format';
import {
  RiderBreadcrumbs,
  RiderPageHeader,
  RiderStatTile,
  RiderBadge,
  RiderBtn,
  RiderSlideOver,
  RiderStatSkeleton,
  RiderCardSkeleton,
  RiderSkeleton,
} from '@/features/Rider/components/RiderUI';
import type { DeliveryTask } from '@/features/Rider/types';

const STATUS_BADGE = {
  EN_ROUTE_TO_VENDOR: { label: 'Going to vendor', variant: 'info' as const },
  ARRIVED_AT_VENDOR: { label: 'At vendor', variant: 'warning' as const },
  PICKED_UP: { label: 'Picked up', variant: 'info' as const },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', variant: 'info' as const },
  EN_ROUTE_TO_BUYER: { label: 'On the way', variant: 'info' as const },
  ARRIVED_AT_BUYER: { label: 'Arrived', variant: 'warning' as const },
  DELIVERED: { label: 'Delivered', variant: 'success' as const },
  ASSIGNED: { label: 'Assigned', variant: 'info' as const },
  READY_FOR_PICKUP: { label: 'Ready for pickup', variant: 'warning' as const },
};

function badgeForStatus(status: string | undefined) {
  return STATUS_BADGE[status as keyof typeof STATUS_BADGE] ?? {
    label: status?.replace(/_/g, ' ').toLowerCase() ?? '—',
    variant: 'default' as const,
  };
}

export default function RiderDashboardPage() {
  useRiderSocket();
  const { riderProfile, isLoadingRiderProfile } = useRiderProfileQuery();
  const { data: assignedDeliveries, isLoading: loadingAssigned } =
    useAssignedDeliveriesQuery();

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);

  const activeDeliveries =
    assignedDeliveries?.filter(
      (d) =>
        d.status !== 'DELIVERED' &&
        d.status !== 'FAILED' &&
        d.status !== 'RETURNED' &&
        d.status !== 'CANCELLED',
    ) ?? [];

  const vehicleInfo =
    riderProfile?.vehicleType || riderProfile?.vehiclePlate
      ? `${riderProfile.vehicleType?.toLowerCase?.() ?? ''} · ${riderProfile.vehiclePlate ?? ''}`
      : null;

  const walletBalance = riderProfile?.wallet?.balance
    ? formatXAF(riderProfile.wallet.balance)
    : '—';

  const rating = riderProfile?.averageRating
    ? parseFloat(riderProfile.averageRating).toFixed(1)
    : '—';

  const totalDeliveries =
    riderProfile?.totalDeliveries != null
      ? String(riderProfile.totalDeliveries)
      : '—';

  const isLoading = isLoadingRiderProfile || loadingAssigned;

  return (
    <div>
      <RiderBreadcrumbs crumbs={[{ label: 'Dashboard' }]} />
      <RiderPageHeader
        title="Overview"
        description={vehicleInfo ?? 'Ready to ride'}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {isLoading ? (
          <>
            <RiderStatSkeleton />
            <RiderStatSkeleton />
            <RiderStatSkeleton />
            <RiderStatSkeleton />
          </>
        ) : (
          <>
            <RiderStatTile
              label="Active Deliveries"
              value={String(activeDeliveries.length)}
              icon={Package}
            />
            <RiderStatTile
              label="Wallet Balance"
              value={walletBalance}
              icon={Wallet}
            />
            <RiderStatTile
              label="Rating"
              value={rating}
            />
            <RiderStatTile
              label="Total Deliveries"
              value={totalDeliveries}
            />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link href="/rider/dashboard/deliveries">
          <RiderBtn variant="primary" icon={Store}>
            Find deliveries
          </RiderBtn>
        </Link>
        <Link href="/rider/dashboard/deliveries?tab=active">
          <RiderBtn variant="secondary" icon={Package}>
            My active ({activeDeliveries.length})
          </RiderBtn>
        </Link>
      </div>

      {/* Active deliveries */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            In Progress
          </h2>
          {activeDeliveries.length > 3 && (
            <Link
              href="/rider/dashboard/deliveries?tab=active"
              className="text-[11px] font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              View all ({activeDeliveries.length})
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <RiderCardSkeleton />
            <RiderCardSkeleton />
          </div>
        ) : activeDeliveries.length === 0 ? (
          <div className="bg-white border border-zinc-200/70 px-5 py-8 text-center">
            <Package size={22} className="mx-auto text-zinc-300" />
            <p className="text-sm font-medium text-zinc-600 mt-2">No active deliveries</p>
            <p className="text-xs text-zinc-400 mt-1">
              Accept a delivery to see it here
            </p>
            <Link href="/rider/dashboard/deliveries" className="mt-3 inline-block">
              <RiderBtn variant="primary" size="sm" icon={Store}>
                Browse available
              </RiderBtn>
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {activeDeliveries.slice(0, 5).map((del) => {
              const badge = badgeForStatus(del.status);
              return (
                <button
                  key={del.id ?? Math.random()}
                  onClick={() => setSelectedDelivery(del)}
                  className="w-full bg-white border border-zinc-200/70 hover:border-zinc-300 transition-colors px-4 py-3 flex items-center justify-between gap-4 text-left"
                >
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-[3px] flex items-center justify-center shrink-0">
                      <Store size={13} className="text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {deliveryVendorName(del)}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                        {deliveryDestAddr(del)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <RiderBadge variant={badge.variant}>{badge.label}</RiderBadge>
                    <span className="text-sm font-semibold text-emerald-600 tabular-nums">
                      {formatXAF(deliveryEarnings(del))}
                    </span>
                    <ArrowRight size={13} className="text-zinc-300" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Delivery detail slide-over */}
      <RiderSlideOver
        open={!!selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
        title={selectedDelivery ? deliveryVendorName(selectedDelivery) : ''}
      >
        {selectedDelivery && <DeliveryDetail delivery={selectedDelivery} />}
      </RiderSlideOver>
    </div>
  );
}

function DeliveryDetail({ delivery }: { delivery: DeliveryTask }) {
  const badge = badgeForStatus(delivery.status);
  const earnings = deliveryEarnings(delivery);
  const vendorName = deliveryVendorName(delivery);
  const destAddr = deliveryDestAddr(delivery);
  const orderRef = (delivery.orderNumber ?? delivery.orderId ?? '').slice(-6).toUpperCase() || '—';

  return (
    <div className="space-y-5">
      {/* Status */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
          Status
        </p>
        <RiderBadge variant={badge.variant} size="md">
          {badge.label}
        </RiderBadge>
      </div>

      {/* Order ref */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
          Order
        </p>
        <p className="text-sm font-medium text-zinc-800">#{orderRef}</p>
      </div>

      {/* Vendor */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
          Vendor
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-50 rounded-[3px] flex items-center justify-center shrink-0">
            <Store size={15} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-800">{vendorName}</p>
            {delivery.vendor?.address && (
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="shrink-0" />
                {delivery.vendor.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Destination */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
          Delivery To
        </p>
        <div className="flex items-start gap-2">
          <MapPin size={13} className="text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-sm text-zinc-700">{destAddr || '—'}</p>
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-amber-50 border border-amber-100 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-0.5">
          Earnings
        </p>
        <p className="text-lg font-bold text-amber-800">{formatXAF(earnings)}</p>
      </div>

      {/* Quick action */}
      <Link href={`/rider/dashboard/deliveries?tab=active`} className="block">
        <RiderBtn variant="primary" className="w-full justify-center" icon={ArrowRight}>
          Go to delivery
        </RiderBtn>
      </Link>
    </div>
  );
}