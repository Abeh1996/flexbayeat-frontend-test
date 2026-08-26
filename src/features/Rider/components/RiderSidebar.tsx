// src/features/Rider/components/RiderSidebar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  User,
  Settings,
  X,
  Bike,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/rider/dashboard', icon: LayoutDashboard },
  { label: 'Deliveries', href: '/rider/dashboard/deliveries', icon: Package },
  { label: 'Earnings', href: '/rider/dashboard/earnings', icon: DollarSign },
  { label: 'Profile', href: '/rider/dashboard/profile', icon: User },
  { label: 'Settings', href: '/rider/dashboard/settings', icon: Settings },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RiderSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/rider/dashboard'
      ? pathname === '/rider/dashboard'
      : pathname.startsWith(href);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-white flex flex-col shrink-0 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 h-14 shrink-0">
          <Link
            href="/rider/dashboard"
            className="flex items-center gap-2 min-w-0 group"
          >
            <div className="w-7 h-7 bg-amber-500 flex items-center justify-center shrink-0 rounded-md">
              <Bike size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-800">
              Rider Hub
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-zinc-400 hover:text-zinc-600 transition-colors rounded-md"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-all rounded-md ${
                  active
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 font-normal'
                }`}
              >
                <item.icon
                  size={15}
                  className={`shrink-0 ${
                    active ? 'text-amber-500' : 'text-zinc-400'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 shrink-0 border-t border-zinc-100">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            FlexBayEats
          </p>
        </div>
      </aside>
    </>
  );
}