// src/features/Buyer/components/account/LogoutConfirmModal.tsx
'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';

interface LogoutConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function LogoutConfirmModal({ open, onCancel, onConfirm, isLoading }: LogoutConfirmModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-full max-w-sm bg-white border border-zinc-200">

          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100">
            <h2 className="text-base font-black uppercase tracking-tight text-zinc-900">
              Sign out
            </h2>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              Are you sure you want to sign out of your SitekEats account?
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-3 border border-zinc-300 text-sm font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-colors duration-150 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-bold uppercase tracking-widest transition-colors duration-150"
            >
              {isLoading
                ? <><Loader2 size={14} className="animate-spin" /> Signing out...</>
                : 'Sign out'
              }
            </button>
          </div>

        </div>
      </motion.div>
    </>
  );
}