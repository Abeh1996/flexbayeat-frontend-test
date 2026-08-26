// src/app/admin/dashboard/vendors/page.tsx
'use client';

import { usePendingVendorsQuery } from '@/features/Admin/hooks/usePendingVendorsQuery';
import { useApprovalMutation } from '@/features/Admin/hooks/useApprovalMutation';
import { DataTable, StatusBadge, Pagination } from '@/features/Admin/components/DataTable';
import type { Column } from '@/features/Admin/components/DataTable';
import type { PendingVendor } from '@/features/Admin/types';
import { AlertCircle, Store, MapPin, Calendar, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PendingVendorsPage() {
  const { pendingVendors, isLoading, isError, error, refetch } = usePendingVendorsQuery();
  const { approveVendor, isApprovingVendor, approvingVendorId } = useApprovalMutation();
  const [actionVendor, setActionVendor] = useState<PendingVendor | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [commissionRate, setCommissionRate] = useState('0.15');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (vendor: PendingVendor) => {
    await approveVendor({
      id: vendor.id,
      payload: { approved: true, commissionRate: parseFloat(commissionRate) || 0.15 },
    });
    setActionVendor(null);
    setActionType(null);
  };

  const handleReject = async (vendor: PendingVendor) => {
    if (!rejectionReason || rejectionReason.length < 5) return;
    await approveVendor({
      id: vendor.id,
      payload: { approved: false, rejectionReason },
    });
    setActionVendor(null);
    setActionType(null);
    setRejectionReason('');
  };

  const columns: Column<PendingVendor>[] = [
    {
      key: 'business',
      label: 'Business',
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
            {v.logoUrl ? (
              <img src={v.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Store size={15} className="text-zinc-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-800 truncate">{v.businessName}</p>
            <p className="text-xs text-zinc-500 truncate">{v.email || v.phone || ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      hideOnMobile: true,
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-zinc-400 shrink-0" />
          <span className="text-sm text-zinc-600">{v.city || 'N/A'}{v.region ? `, ${v.region}` : ''}</span>
        </div>
      ),
    },
    {
      key: 'submitted',
      label: 'Submitted',
      hideOnMobile: true,
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-zinc-400 shrink-0" />
          <span className="text-sm text-zinc-500">{new Date(v.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'docs',
      label: 'Documents',
      hideOnMobile: true,
      render: (v) => (
        <div className="flex items-center gap-1">
          <FileText size={11} className="text-zinc-400 shrink-0" />
          <span className="text-sm text-zinc-500">{v.documents?.length || 0}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v.status || 'PENDING_APPROVAL'} />,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); setActionVendor(v); setActionType('approve'); setCommissionRate('0.15'); }}
            disabled={isApprovingVendor && approvingVendorId === v.id}
            className="px-3 py-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 disabled:opacity-40 transition-colors"
          >
            {isApprovingVendor && approvingVendorId === v.id ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              'Approve'
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActionVendor(v); setActionType('reject'); setRejectionReason(''); }}
            className="px-3 py-1.5 text-[10px] font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Vendor Approvals</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isLoading ? '…' : `${pendingVendors.length} vendor${pendingVendors.length !== 1 ? 's' : ''} awaiting review`}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <DataTable
        columns={columns}
        data={isLoading ? [] : pendingVendors}
        loading={isLoading}
        emptyMessage="No vendors pending approval. All caught up!"
        keyExtractor={(v) => v.id}
        skeletonCount={4}
        onRowClick={(v) => { setActionVendor(v); setActionType('approve'); setCommissionRate('0.15'); }}
      />

      {/* Approve modal */}
      {actionVendor && actionType === 'approve' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">Approve {actionVendor.businessName}</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                  Commission Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    step="0.01"
                    min="0"
                    max="1"
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-700"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">× 100 = %</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  E.g., 0.15 = 15% commission on each order
                </p>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                onClick={() => { setActionVendor(null); setActionType(null); }}
                className="px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(actionVendor)}
                disabled={isApprovingVendor}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {isApprovingVendor && <Loader2 size={12} className="animate-spin" />}
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {actionVendor && actionType === 'reject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">Reject {actionVendor.businessName}</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 text-zinc-700 placeholder:text-zinc-400 resize-none"
                  placeholder="Explain why this vendor is being rejected…"
                />
                {rejectionReason.length > 0 && rejectionReason.length < 5 && (
                  <p className="text-xs text-red-500 mt-1">Reason must be at least 5 characters</p>
                )}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                onClick={() => { setActionVendor(null); setActionType(null); }}
                className="px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(actionVendor)}
                disabled={isApprovingVendor || rejectionReason.length < 5}
                className="px-4 py-2 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {isApprovingVendor && <Loader2 size={12} className="animate-spin" />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}