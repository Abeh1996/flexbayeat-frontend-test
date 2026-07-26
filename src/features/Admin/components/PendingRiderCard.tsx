// src/features/Admin/components/PendingRiderCard.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, User, Bike, Hash, Calendar, FileText, Check, X } from 'lucide-react';
import { PendingRider } from '../types';
import { useApprovalMutation } from '../hooks/useApprovalMutation';
import Link from 'next/link';

const rejectSchema = z.object({
  rejectionReason: z.string().min(10, 'Rejection reason must be at least 10 characters.'),
});

interface PendingRiderCardProps {
  rider: PendingRider;
}

export function PendingRiderCard({ rider }: PendingRiderCardProps) {
  const { approveRider, isApprovingRider, approvingRiderId } = useApprovalMutation();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const isLoading = isApprovingRider && approvingRiderId === rider.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ rejectionReason: string }>({ resolver: zodResolver(rejectSchema) });

  const onReject = async (data: { rejectionReason: string }) => {
    await approveRider({
      id: rider.id,
      payload: { approved: false, rejectionReason: data.rejectionReason },
    });
  };

  const onApprove = async () => {
    setShowRejectForm(false);
    await approveRider({
      id: rider.id,
      payload: { approved: true },
    });
  };

  const toggleReject = () => {
    setShowRejectForm(!showRejectForm);
  };
  
  // A simple way to get initials from a user ID if name isn't available
  const getInitials = (id: string) => (id ? id.substring(0, 2).toUpperCase() : '??');

  return (
    <div className="bg-white border border-zinc-200 p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <Loader2 size={24} className="animate-spin text-amber-500" />
        </div>
      )}
      <div className="flex items-start gap-5">
        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-zinc-500">{getInitials(rider.userId)}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-zinc-900">Rider ID: {rider.userId}</h3>
          <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5 capitalize"><Bike size={12} /> {rider.vehicleType.toLowerCase()}</span>
            <span className="flex items-center gap-1.5"><Hash size={12} /> {rider.vehiclePlate}</span>
            <span className="flex items-center gap-1.5"><Calendar size={12} /> Submitted: {new Date(rider.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            {rider.nationalId && <Link href={rider.nationalId} target="_blank" className="text-xs font-medium text-amber-600 hover:underline flex items-center gap-1.5"><FileText size={12}/> National ID</Link>}
            {rider.license && <Link href={rider.license} target="_blank" className="text-xs font-medium text-amber-600 hover:underline flex items-center gap-1.5"><FileText size={12}/> License</Link>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onApprove} className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 uppercase tracking-widest">Approve</button>
          <button onClick={toggleReject} className="px-4 py-2 text-sm font-bold text-red-500 border border-red-500 bg-white uppercase tracking-widest">Reject</button>
        </div>
      </div>

      {showRejectForm && (
        <form onSubmit={handleSubmit(onReject)} className="mt-4 pt-4 border-t border-zinc-200">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Rejection Reason (Required)</label>
          <div className="flex items-start gap-2 mt-1">
            <div className="relative flex-grow">
                <textarea
                    {...register('rejectionReason')}
                    className="w-full bg-white border border-zinc-300 text-sm font-medium text-zinc-900 px-3 py-2"
                    placeholder="Provide a clear reason for rejection..."
                    rows={3}
                />
            </div>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-bold text-white bg-red-500 uppercase tracking-widest flex items-center gap-2">
              <X size={16} /> Confirm
            </button>
          </div>
          {errors.rejectionReason && <p className="text-xs text-red-500 mt-1">{errors.rejectionReason.message}</p>}
        </form>
      )}
    </div>
  );
}
