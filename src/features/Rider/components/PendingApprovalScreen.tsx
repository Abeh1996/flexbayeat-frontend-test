// src/features/Rider/components/PendingApprovalScreen.tsx
'use client';
import React from 'react';
import { Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function PendingApprovalScreen() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto rounded-2xl">
          <Clock size={24} className="text-amber-500" />
        </div>

        <h1 className="mt-5 text-lg font-semibold text-zinc-800">
          Application Under Review
        </h1>
        <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
          We&apos;re reviewing your documents and vehicle information. This usually
          takes <span className="font-medium text-zinc-700">1–3 business days</span>.
          We&apos;ll notify you once it&apos;s approved.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <ShieldCheck size={13} className="text-amber-500 shrink-0" />
          <span className="text-xs font-medium text-amber-700">Review in progress</span>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <ArrowLeft size={12} />
          Back to home
        </Link>
      </div>
    </div>
  );
}