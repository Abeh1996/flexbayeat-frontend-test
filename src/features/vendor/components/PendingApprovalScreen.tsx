// src/features/Vendor/components/PendingApprovalScreen.tsx
'use client';
import React from 'react';
import { Clock, ShieldCheck, LogOut } from 'lucide-react';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';

export function PendingApprovalScreen() {
  const { logout, isLoggingOut } = useAuthMutation();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500 flex items-center justify-center mx-auto">
          <Clock size={28} className="text-white" />
        </div>

        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">
            Application Under Review
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed">
            Your vendor application is currently being reviewed by our team.
            This usually takes up to{' '}
            <span className="font-bold text-zinc-700">7 business days</span>.
            We'll notify you by email or phone once a decision has been made.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 px-4 py-3 text-left">
          <ShieldCheck size={15} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs font-medium text-amber-800 leading-relaxed">
            No further action is needed from you right now. You can check back
            here anytime to see your application status.
          </p>
        </div>

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