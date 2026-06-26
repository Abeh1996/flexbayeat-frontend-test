// src/features/Vendor/components/Topbar.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';

interface TopbarProps {
  businessName?: string;
  logoUrl?: string;
  onMenuClick: () => void;
  pageTitle: string;
}

export function Topbar({ businessName, logoUrl, onMenuClick, pageTitle }: TopbarProps) {
  const router = useRouter();
  const { logout, isLoggingOut } = useAuthMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-white sticky top-0 border-b border-zinc-200 flex items-center justify-between gap-4 px-5 lg:px-8 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-tight text-zinc-900 truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          title="Notifications"
          className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors relative"
        >
          <Bell size={17} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-1 py-1.5 hover:bg-zinc-100 transition-colors"
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="w-7 h-7 object-cover" />
            ) : (
              <div className="w-7 h-7 bg-zinc-200 flex items-center justify-center">
                <User size={14} className="text-zinc-500" />
              </div>
            )}
            <span className="hidden sm:block text-sm font-semibold text-zinc-700 max-w-[140px] truncate">
              {businessName || 'My Business'}
            </span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-md z-50">
                <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/vendor/dashboard/profile');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
              >
                <User size={14} className="text-zinc-400" />
                Profile
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/vendor/dashboard/settings');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
              >
                <Settings size={14} className="text-zinc-400" />
                Settings
              </button>
              <button
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
              >
                <LogOut size={14} />
                {isLoggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}