// src/app/(auth)/auth/buyer/signup/page.tsx
"use client";
import React, { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { OtpRequestForm } from "@/features/Auth/components/OtpRequestForm";
import { OtpVerifyForm } from "@/features/Auth/components/OtpVerifyForm";
import { SignUpDetailsForm } from "@/features/Auth/components/SignUpDetailsForm";
import { UserRole } from "@/features/Auth/types";
import { checkOtpVerifiedAction } from "@/features/Auth/services/serverActions";
import Link from "next/link";

type Step = "request" | "verify" | "complete";
type Method = "phone" | "email";

const HEADINGS: Record<Step, { title: string; subtitle: string }> = {
  request: {
    title: "Create account",
    subtitle: "Enter your phone or email to receive a verification code.",
  },
  verify: {
    title: "Verify identity",
    subtitle: "Enter the 6-digit code we sent you.",
  },
  complete: {
    title: "Complete profile",
    subtitle: "Almost there. Fill in your details to finish.",
  },
};

// Slide direction: going forward = slide left, going back = slide right
const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const STEP_ORDER: Step[] = ["request", "verify", "complete"];

export default function RiderSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const step = (searchParams.get("step") as Step) || "request";
  const method = (searchParams.get("method") as Method) || "email";
  const contact = searchParams.get("contact") || "";

  // Direction for animation
  const currentIndex = STEP_ORDER.indexOf(step);
  const [prevIndex, setPrevIndex] = React.useState(currentIndex);
  const direction = currentIndex - prevIndex;

  useEffect(() => {
    setPrevIndex(currentIndex);
  }, [currentIndex]);

  // Guard complete step — check cookie server-side
  useEffect(() => {
    if (step === "complete") {
      checkOtpVerifiedAction().then((verified) => {
        if (!verified) {
          router.replace("/auth/rider/signup");
        }
      });
    }
  }, [step, router]);

  const goTo = useCallback(
    (nextStep: Step, params?: Record<string, string>) => {
      const query = new URLSearchParams({ step: nextStep, ...params });
      router.push(`/auth/rider/signup?${query.toString()}`);
    },
    [router],
  );

  const heading = HEADINGS[step];

  return (
    <div className="w-full">
      {/* Heading — animates with step */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`heading-${step}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="mb-7 space-y-1"
        >
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
            {heading.title}
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            {heading.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Form — slides between steps */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`form-${step}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {step === "request" && (
            <OtpRequestForm
              onSuccess={(contact, method) =>
                goTo("verify", { contact, method })
              }
            />
          )}

          {step === "verify" && (
            <OtpVerifyForm
              contact={contact}
              method={method}
              onSuccess={() => goTo("complete", { contact, method })}
              onBack={() => goTo("request")}
            />
          )}

          {step === "complete" && (
            <SignUpDetailsForm
              role={UserRole.BUYER}
              contact={contact}
              method={method}
              redirectTo="/rider/complete-registration"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom contextual link */}
      <AnimatePresence mode="wait">
        {step === "request" && (
          <motion.p
            key="login-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-7 text-sm text-zinc-500"
          >
            Already have an account?{" "}
            <Link
              href="/auth/rider/login"
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
