// src/features/Buyer/components/MenuItemCard.tsx
'use client';
import Image from 'next/image';
import { MenuItem } from '../types/vendor.types';
import { useCartMutation } from '../hooks/useCartMutation';
import { MealDetailSheet } from './MealDetailSheet';

function formatPrice(price: string): string {
  const n = Number(price);
  return Number.isFinite(n) ? n.toLocaleString() : price;
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  const unavailable = item.status !== 'AVAILABLE';
  const { updateCartItem, isUpdatingCart } = useCartMutation();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartItem({ menuItemId: item.id, quantity: 1 });
  };

  return (
    <div
      className={`flex gap-3 border border-neutral-200 rounded-[2px] p-3 bg-white ${
        unavailable ? 'opacity-50' : 'hover:border-neutral-400 transition-colors'
      }`}
    >
      <div className="relative h-20 w-20 shrink-0 bg-neutral-100 rounded-[2px] overflow-hidden">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[10px] text-neutral-400 text-center px-1">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-neutral-950 truncate">{item.name}</h4>
          {item.description && (
            <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2">{item.description}</p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-black text-neutral-950">
            {formatPrice(item.price)} <span className="text-[9px] font-bold text-neutral-400">CFA</span>
          </span>
          {unavailable ? (
            <span className="text-[10px] font-semibold text-neutral-400 uppercase">Sold out</span>
          ) : (
            <button 
              className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1.5 border border-neutral-300 rounded-[2px] text-neutral-700 hover:border-amber-500 hover:text-amber-600 transition-colors disabled:opacity-40"
              onClick={handleAdd}
              disabled={isUpdatingCart}
            >
              Add
            </button>
          )}

          {/* <MealDetailSheet meal={item}  onClose={}/> */}
        </div>
      </div>
    </div>
  );
}