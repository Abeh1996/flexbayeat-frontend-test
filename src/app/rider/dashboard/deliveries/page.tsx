// src/app/rider/dashboard/deliveries/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  Package,
  Store,
  MapPin,
  Check,
  X,
  Navigation,
  AlertCircle,
  Bike,
  Flag,
} from 'lucide-react';
import {
  useAvailableDeliveriesQuery,
  useAssignedDeliveriesQuery,
} from '@/features/Rider/hooks/useRiderDeliveriesQuery';
import { useRiderMutation } from '@/features/Rider/hooks/useRiderMutation';
import {
  formatXAF,
  deliveryEarnings,
  deliveryVendorName,
  deliveryDestAddr,
} from '@/features/Rider/utils/format';
import type { DeliveryTask, DeliveryStatus } from '@/features/Rider/types';
import {
  RiderBreadcrumbs,
  RiderPageHeader,
  RiderBadge,
  RiderBtn,
  RiderModal,
  RiderSlideOver,
  RiderCardSkeleton,
  RiderDropdownActions,
} from '@/features/Rider/components/RiderUI';

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  PENDING: 'Pending',
  READY_FOR_PICKUP: 'Ready for pickup',
  ASSIGNED: 'Assigned',
  EN_ROUTE_TO_VENDOR: 'Going to vendor',
  ARRIVED_AT_VENDOR: 'At vendor',
  PICKED_UP: 'Picked up',
  OUT_FOR_DELIVERY: 'Out for delivery',
  EN_ROUTE_TO_BUYER: 'On the way',
  ARRIVED_AT_BUYER: 'Arrived',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
};

const STATUS_FLOW: DeliveryStatus[] = [
  'ASSIGNED',
  'EN_ROUTE_TO_VENDOR',
  'ARRIVED_AT_VENDOR',
  'PICKED_UP',
  'EN_ROUTE_TO_BUYER',
  'ARRIVED_AT_BUYER',
  'DELIVERED',
];

type Tab = 'available' | 'active';

