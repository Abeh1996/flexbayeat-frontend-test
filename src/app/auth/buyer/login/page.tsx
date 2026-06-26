// src/app/(auth)/auth/buyer/login/page.tsx
import { SignInForm } from "@/features/Auth/components/SignInForm";

export default function BuyerLoginPage() {
  return (
    <div className="w-full">
      {/* Page heading */}
      <div className="mb-7 space-y-1 text-center">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
          Welcome Back!
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Sign in to your FlexbayEats account.
        </p>
      </div>

      <SignInForm />

      <div className="mt-7 text-center">
        {/* Back to signup */}
        <p className="mt-7 text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/buyer/signup"
            className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
