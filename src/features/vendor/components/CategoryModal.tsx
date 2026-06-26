// src/features/Vendor/components/CategoryModal.tsx
'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Tag } from 'lucide-react';
import { MenuCategory, CreateCategoryPayload } from '../types/menu.types';

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 bg-white border rounded-md text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors ${
    err ? 'border-red-400 focus:border-red-400' : 'border-zinc-200 focus:border-amber-500'
  }`;
const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5';
const errorCls = 'text-xs text-red-500 font-medium mt-1';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCategoryPayload) => void;
  isLoading: boolean;
  editingCategory?: MenuCategory | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingCategory,
}: CategoryModalProps) {
  const isEditing = !!editingCategory;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  // Prefill when editing
  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        description: editingCategory.description ?? '',
        isActive: editingCategory.isActive,
      });
    } else {
      reset({ name: '', description: '', isActive: true });
    }
  }, [editingCategory, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      isActive: values.isActive,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Tag size={15} className="text-amber-600" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-tight text-zinc-900">
                {isEditing ? 'Edit Category' : 'New Category'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
            <div>
              <label className={labelCls}>
                Category Name <span className="text-red-400">*</span>
              </label>
              <input
                {...register('name')}
                placeholder="e.g. Main Courses, Beverages, Desserts"
                className={inputCls(!!errors.name)}
                autoFocus
              />
              {errors.name && <p className={errorCls}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>
                Description{' '}
                <span className="normal-case tracking-normal font-normal text-zinc-400">(optional)</span>
              </label>
              <textarea
                {...register('description')}
                rows={2}
                placeholder="Short description visible to customers…"
                className={`${inputCls()} resize-none`}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
                Visible to customers
              </span>
            </label>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 rounded-lg text-sm font-bold text-white transition-colors"
              >
                {isLoading && <Loader2 size={14} className="animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}