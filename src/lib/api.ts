// src/lib/api.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Cookies from 'js-cookie';
import { API_ROUTES } from './endpoints';

<<<<<<< HEAD
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://3.250.40.253:5000';
=======
//const API_BASE_URL = "http://3.250.40.253:5000";
// Production: Uses the Vercel environment variable.
// Development: Falls back to localhost if the variable is not set.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// ;
>>>>>>> e8440869635834ab3d0cab01921129ed7ef99d56

interface BackendErrorResponse {
  message?: string;
  statusCode?: number;
  error?: string;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  // headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach Bearer token ─────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get('fb_session');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error: AxiosError): Promise<never> => Promise.reject(error),
);

// ── Token refresh state ───────────────────────────────────────────────────────
// Prevents multiple simultaneous refresh calls (race condition guard)
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processRefreshQueue(error: unknown, token: string | null = null) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  refreshQueue = [];
}

async function attemptTokenRefresh(): Promise<string> {
  const refreshToken = Cookies.get('fb_refresh_token');
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post<{ access_token: string }>(
    `${API_BASE_URL}${API_ROUTES.auth.refresh}`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const newToken = response.data.access_token;
  // Store new access token
  Cookies.set('fb_session', newToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return newToken;
}

function shouldAttemptRefresh(): boolean {
  // Check stay-logged-in preference — if explicitly false, don't refresh
  const stayLoggedIn = Cookies.get('fb_stay_logged_in');
  // undefined (not set) → refresh (default behavior)
  // "true" → refresh
  // "false" → don't refresh, logout
  return stayLoggedIn !== 'false';
}

function logoutUser() {
  Cookies.remove('fb_session');
  Cookies.remove('fb_refresh_token');
  Cookies.remove('fb_user_role');
  Cookies.remove('fb_otp_verified');
  // Don't remove fb_stay_logged_in — preserve preference for next login
  if (typeof window !== 'undefined') {
    window.location.replace('/auth/buyer/login');
  }
}

// ── Response interceptor — handle 401 with token refresh ─────────────────────
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<BackendErrorResponse>): Promise<never> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Network error
    if (!error.response) {
      return Promise.reject(
        new Error('Network connectivity lost. Please check your data connection.')
      );
    }

    const { status, data } = error.response;

    // ── 401 handling with token refresh ──────────────────────────────────────
    if (status === 401 && !originalRequest._retry) {
      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest) as never);
            },
            reject,
          });
        });
      }

      // Check if we should try refreshing
      if (!shouldAttemptRefresh()) {
        logoutUser();
        return Promise.reject(new Error('Session expired. Please sign in again.'));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await attemptTokenRefresh();
        processRefreshQueue(null, newToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest) as never;
      } catch (refreshError) {
        processRefreshQueue(refreshError, null);
        // Refresh failed — logout regardless of stay-logged-in preference
        logoutUser();
        return Promise.reject(new Error('Session expired. Please sign in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    // ── 403 handling ──────────────────────────────────────────────────────────
    if (status === 403) {
      if (typeof window !== 'undefined') {
        window.location.replace('/unauthorized');
      }
    }

    const parsedErrorMessage =
      data?.message || 'A severe internal server operation error occurred.';
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Error] ${status}:`, data);
    }
    return Promise.reject(new Error(parsedErrorMessage));
  }
);