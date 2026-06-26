// src/features/Buyer/components/account/BuyerAccountMobileNav.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';
import { LogoutConfirmModal } from './LogoutConfirmModal';

const NAV_ITEMS = [
  { label: 'Profile',   href: '/buyer/account/profile',   icon: User },
  { label: 'Orders',    href: '/buyer/account/orders',    icon: ShoppingBag },
  { label: 'Addresses', href: '/buyer/account/addresses', icon: MapPin },
  { label: 'Settings',  href: '/buyer/account/settings',  icon: Settings },
];

export function BuyerAccountMobileNav() {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useAuthMutation();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-200 flex items-center">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors duration-150 ${active ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}

        {/* Logout tab */}
        <button
          onClick={() => setShowLogout(true)}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-zinc-400 hover:text-red-500 transition-colors duration-150"
        >
          <LogOut size={18} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Logout</span>
        </button>
      </nav>

      <LogoutConfirmModal
        open={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={() => logout()}
        isLoading={isLoggingOut}
      />
    </>
  );
}