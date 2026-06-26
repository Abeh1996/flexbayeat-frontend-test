// src/features/Buyer/components/account/BuyerAccountSidebar.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, MapPin, Settings, LogOut } from 'lucide-react';
import { useProfileQuery } from '@/features/Auth/hooks/useProfileQuery';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';
import { LogoutConfirmModal } from './LogoutConfirmModal';

const NAV_ITEMS = [
  { label: 'Profile',    href: '/buyer/account/profile',   icon: User },
  { label: 'Orders',     href: '/buyer/account/orders',    icon: ShoppingBag },
  { label: 'Addresses',  href: '/buyer/account/addresses', icon: MapPin },
  { label: 'Settings',   href: '/buyer/account/settings',  icon: Settings },
];

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0]?.toUpperCase() ?? '';
  const l = lastName?.[0]?.toUpperCase() ?? '';
  return `${f}${l}` || '??';
}

export function BuyerAccountSidebar() {
  const pathname = usePathname();
  const { user } = useProfileQuery();
  const { logout, isLoggingOut } = useAuthMutation();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <aside className="w-[240px] shrink-0 h-screen sticky top-0 border-r border-zinc-200 bg-white flex flex-col">
        

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors duration-150
                  ${active
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }
                `}
              >
                <Icon size={16} className={active ? 'text-amber-500' : 'text-zinc-400'} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-zinc-100">
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-semibold text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </aside>

      <LogoutConfirmModal
        open={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={() => logout()}
        isLoading={isLoggingOut}
      />
    </>
  );
}