// src/features/Auth/services/fetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import {
  OtpRequestPayload,
  OtpVerifyPayload,
  SignInPayload,
  SignUpPayload,
  AuthResponseData,
  UserProfile,
  ChangePasswordPayload,
  ChangeEmailPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  TokenResponseData
} from '../types';

export const authFetchEngine = {
  /**
   * GET / - Base Application Status Checker
   */
  checkSystemHealth: async (): Promise<{ status: string }> => {
    const response = await api.get<{ status: string }>(API_ROUTES.health);
    return response.data;
  },

  /**
   * POST /auth/otp/request - Emits code string via SMS gateway or SMTP
   */
  requestOtp: async (payload: OtpRequestPayload): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(API_ROUTES.auth.otpRequest, payload);
    return response.data;
  },

  /**
   * POST /auth/otp/verify - Evaluates tracking tokens
   */
  verifyOtp: async (payload: OtpVerifyPayload): Promise<AuthResponseData> => {
    const response = await api.post<AuthResponseData>(API_ROUTES.auth.otpVerify, payload);
    return response.data;
  },

  /**
   * POST /auth/signup - Configures brand new profile metrics
   */
  signUpUser: async (payload: SignUpPayload): Promise<TokenResponseData> => {
    const response = await api.post<TokenResponseData>(API_ROUTES.auth.signup, payload);
    return response.data;
  },

  /**
   * POST /auth/signin - Standard credential portal access path
   */
  signInUser: async (payload: SignInPayload): Promise<TokenResponseData> => {
    const response = await api.post<TokenResponseData>(API_ROUTES.auth.signin, payload);
    return response.data;
  },

  /**
   * GET /auth/profile - Extracts matching user profile data
   */
  fetchCurrentProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>(API_ROUTES.auth.profile);
    return response.data;
  },

  /**
   * PATCH /auth/profile - General profile properties editor
   */
  updateCurrentProfile: async (payload: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch<UserProfile>(API_ROUTES.auth.profile, payload);
    return response.data;
  },

  /**
   * POST /auth/logout - Invalidates active browser verification tokens
   */
  logoutUser: async (): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>(API_ROUTES.auth.logout);
    return response.data;
  },

  /**
   * PATCH /auth/change-password - Core account credential security editor
   */
  modifyPassword: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>(API_ROUTES.auth.changePassword, payload);
    return response.data;
  },

  /**
   * PATCH /auth/change-email - Communication pipeline editor
   */
  modifyEmail: async (payload: ChangeEmailPayload): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>(API_ROUTES.auth.changeEmail, payload);
    return response.data;
  },

  /**
   * POST /auth/forgot-password - Dispatches recovery keys
   */
  triggerForgotPassword: async (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(API_ROUTES.auth.forgotPassword, payload);
    return response.data;
  },

  /**
   * POST /auth/reset-password - Accepts credentials modification following token match
   */
  executeResetPassword: async (payload: ResetPasswordPayload): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(API_ROUTES.auth.resetPassword, payload);
    return response.data;
  }
};