// src/app/(main)/checkout/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartQuery } from '@/features/Buyer/hooks/useCartQuery';
import { useVendorsQuery } from '@/features/Buyer/hooks/useVendorsQuery';
import { useAddressesQuery } from '@/features/Addresses/hooks/useAddressesQuery';
import { useOrderMutation } from '@/features/Buyer/hooks/useOrderMutation';
import { CheckoutAddressSelector } from '@/features/Buyer/components/CheckoutAddressSelector';
import { PaymentMethodSelector } from '@/features/Buyer/components/PaymentMethodSelector';
import { CartSummary } from '@/features/Buyer/components/CartSummary';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isCartEmpty, isLoadingCart } = useCartQuery();
  const { vendors } = useVendorsQuery();
  const { addresses, hasAddresses, isLoadingAddresses } = useAddressesQuery();
  const { checkoutAsync, isCheckingOut } = useOrderMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? null
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  const vendor = cart ? vendors.find((v) => v.id === cart.vendorProfileId) : null;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;
    try {
      await checkoutAsync({
        deliveryAddressId: selectedAddressId,
        promoCode: promoCode.trim() || undefined,
        specialInstructions: specialInstructions.trim() || undefined,
      });
      router.push('/buyer/account/orders');
    } catch {
      // toast already handled inside useOrderMutation's onError
    }
  };

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="h-40 bg-neutral-100 animate-pulse rounded-[2px]" />
            <div className="h-32 bg-neutral-100 animate-pulse rounded-[2px]" />
          </div>
          <div className="h-48 bg-neutral-100 animate-pulse rounded-[2px]" />
        </div>
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

  const canPlaceOrder = !!selectedAddressId && hasAddresses && !isCheckingOut;

  return (
    <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-black tracking-tight text-neutral-950">Checkout</h1>
      {vendor && (
        <p className="mt-1 text-sm text-neutral-500">Ordering from {vendor.businessName}</p>
      )}

      <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-700 mb-3">
              Delivery address
            </h2>
            <CheckoutAddressSelector
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-700 mb-3">
              Payment method
            </h2>
            <PaymentMethodSelector value="COD" />
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-700 mb-3">
              Delivery instructions
            </h2>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Leave at the front gate and ring the bell, etc. (optional)"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </section>

          <section>
            {showPromoInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPromoInput(true)}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Have a promo code?
              </button>
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-24 space-y-4">
          <CartSummary cart={cart} />

          {!hasAddresses && (
            <p className="text-xs text-neutral-500 text-center">
              Add a delivery address to continue.
            </p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder}
            className="w-full py-3 text-sm font-bold uppercase tracking-wide bg-neutral-950 text-white rounded-[2px] hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? 'Placing order...' : 'Place order · Cash on Delivery'}
          </button>
        </div>
      </div>
    </main>
  );
}