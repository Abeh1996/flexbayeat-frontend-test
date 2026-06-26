// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CUSTOMER_PROTECTED = ["/checkout", "/orders", "/favorites"];

// FIX: Next.js expects the function name to match the file name "proxy" exactly
export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("fb_session")?.value;
  const userRole = request.cookies.get("fb_user_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. Guard for Customer Sensitive Actions
  if (CUSTOMER_PROTECTED.some((route) => pathname.startsWith(route))) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Strict Domain Isolation for Dashboards
  if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/dashboard/vendor") && userRole !== "VENDOR") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/rider") && userRole !== "RIDER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    // In proxy.ts
    if (pathname.startsWith("/auth/buyer/signup")) {
      const otpVerified = request.cookies.get("fb_otp_verified")?.value;
      if (!otpVerified) {
        return NextResponse.redirect(new URL("/auth/buyer/login", request.url));
      }
    }
    if (
      pathname === "/auth/buyer/signup" &&
      request.nextUrl.searchParams.get("step") === "complete"
    ) {
      const otpVerified = request.cookies.get("fb_otp_verified")?.value;
      if (!otpVerified) {
        return NextResponse.redirect(
          new URL("/auth/buyer/signup", request.url),
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/favorites/:path*",
    "/dashboard/:path*",
  ],
};
