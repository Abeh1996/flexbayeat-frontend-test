// src/features/Admin/components/Sidebar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  Bike,
  Settings,
  ShieldCheck,
  X,
  Truck,
  ChevronDown,
  MapPin,
  ClipboardCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', href: '/admin/dashboard', icon: LayoutGrid },
    ],
  },
  {
    title: 'Deliveries',
    items: [
      { label: 'Unassigned', href: '/admin/dashboard/deliveries?tab=unassigned', icon: ClipboardCheck },
      { label: 'Assigned', href: '/admin/dashboard/deliveries?tab=assigned', icon: Truck },
      { label: 'Available Riders', href: '/admin/dashboard/deliveries?tab=riders', icon: MapPin },
    ],
  },
  {
    title: 'Approvals',
    items: [
      { label: 'Vendors', href: '/admin/dashboard/vendors', icon: Users },
      { label: 'Riders', href: '/admin/dashboard/riders', icon: Bike },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const [basePath] = href.split('?');
    if (basePath === '/admin/dashboard') return pathname === basePath;
    return pathname.startsWith(basePath);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold text-zinc-900 block truncate">
                FlexBayEats
              </span>
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-zinc-400 hover:text-zinc-600 transition-colors rounded-md hover:bg-zinc-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[9px] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        active
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 ${
                          active ? 'text-amber-500' : 'text-zinc-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-100 shrink-0">
          <p className="text-[10px] font-medium text-zinc-400">
            &copy; {new Date().getFullYear()} FlexBayEats
          </p>
        </div>
      </aside>
    </>
  );
}