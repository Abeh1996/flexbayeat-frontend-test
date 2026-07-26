// src/features/Buyer/components/MealBrowseCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { BrowsableMeal } from "../hooks/useAllMealsQuery";
import { useCartMutation } from "../hooks/useCartMutation";

function formatPrice(price: string): string {
  const n = Number(price);
  return Number.isFinite(n) ? n.toLocaleString() : price;
}

interface Props {
  meal: BrowsableMeal;
  onSelect: (meal: BrowsableMeal) => void;
}

export function MealBrowseCard({ meal, onSelect }: Props) {
  const { updateCartItem, isUpdatingCart } = useCartMutation();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartItem({ menuItemId: meal.id, quantity: 1 });
  };

  return (
    <div
      onClick={() => onSelect(meal)}
      className="cursor-pointer border border-neutral-200 rounded-[2px] bg-white overflow-hidden hover:border-neutral-400 transition-colors"
    >
      <div className="relative aspect-4/3 w-full bg-neutral-100">
        {meal.imageUrl ? (
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <div>
          <Link
            href={`/restaurant/${meal.vendorId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-bold text-neutral-400 hover:underline uppercase tracking-wide truncate hover:text-amber-600 transition-colors block"
          >
            {meal.vendorName}
          </Link>
          <h4 className="text-sm font-bold text-neutral-950 line-clamp-2 mt-0.5 min-h-[36px] leading-tight">
            {meal.name}
          </h4>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-sm font-black text-neutral-950">
            {formatPrice(meal.price)}{" "}
            <span className="text-[9px] font-bold text-neutral-400">CFA</span>
          </span>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isUpdatingCart}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide border border-neutral-300 rounded-[2px] text-neutral-700 hover:border-amber-500 hover:text-amber-600 transition-colors disabled:opacity-40"
          >
            <ShoppingBag size={11} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
