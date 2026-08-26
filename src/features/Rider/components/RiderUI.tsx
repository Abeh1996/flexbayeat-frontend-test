// src/features/Rider/components/RiderUI.tsx
// Shared UI primitives for the rider module — compact, consistent, intentional.

'use client';
import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronRight, Loader2 } from 'lucide-react';

// ── Design tokens (rider module) ─────────────────────────────────────────────
// Accent: amber. Base: neutral/zinc.
export const RIDER_COLORS = {
  accent: 'amber',
  accentHex: '#f59e0b',
} as const;

// ── Breadcrumbs ──────────────────────────────────────────────────────────────
interface Crumb {
  label: string;
  href?: string;
}

export function RiderBreadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 mb-1">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.label}>
          {i > 0 && <ChevronRight size={10} className="text-zinc-300" />}
          {crumb.href ? (
            <a href={crumb.href} className="hover:text-zinc-600 transition-colors">
              {crumb.label}
            </a>
          ) : (
            <span className="text-zinc-600">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ── Page header ──────────────────────────────────────────────────────────────
export function RiderPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-zinc-500 mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ── Stat tile (compact) ──────────────────────────────────────────────────────
interface StatTileProps {
  label: string;
  value: string;
  icon?: React.ElementType;
  trend?: { value: string; positive: boolean };
}

export function RiderStatTile({ label, value, icon: Icon, trend }: StatTileProps) {
  return (
    <div className="bg-white border border-zinc-200/70 rounded-[4px] px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        {Icon && <Icon size={13} className="text-zinc-400" />}
        {trend && (
          <span
            className={`text-[10px] font-semibold ${
              trend.positive ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-xl font-semibold text-zinc-900 tabular-nums tracking-tight">
        {value}
      </p>
      <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{label}</p>
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const BADGE_VARIANTS = {
  default: 'bg-zinc-100 text-zinc-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-700',
};

export function RiderBadge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-[2px] ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      } ${BADGE_VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}

// ── Button (compact — never full-width on desktop) ──────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
  icon?: React.ElementType;
}

const BTN_VARIANTS = {
  primary:
    'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white disabled:bg-zinc-200 disabled:text-zinc-400',
  secondary:
    'border border-zinc-200 hover:border-zinc-300 active:bg-zinc-50 text-zinc-700 disabled:opacity-40',
  ghost:
    'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40',
  danger:
    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white disabled:bg-zinc-200 disabled:text-zinc-400',
};

export function RiderBtn({
  variant = 'primary',
  size = 'sm',
  loading,
  icon: Icon,
  children,
  className = '',
  ...rest
}: BtnProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 font-medium transition-all rounded-[3px]
        ${size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'}
        ${BTN_VARIANTS[variant]}
        ${loading ? 'cursor-wait' : ''}
        ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 12 : 14} className="animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 13 : 15} />
      ) : null}
      {children}
    </button>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'md';
}

export function RiderModal({ open, onClose, title, children, width = 'sm' }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !ref.current) return;
    ref.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        tabIndex={-1}
        className={`relative bg-white shadow-lg max-h-[85vh] overflow-y-auto ${
          width === 'sm' ? 'w-full max-w-sm' : 'w-full max-w-md'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors rounded-[2px] hover:bg-zinc-100"
          >
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Slide-over panel ─────────────────────────────────────────────────────────
interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function RiderSlideOver({ open, onClose, title, children }: SlideOverProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-white shadow-xl h-full flex flex-col animate-[slideIn_0.2s_ease-out]">
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0">
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors rounded-[2px] hover:bg-zinc-100"
          >
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
export function RiderSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-100 rounded-[2px] ${className}`}
    />
  );
}

export function RiderCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200/70 p-4 space-y-3">
      <RiderSkeleton className="h-4 w-2/5" />
      <RiderSkeleton className="h-3 w-4/5" />
      <RiderSkeleton className="h-3 w-3/5" />
      <div className="flex gap-2 pt-2">
        <RiderSkeleton className="h-7 w-20" />
        <RiderSkeleton className="h-7 w-16" />
      </div>
    </div>
  );
}

export function RiderStatSkeleton() {
  return (
    <div className="bg-white border border-zinc-200/70 p-4 space-y-2">
      <RiderSkeleton className="h-3 w-1/3" />
      <RiderSkeleton className="h-6 w-1/2" />
      <RiderSkeleton className="h-2.5 w-2/5" />
    </div>
  );
}

// ── Dropdown actions ─────────────────────────────────────────────────────────
interface Action {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  danger?: boolean;
}

export function RiderDropdownActions({ actions }: { actions: Action[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-[2px] transition-colors"
        aria-label="More actions"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-zinc-200 shadow-md py-0.5 z-50">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                action.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {action.icon && <action.icon size={12} />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}