// src/features/Vendor/components/RejectedScreen.tsx
'use client';
import React, { useState } from 'react';
import { XCircle, RotateCcw, LogOut } from 'lucide-react';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';
import { useVendorMutation } from '../hooks/useVendorMutation';
import { VendorRegistrationForm } from './VendorRegistrationForm';
import { VendorProfilePayload } from '../types';

interface RejectedScreenProps {
  rejectionReason?: string;
}

export function RejectedScreen({ rejectionReason }: RejectedScreenProps) {
  const { logout, isLoggingOut } = useAuthMutation();
  const { updateVendorProfile, isUpdatingVendorProfile } = useVendorMutation();
  const [isResubmitting, setIsResubmitting] = useState(false);

  const handleResubmit = (payload: VendorProfilePayload) => {
    updateVendorProfile(payload);
  };

  if (isResubmitting) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 pt-12 pb-20">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-500 flex items-center justify-center shrink-0">
              <RotateCcw size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">
                Resubmit Application
              </h1>
              <p className="text-sm font-medium text-zinc-500 mt-0.5">
                Update your details and documents, then resubmit for review
              </p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-6">
            <VendorRegistrationForm
              onSuccess={handleResubmit}
              isLoading={isUpdatingVendorProfile}
            />
          </div>

          <div className="text-center mt-5">
            <button
              onClick={() => setIsResubmitting(false)}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-red-500 flex items-center justify-center mx-auto">
          <XCircle size={28} className="text-white" />
        </div>

        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">
            Application Not Approved
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed">
            Unfortunately your vendor application wasn't approved this time.
          </p>
        </div>

        {rejectionReason && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
              Reason
            </p>
            <p className="text-sm font-medium text-red-700 leading-relaxed">
              {rejectionReason}
            </p>
          </div>
        )}

        <button
          onClick={() => setIsResubmitting(true)}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-widest px-6 py-3.5 transition-colors duration-150"
        >
          <RotateCcw size={15} />
          Resubmit Documents
        </button>

        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          <LogOut size={13} />
          {isLoggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </div>
  );
}