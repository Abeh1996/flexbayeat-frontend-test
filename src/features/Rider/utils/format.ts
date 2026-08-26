// src/features/Rider/utils/format.ts

/**
 * Formats a numeric amount as XAF (Central African CFA franc).
 * Examples: formatXAF(1550) → "1 550 XAF"
 *           formatXAF("450232.10") → "450 232 XAF"
 */
export function formatXAF(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  const int = Math.round(num);
  return `${int.toLocaleString('fr-FR')} XAF`;
}

/**
 * Extract earnings from a delivery task.
 * Handles both the spec format (flat `earnings`) and
 * the real API format (`estimatedEarnings.netEarning` / `estimatedEarnings.base`).
 */
export function deliveryEarnings(
  delivery: {
    earnings?: number;
    estimatedEarnings?: { netEarning?: number; base?: number };
    deliveryFee?: string;
  } | null | undefined,
): number {
  if (!delivery) return 0;
  return delivery.earnings
    ?? delivery.estimatedEarnings?.netEarning
    ?? delivery.estimatedEarnings?.base
    ?? (delivery.deliveryFee ? parseFloat(delivery.deliveryFee) : 0);
}

/**
 * Extract vendor name from a delivery task.
 * Handles both `vendor.name` (spec) and `vendorProfile.businessName` (real API).
 */
export function deliveryVendorName(
  delivery: {
    vendor?: { name?: string };
    vendorProfile?: { businessName?: string };
  } | null | undefined,
): string {
  if (!delivery) return 'Vendor';
  return delivery.vendor?.name
    ?? delivery.vendorProfile?.businessName
    ?? 'Vendor';
}

/**
 * Extract delivery destination address from a task.
 * Handles both `deliveryAddress.street` (spec) and `deliveryAddress.addressLine1` (real API).
 */
export function deliveryDestAddr(
  delivery: {
    deliveryAddress?: { street?: string; addressLine1?: string; city?: string };
  } | null | undefined,
): string {
  if (!delivery?.deliveryAddress) return '—';
  const addr = delivery.deliveryAddress;
  return addr.street
    ?? addr.addressLine1
    ?? '—';
}