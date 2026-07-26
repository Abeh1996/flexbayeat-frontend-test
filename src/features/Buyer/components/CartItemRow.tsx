// src/features/Buyer/components/CartItemRow.tsx
"use client";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../types/cart.types";
import { useCartMutation } from "../hooks/useCartMutation";

function formatPrice(value: string | number): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : String(value);
}

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateCartItem, isUpdatingCart } = useCartMutation();

  const changeQuantity = (next: number) => {
    updateCartItem({
      menuItemId: item.menuItemId,
      menuItemVariantId: item.menuItemVariantId ?? undefined,
      quantity: Math.max(0, next),
      notes: item.notes ?? undefined,
    });
  };

  const lineTotal = Number(item.unitPrice) * item.quantity;

  return (
    <div className="flex gap-3 border border-neutral-200 rounded-[2px] p-3 bg-white">
      <div className="relative h-16 w-16 shrink-0 bg-neutral-100 rounded-[2px] overflow-hidden">
        {item.menuItem.imageUrl ? (
          <Image
            src={item.menuItem.imageUrl}
            alt={item.menuItem.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[9px] text-neutral-400 text-center px-1">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-neutral-950 truncate">
              {item.menuItem.name}
            </h4>
            {item.notes && (
              <p className="text-xs text-neutral-500 mt-0.5 truncate">
                Note: {item.notes}
              </p>
            )}
          </div>
          <button
            onClick={() => changeQuantity(0)}
            disabled={isUpdatingCart}
            className="shrink-0 text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-40"
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border border-neutral-200 rounded-[2px]">
            <button
              onClick={() => changeQuantity(item.quantity - 1)}
              disabled={isUpdatingCart}
              className="h-7 w-7 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs font-bold text-neutral-950 min-w-[1rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={isUpdatingCart}
              className="h-7 w-7 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <span className="text-sm font-black text-neutral-950">
            {formatPrice(lineTotal)}{" "}
            <span className="text-[9px] font-bold text-neutral-400">CFA</span>
          </span>
        </div>
      </div>
    </div>
  );
}
