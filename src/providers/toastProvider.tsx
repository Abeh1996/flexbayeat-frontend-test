"use client";
import React from "react";
import { Toaster } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        theme="light"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "2px" },
          classNames: {
            error: "!duration-[60000ms]",
          },
        }}
      />
    </>
  );
}
