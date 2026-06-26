// src/app/vendor/(dashboard)/dashboard/orders/page.tsx
'use client';
import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  PackageCheck,
  Loader2,
  RefreshCw,
  AlertCircle,
  Phone,
  User,
  Receipt,
} from 'lucide-react';
import { useActiveOrdersQuery, useOrderHistoryQuery } from '@/features/vendor/hooks/useOrdersQuery';
import { useOrdersMutation } from '@/features/vendor/hooks/useOrdersMutation';
import { Order, OrderStatus } from '@/features/vendor/types/orders.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING:          { label: 'New Order',        color: 'text-amber-700',   bg: 'bg-amber-100' },
  ACCEPTED:         { label: 'Accepted',          color: 'text-blue-700',    bg: 'bg-blue-100' },
  REJECTED:         { label: 'Rejected',          color: 'text-red-600',     bg: 'bg-red-100' },
  PREPARING:        { label: 'Preparing',         color: 'text-purple-700',  bg: 'bg-purple-100' },
  READY_FOR_PICKUP: { label: 'Ready for Pickup',  color: 'text-emerald-700', bg: 'bg-emerald-100' },
  RIDER_ASSIGNED:   { label: 'Rider Assigned',    color: 'text-teal-700',    bg: 'bg-teal-100' },
  PICKED_UP:        { label: 'Picked Up',         color: 'text-teal-700',    bg: 'bg-teal-100' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',  color: 'text-teal-700',    bg: 'bg-teal-100' },
  DELIVERED:        { label: 'Delivered',         color: 'text-emerald-700', bg: 'bg-emerald-100' },
  CANCELLED:        { label: 'Cancelled',         color: 'text-zinc-500',    bg: 'bg-zinc-100' },
  DISPUTED:         { label: 'Disputed',          color: 'text-red-600',     bg: 'bg-red-100' },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'text-zinc-600', bg: 'bg-zinc-100' };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function formatAmount(val?: number | string | null): string {
  if (val === undefined || val === null) return '—';
  return `${Number(val).toLocaleString()} XAF`;
}

