// src/app/buyer/account/profile/page.tsx
'use client';
import React, { useState } from 'react';
import { useProfileQuery } from '@/features/Auth/hooks/useProfileQuery';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Check, X, MapPin, AlertCircle } from 'lucide-react';
import { useAddressesQuery } from '@/features/Addresses/hooks/useAddressesQuery';

// ── Constants ─────────────────────────────────────────────



function getCompletion(isAddressSetup: boolean): number {
  return isAddressSetup ? 100 : 75;
}

function getCompletionNudge(isAddressSetup: boolean): string {
  if (!isAddressSetup) return 'Add a delivery address to reach 100%';
  return 'Your profile is complete!';
}

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '??';
}

// ── Schemas ───────────────────────────────────────────────
const nameSchema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
});
type NameValues = z.infer<typeof nameSchema>;

// ── Subcomponents ─────────────────────────────────────────
const inputCls = (err?: boolean) =>
  `w-full px-3 py-2 bg-white border text-sm text-zinc-900 outline-none transition-colors duration-150 ${err ? 'border-red-400' : 'border-zinc-300 focus:border-amber-500'}`;

// Read-only field row
function DisplayField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0">
      <div className="space-y-0.5 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
        <p className="text-sm font-medium text-zinc-500 truncate">{value ?? 'user'}</p>
      </div>
      <span className="text-xs text-zinc-300 font-medium ml-4 shrink-0">Read only</span>
    </div>
  );
}

// Skeleton row
function SkeletonField() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0">
      <div className="space-y-2 flex-1">
        <div className="h-3 w-20 bg-zinc-100 animate-pulse" />
        <div className="h-4 w-40 bg-zinc-100 animate-pulse" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function BuyerProfilePage() {
  const { user, isLoadingProfile, isErrorProfile } = useProfileQuery();
  const { updateProfile, isUpdatingProfile } = useAuthMutation();
  const [editing, setEditing] = useState(false);

  const { addresses, hasAddresses } = useAddressesQuery();
const IS_ADDRESS_SETUP = hasAddresses;

  const completion = getCompletion(IS_ADDRESS_SETUP);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    values: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  const onSubmit = (values: NameValues) => {
    updateProfile(values, {
      onSuccess: () => setEditing(false),
    });
  };

  const onCancel = () => {
    reset({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' });
    setEditing(false);
  };

  // ── Error state ──────────────────────────────────────────
  if (isErrorProfile) {
    return (
      <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4 max-w-xl">
        <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-red-700">Failed to load profile</p>
          <p className="text-xs text-red-600">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">

      {/* Page title */}
      {/* <div>
        <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">My Profile</h1>
        <p className="text-sm text-zinc-400 font-medium mt-0.5">Manage your personal information</p>
      </div> */}

      {/* Identity card */}
      <div className="bg-white border border-zinc-200 p-6 space-y-5">

        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          {(isLoadingProfile || !user) ? (
            <>
              <div className="w-16 h-16 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-zinc-100 animate-pulse" />
                <div className="h-3 w-20 bg-zinc-100 animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xl font-black">
                  {getInitials(user?.firstName, user?.lastName)}
                </span>
              </div>
              <div>
                <p className="text-base font-black text-zinc-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-amber-50 text-amber-600 border border-amber-200">
                  {user?.status}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Completion bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Profile completion
            </span>
            <span className="text-xs font-black text-amber-600">{completion}%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 w-full">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          {!IS_ADDRESS_SETUP && (
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-zinc-400 shrink-0" />
              <p className="text-xs text-zinc-400 font-medium">{getCompletionNudge(IS_ADDRESS_SETUP)}</p>
            </div>
          )}
        </div>

      </div>

      {/* Fields */}
      <div className="bg-white border border-zinc-200">

        {/* Section header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Personal Information
          </p>
          {!isLoadingProfile && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors"
            >
              <Pencil size={11} />
              Edit
            </button>
          )}
        </div>

        <div className="px-6">
          {isLoadingProfile ? (
            <>
              <SkeletonField />
              <SkeletonField />
              <SkeletonField />
              <SkeletonField />
            </>
          ) : editing ? (
            // ── Edit mode ──
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold tracking-widest text-zinc-400">
                    First Name
                  </label>
                  <input {...register('firstName')} type="text" className={inputCls(!!errors.firstName)} />
                  {errors.firstName && <p className="text-xs text-red-500 font-medium">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold tracking-widest text-zinc-400">
                    Last Name
                  </label>
                  <input {...register('lastName')} type="text" className={inputCls(!!errors.lastName)} />
                  {errors.lastName && <p className="text-xs text-red-500 font-medium">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Read-only fields in edit mode */}
              {user?.email && <DisplayField label="Email" value={user.email} />}
              {user?.phone && <DisplayField label="Phone" value={user.phone} />}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  <Check size={13} />
                  {isUpdatingProfile ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-1.5 px-4 py-2 border border-zinc-300 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  <X size={13} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // ── Display mode ──
            <>
              <div className="flex items-center justify-between py-4 border-b border-zinc-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Full Name</p>
                  <p className="text-sm font-semibold text-zinc-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
              {user?.email && <DisplayField label="Email" value={user.email} />}
              {user?.phone && <DisplayField label="Phone" value={user.phone} />}
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Delivery Address</p>
                  <p className="text-sm font-semibold text-zinc-800">
                    {IS_ADDRESS_SETUP ? addresses[0]?.label : 'Not set'}
                  </p>
                </div>
                <a
                  href="/buyer/account/addresses"
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors"
                >
                  Add
                </a>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}