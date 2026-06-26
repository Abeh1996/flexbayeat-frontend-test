// src/features/Vendor/components/Sidebar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  ShoppingBag,
  // Wallet,
  Settings,
  BarChart3,
  Store,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/vendor/dashboard', icon: LayoutGrid },
  { label: 'Orders', href: '/vendor/dashboard/orders', icon: ShoppingBag },
  { label: 'Menu', href: '/vendor/dashboard/menu', icon: Package },
  { label: 'Analytics', href: '/vendor/dashboard/analytic', icon: BarChart3 },
  { label: 'Profile', href: '/vendor/dashboard/profile', icon: Settings },
];

interface SidebarProps {
  businessName?: string;
  logoUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ businessName, logoUrl, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/vendor/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 flex flex-col shrink-0 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="w-8 h-8 object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 bg-amber-500 flex items-center justify-center shrink-0">
                <Store size={15} className="text-white" />
              </div>
            )}
            <span className="text-sm font-bold text-white truncate">
              {businessName || 'Vendor Portal'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-500 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer note */}
        <div className="px-5 py-4 border-t border-zinc-800 shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            Vendor Account
          </p>
        </div>
      </aside>
    </>
  );
}