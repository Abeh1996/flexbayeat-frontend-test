// src/app/admin/dashboard/settings/page.tsx
'use client';

import { useAdminProfileQuery } from '@/features/Admin/hooks/useAdminProfileQuery';
import { useAdminMutation } from '@/features/Admin/hooks/useAdminMutation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

const profileSchema = z.object({
  adminRole: z.string().min(3, { message: 'Admin role must be at least 3 characters.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminSettingsPage() {
  const { adminProfile, isLoadingAdminProfile } = useAdminProfileQuery();
  const { updateAdminProfile, isUpdatingAdminProfile } = useAdminMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (adminProfile) {
      reset({ adminRole: adminProfile.adminRole });
    }
  }, [adminProfile, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    await updateAdminProfile(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your admin account</p>
      </div>

      {isLoadingAdminProfile ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <div className="space-y-4">
            <div className="w-1/4 h-4 bg-zinc-100 animate-pulse rounded" />
            <div className="w-full h-10 bg-zinc-100 animate-pulse rounded-lg" />
            <div className="w-24 h-10 bg-zinc-100 animate-pulse rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="max-w-xl">
          <div className="bg-white border border-zinc-200 rounded-xl">
            <div className="px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Admin Profile</h2>
                  <p className="text-xs text-zinc-500">Update your administrative role</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-5 space-y-4">
                <div>
                  <label htmlFor="adminRole" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                    Admin Role
                  </label>
                  <input
                    id="adminRole"
                    type="text"
                    {...register('adminRole')}
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-700 placeholder:text-zinc-400 transition-colors"
                    placeholder="e.g. super_admin, moderator"
                  />
                  {errors.adminRole && (
                    <p className="mt-1 text-xs text-red-500">{errors.adminRole.message}</p>
                  )}
                </div>
              </div>
              <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingAdminProfile || !isDirty}
                  className="px-5 py-2 text-xs font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {isUpdatingAdminProfile && <Loader2 size={13} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}