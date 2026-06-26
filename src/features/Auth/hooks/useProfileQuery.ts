// src/features/Auth/hooks/useProfileQuery.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import { AxiosError } from 'axios';
import { authFetchEngine } from '../services/fetchEngine';
import { UserProfile } from '../types';

export function useProfileQuery() {
  const pathname = usePathname();
  
  const hasToken = !!Cookies.get('fb_session');

  const isNotOnboarding = pathname !== '/signup';

  const profileQuery = useQuery<UserProfile, AxiosError>({
    queryKey: ['user-profile'],
    queryFn: authFetchEngine.fetchCurrentProfile,
    
    enabled: hasToken && isNotOnboarding,
    
    staleTime: 1000 * 60 * 10, 
    gcTime: 1000 * 60 * 60,    
    retry: (failureCount: number, error: AxiosError): boolean => {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
  });

  return {
    user: profileQuery.data ?? null,
    isLoadingProfile: profileQuery.isLoading,
    isErrorProfile: profileQuery.isError,
    profileError: profileQuery.error,
    refetchProfile: profileQuery.refetch
  };
}