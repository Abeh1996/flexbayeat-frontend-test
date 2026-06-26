// src/features/Vendor/types/orders.types.ts

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'RIDER_ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number | string;
  imageUrl?: string | null;
}

export interface OrderCustomer {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  status: OrderStatus;
  customer?: OrderCustomer;
  // field name unconfirmed — console.log to verify when real order comes in
  items?: OrderItem[];
  orderItems?: OrderItem[];
  totalAmount?: number | string;
  total?: number | string;
  estimatedPrepMin?: number | null;
  note?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// ── Payloads ───────────────────────────────────────────────────────────────

export interface AcceptOrderPayload {
  estimatedPrepMin?: number;
}

export interface RejectOrderPayload {
  reason: string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  note?: string;
}