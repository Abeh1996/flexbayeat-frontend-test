// src/features/Rider/components/RiderTopbar.tsx
'use client';
import React from 'react';
import { Menu, LogOut, Crosshair } from 'lucide-react';
import { useRiderProfileQuery } from '../hooks/useRiderProfileQuery';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';
import type { GpsStatus } from '../hooks/useRiderLocation';

interface TopbarProps {
  pageTitle: string;
  onMenuClick: () => void;
  gpsStatus: GpsStatus;
}

const GPS_DOT: Record<GpsStatus, { color: string; label: string }> = {
  tracking: { color: 'bg-emerald-500', label: 'GPS active' },
  idle: { color: 'bg-zinc-300', label: 'GPS idle' },
  error: { color: 'bg-red-400', label: 'GPS error' },
  denied: { color: 'bg-red-400', label: 'GPS denied' },
  unsupported: { color: 'bg-zinc-300', label: 'GPS unavailable' },
};

export function RiderTopbar({ pageTitle, onMenuClick, gpsStatus }: TopbarProps) {
  const { riderProfile } = useRiderProfileQuery();
  const { logout } = useAuthMutation();

  const initials =
    riderProfile?.userId
      ? riderProfile.userId.slice(0, 2).toUpperCase()
      : 'R';

  const displayName =
    riderProfile?.vehiclePlate || riderProfile?.vehicleNumber || 'Rider';

  const vehicleLabel = riderProfile?.vehicleType
    ? riderProfile.vehicleType.toLowerCase()
    : '—';

  const gps = GPS_DOT[gpsStatus];

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-zinc-100 flex items-center justify-between px-4 lg:px-5">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors rounded-[3px]"
        >
          <Menu size={17} />
        </button>
        <h1 className="text-sm font-semibold text-zinc-800 truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* GPS indicator — subtle */}
        <div
          className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400"
          title={gps.label}
        >
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${gps.color} shrink-0`} />
          <span className="hidden sm:inline">{gps.label}</span>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-zinc-100 flex items-center justify-center rounded-[3px]">
            <span className="text-[11px] font-semibold text-zinc-600">
              {initials}
            </span>
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="text-xs font-medium text-zinc-700 truncate max-w-[100px]">
              {displayName}
            </p>
            <p className="text-[10px] text-zinc-400 truncate max-w-[100px]">
              {vehicleLabel}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors rounded-[3px]"
          title="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}