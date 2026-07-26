// src/app/(main)/buyer/account/orders/page.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useOrdersQuery } from '@/features/Buyer/hooks/useOrdersQuery';
import { getStatusConfig } from '@/features/Buyer/utils/orderStatus';

function formatPrice(value: string): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : value;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const BuyerOrdersPage = () => {
  const { orders, hasOrders, isLoadingOrders, isErrorOrders, refetchOrders } = useOrdersQuery();

  if (isLoadingOrders) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-neutral-100 animate-pulse rounded-[2px]" />
        ))}
      </div>
    );
  }

  if (isErrorOrders) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-sm text-neutral-500">Couldn&apos;t load your orders right now.</p>
        <button
          onClick={() => refetchOrders()}
          className="mt-3 px-4 py-2 text-sm font-semibold border border-neutral-300 rounded-[2px] text-neutral-700 hover:border-neutral-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hasOrders) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={32} className="text-neutral-300" />
        <p className="mt-3 text-sm text-neutral-500">No orders yet. Start shopping to see your orders here!</p>
        <Link
          href="/restaurants"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide bg-neutral-950 text-white rounded-[2px] hover:bg-neutral-800 transition-colors"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto  lg:px-8 py-8">
      <h1 className="text-2xl font-black tracking-tight text-neutral-950">Your Orders</h1>

      <div className="mt-6 space-y-3">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);
          const itemsSummary = order.orderItems.map((i) => i.menuItemName).join(', ');

          return (
            <Link
              key={order.id}
              href={`/buyer/account/orders/${order.id}`}
              className="flex gap-3 border border-neutral-200 rounded-[2px] bg-white p-3 hover:border-neutral-400 transition-colors"
            >
              <div className="relative h-14 w-14 shrink-0 bg-neutral-100 rounded-[2px] overflow-hidden">
                {order.vendorProfile.logoUrl ? (
                  <Image src={order.vendorProfile.logoUrl} alt={order.vendorProfile.businessName} fill className="object-cover" />
                ) : null}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-neutral-950 truncate">{order.vendorProfile.businessName}</h3>
                  <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wide border rounded-[2px] px-2 py-0.5 ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{itemsSummary}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-neutral-400">{formatDate(order.createdAt)}</span>
                  <span className="text-sm font-black text-neutral-950">{formatPrice(order.total)} CFA</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
};

export default BuyerOrdersPage;