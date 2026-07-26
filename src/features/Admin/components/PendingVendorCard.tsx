// src/features/Admin/components/PendingVendorCard.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building, MapPin, Calendar, FileText, Percent, MessageSquare, Check, X } from 'lucide-react';
import { PendingVendor } from '../types';
import { useApprovalMutation } from '../hooks/useApprovalMutation';
import Image from 'next/image';

const rejectSchema = z.object({
  rejectionReason: z.string().min(10, 'Rejection reason must be at least 10 characters.'),
});

const approveSchema = z.object({
  commissionRate: z.coerce.number().min(0).max(1),
});

type ApproveFormInput = z.input<typeof approveSchema>;
type ApproveFormOutput = z.output<typeof approveSchema>;

interface PendingVendorCardProps {
  vendor: PendingVendor;
}

export function PendingVendorCard({ vendor }: PendingVendorCardProps) {
  const { approveVendor, isApprovingVendor, approvingVendorId } = useApprovalMutation();
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const isLoading = isApprovingVendor && approvingVendorId === vendor.id;

  const {
    register: registerReject,
    handleSubmit: handleRejectSubmit,
    formState: { errors: rejectErrors },
  } = useForm<{ rejectionReason: string }>({ resolver: zodResolver(rejectSchema) });

  const {
    register: registerApprove,
    handleSubmit: handleApproveSubmit,
    formState: { errors: approveErrors },
  } = useForm<ApproveFormInput, any, ApproveFormOutput>({
    resolver: zodResolver(approveSchema),
    defaultValues: { commissionRate: 0.15 },
  });

  const onReject = async (data: { rejectionReason: string }) => {
    await approveVendor({
      id: vendor.id,
      payload: { approved: false, rejectionReason: data.rejectionReason },
    });
  };

  const onApprove = async (data: ApproveFormOutput) => {
    await approveVendor({
      id: vendor.id,
      payload: { approved: true, commissionRate: data.commissionRate },
    });
  };

  const toggleApprove = () => {
    setShowApproveForm(!showApproveForm);
    setShowRejectForm(false);
  };

  const toggleReject = () => {
    setShowRejectForm(!showRejectForm);
    setShowApproveForm(false);
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <Loader2 size={24} className="animate-spin text-amber-500" />
        </div>
      )}
      <div className="flex items-start gap-5">
        <Image
          src={vendor.logoUrl || '/images/restaurants/my-way.png'}
          alt={vendor.businessName}
          width={48}
          height={48}
          className="w-12 h-12 object-cover shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-base font-bold text-zinc-900">{vendor.businessName}</h3>
          <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5"><MapPin size={12} /> {vendor.city || 'N/A'}, {vendor.region || 'N/A'}</span>
            <span className="flex items-center gap-1.5"><Calendar size={12} /> Submitted: {new Date(vendor.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><FileText size={12} /> {vendor.documents?.length || 0} documents</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggleApprove} className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 uppercase tracking-widest">Approve</button>
          <button onClick={toggleReject} className="px-4 py-2 text-sm font-bold text-red-500 border border-red-500 bg-white uppercase tracking-widest">Reject</button>
        </div>
      </div>

      {showApproveForm && (
        <form onSubmit={handleApproveSubmit(onApprove)} className="mt-4 pt-4 border-t border-zinc-200">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Commission Rate</label>
          <div className="flex items-center gap-2 mt-1">
            <div className="relative flex-grow">
              <input
                {...registerApprove('commissionRate')}
                type="number"
                step="0.01"
                className="w-full bg-white border border-zinc-300 text-sm font-medium text-zinc-900 px-3 py-2 pr-8"
                placeholder="e.g. 0.15 for 15%"
              />
              <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <Check size={16} /> Confirm
            </button>
          </div>
          {approveErrors.commissionRate && <p className="text-xs text-red-500 mt-1">{approveErrors.commissionRate.message}</p>}
        </form>
      )}

      {showRejectForm && (
        <form onSubmit={handleRejectSubmit(onReject)} className="mt-4 pt-4 border-t border-zinc-200">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Rejection Reason (Required)</label>
          <div className="flex items-start gap-2 mt-1">
            <div className="relative flex-grow">
                <textarea
                    {...registerReject('rejectionReason')}
                    className="w-full bg-white border border-zinc-300 text-sm font-medium text-zinc-900 px-3 py-2"
                    placeholder="Provide a clear reason for rejection..."
                    rows={3}
                />
            </div>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-bold text-white bg-red-500 uppercase tracking-widest flex items-center gap-2">
              <X size={16} /> Confirm
            </button>
          </div>
          {rejectErrors.rejectionReason && <p className="text-xs text-red-500 mt-1">{rejectErrors.rejectionReason.message}</p>}
        </form>
      )}
    </div>
  );
}