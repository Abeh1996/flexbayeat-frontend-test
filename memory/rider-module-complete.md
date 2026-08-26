---
name: rider-module-complete
description: Full audit and buildout of the FlexBayEats Rider module (delivery loop, dashboard, topbar)
metadata:
  type: project
---

# Rider Module — Complete Buildout (Aug 2026)

Completed the full rider module for FlexBayEats. Here's what was done:

## Bugs Fixed
1. **BUYER→RIDER role bug** (`src/app/auth/rider/signup/page.tsx` line 131) — `UserRole.BUYER` was used instead of `UserRole.RIDER`, meaning every rider signup created a BUYER account. Rider signup was functionally broken.
2. **proxy.ts hardcoded login URL** — unauthenticated `/rider/*` redirected to `/rider/login` (doesn't exist) instead of `/auth/rider/login`.
3. **`SignUpDetailsForm` OTP guard** — hardcoded redirect to `/auth/buyer/signup` regardless of role; made dynamic based on `role` prop.
4. **`useRiderProfileQuery` inert retry logic** — `error.response?.status` checks never fired because `api.ts` normalizes all errors to plain `Error`. Switched to message-based detection.
5. **Stale AUTH_PREFIXES** in proxy.ts — removed role-specific login/signup paths (covered by `/auth/`).

## Types & Endpoints Added
- Full `DeliveryStatus` enum with all lifecycle states including intermediate shipping states (READY_FOR_PICKUP, EN_ROUTE_TO_VENDOR, ARRIVED_AT_VENDOR, EN_ROUTE_TO_BUYER, ARRIVED_AT_BUYER, CANCELLED)
- `DeliveryTask`, `VendorInfo`, `DeliveryAddress` interfaces (all optional/null-safe)
- All DTOs: `AcceptDeliveryDto`, `DeclineDeliveryDto`, `ConfirmPickupDto`, `ConfirmDeliveryDto`, `UpdateDeliveryStatusDto`
- 7 endpoints added to `API_ROUTES.rider`: available/assigned deliveries, accept/decline, status update, pickup, deliver
- Renamed `types.tsx` → `types.ts` (no JSX content)

**Note:** Earnings types (`EarningsSummary`, `PayoutRecord`, `DeliveryEarning`) and `useRiderEarningsQuery` were removed — earnings endpoints aren't available on the backend yet. The earnings page is a placeholder.

## Hooks Created
- `useRiderDeliveriesQuery` — available + assigned delivery queries with 15-30s polling
- `useRiderSocket` — socket.io listener for real-time delivery events (accepted, declined, status updated, completed, picked up)
- `useRiderLocation` — GPS watcher using `navigator.geolocation.watchPosition` with configurable interval (default 5s), tied to online/offline status
- `useRiderAccessStatus` — status gate (loading/error/no_profile/pending/active/rejected) mirroring vendor pattern
- `useRiderMutation` expanded — all delivery action mutations: accept/decline/updateStatus/confirmPickup/confirmDelivery with proper toast + invalidation

## UI Built
- **RiderSidebar** — clean, responsive sidebar with 5 nav items, mobile overlay, brand header
- **RiderTopbar** — sticky header with online/offline toggle (triggers GPS streaming), rider avatar/vehicle info, logout. No earnings/stats references.
- **PendingApprovalScreen** — clean status screen for riders awaiting approval
- **RejectedScreen** — rejection reason display with support info
- **Dashboard Overview** — stats grid (active count), quick links to tasks, active delivery summary cards. No earnings query references.
- **Deliveries page** — tab navigation (Available / Active), 30s timer on available tasks with auto-decline, 6-step status stepper for active deliveries, OTP delivery confirmation modal, accept/decline buttons. Null-safe vendor/address/id access.
- **Earnings page** — placeholder "coming soon" (backend doesn't expose earnings endpoints yet)
- **Profile page** — info display with null-safe accessors, document links with verified status
- **Settings page** — notification toggles, sign out button

All components are fully responsive, follow the established design system (amber accents, zinc grays, zero border-radius, sharp corners), and are professionally polished.

## Redirect Flows Fixed
- Sign-in → `/rider/dashboard` (with status gating inside layout)
- Registration success → `/rider/dashboard`
- Already-logged-in from auth pages → `/rider/dashboard`

**Why:** This was needed because the rider module had critical blockers and was essentially unusable before — rider signup created wrong roles, post-login routes were all 404, and none of the delivery loop existed. Later cleanup removed earnings hooks/types since backend doesn't support them yet.