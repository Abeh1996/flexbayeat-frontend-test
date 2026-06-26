// src/app/buyer/account/addresses/setup/page.tsx
// OR use this as a standalone modal/step triggered from the profile completion bar.
// This page is shown when IS_ADDRESS_SETUP is false and buyer hasn't added any address yet.
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useAddressMutation } from '@/features/Addresses/hooks/useAddressMutation';
import { AddressForm } from '@/features/Addresses/components/AddressForm';
import { AddressPayload } from '@/features/Addresses/types';

export default function AddressSetupPage() {
  const router = useRouter();
  const { createAddressAsync, isCreating } = useAddressMutation();

  const handleSuccess = async (payload: AddressPayload) => {
    await createAddressAsync({ ...payload, isDefault: true });
    router.replace('/buyer/account/profile');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-start justify-center pt-12 px-4 pb-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-center tracking-tight text-zinc-900">
              Add Your Address
            </h1>
            <p className="text-sm font-medium text-zinc-500 mt-0.5">
              So we know where to deliver your orders
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-zinc-200 p-6">
          <AddressForm
            onSuccess={handleSuccess}
            isLoading={isCreating}
            submitLabel="Save & Continue"
            defaultValues={{ isDefault: true }}
          />
        </div>

        {/* Skip */}
        <div className="text-center mt-5">
          <button
            onClick={() => router.replace('/buyer/account/profile')}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}