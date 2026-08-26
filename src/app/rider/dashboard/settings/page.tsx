// src/app/rider/dashboard/settings/page.tsx
'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import {
  Bell,
  LogOut,
  MapPin,
  RefreshCw,
  Target,
} from 'lucide-react';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';
import { useRiderLocation } from '@/features/Rider/hooks/useRiderLocation';
import { RiderBtn } from '@/features/Rider/components/RiderUI';

const LocationMap = dynamic(
  () => import('@/features/Rider/components/LocationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 bg-zinc-50 animate-pulse rounded-[3px] border border-zinc-200" />
    ),
  },
);

const GPS_LABEL: Record<string, { label: string; color: string }> = {
  tracking: { label: 'Tracking', color: 'text-emerald-600' },
  idle: { label: 'Idle', color: 'text-zinc-500' },
  error: { label: 'Error', color: 'text-red-500' },
  denied: { label: 'Denied', color: 'text-red-500' },
  unsupported: { label: 'Unavailable', color: 'text-zinc-400' },
};

export default function RiderSettingsPage() {
  const { logout, isLoggingOut } = useAuthMutation();
  const { gpsStatus, lastPosition, refresh, isUpdating } = useRiderLocation();

  const gps = GPS_LABEL[gpsStatus] ?? { label: 'Unknown', color: 'text-zinc-400' };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Location & GPS ────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-zinc-800">Location &amp; GPS</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          Your current position is sent to the server periodically while the dashboard is open.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[3px] overflow-hidden">
        {/* Map */}
        <div className="relative">
          {lastPosition ? (
            <LocationMap
              latitude={lastPosition.latitude}
              longitude={lastPosition.longitude}
              accuracy={lastPosition.accuracy}
            />
          ) : (
            <div className="h-56 bg-zinc-50 flex flex-col items-center justify-center gap-2 border-b border-zinc-200">
              <MapPin size={22} className="text-zinc-300" />
              <p className="text-xs text-zinc-400">Waiting for position…</p>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="px-4 py-4 space-y-3">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={13} className="text-zinc-400" />
              <span className="text-xs font-medium text-zinc-600">GPS Status</span>
            </div>
            <span className={`text-xs font-semibold ${gps.color}`}>
              {gps.label}
            </span>
          </div>

          <div className="h-px bg-zinc-100" />

          <div className="grid grid-cols-2 gap-3">
            {/* Latitude */}
            <StatRow
              label="Latitude"
              value={
                lastPosition
                  ? lastPosition.latitude.toFixed(6)
                  : '—'
              }
            />
            {/* Longitude */}
            <StatRow
              label="Longitude"
              value={
                lastPosition
                  ? lastPosition.longitude.toFixed(6)
                  : '—'
              }
            />
            {/* Accuracy */}
            <StatRow
              label="Accuracy"
              value={
                lastPosition?.accuracy != null
                  ? `±${Math.round(lastPosition.accuracy)} m`
                  : '—'
              }
            />
            {/* Speed */}
            <StatRow
              label="Speed"
              value={
                lastPosition?.speed != null && lastPosition.speed >= 0
                  ? `${(lastPosition.speed * 3.6).toFixed(1)} km/h`
                  : '—'
              }
            />
            {/* Heading */}
            <StatRow
              label="Heading"
              value={
                lastPosition?.heading != null && lastPosition.heading >= 0
                  ? `${Math.round(lastPosition.heading)}°`
                  : '—'
              }
            />
            {/* Provider */}
            <StatRow
              label="Source"
              value="GPS"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
          <RiderBtn
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={refresh}
            loading={isUpdating}
          >
            {isUpdating ? 'Updating…' : 'Update now'}
          </RiderBtn>
        </div>
      </div>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-zinc-800">Notifications</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          Delivery and earnings alerts
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[3px] overflow-hidden divide-y divide-zinc-100">
        <div className="px-4 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Preferences
          </p>
        </div>
        <ToggleRow
          icon={Bell}
          label="Delivery Alerts"
          description="Get notified when new deliveries are available"
          defaultChecked
        />
        <ToggleRow
          icon={Bell}
          label="Earnings Reports"
          description="Daily summary of your earnings"
          defaultChecked
        />
      </div>

      {/* ── Account ───────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-zinc-800">Account</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Session management</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[3px] overflow-hidden">
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-red-50 transition-colors group"
        >
          <LogOut size={14} className="text-zinc-400 group-hover:text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-zinc-800 group-hover:text-red-600 transition-colors">
              Sign Out
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">End your current session</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className="text-[11px] font-medium text-zinc-800 font-mono tabular-nums">
        {value}
      </span>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  defaultChecked,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="px-4 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <Icon size={14} className="text-zinc-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-800">{label}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
        />
        <div className="w-8 h-4.5 bg-zinc-200 peer-checked:bg-amber-400 rounded-full transition-colors relative">
          <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5 peer-checked:left-[14px] transition-all shadow-sm" />
        </div>
      </label>
    </div>
  );
}