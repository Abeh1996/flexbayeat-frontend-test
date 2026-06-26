// src/features/Auth/components/AuthLayoutShell.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutShellProps {
  children: React.ReactNode;
}

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  return (
    <div className="min-h-screen w-full flex">
      {/* ─── Left Panel: Visual Anchor (40%) ─── */}
      <div className="hidden lg:flex lg:w-[40%] relative flex-col overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/hero.png"
          alt="FlexbayEats food"
          fill
          className="object-cover"
          priority
        />

        {/* Amber-dark overlay */}
        <div className="absolute inset-0 bg-amber-950/65 z-10" />

        {/* Noise texture layer for depth */}
        <div
          className="absolute inset-0 z-20 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Content layer */}
        <div className="relative z-30 flex flex-col justify-between h-full p-10">
          {/* Top: Wordmark */}
          <Link href="/" className="inline-block">
            <span className="text-white text-2xl font-black tracking-tight uppercase">
              Flexbay<span className="text-amber-400">Eats</span>
            </span>
          </Link>

          {/* Bottom: Tagline */}
          <div className="space-y-3">
            <p className="text-white text-4xl font-black leading-[1.1] tracking-tight uppercase">
              Food,
              <br />
              found
              <br />
              fast.
            </p>
            <div className="w-10 h-[3px] bg-amber-400" />
            <p className="text-amber-200/70 text-sm font-medium tracking-wide">
              Order from local kitchens near you.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Form Area (60%) ─── */}
      <div className="flex-1 lg:w-[60%] flex flex-col bg-stone-50 min-h-screen">
        {/* Mobile-only top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-zinc-200 bg-white">
          <Link
            href="/"
            className="text-zinc-900 text-xl font-black tracking-tight uppercase"
          >
            Flexbay<span className="text-amber-500">Eats</span>
          </Link>
        </div>

        {/* Form content — vertically centered */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>

        {/* Bottom footer strip */}
        <div className="px-6 py-5 lg:px-16 xl:px-24">
          <p className="text-xs text-zinc-400 font-medium">
            © {new Date().getFullYear()} FlexbayEats. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
