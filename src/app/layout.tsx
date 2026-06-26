import type { Metadata } from "next";
import {
  Outfit,
} from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";

const activeFont = Outfit({ subsets: ["latin"], variable: "--font-active" });


export const metadata: Metadata = {
  title: "FlexBayEats Web App",
  description: "A web application for FlexBayEats, a food delivery service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${activeFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProviders >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