export default function DeliveriesPage() {
  const [tab, setTab] = useState<Tab>('available');

  return (
    <div>
      <RiderBreadcrumbs crumbs={[{ label: 'Dashboard', href: '/rider/dashboard' }, { label: 'Deliveries' }]} />
      <RiderPageHeader title="Deliveries" />

      {/* Tab bar — compact segmented control */}
      <div className="flex gap-1 bg-zinc-100 rounded-[3px] p-0.5 w-fit mb-5">
        {(['available', 'active'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-[2px] transition-all ${
              tab === t
                ? 'bg-white text-zinc-800 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'available' ? <AvailableDeliveries /> : <ActiveDeliveries />}
    </div>
  );
}

// ── Available ────────────────────────────────────────────────────────────────
function AvailableDeliveries() {
  const { data: deliveries, isLoading, isError, refetch } =
    useAvailableDeliveriesQuery();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2.5">
        <RiderCardSkeleton />
        <RiderCardSkeleton />
        <RiderCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-zinc-200/70 px-6 py-10 text-center">
        <AlertCircle size={24} className="mx-auto text-zinc-400" />
        <p className="text-sm font-medium text-zinc-700 mt-3">
          Could not load deliveries
        </p>
        <RiderBtn variant="secondary" size="sm" onClick={() => refetch()} className="mt-3">
          Try again
        </RiderBtn>
      </div>
    );
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/70 px-6 py-12 text-center">
        <Package size={26} className="mx-auto text-zinc-300" />
        <p className="text-sm font-medium text-zinc-700 mt-3">
          No available deliveries
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          New tasks appear here as orders come in
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-[11px] font-medium text-zinc-500 mb-3">
        {deliveries.length} task{deliveries.length !== 1 ? 's' : ''} nearby
      </div>
      <div className="space-y-1.5">
        {deliveries.map((del) => (
          <AvailableCard
            key={del.id}
            delivery={del}
            onOpen={() => setSelectedDelivery(del)}
          />
        ))}
      </div>

      {/* Detail modal */}
      <AvailableDetailModal
        delivery={selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
      />
    </>
  );
}

function AvailableCard({
  delivery,
  onOpen,
}: {
  delivery: DeliveryTask;
  onOpen: () => void;
}) {
  const { acceptDelivery, declineDelivery, isAcceptingDelivery } = useRiderMutation();

  const vendorName = deliveryVendorName(delivery);
  const earnings = deliveryEarnings(delivery);

  return (
    <div className="bg-white border border-zinc-200/70 hover:border-zinc-300 transition-colors px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: info */}
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-[3px] flex items-center justify-center shrink-0">
              <Store size={13} className="text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate leading-snug">
                {vendorName}
              </p>
              {delivery.estimatedDistanceKm != null && (
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {delivery.estimatedDistanceKm.toFixed(1)} km
                </p>
              )}
              <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                {deliveryDestAddr(delivery)}
              </p>
            </div>
          </div>
        </button>

        {/* Price */}
        <span className="text-sm font-semibold text-emerald-600 shrink-0 tabular-nums">
          {formatXAF(earnings)}
        </span>

        {/* Actions — compact on desktop */}
        <div className="flex items-center gap-1.5 shrink-0">
          <RiderBtn
            variant="primary"
            size="sm"
            icon={Check}
            onClick={() => acceptDelivery({ deliveryId: delivery.id! })}
            loading={isAcceptingDelivery}
          >
            Accept
          </RiderBtn>
          <RiderBtn
            variant="ghost"
            size="sm"
            icon={X}
            onClick={() => declineDelivery({ id: delivery.id!, payload: { deliveryId: delivery.id!, reason: 'Not available' } })}
          >
            Pass
          </RiderBtn>
        </div>
      </div>
    </div>
  );
}

// ── Available detail modal ───────────────────────────────────────────────────
function AvailableDetailModal({
  delivery,
  onClose,
}: {
  delivery: DeliveryTask | null;
  onClose: () => void;
}) {
  const { acceptDelivery, declineDelivery, isAcceptingDelivery } = useRiderMutation();

  if (!delivery) return null;

  const vendorName = deliveryVendorName(delivery);
  const earnings = deliveryEarnings(delivery);
  const destAddr = deliveryDestAddr(delivery);
  const vendorAddr =
    delivery.vendor?.address ??
    (delivery.vendorProfile?.addressLine1
      ? `${delivery.vendorProfile.addressLine1}${
          delivery.vendorProfile.city ? `, ${delivery.vendorProfile.city}` : ''
        }`
      : null);

  return (
    <RiderModal open={!!delivery} onClose={onClose} title={vendorName}>
      <div className="space-y-4">
        {/* Destination */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
            Delivery to
          </p>
          <div className="flex items-start gap-2">
            <MapPin size={13} className="text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-zinc-700">{destAddr || '—'}</p>
          </div>
        </div>

        {/* Vendor address */}
        {vendorAddr && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
              Pickup from
            </p>
            <div className="flex items-start gap-2">
              <Store size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-zinc-700">{vendorAddr}</p>
            </div>
          </div>
        )}

        {/* Items */}
        {delivery.orderItems && delivery.orderItems.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Items ({delivery.orderItems.length})
            </p>
            <div className="space-y-1">
              {delivery.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-zinc-700">
                    {item.quantity && (
                      <span className="text-zinc-400 mr-1">×{item.quantity}</span>
                    )}
                    {item.menuItemName ?? 'Item'}
                  </span>
                  {item.totalPrice && (
                    <span className="text-zinc-600 font-medium tabular-nums">
                      {formatXAF(item.totalPrice)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Distance + earnings */}
        <div className="bg-amber-50 border border-amber-100 px-4 py-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-600">Earnings</span>
            <span className="text-base font-bold text-amber-800">{formatXAF(earnings)}</span>
          </div>
          {delivery.estimatedDistanceKm != null && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-amber-500">Distance</span>
              <span className="text-xs font-medium text-amber-600">
                {delivery.estimatedDistanceKm.toFixed(1)} km
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <RiderBtn
            variant="primary"
            icon={Check}
            onClick={() => {
              acceptDelivery({ deliveryId: delivery.id! });
              onClose();
            }}
            loading={isAcceptingDelivery}
            className="flex-1 justify-center"
          >
            Accept
          </RiderBtn>
          <RiderBtn
            variant="secondary"
            icon={X}
            onClick={() => {
              declineDelivery({ id: delivery.id!, payload: { reason: 'Not interested', deliveryId: delivery.id } });
              onClose();
            }}
            className="flex-1 justify-center"
          >
            Pass
          </RiderBtn>
        </div>
      </div>
    </RiderModal>
  );
}

// ── Active ───────────────────────────────────────────────────────────────────
function ActiveDeliveries() {
  const { data: deliveries, isLoading, isError, refetch } =
    useAssignedDeliveriesQuery();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);
  const [confirmModal, setConfirmModal] = useState<DeliveryTask | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2.5">
        <RiderCardSkeleton />
        <RiderCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-zinc-200/70 px-6 py-10 text-center">
        <AlertCircle size={24} className="mx-auto text-zinc-400" />
        <p className="text-sm font-medium text-zinc-700 mt-3">
          Could not load deliveries
        </p>
        <RiderBtn variant="secondary" size="sm" onClick={() => refetch()} className="mt-3">
          Try again
        </RiderBtn>
      </div>
    );
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/70 px-6 py-12 text-center">
        <Bike size={26} className="mx-auto text-zinc-300" />
        <p className="text-sm font-medium text-zinc-700 mt-3">
          No active deliveries
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Accept a delivery task to see it here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-[11px] font-medium text-zinc-500 mb-3">
        {deliveries.length} active task{deliveries.length !== 1 ? 's' : ''}
      </div>
      <div className="space-y-1.5">
        {deliveries.map((del) => {
          const isDelivered = del.status === 'DELIVERED';
          return (
            <button
              key={del.id}
              onClick={() => setSelectedDelivery(del)}
              className="w-full bg-white border border-zinc-200/70 hover:border-zinc-300 transition-colors px-4 py-3 flex items-center justify-between gap-4 text-left"
            >
              <div className="min-w-0 flex-1 flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-[3px] flex items-center justify-center shrink-0 ${
                    isDelivered ? 'bg-emerald-50' : 'bg-amber-50'
                  }`}
                >
                  <Store
                    size={13}
                    className={isDelivered ? 'text-emerald-500' : 'text-amber-500'}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 truncate">
                    {deliveryVendorName(del)}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                    #{(
                      del.orderNumber ?? del.orderId ?? ''
                    )
                      .slice(-6)
                      .toUpperCase() || '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={del.status} />
                <span className="text-sm font-semibold text-emerald-600 tabular-nums">
                  {formatXAF(deliveryEarnings(del))}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Delivery detail slide-over */}
      <RiderSlideOver
        open={!!selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
        title={selectedDelivery ? deliveryVendorName(selectedDelivery) : ''}
      >
        {selectedDelivery && (
          <ActiveDeliveryDetail
            delivery={selectedDelivery}
            onOpenConfirm={() => {
              setConfirmModal(selectedDelivery);
              setSelectedDelivery(null);
            }}
          />
        )}
      </RiderSlideOver>

      {/* Confirm delivery OTP modal */}
      {confirmModal && (
        <ConfirmDeliveryModal
          delivery={confirmModal}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}

// ── Active delivery detail (slide-over content) ──────────────────────────────
function ActiveDeliveryDetail({
  delivery,
  onOpenConfirm,
}: {
  delivery: DeliveryTask;
  onOpenConfirm: () => void;
}) {
  const { updateDeliveryStatus, confirmPickupAsync, isConfirmingPickup, reportIssueAsync, isReportingIssue } =
    useRiderMutation();
  const [confirmingPickup, setConfirmingPickup] = useState(false);
  const [issueModal, setIssueModal] = useState(false);
  const [issueText, setIssueText] = useState('');

  // Auto-transition ASSIGNED → EN_ROUTE_TO_VENDOR
  useEffect(() => {
    if (
      delivery.id &&
      (delivery.status === 'ASSIGNED' || delivery.status === 'READY_FOR_PICKUP')
    ) {
      updateDeliveryStatus({
        id: delivery.id,
        payload: { status: 'EN_ROUTE_TO_VENDOR' as DeliveryStatus },
      });
    }
  }, [delivery.id, delivery.status, updateDeliveryStatus]);

  const stepIndex = STATUS_FLOW.indexOf(delivery.status!);
  const currentStep = stepIndex >= 0 ? stepIndex : 0;
  const isDelivered = delivery.status === 'DELIVERED';
  const vendorName = deliveryVendorName(delivery);
  const destAddr = deliveryDestAddr(delivery);
  const earnings = deliveryEarnings(delivery);
  const orderRef = (delivery.orderNumber ?? delivery.orderId ?? '')
    .slice(-6)
    .toUpperCase() || '—';

  const handleNextStep = () => {
    if (!delivery.id) return;
    const nextIdx = currentStep + 1;
    if (nextIdx >= STATUS_FLOW.length) return;
    const nextStatus = STATUS_FLOW[nextIdx];

    if (nextStatus === 'PICKED_UP') {
      setConfirmingPickup(true);
      confirmPickupAsync(
        { id: delivery.id, payload: { pickupNotes: 'Items collected' } },
      ).finally(() => setConfirmingPickup(false));
    } else {
      updateDeliveryStatus({ id: delivery.id, payload: { status: nextStatus } });
    }
  };

  const nextLabel =
    delivery.status === 'PICKED_UP' || delivery.status === 'EN_ROUTE_TO_BUYER'
      ? 'Mark as arrived'
      : delivery.status === 'ARRIVED_AT_BUYER'
      ? 'Complete delivery'
      : 'Next step';

  return (
    <div className="space-y-5">
      {/* Order + Status */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Order
          </p>
          <p className="text-sm font-medium text-zinc-800 mt-0.5">#{orderRef}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      {/* Status progress */}
      <div>
        <div className="flex items-center gap-1">
          {STATUS_FLOW.slice(0, -1).map((status, i) => {
            const done = i < currentStep;
            const curr = i === currentStep;
            return (
              <React.Fragment key={status}>
                <div
                  className={`w-2 h-2 rounded-full ${
                    done
                      ? 'bg-emerald-400'
                      : curr
                      ? 'bg-amber-400'
                      : 'bg-zinc-200'
                  }`}
                />
                {i < STATUS_FLOW.length - 2 && (
                  <div
                    className={`flex-1 h-[3px] rounded-full ${
                      i < currentStep ? 'bg-emerald-200' : 'bg-zinc-100'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-[11px] font-medium text-zinc-500 mt-1.5">
          {STATUS_LABELS[delivery.status!] ?? delivery.status ?? '—'}
        </p>
      </div>

      {/* Vendor */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
          Pickup from
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-50 rounded-[3px] flex items-center justify-center shrink-0">
            <Store size={15} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-800">{vendorName}</p>
            {delivery.vendor?.address && (
              <p className="text-xs text-zinc-500">{delivery.vendor.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Destination */}
      {destAddr !== '—' && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Deliver to
          </p>
          <div className="flex items-start gap-2">
            <MapPin size={13} className="text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-zinc-700">{destAddr}</p>
          </div>
        </div>
      )}

      {/* Items */}
      {delivery.orderItems && delivery.orderItems.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Items
          </p>
          <div className="space-y-1">
            {delivery.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-700 truncate">
                  {item.quantity && (
                    <span className="text-zinc-400 mr-1">×{item.quantity}</span>
                  )}
                  {item.menuItemName ?? 'Item'}
                </span>
                {item.totalPrice && (
                  <span className="text-zinc-600 font-medium tabular-nums shrink-0 ml-2">
                    {formatXAF(item.totalPrice)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Earnings */}
      <div className="bg-amber-50 border border-amber-100 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-0.5">
          Earnings
        </p>
        <p className="text-lg font-bold text-amber-800">{formatXAF(earnings)}</p>
      </div>

      {/* Actions */}
      {!isDelivered && (
        <div className="space-y-2">
          <RiderBtn
            variant="primary"
            icon={Navigation}
            onClick={
              delivery.status === 'ARRIVED_AT_BUYER' ? onOpenConfirm : handleNextStep
            }
            loading={isConfirmingPickup}
            className="w-full justify-center"
          >
            {nextLabel}
          </RiderBtn>

          {/* Report issue */}
          <RiderBtn
            variant="ghost"
            icon={Flag}
            onClick={() => setIssueModal(true)}
            className="w-full justify-center"
          >
            Report an issue
          </RiderBtn>
        </div>
      )}

      {/* Delivered state */}
      {isDelivered && (
        <div className="bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center gap-2">
          <Check size={14} className="text-emerald-500" />
          <span className="text-sm font-medium text-emerald-700">Delivered</span>
        </div>
      )}

      {/* Issue modal */}
      <RiderModal
        open={issueModal}
        onClose={() => setIssueModal(false)}
        title="Report Issue"
      >
        <div className="space-y-3">
          <p className="text-xs text-zinc-600">
            Describe the issue with this delivery
          </p>
          <textarea
            value={issueText}
            onChange={(e) => setIssueText(e.target.value)}
            placeholder="Wrong address, missing items, etc."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors resize-none text-zinc-800 placeholder:text-zinc-400"
          />
          <div className="flex items-center gap-2">
            <RiderBtn
              variant="danger"
              size="sm"
              icon={Flag}
              disabled={!issueText.trim()}
              loading={isReportingIssue}
              onClick={() => {
                if (!delivery.id || !issueText.trim()) return;
                reportIssueAsync({
                  id: delivery.id,
                  payload: { issueType: 'OTHER', description: issueText.trim() },
                });
                setIssueText('');
                setIssueModal(false);
              }}
              className="flex-1 justify-center"
            >
              Submit report
            </RiderBtn>
            <RiderBtn
              variant="ghost"
              size="sm"
              onClick={() => setIssueModal(false)}
            >
              Cancel
            </RiderBtn>
          </div>
        </div>
      </RiderModal>
    </div>
  );
}

// ── Confirm delivery OTP modal ───────────────────────────────────────────────
function ConfirmDeliveryModal({
  delivery,
  onClose,
}: {
  delivery: DeliveryTask;
  onClose: () => void;
}) {
  const { confirmDeliveryAsync, isConfirmingDelivery } = useRiderMutation();
  const [otp, setOtp] = useState('');
  const [notes, setNotes] = useState('');

  const handleConfirm = async () => {
    if (!delivery.id) return;
    await confirmDeliveryAsync({
      id: delivery.id,
      payload: { deliveryCode: otp, notes },
    });
    onClose();
  };

  return (
    <RiderModal open={!!delivery} onClose={onClose} title="Confirm Delivery" width="sm">
      <div className="space-y-4">
        <p className="text-xs text-zinc-600">
          Enter the delivery code provided by the customer to complete this delivery.
        </p>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
            Delivery Code (OTP)
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors text-center text-lg font-bold tracking-widest text-zinc-800 placeholder:text-zinc-300"
            maxLength={6}
            autoFocus
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
            Notes (optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Delivery completed successfully"
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors text-zinc-800 placeholder:text-zinc-400"
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <RiderBtn
            variant="primary"
            icon={Check}
            onClick={handleConfirm}
            loading={isConfirmingDelivery}
            disabled={otp.length < 4}
            className="flex-1 justify-center"
          >
            Confirm Delivery
          </RiderBtn>
          <RiderBtn variant="ghost" onClick={onClose}>
            Cancel
          </RiderBtn>
        </div>
      </div>
    </RiderModal>
  );
}

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string | undefined }) {
  const badge =
    STATUS_LABELS[status as keyof typeof STATUS_LABELS] ??
    status?.replace(/_/g, ' ').toLowerCase() ??
    '—';

  const variant =
    status === 'DELIVERED'
      ? ('success' as const)
      : status === 'EN_ROUTE_TO_VENDOR' || status === 'EN_ROUTE_TO_BUYER'
      ? ('info' as const)
      : status === 'ARRIVED_AT_VENDOR' || status === 'ARRIVED_AT_BUYER'
      ? ('warning' as const)
      : ('default' as const);

  return <RiderBadge variant={variant}>{badge}</RiderBadge>;
}