// ── Inline accept form ────────────────────────────────────────────────────────
function AcceptForm({
  onAccept,
  onCancel,
  isLoading,
}: {
  onAccept: (prepMin?: number) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [prepMin, setPrepMin] = useState('');
  return (
    <div className="mt-3 flex items-center gap-2 flex-wrap">
      <input
        type="number"
        min={1}
        value={prepMin}
        onChange={(e) => setPrepMin(e.target.value)}
        placeholder="Prep time (min)"
        className="w-36 px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-amber-500"
      />
      <button
        onClick={() => onAccept(prepMin ? Number(prepMin) : undefined)}
        disabled={isLoading}
        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
        Confirm Accept
      </button>
      <button
        onClick={onCancel}
        className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 px-2 py-2 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

// ── Inline reject form ────────────────────────────────────────────────────────
function RejectForm({
  onReject,
  onCancel,
  isLoading,
}: {
  onReject: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState('');
  return (
    <div className="mt-3 space-y-2">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for rejection…"
        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-red-400"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => reason.trim() && onReject(reason.trim())}
          disabled={isLoading || !reason.trim()}
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
          Confirm Reject
        </button>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 px-2 py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onAccept,
  onReject,
  onUpdateStatus,
  isAccepting,
  isRejecting,
  isUpdatingStatus,
}: {
  order: Order;
  onAccept: (id: string, prepMin?: number) => void;
  onReject: (id: string, reason: string) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  isAccepting: boolean;
  isRejecting: boolean;
  isUpdatingStatus: boolean;
}) {
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);

  // Derive items from possible field names — log to verify
  const items = order.items ?? order.orderItems ?? [];
  const total = order.totalAmount ?? order.total;
  const customerName = order.customer?.name ?? 'Customer';
  const customerPhone = order.customer?.phone;

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-zinc-900">
              #{order.orderNumber ?? order.id.slice(0, 8).toUpperCase()}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(order.createdAt)}
          </p>
        </div>
        <span className="text-base font-black text-zinc-900 shrink-0">
          {formatAmount(total)}
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-3 py-2.5 px-3 bg-zinc-50 rounded-lg">
        <div className="w-7 h-7 bg-zinc-200 rounded-full flex items-center justify-center shrink-0">
          <User size={13} className="text-zinc-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-800 truncate">{customerName}</p>
          {customerPhone && (
            <a
              href={`tel:${customerPhone}`}
              className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              <Phone size={10} />
              {customerPhone}
            </a>
          )}
        </div>
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div className="space-y-1.5">
          {items.map((item, idx) => (
            <div key={item.id ?? idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {item.quantity}
                </span>
                <span className="text-sm text-zinc-700 truncate">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-zinc-500 shrink-0">
                {formatAmount(item.price)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions based on status */}
      {order.status === 'PENDING' && !showAccept && !showReject && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setShowAccept(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
          >
            <CheckCircle2 size={13} />
            Accept
          </button>
          <button
            onClick={() => setShowReject(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold py-2.5 rounded-lg border border-red-200 transition-colors"
          >
            <XCircle size={13} />
            Reject
          </button>
        </div>
      )}

      {showAccept && (
        <AcceptForm
          onAccept={(prepMin) => {
            onAccept(order.id, prepMin);
            setShowAccept(false);
          }}
          onCancel={() => setShowAccept(false)}
          isLoading={isAccepting}
        />
      )}

      {showReject && (
        <RejectForm
          onReject={(reason) => {
            onReject(order.id, reason);
            setShowReject(false);
          }}
          onCancel={() => setShowReject(false)}
          isLoading={isRejecting}
        />
      )}

      {order.status === 'ACCEPTED' && (
        <button
          onClick={() => onUpdateStatus(order.id, 'PREPARING')}
          disabled={isUpdatingStatus}
          className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
        >
          {isUpdatingStatus ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <ChefHat size={13} />
          )}
          Start Preparing
        </button>
      )}

      {order.status === 'PREPARING' && (
        <button
          onClick={() => onUpdateStatus(order.id, 'READY_FOR_PICKUP')}
          disabled={isUpdatingStatus}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
        >
          {isUpdatingStatus ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <PackageCheck size={13} />
          )}
          Mark Ready for Pickup
        </button>
      )}

      {order.status === 'READY_FOR_PICKUP' && (
        <div className="flex items-center gap-2 py-2 px-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <PackageCheck size={14} className="text-emerald-500 shrink-0" />
          <p className="text-xs font-semibold text-emerald-700">
            Waiting for rider to pick up
          </p>
        </div>
      )}
    </div>
  );
}

// ── History row ───────────────────────────────────────────────────────────────
function HistoryRow({ order }: { order: Order }) {
  const total = order.totalAmount ?? order.total;
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 px-5 bg-white rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
          <Receipt size={14} className="text-zinc-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-zinc-800">
            #{order.orderNumber ?? order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={order.status} />
        <span className="text-sm font-bold text-zinc-900">{formatAmount(total)}</span>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyOrders({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
      <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
        <ShoppingBag size={22} className="text-zinc-300" />
      </div>
      <p className="text-sm font-bold text-zinc-500">{message}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
type Tab = 'active' | 'history';

export default function VendorOrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const { activeOrders, isLoadingActiveOrders, isErrorActiveOrders, refetchActiveOrders } =
    useActiveOrdersQuery();
  const { orderHistory, isLoadingHistory } = useOrderHistoryQuery();
  const {
    acceptOrder, isAccepting, acceptingId,
    rejectOrder, isRejecting, rejectingId,
    updateOrderStatus, isUpdatingStatus, updatingStatusId,
  } = useOrdersMutation();

  const handleAccept = (id: string, prepMin?: number) => {
    acceptOrder({ id, payload: { estimatedPrepMin: prepMin } });
  };

  const handleReject = (id: string, reason: string) => {
    rejectOrder({ id, payload: { reason } });
  };

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus({ id, payload: { status } });
  };

  const pendingCount = activeOrders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">Orders</h2>
          {pendingCount > 0 && (
            <p className="text-sm font-semibold text-amber-600 mt-0.5">
              {pendingCount} new order{pendingCount > 1 ? 's' : ''} waiting
            </p>
          )}
        </div>
        <button
          onClick={() => refetchActiveOrders()}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 border border-zinc-200 hover:border-zinc-300 px-3 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1 w-fit">
        {(['active', 'history'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors capitalize ${
              activeTab === tab
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab === 'active' ? (
              <span className="flex items-center gap-2">
                Active
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </span>
            ) : 'History'}
          </button>
        ))}
      </div>

      {/* Active orders */}
      {activeTab === 'active' && (
        <>
          {isLoadingActiveOrders ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-zinc-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : isErrorActiveOrders ? (
            <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4 rounded-xl">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm font-semibold text-red-700">
                Failed to load orders.{' '}
                <button onClick={() => refetchActiveOrders()} className="underline">
                  Try again
                </button>
              </p>
            </div>
          ) : activeOrders.length === 0 ? (
            <EmptyOrders message="No active orders right now" />
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onUpdateStatus={handleUpdateStatus}
                  isAccepting={isAccepting && acceptingId === order.id}
                  isRejecting={isRejecting && rejectingId === order.id}
                  isUpdatingStatus={isUpdatingStatus && updatingStatusId === order.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Order history */}
      {activeTab === 'history' && (
        <>
          {isLoadingHistory ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orderHistory.length === 0 ? (
            <EmptyOrders message="No order history yet" />
          ) : (
            <div className="space-y-2">
              {orderHistory.map((order) => (
                <HistoryRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}