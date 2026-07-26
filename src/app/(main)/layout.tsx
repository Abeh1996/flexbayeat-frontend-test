'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useProfileQuery } from '@/features/Auth/hooks/useProfileQuery';
import { useRouter } from 'next/navigation';
import LoadingScreen from './loading';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Newsletter from '@/components/landing/Newsletter';

const ROLE_REDIRECTS: Record<string, string> = {
  VENDOR: '/vendor/dashboard',
  RIDER: '/rider/dashboard',
  ADMIN: '/admin/dashboard',
};

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingProfile } = useProfileQuery();
  const router = useRouter();
  
  // Safe hydration mount check
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoadingProfile || !user) return;

    const redirectTo = ROLE_REDIRECTS[user.role];
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [user, isLoadingProfile, router, isMounted]);

  const isNonBuyer = !!user && user.role !== 'BUYER';
  const showLoader = !isMounted || isLoadingProfile || isNonBuyer;

  // We ALWAYS return the same base HTML wrapper shell so the server and client match perfectly.
  // The content inside the main area adjusts smoothly once the browser mounts.
  return (
    <div>
      <Header />
      <main className="min-h-[60vh]">
        {showLoader ? <LoadingScreen /> : children}
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default MainLayout;