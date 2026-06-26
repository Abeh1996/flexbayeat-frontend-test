// src/app/vendor/(dashboard)/dashboard/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import {
  Star,
  ShoppingBag,
  Wallet,
  FileCheck,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { useVendorProfileQuery } from '@/features/vendor/hooks/useVendorProfileQuery';

const PAYOUT_LABEL: Record<string, string> = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
};

export default function VendorOverviewPage() {
  const { vendorProfile, isLoadingVendorProfile } = useVendorProfileQuery();

  console.log("vendor profile", vendorProfile);

  if (isLoadingVendorProfile || !vendorProfile) {
    return (
      <div className="p-6 lg:p-10 space-y-4">
        <div className="h-24 bg-zinc-100 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const {
    businessName,
    averageRating,
    totalReviews,
    totalOrders,
    commissionRate,
    payoutSchedule,
    documentsVerified,
    city,
    region,
    wallet,
    status
  } = vendorProfile;

  const ratingValue = parseFloat(averageRating) || 0;
  const commissionPercent = (parseFloat(commissionRate) * 100).toFixed(0);

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">
          Welcome back, {businessName}
        </h2>
        <p className="text-sm font-medium text-zinc-500 mt-1 flex items-center gap-1.5">
          {city && region ? (
            <>
              <MapPin size={13} className="text-zinc-400" />
              {city}, {region}
            </>
          ) : (
            'Here is how your business is doing'
          )}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-3">
            <Star size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">Rating</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">
            {ratingValue > 0 ? ratingValue.toFixed(1) : '—'}
          </p>
          <p className="text-xs font-medium text-zinc-400 mt-1">
            {totalReviews} review{totalReviews === 1 ? '' : 's'}
          </p>
        </div>

        <div className="border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-3">
            <ShoppingBag size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">Orders</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{totalOrders}</p>
          <p className="text-xs font-medium text-zinc-400 mt-1">Total orders received</p>
        </div>

        <div className="border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-3">
            <Wallet size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">Wallet Balance</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">
            {wallet ? `${wallet.balance.toLocaleString()} ${wallet.currency ?? 'XAF'}` : '0 XAF'}
          </p>
          <p className="text-xs font-medium text-zinc-400 mt-1">
            {PAYOUT_LABEL[payoutSchedule] ?? payoutSchedule} payouts
          </p>
        </div>
      </div>

      {/* Account details */}
      <div className="border border-zinc-200 bg-white">
        <div className="px-5 py-4 border-b border-zinc-200">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Account Details
          </h3>
        </div>
        <div className="divide-y divide-zinc-100">
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm font-medium text-zinc-500">Commission rate</span>
            <span className="text-sm font-bold text-zinc-900">{commissionPercent}%</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm font-medium text-zinc-500">Payout schedule</span>
            <span className="text-sm font-bold text-zinc-900">
              {PAYOUT_LABEL[payoutSchedule] ?? payoutSchedule}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm font-medium text-zinc-500">Account status</span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                documentsVerified ? 'text-emerald-600' : 'text-amber-500'
              }`}
            >
              <FileCheck size={13} />
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/vendor/dashboard/menu"
          className="group flex items-center justify-between border border-zinc-200 bg-white px-5 py-4 hover:border-amber-400 transition-colors"
        >
          <div>
            <p className="text-sm font-bold text-zinc-900">Manage your menu</p>
            <p className="text-xs text-zinc-500 mt-0.5">Add categories and items</p>
          </div>
          <ArrowRight size={16} className="text-zinc-300 group-hover:text-amber-500 transition-colors" />
        </Link>

        <Link
          href="/vendor/dashboard/settings"
          className="group flex items-center justify-between border border-zinc-200 bg-white px-5 py-4 hover:border-amber-400 transition-colors"
        >
          <div>
            <p className="text-sm font-bold text-zinc-900">Set operating hours</p>
            <p className="text-xs text-zinc-500 mt-0.5">Let customers know when you're open</p>
          </div>
          <Clock size={16} className="text-zinc-300 group-hover:text-amber-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
}