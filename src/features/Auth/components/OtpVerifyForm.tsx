// src/features/Auth/components/OtpVerifyForm.tsx
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, Loader2, RotateCcw, ArrowLeft } from 'lucide-react';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { commitOtpVerifiedAction } from '../services/serverActions';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function maskContact(contact: string, method: string): string {
  if (method === 'email') {
    const [user, domain] = contact.split('@');
    if (!domain) return contact;
    const visible = user.slice(0, 2);
    return `${visible}${'*'.repeat(Math.max(user.length - 2, 3))}@${domain}`;
  }
  // phone — show last 3 digits
  return contact.slice(0, -3).replace(/\d/g, '*') + contact.slice(-3);
}

interface OtpVerifyFormProps {
  contact: string;
  method: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OtpVerifyForm({ contact, method, onSuccess, onBack }: OtpVerifyFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, isVerifyingOtp, requestOtp, isRequestingOtp } = useAuthMutation();

  const otp = digits.join('');
  const isComplete = otp.length === OTP_LENGTH && digits.every(Boolean);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const updated = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => { updated[i] = char; });
    setDigits(updated);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = useCallback(() => {
    if (!isComplete) return;
    const payload = method === 'phone' ? { phone: contact, code: otp } : { email: contact, code: otp };
    verifyOtp(payload, {
      onSuccess: async () => {
        await commitOtpVerifiedAction(contact);
        onSuccess();
      },
    });
  }, [isComplete, method, contact, otp, verifyOtp, onSuccess]);

  const handleResend = () => {
    const payload = method === 'phone' ? { phone: contact } : { email: contact };
    requestOtp(payload, {
      onSuccess: () => setCountdown(RESEND_SECONDS),
    });
  };

  return (
    <div className="space-y-6">

      {/* Masked contact */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 border border-zinc-200">
        <span className="text-xs text-zinc-500 font-medium tracking-widest">Code sent to</span>
        <span className="text-sm font-bold text-zinc-800">{maskContact(contact, method)}</span>
      </div>

      {/* OTP inputs */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold tracking-widest text-zinc-500">
          Verification Code
        </label>
        <div className="flex gap-2" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-full aspect-square text-center text-lg font-bold bg-white border
                text-zinc-900 outline-none transition-colors duration-150
                ${digit ? 'border-amber-500 bg-amber-50' : 'border-zinc-300'}
                focus:border-amber-500
              `}
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isComplete || isVerifyingOtp}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold tracking-widest py-3.5 transition-colors duration-150"
      >
        {isVerifyingOtp
          ? <><Loader2 size={15} className="animate-spin" /> Verifying...</>
          : <>Verify Code <ArrowRight size={15} /></>}
      </button>

      {/* Resend + back */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 tracking-widest transition-colors"
        >
          <ArrowLeft size={12} />
          Wrong contact
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isRequestingOtp}
          className="flex items-center gap-1.5 text-xs font-semibold tracking-widest transition-colors disabled:text-zinc-300 text-zinc-400 hover:text-amber-600 disabled:hover:text-zinc-300"
        >
          <RotateCcw size={12} />
          {countdown > 0 ? `Resend in ${countdown}s` : isRequestingOtp ? 'Sending...' : 'Resend code'}
        </button>
      </div>

    </div>
  );
}