// src/app/rider/dashboard/profile/page.tsx
'use client';
import React, { useState } from 'react';
import {
  User,
  Bike,
  Hash,
  Smartphone,
  Star,
  Wallet,
  Shield,
  FileText,
  Pencil,
  Award,
  Clock,
} from 'lucide-react';
import { useRiderProfileQuery } from '@/features/Rider/hooks/useRiderProfileQuery';
import { useRiderMutation } from '@/features/Rider/hooks/useRiderMutation';
import { formatXAF } from '@/features/Rider/utils/format';
import type { VehicleType } from '@/features/Rider/types';
import {
  RiderBreadcrumbs,
  RiderPageHeader,
  RiderBadge,
  RiderBtn,
  RiderModal,
  RiderSkeleton,
} from '@/features/Rider/components/RiderUI';

const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'BICYCLE', label: 'Bicycle' },
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
  { value: 'CAR', label: 'Car' },
  { value: 'VAN', label: 'Van' },
];

const VEHICLE_LABELS: Record<VehicleType, string> = {
  BICYCLE: 'Bicycle',
  MOTORCYCLE: 'Motorcycle',
  CAR: 'Car',
  VAN: 'Van',
};

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  APPROVED: { label: 'Approved', variant: 'success' },
  PENDING_APPROVAL: { label: 'Pending Review', variant: 'warning' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
  SUSPENDED: { label: 'Suspended', variant: 'danger' },
};

