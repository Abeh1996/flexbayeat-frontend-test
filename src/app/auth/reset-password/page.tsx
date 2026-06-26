// src/app/auth/reset/page.tsx
'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthMutation } from '@/features/Auth/hooks/useAuthMutation';

const schema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

const inputCls = (err?: boolean) => `w-full px-4 py-3 bg-white border text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors duration-150 ${err ? 'border-red-400 focus:border-red-400' : 'border-zinc-300 focus:border-amber-500'}`;
const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-zinc-500';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [show, setShow] = useState({ new: false, confirm: false });
  const { resetPassword, isResetLoading } = useAuthMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // No token — show message, don't redirect
  if (!token) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-4">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-red-700">Invalid or missing reset token</p>
            <p className="text-xs text-red-600 leading-relaxed">
              This link is invalid or has expired. Please request a new password reset link.
            </p>
          </div>
        </div>
        <Link
          href="/auth/forgot"
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors duration-150"
        >
          Request New Link
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    resetPassword(
      { token, newPassword: values.newPassword },
      { onSuccess: () => router.replace('/auth/reset-success') }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      {/* New password */}
      <div className="space-y-1.5">
        <label className={labelCls}>New Password</label>
        <div className="relative">
          <input
            {...register('newPassword')}
            type={show.new ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            className={inputCls(!!errors.newPassword) + ' pr-11'}
          />
          <button type="button" tabIndex={-1} onClick={() => setShow(s => ({ ...s, new: !s.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
            {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label className={labelCls}>Confirm Password</label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={show.confirm ? 'text' : 'password'}
            placeholder="Re-enter password"
            autoComplete="new-password"
            className={inputCls(!!errors.confirmPassword) + ' pr-11'}
          />
          <button type="button" tabIndex={-1} onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
            {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isResetLoading}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors duration-150"
      >
        {isResetLoading
          ? <><Loader2 size={15} className="animate-spin" /> Resetting...</>
          : <>Reset Password <ArrowRight size={15} /></>}
      </button>

    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full">
      <div className="mb-7 space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
          Reset password
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Choose a new password for your account.
        </p>
      </div>
      <Suspense fallback={
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-zinc-100 animate-pulse" />)}
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}