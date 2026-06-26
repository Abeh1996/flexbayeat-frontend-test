// src/app/vendor/(dashboard)/dashboard/profile/page.tsx
'use client';
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useVendorProfileQuery } from '@/features/vendor/hooks/useVendorProfileQuery';
import { useVendorMutation } from '@/features/vendor/hooks/useVendorMutation';
import { VendorProfileForm } from '@/features/vendor/components/VendorProfileForm';
import { VendorProfilePayload } from '@/features/vendor/types';

export default function VendorProfilePage() {
  const { vendorProfile, isLoadingVendorProfile, isErrorVendorProfile, refetchVendorProfile } =
    useVendorProfileQuery();
  const { updateVendorProfile, isUpdatingVendorProfile } = useVendorMutation();

  const handleSave = (payload: Partial<VendorProfilePayload>) => {
    updateVendorProfile(payload);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoadingVendorProfile) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={22} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isErrorVendorProfile || !vendorProfile) {
    return (
      <div className="p-6 lg:p-10">
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Couldn't load your profile</p>
            <p className="text-xs text-red-600">
              Something went wrong.{' '}
              <button onClick={() => refetchVendorProfile()} className="underline font-semibold">
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {/* <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
          <User size={18} className="text-white" />
        </div> */}
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">
            Business Profile
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-0.5">
            This is how customers see your business
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 p-6">
        <VendorProfileForm
          vendorProfile={vendorProfile}
          onSuccess={handleSave}
          isLoading={isUpdatingVendorProfile}
        />
      </div>
    </div>
  );
}