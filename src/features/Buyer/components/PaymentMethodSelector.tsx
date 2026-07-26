// src/features/Buyer/components/PaymentMethodSelector.tsx
'use client';
import { Banknote, Smartphone } from 'lucide-react';

export type PaymentMethod = 'COD' | 'MOMO' | 'OM';

const OPTIONS: { id: PaymentMethod; label: string; icon: typeof Banknote; disabled: boolean }[] = [
  { id: 'COD', label: 'Cash on Delivery', icon: Banknote, disabled: false },
  { id: 'MOMO', label: 'MTN Mobile Money', icon: Smartphone, disabled: true },
  { id: 'OM', label: 'Orange Money', icon: Smartphone, disabled: true },
];

export function PaymentMethodSelector({ value }: { value: PaymentMethod }) {
  return (
    <div className="space-y-2">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.id;
        return (
          <div
            key={option.id}
            className={`flex items-center gap-3 border rounded-[2px] p-3 ${
              option.disabled
                ? 'border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed'
                : isSelected
                ? ' border-neutral-200 bg-white'
                : 'border-neutral-200 bg-white'
            }`}
          >
            <div
              className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                isSelected && !option.disabled ? 'border-amber-500' : 'border-neutral-300'
              }`}
            >
              {isSelected && !option.disabled && <div className="h-2 w-2 rounded-full bg-amber-500" />}
            </div>

            <Icon size={16} className="text-neutral-500 shrink-0" />
            <span className="text-sm font-semibold text-neutral-800 flex-1">{option.label}</span>

            {option.disabled && (
              <span className="text-[9px] font-bold uppercase tracking-wide text-neutral-400 border border-neutral-200 rounded-[2px] px-1.5 py-0.5">
                Coming soon
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}