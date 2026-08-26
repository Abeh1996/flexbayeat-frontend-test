// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Role → home dashboard mapping ────────────────────────────────────────────
const ROLE_DASHBOARDS: Record<string, string> = {
  VENDOR: '/vendor/dashboard',
  RIDER:  '/rider/dashboard',
  ADMIN:  '/admin/dashboard',
  BUYER:  '/buyer/account',
};

// ── Route ownership ───────────────────────────────────────────────────────────
// Which role exclusively owns each path prefix
const ROLE_ROUTES: { prefix: string; role: string }[] = [
  { prefix: '/vendor', role: 'VENDOR' },
  { prefix: '/rider',  role: 'RIDER'  },
  { prefix: '/admin',  role: 'ADMIN'  },
];

// Auth pages — always public, never redirect even if logged in
const AUTH_PREFIXES = [
  '/auth/',
];

// (main) browsing pages — buyers can access freely, others get redirected to their dashboard
const MAIN_PREFIXES = ['/', '/menu', '/restaurant', '/search', '/cart', '/checkout'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('fb_session')?.value;
  const userRole     = request.cookies.get('fb_user_role')?.value;

  // ── 1. Always allow auth pages through ───────────────────────────────────
  if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) {
    // If already logged in and hitting login/signup, redirect to their dashboard
    if (sessionToken && userRole && ROLE_DASHBOARDS[userRole]) {
      const isLoginOrSignup =
        pathname.includes('/login') || pathname.includes('/signup');
      if (isLoginOrSignup) {
        return NextResponse.redirect(new URL(ROLE_DASHBOARDS[userRole], request.url));
      }
    }
    return NextResponse.next();
  }

  // ── 2. OTP signup guard ───────────────────────────────────────────────────
  if (
    pathname.startsWith('/buyer/signup') &&
    request.nextUrl.searchParams.get('step') === 'complete'
  ) {
    const otpVerified = request.cookies.get('fb_otp_verified')?.value;
    if (!otpVerified) {
      return NextResponse.redirect(new URL('/buyer/signup', request.url));
    }
  }

  // ── 3. Role-owned routes (/vendor/*, /rider/*, /admin/*) ──────────────────
  const ownedRoute = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (ownedRoute) {
    // Not logged in → send to that role's login (/auth/<role>/login)
    if (!sessionToken) {
      const loginUrl = new URL(`/auth/${ownedRoute.role.toLowerCase()}/login`, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Wrong role → redirect to their actual dashboard
    if (userRole !== ownedRoute.role) {
      const destination = userRole && ROLE_DASHBOARDS[userRole]
        ? ROLE_DASHBOARDS[userRole]
        : '/';
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // ── 4. /buyer/account/* — authenticated BUYER only ───────────────────────
  if (pathname.startsWith('/buyer/account') || pathname.startsWith('/buyer/setup-address')) {
    if (!sessionToken) {
      const loginUrl = new URL('/buyer/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Logged in but not a buyer → send to their dashboard
    if (userRole && userRole !== 'BUYER') {
      return NextResponse.redirect(new URL(ROLE_DASHBOARDS[userRole], request.url));
    }
    return NextResponse.next();
  }

  // ── 5. (main) pages — vendors/riders/admins should not browse here ────────
  // They should stay in their dashboard. Buyers + unauthenticated can browse freely.
  if (sessionToken && userRole && userRole !== 'BUYER') {
    // Only redirect if they're on a (main) browsing page, not a shared route
    const isMainPage =
      pathname === '/' ||
      MAIN_PREFIXES.slice(1).some((p) => pathname.startsWith(p));
    if (isMainPage) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARDS[userRole], request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};