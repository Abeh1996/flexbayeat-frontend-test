// src/features/Buyer/components/CartSummary.tsx
import { Cart } from '../types/cart.types';

function formatPrice(value: string | number): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : String(value);
}

export function CartSummary({ cart }: { cart: Cart }) {
  const computedSubtotal = cart.cartItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );

  // Backend subtotal/total currently return "0" regardless of cart contents —
  // confirmed bug, not a frontend guess. Fall back to a client-computed
  // subtotal so the page isn't lying to the user, but only for subtotal;
  // fee/tax fields stay as backend sends them since we can't derive those.
  const backendSubtotal = Number(cart.subtotal);
  const subtotalIsStale = backendSubtotal === 0 && computedSubtotal > 0;
  const displaySubtotal = subtotalIsStale ? computedSubtotal : backendSubtotal;

  const backendTotal = Number(cart.total);
  const otherFees = Number(cart.deliveryFee) + Number(cart.serviceFee) + Number(cart.taxes);
  const displayTotal = subtotalIsStale && backendTotal === 0
    ? displaySubtotal + otherFees
    : backendTotal;

  return (
    <div className="border border-neutral-200 rounded-[2px] bg-white p-4 space-y-2">
      {subtotalIsStale && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[2px] px-2 py-1.5">
          Totals shown are estimated from item prices — final pricing confirms at checkout.
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>Subtotal</span>
        <span>{formatPrice(displaySubtotal)} CFA</span>
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>Delivery fee</span>
        <span>{formatPrice(cart.deliveryFee)} CFA</span>
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>Service fee</span>
        <span>{formatPrice(cart.serviceFee)} CFA</span>
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>Taxes</span>
        <span>{formatPrice(cart.taxes)} CFA</span>
      </div>
      <div className="flex items-center justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-200">
        <span>Total</span>
        <span>{formatPrice(displayTotal)} CFA</span>
      </div>
    </div>
  );
}