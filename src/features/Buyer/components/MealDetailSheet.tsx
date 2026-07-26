// src/features/Buyer/components/MealDetailSheet.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { MenuItem } from "../types/vendor.types";
import { useCartMutation } from "../hooks/useCartMutation";

interface Props {
  meal: (MenuItem & { vendorName?: string }) | null;
  onClose: () => void;
}

function formatPrice(price: string): string {
  const n = Number(price);
  return Number.isFinite(n) ? n.toLocaleString() : price;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sheetVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

export function MealDetailSheet({ meal, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const { updateCartItem, isUpdatingCart } = useCartMutation();

  useEffect(() => {
    setQuantity(1);
    setNotes("");
  }, [meal?.id]);

  useEffect(() => {
    if (!meal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [meal, onClose]);

  const unavailable = meal?.status !== "AVAILABLE";
  const hasUnknownVariants = (meal?.variants.length ?? 0) > 0;
  const canAdd = !!meal && !unavailable && !hasUnknownVariants;

  const handleAdd = () => {
    if (!meal) return;
    updateCartItem({
      menuItemId: meal.id,
      quantity,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {meal && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-neutral-950/50"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            className="relative w-full sm:max-w-md bg-white rounded-2xl md:rounded-md max-h-[88vh] sm:max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center bg-white/90 border border-neutral-200 rounded-[2px] text-neutral-600 hover:text-neutral-950 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

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

            <div className="p-4 space-y-4">
              <div>
                {meal.vendorName && (
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                    {meal.vendorName}
                  </p>
                )}
                <h3 className="text-lg font-black text-neutral-950 mt-0.5">
                  {meal.name}
                </h3>
                {meal.description && (
                  <p className="mt-1 text-sm text-neutral-600">
                    {meal.description}
                  </p>
                )}
                <p className="mt-2 text-base font-black text-neutral-950">
                  {formatPrice(meal.price)}{" "}
                  <span className="text-[10px] font-bold text-neutral-400">
                    CFA
                  </span>
                </p>
              </div>

              {unavailable && (
                <p className="text-xs font-semibold text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-[2px] px-3 py-2">
                  This item is currently sold out.
                </p>
              )}

              {hasUnknownVariants && !unavailable && (
                <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-[2px] px-3 py-2">
                  This item has options that aren&apos;t supported for online
                  ordering yet. Contact the restaurant directly to order.
                </p>
              )}

              {canAdd && (
                <>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="No onions, extra sauce, etc."
                      rows={2}
                      className="w-full mt-1.5 px-3 py-2 text-sm border border-neutral-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 border border-neutral-200 rounded-[2px]">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="h-9 w-9 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-neutral-950 min-w-[1.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="h-9 w-9 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={handleAdd}
                      disabled={isUpdatingCart}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide bg-neutral-950 text-white rounded-[2px] hover:bg-neutral-800 transition-colors disabled:opacity-40"
                    >
                      <ShoppingBag size={15} />
                      Add ·{" "}
                      {formatPrice(
                        (Number(meal.price) * quantity).toString(),
                      )}{" "}
                      CFA
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
