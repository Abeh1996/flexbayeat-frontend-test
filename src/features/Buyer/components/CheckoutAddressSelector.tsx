// src/features/Buyer/components/CheckoutAddressSelector.tsx
'use client';
import Link from 'next/link';
import { MapPin, Plus } from 'lucide-react';
import { Address } from '@/features/Addresses/types';

interface Props {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CheckoutAddressSelector({ addresses, selectedId, onSelect }: Props) {
  if (addresses.length === 0) {
    return (
      <div className="border border-neutral-200 rounded-[2px] bg-white p-4 text-center">
        <MapPin size={20} className="mx-auto text-neutral-300" />
        <p className="mt-2 text-sm text-neutral-600">You don&apos;t have a delivery address yet.</p>
        <Link
          href="/buyer/account/addresses"
          className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-neutral-950 text-white rounded-[2px] hover:bg-neutral-800 transition-colors"
        >
          <Plus size={13} />
          Add an address
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {addresses.map((address) => {
        const isSelected = selectedId === address.id;
        return (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address.id)}
            className={`w-full text-left flex items-start gap-3 border rounded-[2px] p-3 transition-colors ${
              isSelected ? 'border-neutral-200 bg-white' : 'border-neutral-200 bg-white hover:border-neutral-400'
            }`}
          >
            <div
              className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                isSelected ? 'border-amber-500' : 'border-neutral-300'
              }`}
            >
              {isSelected && <div className="h-2 w-2 rounded-full bg-amber-500" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-950">{address.label}</span>
                {address.isDefault && (
                  <span className="text-[9px] font-bold uppercase tracking-wide text-neutral-500 border border-neutral-200 rounded-[2px] px-1.5 py-0.5">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 truncate">
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}
              </p>
            </div>
          </button>
        );
      })}

      <Link
        href="/buyer/account/addresses"
        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
      >
        <Plus size={12} />
        Add a new address
      </Link>
    </div>
  );
}