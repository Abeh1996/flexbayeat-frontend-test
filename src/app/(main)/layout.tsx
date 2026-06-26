'use client';

import React, { ReactNode, useEffect } from 'react';
import { useProfileQuery } from '@/features/Auth/hooks/useProfileQuery';
import { useRouter } from 'next/navigation';
import LoadingScreen from './loading';

const MainLayout = ({children}: {children: ReactNode}) => {
    const {user, isLoadingProfile} = useProfileQuery();
    const router = useRouter();

    useEffect(() => {
    if (!isLoadingProfile && user) {
      router.replace(`/vendor/dashboard`);
    }
    if(user && user?.role === "RIDER") {
      router.push("/rider/dashboard")
    }
  }, [user, isLoadingProfile, router]);


    if(isLoadingProfile){
      <LoadingScreen />
    }

    if(user && (user.role != "BUYER")){
        <LoadingScreen />
    }

  return (
    <div>
      {children}
    </div>
  )
}

export default MainLayout
