// src/features/Buyer/types/order.types.ts

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemVariantId: string | null;
  menuItemName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  notes: string;
  createdAt: string;
}

export interface OrderVendorSummary {
  businessName: string;
  logoUrl: string | null;
}

// Matches Addresses/types.ts Address shape closely, but this is what the
// order endpoint actually embeds — kept separate rather than reusing Address
// in case the two drift (this one lacks buyerProfileId/updatedAt).
export interface OrderDeliveryAddress {
  id: string;
  buyerProfileId: string;
  label: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  deliveryInstructions: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// UNCONFIRMED — every order so far has payment: null and review: null.
// Typed loosely until a real value comes through.
export interface OrderPayment {
  [key: string]: unknown;
}

export interface OrderReview {
  [key: string]: unknown;
}

// Only "PENDING" has been observed. Not inventing the rest of the state
// machine — treat as an open string, but these are the values seen/expected
// based on the timestamp fields the order carries (acceptedAt, readyAt, etc.)
export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | (string & {});

export interface Order {
  id: string;
  orderNumber: string;
  buyerProfileId: string;
  vendorProfileId: string;
  deliveryAddressId: string;
  riderProfileId: string | null;
  promoCodeId: string | null;
  status: OrderStatus;
  subtotal: string;
  deliveryFee: string;
  serviceFee: string;
  taxes: string;
  discount: string;
  total: string;
  estimatedPrepMin: number | null;
  estimatedDeliveryMin: number | null;
  specialInstructions: string;
  cancellationReason: string | null;
  cancelledAt: string | null;
  acceptedAt: string | null;
  readyAt: string | null;
  deliveredAt: string | null;
  autoRejectAt: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  riderProfile: unknown | null;
  vendorProfile: OrderVendorSummary;
  deliveryAddress: OrderDeliveryAddress;
  review: OrderReview | null;
  payment: OrderPayment | null;
}

export interface CheckoutPayload {
  deliveryAddressId: string;
  promoCode?: string;
  specialInstructions?: string;
}

export interface ReviewPayload {
  vendorRating: number;
  riderRating?: number;
  comment?: string;
}