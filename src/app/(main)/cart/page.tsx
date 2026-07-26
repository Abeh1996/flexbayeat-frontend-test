// src/app/(main)/cart/page.tsx
"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartQuery } from "@/features/Buyer/hooks/useCartQuery";
import { useVendorsQuery } from "@/features/Buyer/hooks/useVendorsQuery";
import { CartItemRow } from "@/features/Buyer/components/CartItemRow";
import { CartSummary } from "@/features/Buyer/components/CartSummary";

export default function CartPage() {
  const {
    cart,
    cartItems,
    isCartEmpty,
    isLoadingCart,
    isErrorCart,
    refetchCart,
  } = useCartQuery();
  const { vendors } = useVendorsQuery();

  const vendor = cart
    ? vendors.find((v) => v.id === cart.vendorProfileId)
    : null;

  if (isLoadingCart) {
    return (
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-neutral-100 animate-pulse rounded-[2px]"
              />
            ))}
          </div>
          <div className="h-48 bg-neutral-100 animate-pulse rounded-[2px]" />
        </div>
      </main>
    );
  }

  if (isErrorCart) {
    return (
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-sm text-neutral-500">
          Couldn&apos;t load your cart right now.
        </p>
        <button
          onClick={() => refetchCart()}
          className="mt-3 px-4 py-2 text-sm font-semibold border border-neutral-300 rounded-[2px] text-neutral-700 hover:border-neutral-500 transition-colors"
        >
          Retry
        </button>
      </main>
    );
  }

  if (!cart || isCartEmpty) {
    return (
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center">
        <ShoppingBag size={32} className="mx-auto text-neutral-300" />
        <p className="mt-3 text-sm text-neutral-500">Your cart is empty.</p>
        <Link
          href="/restaurants"
          className="inline-block mt-4 px-4 py-2 text-sm font-bold uppercase tracking-wide bg-neutral-950 text-white rounded-[2px] hover:bg-neutral-800 transition-colors"
        >
          Browse restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-black tracking-tight text-neutral-950">
        Your Cart
      </h1>
      {vendor && (
        <Link
          href={`/restaurant/${vendor.id}`}
          className="mt-1 inline-block text-sm text-amber-600 hover:text-amber-700 transition-colors"
        >
          Ordering from {vendor.businessName}
        </Link>
      )}

      <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 space-y-4">
          <CartSummary cart={cart} />

          <Link
            href="/checkout"
            className="mt-4 block w-full py-3 text-center text-sm font-bold uppercase tracking-wide bg-neutral-950 text-white rounded-[2px] hover:bg-neutral-800 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
