// src/lib/api.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "js-cookie";
import { API_ROUTES } from "./endpoints";

//const API_BASE_URL = "http://3.250.40.253:5000";
// Production: Uses the Vercel environment variable.
// Development: Falls back to localhost if the variable is not set.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// ;

// Type definition for our backend's custom error response body
interface BackendErrorResponse {
  message?: string;
  statusCode?: number;
  error?: string;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Outgoing Request Interceptor with explicit type safety
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get("fb_session");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  },
);

// Incoming Response Interceptor with zero "any" types
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<BackendErrorResponse>): Promise<never> => {
    // 1. Defend against network drops or connection drops
    if (!error.response) {
      return Promise.reject(
        new Error(
          "Network connectivity lost. Please check your data connection.",
        ),
      );
    }

    const { status, data } = error.response;

    // 2. Clear sessions globally on 401 Unauthorized
    if (status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // Redirect safely only if accessing protected operational areas
        if (
          currentPath.startsWith("/dashboard") ||
          currentPath.startsWith("/checkout")
        ) {
          Cookies.remove("fb_session");
          Cookies.remove("fb_user_role");

          // Using our imported API_ROUTES configuration map cleanly
          window.location.replace(
            `${API_ROUTES.auth.signin}?next=${encodeURIComponent(currentPath)}`,
          );
        }
      }
    }

    // 3. Handle Permission boundary updates on 403 Forbidden
    if (status === 403) {
      if (typeof window !== "undefined") {
        window.location.replace("/unauthorized");
      }
    }

    // 4. Extract explicit messages from your typed backend error schema
    const parsedErrorMessage =
      data?.message || "A severe internal server operation error occurred.";
    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${status}:`, data);
    }
    return Promise.reject(new Error(parsedErrorMessage));
  },
);
