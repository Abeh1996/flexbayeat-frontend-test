// src/app/rider/complete-registration/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Bike } from 'lucide-react';
import { RiderRegistrationForm } from '@/features/Rider/components/RiderRegistrationForm';
import { useRiderMutation } from '@/features/Rider/hooks/useRiderMutation';
import { RiderProfilePayload } from '@/features/Rider/types';

export default function RiderCompleteRegistrationPage() {
  const router = useRouter();
  const { createRiderProfileAsync, isCreatingRiderProfile } = useRiderMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = async (payload: RiderProfilePayload) => {
    await createRiderProfileAsync(payload);
    setSubmitted(true);
    setTimeout(() => {
      router.replace('/rider/account');
    }, 5000);
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-5">
          <div className="w-16 h-16 bg-amber-500 flex items-center justify-center mx-auto">
            <ShieldCheck size={30} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">
              Application Submitted!
            </h1>
            <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed">
              Thank you for completing your rider registration. Your application
              will be reviewed and confirmed within{' '}
              <span className="font-bold text-zinc-700">7 business days</span>.
              We'll notify you once it's approved.
            </p>
          </div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
            Redirecting you shortly…
          </p>
        </div>
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 px-4 pt-12 pb-20">
      <div className="w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-500 flex items-center justify-center shrink-0">
            <Bike size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">
              Complete Your Registration
            </h1>
            <p className="text-sm font-medium text-zinc-500 mt-0.5">
              Set up your rider profile to start delivering
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 px-4 py-3 mb-6">
          <ShieldCheck size={15} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs font-medium text-amber-800 leading-relaxed">
            Your documents are reviewed by our team to verify your identity and vehicle.
            This process takes up to <span className="font-bold">7 business days</span>.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-zinc-200 p-6">
          <RiderRegistrationForm
            onSuccess={handleSuccess}
            isLoading={isCreatingRiderProfile}
          />
        </div>
      </div>
    </div>
  );
}