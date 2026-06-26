// src/app/(auth)/auth/vendor/login/page.tsx
import { SignInForm } from "@/features/Auth/components/SignInForm";

export default function AdminLoginPage() {
  return (
    <div className="w-full">
      {/* Page heading */}
      <div className="mb-7 space-y-1 text-center">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
          Welcome Back!
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
        Sign in to manage your admin account and oversee the platform.
        </p>
      </div>

      <SignInForm />

    </div>
  );
}
