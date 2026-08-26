// src/features/Admin/components/DataTable.tsx
'use client';
import React from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  skeletonCount?: number;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data found',
  loading = false,
  skeletonCount = 5,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-400 ${col.className || ''} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <tr key={i} className="border-b border-zinc-50 last:border-0">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3.5 ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    <div className="h-4 bg-zinc-100 animate-pulse rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl px-6 py-12 text-center">
        <p className="text-sm font-medium text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-400 ${col.className || ''} ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-zinc-50 last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-zinc-50' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3.5 text-sm text-zinc-700 ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({
  status,
  size = 'sm',
}: {
  status: string;
  size?: 'sm' | 'md';
}) {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-zinc-100 text-zinc-600',
    PENDING_APPROVAL: 'bg-amber-50 text-amber-700',
    APPROVED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    SUSPENDED: 'bg-orange-50 text-orange-700',
    ASSIGNED: 'bg-blue-50 text-blue-700',
    PICKED_UP: 'bg-violet-50 text-violet-700',
    OUT_FOR_DELIVERY: 'bg-indigo-50 text-indigo-700',
    EN_ROUTE_TO_VENDOR: 'bg-sky-50 text-sky-700',
    ARRIVED_AT_VENDOR: 'bg-cyan-50 text-cyan-700',
    EN_ROUTE_TO_BUYER: 'bg-teal-50 text-teal-700',
    ARRIVED_AT_BUYER: 'bg-emerald-50 text-emerald-700',
    DELIVERED: 'bg-emerald-50 text-emerald-700',
    FAILED: 'bg-red-50 text-red-700',
    RETURNED: 'bg-orange-50 text-orange-700',
    CANCELLED: 'bg-zinc-100 text-zinc-500',
    READY_FOR_PICKUP: 'bg-blue-50 text-blue-700',
  };

  const cls = colorMap[status] || 'bg-zinc-100 text-zinc-600';
  const label = status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${cls}`}
    >
      {label}
    </span>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-zinc-400">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const start = Math.max(1, page - 2);
          const p = start + i;
          if (p > totalPages) return null;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                p === page
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}