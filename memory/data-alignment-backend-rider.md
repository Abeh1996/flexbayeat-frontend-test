---
name: data-alignment-backend-rider
description: Known data shape mismatches between frontend types and backend API responses
metadata:
  type: reference
---

**Profile** (`GET /user/rider/profile → 200`)
- `vendorProfile.addressLine1` is the real key (not `vendor.address`)
- `vendorProfile.businessName` is the real key (not `vendor.name`, `vendor.businessName`)
- `deliveryAddress.addressLine1` is the real key (not `deliveryAddress.street`)
- `estimatedEarnings.netEarning` / `estimatedEarnings.base` are the real keys (not flat `earnings`)
- `delivery` nested object has `deliveryFee`, `riderPayout`, `distanceKm` — separate from the order-level `deliveryFee`
- Types in `types.ts` handles both spec and real keys via fallback chains

**Backend known issues:**
- `PATCH /user/rider/profile` rejects `isAvailable` — no dedicated online/offline endpoint exists yet. Online toggle is currently broken.
- `POST /rider/deliveries/{id}/decline` requires `deliveryId` in the body (UUID format) — our types included it as optional, fix is to always pass it
- Profile response has `deliveries: []` and `earnings: []` arrays in addition to the actual delivery/earnings data at the top level

**Log responses** in dev console to catch new mismatches before they cause silent failures.

**Why:** Backend is AI-generated too. Data shapes may diverge from spec. We catch them via the dev response logger.

**How to apply:** When adding a new screen, first check the dev console logs for data shapes. Update types.ts fallbacks accordingly.