// src/app/admin/(dashboard)/dashboard/settings/page.tsx
'use client';

import { useAdminProfileQuery } from '@/features/Admin/hooks/useAdminProfileQuery';
import { useAdminMutation } from '@/features/Admin/hooks/useAdminMutation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const profileSchema = z.object({
  adminRole: z.string().min(3, { message: 'Admin role must be at least 3 characters long.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const FormSkeleton = () => (
    <div className="bg-white border border-zinc-200 p-6">
        <div className="w-1/4 h-4 bg-zinc-100 animate-pulse mb-2"></div>
        <div className="w-full h-10 bg-zinc-100 animate-pulse mb-4"></div>
        <div className="w-32 h-10 bg-zinc-100 animate-pulse"></div>
    </div>
)

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

  if (isLoadingAdminProfile) {
    return <FormSkeleton />;
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-zinc-200">
        <div className="p-6">
          <h2 className="text-base font-bold text-zinc-900">Admin Profile</h2>
          <p className="text-sm text-zinc-500 mt-1">Update your administrative role.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 border-t border-zinc-200">
            <div>
              <label htmlFor="adminRole" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Admin Role
              </label>
              <input
                id="adminRole"
                type="text"
                {...register('adminRole')}
                className="mt-1 w-full bg-white border border-zinc-300 text-sm font-medium text-zinc-900 px-3 py-2"
              />
              {errors.adminRole && (
                <p className="mt-1 text-xs text-red-500">{errors.adminRole.message}</p>
              )}
            </div>
          </div>
          <div className="bg-zinc-50 p-6 border-t border-zinc-200 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingAdminProfile || !isDirty}
              className="px-6 py-2 text-sm font-bold text-white bg-zinc-900 uppercase tracking-widest disabled:opacity-40 flex items-center gap-2"
            >
              {isUpdatingAdminProfile && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
