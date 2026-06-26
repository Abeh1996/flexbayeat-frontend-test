// src/app/auth/reset-success/page.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const PORTALS = [
  { label: 'I am a Buyer', href: '/auth/buyer/login', description: 'Order food from local kitchens' },
  { label: 'I am a Restaurant', href: '/auth/vendor/login', description: 'Manage your menu and orders' },
  { label: 'I am a Rider', href: '/auth/rider/login', description: 'Deliver orders near you' },
];

export default function ResetSuccessPage() {
  return (
    <div className="w-full space-y-8">

      {/* Icon + message */}
      <div className="space-y-4">
        <div className="w-14 h-14 bg-amber-50 border border-amber-200 flex items-center justify-center">
          <CheckCircle size={24} className="text-amber-500" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
            Password reset
          </h1>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            Your password has been reset successfully. Choose your portal below to sign in.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-200" />

      {/* Role buttons */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Sign in as
        </p>
        {PORTALS.map((portal) => (
          <Link
            key={portal.href}
            href={portal.href}
            className="
              flex items-center justify-between w-full
              border border-zinc-200 px-5 py-4
              hover:border-amber-500 hover:bg-amber-50
              transition-colors duration-150 group
            "
          >
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-zinc-800 group-hover:text-amber-700 transition-colors">
                {portal.label}
              </p>
              <p className="text-xs text-zinc-400 font-medium">
                {portal.description}
              </p>
            </div>
            <span className="text-zinc-300 group-hover:text-amber-500 transition-colors text-lg font-light">
              →
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}