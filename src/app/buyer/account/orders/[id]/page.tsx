// src/app/(main)/buyer/account/orders/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, RotateCcw } from 'lucide-react';
import { useOrderQuery } from '@/features/Buyer/hooks/useOrderQuery';
import { useOrderMutation } from '@/features/Buyer/hooks/useOrderMutation';
import { getStatusConfig } from '@/features/Buyer/utils/orderStatus';

function formatPrice(value: string): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : value;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { order, isLoadingOrder, isErrorOrder } = useOrderQuery(id);
  const { reorder, isReordering } = useOrderMutation();

  if (isLoadingOrder) {
    return (
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
        <div className="h-64 bg-neutral-100 animate-pulse rounded-[2px]" />
      </main>
    );
  }

  if (isErrorOrder || !order) {
    return (
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-sm text-neutral-500">This order couldn&apos;t be found.</p>
        <Link href="/buyer/account/orders" className="mt-3 inline-block text-sm text-amber-600 hover:text-amber-700">
          Back to orders
        </Link>
      </main>
    );
  }

  const status = getStatusConfig(order.status);

  return (
    <main className="max-w-4xl mx-auto lg:px-8 py-8">
      <Link href="/buyer/account/orders" className="text-lg text-neutral-500 hover:text-blue-500 transition-colors hover:underline ">
        ← Back to orders
      </Link>

      <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 bg-neutral-100 rounded-[2px] overflow-hidden">
            {order.vendorProfile.logoUrl ? (
              <Image src={order.vendorProfile.logoUrl} alt={order.vendorProfile.businessName} fill className="object-cover" />
            ) : null}
          </div>
          <div>
            <h1 className="text-lg font-black text-neutral-950">{order.vendorProfile.businessName}</h1>
            <p className="text-xs text-neutral-400">
              {order.orderNumber} · {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wide border rounded-[2px] px-2 py-1 ${status.className}`}>
          {status.label}
        </span>
      </div>

      {order.status === 'CANCELLED' && order.cancellationReason && (
        <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-[2px] px-3 py-2">
          {order.cancellationReason}
        </p>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-700 mb-3">Items</h2>
        <div className="border border-neutral-200 rounded-[2px] divide-y divide-neutral-100 bg-white">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {item.quantity}× {item.menuItemName}
                  {item.variantName && <span className="text-neutral-400"> · {item.variantName}</span>}
                </p>
                {item.notes && <p className="text-xs text-neutral-500 mt-0.5">Note: {item.notes}</p>}
              </div>
              <span className="shrink-0 text-sm font-bold text-neutral-950">{formatPrice(item.totalPrice)} CFA</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-700 mb-3">Delivery address</h2>
        <div className="flex items-start gap-2 border border-neutral-200 rounded-[2px] bg-white p-3">
          <MapPin size={15} className="text-neutral-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">{order.deliveryAddress.label}</p>
            <p className="text-xs text-neutral-500">
              {order.deliveryAddress.addressLine1}
              {order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''}, {order.deliveryAddress.city}
            </p>
          </div>
        </div>
      </section>

      {order.specialInstructions && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-700 mb-3">Delivery instructions</h2>
          <p className="text-sm text-neutral-600 border border-neutral-200 rounded-[2px] bg-white p-3">
            {order.specialInstructions}
          </p>
        </section>
      )}

      <section className="mt-6 border border-neutral-200 rounded-[2px] bg-white p-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>Subtotal</span><span>{formatPrice(order.subtotal)} CFA</span>
        </div>
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>Delivery fee</span><span>{formatPrice(order.deliveryFee)} CFA</span>
        </div>
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>Service fee</span><span>{formatPrice(order.serviceFee)} CFA</span>
        </div>
        {Number(order.discount) > 0 && (
          <div className="flex items-center justify-between text-sm text-green-700">
            <span>Discount</span><span>-{formatPrice(order.discount)} CFA</span>
          </div>
        )}
        <div className="flex items-center justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-200">
          <span>Total</span><span>{formatPrice(order.total)} CFA</span>
        </div>
      </section>

      <button
        onClick={() => reorder(order.id)}
        disabled={isReordering}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wide border border-neutral-300 rounded-[2px] text-neutral-700 hover:border-neutral-500 transition-colors disabled:opacity-50"
      >
        <RotateCcw size={15} />
        {isReordering ? 'Adding to cart...' : 'Reorder'}
      </button>
    </main>
  );
}