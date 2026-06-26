// src/features/Auth/components/SignInForm.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, Loader2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useAuthMutation } from "../hooks/useAuthMutation";
import type { UseFormRegisterReturn } from "react-hook-form";

type Method = "phone" | "email";

const schema = {
  phone: z.object({
    phone: z.string().min(8, "Enter a valid phone number"),
    password: z.string().min(1, "Password is required"),
  }),
  email: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
};

type PhoneValues = z.infer<typeof schema.phone>;
type EmailValues = z.infer<typeof schema.email>;

const inputClass = (error?: boolean) => `
  w-full px-4 py-3 bg-white border text-sm rounded-md text-zinc-900 placeholder:text-zinc-400
  outline-none transition-colors duration-150
  ${error ? "border-red-400 focus:border-red-400" : "border-zinc-300 focus:border-amber-500"}
`;

const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-zinc-500";

function PasswordInput({
  register,
  error,
}: {
  register: UseFormRegisterReturn;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>Password</label>
      <div className="relative">
        <input
          {...register}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          className={inputClass(!!error) + " pr-11"}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

const SubmitBtn = ({ loading }: { loading: boolean }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full flex items-center rounded-md justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors duration-150"
  >
    {loading ? (
      <>
        <Loader2 size={15} className="animate-spin" /> Signing in...
      </>
    ) : (
      <>
        Sign In <ArrowRight size={15} />
      </>
    )}
  </button>
);

export function SignInForm() {
  const [method, setMethod] = useState<Method>("email");
  const { signIn, isSigningIn } = useAuthMutation();

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(schema.phone),
  });
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(schema.email),
  });

  return (
    <div className="space-y-5 mt-6">
      {/* Method toggle */}
      <div className="flex border border-zinc-200">
        {(["email", "phone"] as Method[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${method === m ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 hover:text-zinc-800"}`}
          >
            {m === "phone" ? <Phone size={13} /> : <Mail size={13} />}
            {m}
          </button>
        ))}
      </div>

      {/* Phone form */}
      {method === "phone" && (
        <form
          onSubmit={phoneForm.handleSubmit((v) =>
            signIn({ phone: v.phone, password: v.password }),
          )}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className={labelClass}>Phone Number</label>
            <input
              {...phoneForm.register("phone")}
              type="tel"
              placeholder="+237 6XX XXX XXX"
              autoComplete="tel"
              className={inputClass(!!phoneForm.formState.errors.phone)}
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-xs text-red-500 font-medium">
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>
          <PasswordInput
            register={phoneForm.register("password")}
            error={phoneForm.formState.errors.password?.message}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/buyer/forgot-password"
              className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <SubmitBtn loading={isSigningIn} />
        </form>
      )}

      {/* Email form */}
      {method === "email" && (
        <form
          onSubmit={emailForm.handleSubmit((v) =>
            signIn({ email: v.email, password: v.password }),
          )}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className={labelClass}>Email Address</label>
            <input
              {...emailForm.register("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass(!!emailForm.formState.errors.email)}
            />
            {emailForm.formState.errors.email && (
              <p className="text-xs text-red-500 font-medium">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <PasswordInput
            register={emailForm.register("password")}
            error={emailForm.formState.errors.password?.message}
          />
          <div className="flex justify-end">
            <Link
              href="/auth/buyer/forgot-password"
              className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <SubmitBtn loading={isSigningIn} />
        </form>
      )}
    </div>
  );
}