export default function RiderProfilePage() {
  const { riderProfile, isLoadingRiderProfile } = useRiderProfileQuery();
  const { updateRiderProfile, isUpdatingRiderProfile } = useRiderMutation();
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({
    vehicleType: '' as VehicleType | '',
    phoneNumber: '',
  });

  const openEdit = () => {
    setForm({
      vehicleType: riderProfile?.vehicleType ?? '',
      phoneNumber: riderProfile?.phoneNumber ?? '',
    });
    setEditModal(true);
  };

  const saveProfile = () => {
    const payload: Record<string, unknown> = {};
    if (form.vehicleType) payload.vehicleType = form.vehicleType;
    if (form.phoneNumber) payload.phoneNumber = form.phoneNumber;
    updateRiderProfile(payload as Parameters<typeof updateRiderProfile>[0]);
    setEditModal(false);
  };

  if (isLoadingRiderProfile) {
    return (
      <div>
        <RiderBreadcrumbs
          crumbs={[
            { label: 'Dashboard', href: '/rider/dashboard' },
            { label: 'Profile' },
          ]}
        />
        <RiderPageHeader title="Profile" description="Your rider information" />
        <div className="space-y-4">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>
      </div>
    );
  }

  if (!riderProfile) {
    return (
      <div>
        <RiderBreadcrumbs
          crumbs={[
            { label: 'Dashboard', href: '/rider/dashboard' },
            { label: 'Profile' },
          ]}
        />
        <div className="bg-white border border-zinc-200/70 px-6 py-10 text-center">
          <User size={26} className="mx-auto text-zinc-300" />
          <p className="text-sm font-medium text-zinc-600 mt-2">Profile not available</p>
        </div>
      </div>
    );
  }

  const statusDef = riderProfile.status
    ? STATUS_BADGE[riderProfile.status] ?? { label: riderProfile.status, variant: 'default' as const }
    : null;

  const walletBalance = riderProfile.wallet?.balance
    ? formatXAF(riderProfile.wallet.balance)
    : '—';

  const rating = riderProfile.averageRating
    ? parseFloat(riderProfile.averageRating).toFixed(1)
    : null;

  return (
    <div>
      <RiderBreadcrumbs
        crumbs={[
          { label: 'Dashboard', href: '/rider/dashboard' },
          { label: 'Profile' },
        ]}
      />
      <RiderPageHeader
        title="Profile"
        description="Your rider information and documents"
        actions={
          <RiderBtn variant="primary" size="sm" icon={Pencil} onClick={openEdit}>
            Edit
          </RiderBtn>
        }
      />

      {/* Status + ID row */}
      <div className="flex items-center gap-3 mb-5">
        {statusDef && (
          <RiderBadge variant={statusDef.variant} size="md">
            {statusDef.label}
          </RiderBadge>
        )}
        <span className="text-xs text-zinc-500">
          ID: <span className="font-mono text-zinc-600">{riderProfile.userId?.slice(0, 12) ?? '—'}</span>
        </span>
      </div>

      <div className="space-y-4">
        {/* Vehicle section */}
        <ProfileSection title="Vehicle">
          <ProfileField icon={Bike} label="Type" value={riderProfile.vehicleType ? (VEHICLE_LABELS[riderProfile.vehicleType] ?? riderProfile.vehicleType) : '—'} />
          <ProfileField icon={Hash} label="Plate Number" value={riderProfile.vehiclePlate ?? '—'} />
          <ProfileField icon={Bike} label="Model" value={riderProfile.vehicleModel ?? '—'} />
          {riderProfile.vehicleNumber && (
            <ProfileField icon={Hash} label="Vehicle Number" value={riderProfile.vehicleNumber} />
          )}
        </ProfileSection>

        {/* Contact section */}
        <ProfileSection title="Contact">
          <ProfileField icon={Smartphone} label="Phone" value={riderProfile.phoneNumber ?? '—'} />
          {riderProfile.licenseNumber && (
            <ProfileField icon={Award} label="License Number" value={riderProfile.licenseNumber} />
          )}
        </ProfileSection>

        {/* Stats section */}
        <ProfileSection title="Statistics">
          <ProfileField icon={Star} label="Rating" value={rating ? `${rating} / 5.0` : '—'} />
          <ProfileField icon={Award} label="Total Deliveries" value={String(riderProfile.totalDeliveries ?? 0)} />
          <ProfileField icon={Wallet} label="Wallet Balance" value={walletBalance} />
          {riderProfile.completionRate && (
            <ProfileField icon={Clock} label="Completion Rate" value={`${riderProfile.completionRate}%`} />
          )}
          <ProfileField
            icon={Shield}
            label="Background Check"
            value={riderProfile.backgroundCheckDone ? 'Passed' : 'Pending'}
          />
        </ProfileSection>

        {/* Documents section */}
        <ProfileSection title="Documents">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={14} className="text-zinc-400 shrink-0" />
              <span className="text-sm text-zinc-700">National ID</span>
            </div>
            {riderProfile.nationalIdUrl ? (
              <a
                href={riderProfile.nationalIdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                View
              </a>
            ) : (
              <span className="text-xs text-zinc-400">Not uploaded</span>
            )}
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-t border-zinc-100">
            <div className="flex items-center gap-3">
              <FileText size={14} className="text-zinc-400 shrink-0" />
              <span className="text-sm text-zinc-700">Driver&apos;s License</span>
            </div>
            {riderProfile.licenseUrl ? (
              <a
                href={riderProfile.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                View
              </a>
            ) : (
              <span className="text-xs text-zinc-400">Not uploaded</span>
            )}
          </div>
        </ProfileSection>
      </div>

      {/* Edit modal */}
      <RiderModal open={editModal} onClose={() => setEditModal(false)} title="Edit Profile" width="sm">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
              Vehicle Type
            </label>
            <select
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value as VehicleType })}
              className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors text-zinc-800 bg-white"
            >
              <option value="">Select...</option>
              {VEHICLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
              Phone Number
            </label>
            <input
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors text-zinc-800 placeholder:text-zinc-400"
              placeholder="+237XXXXXXXXX"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <RiderBtn
              variant="primary"
              icon={Pencil}
              onClick={saveProfile}
              loading={isUpdatingRiderProfile}
              className="flex-1 justify-center"
            >
              Save Changes
            </RiderBtn>
            <RiderBtn variant="ghost" onClick={() => setEditModal(false)}>
              Cancel
            </RiderBtn>
          </div>
        </div>
      </RiderModal>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-zinc-200/70">
      <div className="px-4 py-2.5 border-b border-zinc-100">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          {title}
        </p>
      </div>
      <div className="divide-y divide-zinc-100">{children}</div>
    </div>
  );
}

// ── Field row ─────────────────────────────────────────────────────────────────
function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <Icon size={14} className="text-zinc-400 shrink-0" />
      <div className="min-w-0 flex-1 flex items-baseline justify-between gap-4">
        <span className="text-xs font-medium text-zinc-500">{label}</span>
        <span className="text-sm text-zinc-800 text-right truncate">{value}</span>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProfileCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200/70">
      <div className="px-4 py-2.5 border-b border-zinc-100">
        <RiderSkeleton className="h-3 w-16" />
      </div>
      <div className="p-4 space-y-3">
        <RiderSkeleton className="h-4 w-3/5" />
        <RiderSkeleton className="h-4 w-2/5" />
        <RiderSkeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}