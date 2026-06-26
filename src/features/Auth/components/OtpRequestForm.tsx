// src/features/Auth/components/OtpRequestForm.tsx
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader2, Phone, Mail } from 'lucide-react';
import { useAuthMutation } from '../hooks/useAuthMutation';

type Method = 'phone' | 'email';

const schemas = {
  phone: z.object({ phone: z.string().min(8, 'Enter a valid phone number').regex(/^\+?[0-9\s\-().]+$/, 'Invalid format') }),
  email: z.object({ email: z.string().min(1, 'Email is required').email('Invalid email') }),
};

type PhoneValues = z.infer<typeof schemas.phone>;
type EmailValues = z.infer<typeof schemas.email>;

const inputCls = (err?: boolean) => `w-full px-4 py-3 bg-white border text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors duration-150 ${err ? 'border-red-400 focus:border-red-400' : 'border-zinc-300 focus:border-amber-500'}`;
const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-zinc-500';

interface OtpRequestFormProps {
  onSuccess: (contact: string, method: Method) => void;
}

export function OtpRequestForm({ onSuccess }: OtpRequestFormProps) {
  const [method, setMethod] = useState<Method>('email');
  const { requestOtp, isRequestingOtp } = useAuthMutation();

  const phoneForm = useForm<PhoneValues>({ resolver: zodResolver(schemas.phone) });
  const emailForm = useForm<EmailValues>({ resolver: zodResolver(schemas.email) });

  const handlePhone = (v: PhoneValues) => {
    requestOtp({ phone: v.phone }, { onSuccess: () => onSuccess(v.phone, 'phone') });
  };

  const handleEmail = (v: EmailValues) => {
    requestOtp({ email: v.email }, { onSuccess: () => onSuccess(v.email, 'email') });
  };

  const SubmitBtn = (
    <button
      type="submit"
      disabled={isRequestingOtp}
      className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors duration-150"
    >
      {isRequestingOtp
        ? <><Loader2 size={15} className="animate-spin" /> Sending...</>
        : <>Send Code <ArrowRight size={15} /></>}
    </button>
  );

  return (
    <div className="space-y-5">

      {/* Method toggle */}
      <div className="space-y-1.5">
        <label className={labelCls}>Send code via</label>
        <div className="flex border border-zinc-200 rounded-lg overflow-hidden">
          {(['email', 'phone'] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${method === m ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-500 hover:text-zinc-800'}`}
            >
              {m === 'phone' ? <Phone size={13} /> : <Mail size={13} />}
              {m}
            </button>
          ))}
        </div>
      </div>

      {method === 'phone' && (
        <form onSubmit={phoneForm.handleSubmit(handlePhone)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelCls}>Phone Number</label>
            <input {...phoneForm.register('phone')} type="tel" placeholder="+237 6XX XXX XXX" className={inputCls(!!phoneForm.formState.errors.phone)} />
            {phoneForm.formState.errors.phone && <p className="text-xs text-red-500 font-medium">{phoneForm.formState.errors.phone.message}</p>}
          </div>
          {SubmitBtn}
        </form>
      )}

      {method === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleEmail)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelCls}>Email Address</label>
            <input {...emailForm.register('email')} type="email" placeholder="you@example.com" className={inputCls(!!emailForm.formState.errors.email)} />
            {emailForm.formState.errors.email && <p className="text-xs text-red-500 font-medium">{emailForm.formState.errors.email.message}</p>}
          </div>
          {SubmitBtn}
        </form>
      )}

    </div>
  );
}