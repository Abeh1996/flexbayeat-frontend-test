// src/app/auth/forgot/page.tsx
'use client';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ForgotPasswordForm } from '@/features/Auth/components/ForgotPasswordForm';
import { Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const variants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [contact, setContact] = useState('');

  return (
    <div className="w-full">

      <AnimatePresence mode="wait">

        {/* ── Form state ── */}
        {!sent && (
          <motion.div
            key="form"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <div className="mb-7 space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
                Forgot password
              </h1>
              <p className="text-sm text-zinc-500 font-medium">
                Enter your phone or email and we'll send you a reset link.
              </p>
            </div>

            <ForgotPasswordForm
              onSuccess={(sentContact) => {
                setContact(sentContact);
                setSent(true);
              }}
            />

            <p className="mt-7 text-sm text-zinc-500">
              Remembered it?{' '}
              <Link href="/auth/buyer/login" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}

        {/* ── Success state ── */}
        {sent && (
          <motion.div
            key="success"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="space-y-6"
          >
            {/* Icon */}
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Mail size={24} className="text-amber-500" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
                Check your {contact.includes('@') ? 'email' : 'phone'}
              </h1>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                We sent a password reset link to{' '}
                <span className="font-semibold text-zinc-800">{contact}</span>.
                Click the link in the message to reset your password.
              </p>
            </div>

            {/* Open Gmail CTA — only show if email */}
            {contact.includes('@') && (
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors duration-150"
              >
                Open Gmail
                <ExternalLink size={14} />
              </a>
            )}

            {/* Didn't receive */}
            <div className="space-y-2 pt-1">
              <p className="text-xs text-zinc-400 font-medium">
                Didn't receive it?
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors"
              >
                Try a different contact
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}