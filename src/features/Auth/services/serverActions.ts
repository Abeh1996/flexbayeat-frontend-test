// src/features/Auth/services/serverActions.ts
'use server';
import { cookies } from 'next/headers';
import { TokenResponseData } from '../types';

// commitSessionAction — stores access + refresh tokens only
export async function commitSessionAction(data: TokenResponseData): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const base = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
  cookieStore.set('fb_session', data.access_token, base);
  cookieStore.set('fb_refresh_token', data.refresh_token, { 
    ...base, 
    httpOnly: true 
  });
  return { success: true };
}

// NEW — called from client after decoding token
export async function setUserRoleAction(role: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('fb_user_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}


export async function commitOtpVerifiedAction(contact: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('fb_otp_verified', contact, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });
}


export async function checkOtpVerifiedAction(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get('fb_otp_verified')?.value;
}


// destroySessionAction — delete all three
export async function destroySessionAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete('fb_session');
  cookieStore.delete('fb_refresh_token');
  cookieStore.delete('fb_user_role');
  cookieStore.delete('fb_otp_verified');
  return { success: true };
}