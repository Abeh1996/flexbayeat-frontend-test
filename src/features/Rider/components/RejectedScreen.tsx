// src/features/Rider/components/RejectedScreen.tsx
'use client';
import React from 'react';
import { AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface RejectedScreenProps {
  reason?: string;
}

export function RejectedScreen({ reason }: RejectedScreenProps) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 bg-red-50 border border-red-100 flex items-center justify-center mx-auto rounded-2xl">
          <AlertTriangle size={24} className="text-red-400" />
        </div>

        <h1 className="mt-5 text-lg font-semibold text-zinc-800">
          Application Not Approved
        </h1>
        <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
          Unfortunately, your rider application could not be approved at this time.
        </p>

        {reason && (
          <div className="mt-5 text-left bg-white border border-zinc-200 rounded-lg px-4 py-3">
            <p className="text-xs font-medium text-zinc-500 mb-1">Reason</p>
            <p className="text-sm text-zinc-700 leading-relaxed">{reason}</p>
          </div>
        )}

        <div className="mt-5 flex items-start gap-2.5">
          <FileText size={13} className="text-zinc-400 mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-400 text-left leading-relaxed">
            If you believe this is a mistake, please contact our support team
            with your rider ID for further assistance.
          </p>
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