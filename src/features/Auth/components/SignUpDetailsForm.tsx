// src/features/Auth/components/SignUpDetailsForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthMutation } from "../hooks/useAuthMutation";
import { UserRole } from "../types";
import { checkOtpVerifiedAction } from "../services/serverActions";

const schema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

interface SignUpDetailsFormProps {
  role: UserRole;
  contact: string;
  method: string;
  redirectTo: string;
}

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 bg-white border text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors duration-150 ${err ? "border-red-400 focus:border-red-400" : "border-zinc-300 focus:border-amber-500"}`;
const labelCls =
  "block text-xs font-semibold uppercase tracking-widest text-zinc-500";

export function SignUpDetailsForm({
  role,
  contact,
  method,
  redirectTo,
}: SignUpDetailsFormProps) {
  const [show, setShow] = useState({ password: false, confirm: false });
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const { signUpAsync, isSigningUp } = useAuthMutation();

  useEffect(() => {
    checkOtpVerifiedAction().then((ok) => {
      if (!ok) router.replace("/auth/buyer/signup");
      else setVerified(true);
    });
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await signUpAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        role,
        ...(method === "phone" ? { phone: contact } : { email: contact }),
      });
      router.replace(redirectTo);
    } catch {
      // error already toasted in mutation onError
    }
  };

  if (!verified) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* First + Last name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className={labelCls}>First Name</label>
          <input
            {...register("firstName")}
            type="text"
            placeholder="Aubin"
            className={inputCls(!!errors.firstName)}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 font-medium">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Last Name</label>
          <input
            {...register("lastName")}
            type="text"
            placeholder="Siaha"
            className={inputCls(!!errors.lastName)}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 font-medium">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className={labelCls}>Password</label>
        <div className="relative">
          <input
            {...register("password")}
            type={show.password ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            className={inputCls(!!errors.password) + " pr-11"}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {show.password ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label className={labelCls}>Confirm Password</label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={show.confirm ? "text" : "password"}
            placeholder="Re-enter password"
            autoComplete="new-password"
            className={inputCls(!!errors.confirmPassword) + " pr-11"}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSigningUp}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors duration-150"
      >
        {isSigningUp ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Creating account...
          </>
        ) : (
          <>
            Create Account <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}
