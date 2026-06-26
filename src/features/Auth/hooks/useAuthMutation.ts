// src/features/Auth/hooks/useAuthMutation.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authFetchEngine } from "../services/fetchEngine";
import {
  commitSessionAction,
  destroySessionAction,
  setUserRoleAction,
} from "../services/serverActions";
import {
  SignInPayload,
  SignUpPayload,
  OtpVerifyPayload,
  OtpRequestPayload,
  ChangePasswordPayload,
  ChangeEmailPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UserProfile,
} from "../types";
import Cookies from "js-cookie";
import { getRoleFromToken } from "@/lib/token";
import { useAddressesQuery } from "@/features/Addresses/hooks/useAddressesQuery";
import { addressFetchEngine } from "@/features/Addresses/services/fetchEngine";
import { vendorFetchEngine } from "@/features/vendor/services/fetchEngine";
import { riderFetchEngine } from "@/features/Rider/services/fetchEngine";

const dev = process.env.NODE_ENV === "development";

export function useAuthMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { hasAddresses } = useAddressesQuery();

  const requestOtpMutation = useMutation({
    mutationFn: (payload: OtpRequestPayload) =>
      authFetchEngine.requestOtp(payload),
    onSuccess: (_, variables) => {
      const channel = variables.phone ? "phone" : "email";
      toast.success("Code sent", {
        description: `Check your ${channel} for the verification code.`,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      if (dev) console.error("[requestOtp]", error);
      toast.error("Failed to send code", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: OtpVerifyPayload) =>
      authFetchEngine.verifyOtp(payload),
    onError: (error: Error) => {
      if (dev) console.error("[verifyOtp]", error);
      toast.error("Invalid verification code", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const responseData = await authFetchEngine.signUpUser(payload);
      await commitSessionAction(responseData);
      return responseData;
    },
    onSuccess: async () => {
      const token = Cookies.get("fb_session");
      const role = token ? getRoleFromToken(token) : null;
      if (role) await setUserRoleAction(role);
      toast.success("Account created successfully!", { duration: 5000 });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      router.replace(
        role === "BUYER" && !hasAddresses
          ? "/buyer/setup-address"
          : role == "VENDOR"
          ? `/vendor/complete-registration`
          : role == "RIDER"
          ? `/rider/complete-registration`
          : "/",
      );
    },
    onError: (error: Error) => {
      if (dev) console.error("[signUp]", error);
      toast.error("Registration failed", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const responseData = await authFetchEngine.signInUser(payload);
      await commitSessionAction(responseData);
      return responseData;
    },
    onSuccess: async () => {
      const token = Cookies.get("fb_session");
      const role = token ? getRoleFromToken(token) : null;

      if (role) await setUserRoleAction(role);

      toast.success("Signed in successfully!", { duration: 5000 });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      // In useAuthMutation.ts — signInMutation.onSuccess — extend the branch to cover RIDER
// the same way as VENDOR. Note rider status comes from the rider profile itself,
// same pattern as vendor (NOT from the generic user profile).

if (role === 'BUYER') {
  const addressData = await queryClient.fetchQuery({
    queryKey: ['addresses'],
    queryFn: addressFetchEngine.getAll,
  });
  router.replace(addressData.length === 0 ? '/buyer/setup-address' : '/buyer/account');

} else if (role === 'VENDOR') {
  const vendorProfile = await queryClient.fetchQuery({
    queryKey: ['vendor-profile'],
    queryFn: vendorFetchEngine.getProfile,
  });
  if (vendorProfile.status === 'PENDING_APPROVAL') {
    router.replace('/vendor/dashboard'); // gate inside (dashboard) layout shows pending screen
  } else {
    router.replace('/vendor/dashboard');
  }

} else if (role === 'RIDER') {
  try {
    await queryClient.fetchQuery({
      queryKey: ['rider-profile'],
      queryFn: riderFetchEngine.getProfile,
    });
    // profile exists — let the dashboard gate decide pending/active/rejected
    router.replace('/rider/account');
  } catch {
    // 404 — no profile submitted yet
    router.replace('/rider/complete-registration');
  }
} else if (role === "ADMIN") {
    router.replace('/admin/dashboard');
} else {
  router.replace(`/dashboard/${role?.toLowerCase() ?? ''}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: since the (dashboard) layout gate already handles pending/rejected/active
// internally by re-fetching the profile itself, the signIn redirect for VENDOR
// and RIDER can actually just always go straight to /vendor/account or
// /rider/account — the layout figures out what to show. The only case that
// needs a *different* route from sign-in is "no profile exists yet" (404),
// which only applies to RIDER/VENDOR since they might have skipped registration
// entirely or it 404s before any profile was ever created.

// Also add these imports at the top of useAuthMutation.ts:
// import { vendorFetchEngine } from '@/features/Vendor/services/fetchEngine';
// import { riderFetchEngine } from '@/features/Rider/services/fetchEngine';
 
    },
    onError: (error: Error) => {
      if (dev) console.error("[signIn]", error);
      if (error.message.includes("Access")) {
        toast.error("Credentials do not match", {
          description:
            "Please check your email/phone and password and try again.",
          duration: 10000,
        });
      } else {
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
          duration: 10000,
        });
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: Partial<UserProfile>) =>
      authFetchEngine.updateCurrentProfile(payload),
    onSuccess: (data) => {
      toast.success("Profile updated", { duration: 4000 });
      queryClient.setQueryData(["user-profile"], data);
    },
    onError: (error: Error) => {
      if (dev) console.error("[updateProfile]", error);
      toast.error("Profile update failed", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authFetchEngine.modifyPassword(payload),
    onSuccess: (data) =>
      toast.success("Password updated", {
        description: data.message,
        duration: 4000,
      }),
    onError: (error: Error) => {
      if (dev) console.error("[changePassword]", error);
      toast.error("Password update failed", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const changeEmailMutation = useMutation({
    mutationFn: (payload: ChangeEmailPayload) =>
      authFetchEngine.modifyEmail(payload),
    onSuccess: (data) => {
      toast.success("Email updated", {
        description: data.message,
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: Error) => {
      if (dev) console.error("[changeEmail]", error);
      toast.error("Email update failed", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authFetchEngine.triggerForgotPassword(payload),
    // onSuccess: (data) =>
    //   toast.success("Recovery code sent", {
    //     description: data.message,
    //     duration: 5000,
    //   }),
    // Remove onSuccess from mutation entirely — handle in form callback
    onSuccess: (data) =>
      toast.success("Recovery code sent", {
        description: data.message,
        duration: 5000,
      }),
    onError: (error: Error) => {
      if (dev) console.error("[forgotPassword]", error);
      toast.error("Could not send recovery code", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authFetchEngine.executeResetPassword(payload),
    onSuccess: (data) =>
      toast.success("Password reset successfully", {
        description: data.message,
        duration: 5000,
      }),
    onError: (error: Error) => {
      if (dev) console.error("[resetPassword]", error);
      toast.error("Password reset failed", {
        description: error.message,
        duration: 6000,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authFetchEngine.logoutUser();
      await destroySessionAction();
    },
    onSuccess: () => {
      toast.success("Logged out successfully", { duration: 3000 });
      queryClient.clear();
      router.replace("/logout-success");
    },
    onError: () => {
      if (dev) console.error("[logout] failed, forcing session destroy");
      destroySessionAction().then(() => router.replace("/auth/buyer/login"));
    },
  });

  return {
    requestOtp: requestOtpMutation.mutate,
    isRequestingOtp: requestOtpMutation.isPending,

    verifyOtp: verifyOtpMutation.mutate,
    verifyOtpAsync: verifyOtpMutation.mutateAsync,
    isVerifyingOtp: verifyOtpMutation.isPending,

    signUp: signUpMutation.mutate,
    signUpAsync: signUpMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,

    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,

    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,

    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,

    changeEmail: changeEmailMutation.mutate,
    isChangingEmail: changeEmailMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutate,
    isForgotLoading: forgotPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResetLoading: resetPasswordMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
