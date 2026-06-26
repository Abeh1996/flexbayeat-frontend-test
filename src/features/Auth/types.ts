// src/features/Auth/types.ts

export enum UserRole {
  BUYER = 'BUYER',
  VENDOR = 'VENDOR',
  RIDER = 'RIDER',
  ADMIN = 'ADMIN',
  SUPPORT_STAFF = 'SUPPORT_STAFF',
  FINANCE = 'FINANCE',
  OPERATIONS = 'OPERATIONS'
}

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'REJECTED';
  // isActive: boolean;
  createdAt: string;
}

export interface OtpRequestPayload {
  phone?: string;
  email?: string;
}

export interface OtpVerifyPayload {
  phone?: string;
  email?: string;
  code: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  role: UserRole;
  password: string;
}

export interface SignInPayload {
  phone?: string;
  email?: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}

export interface ChangeEmailPayload {
  newEmail: string;
}

export interface ForgotPasswordPayload {
  email?: string;
  phone?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}


export interface AuthResponseData {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}

export interface TokenResponseData {
  access_token: string;
  refresh_token: string;
}