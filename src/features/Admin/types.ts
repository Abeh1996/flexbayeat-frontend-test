// src/features/Admin/types.ts

// Copied from src/features/vendor/types.ts
export type VendorStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

// Copied from src/features/vendor/types.ts
export type PayoutSchedule = 'DAILY' | 'WEEKLY' | 'MONTHLY';

// Copied from src/features/vendor/types.ts
export interface VendorDocument {
  id: string;
  vendorProfileId: string;
  documentType: string;
  fileUrl: string;
  verifiedAt: string | null;
  createdAt: string;
}

// Copied from src/features/vendor/types.ts
export interface VendorWallet {
  balance: number;
  currency?: string;
  [key: string]: unknown;
}

// Copied from src/features/vendor/types.ts and renamed to PendingVendor
export interface PendingVendor {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  status: VendorStatus;
  commissionRate: string;
  payoutSchedule: PayoutSchedule;
  payoutThreshold: number | null;
  averageRating: string;
  totalReviews: number;
  totalOrders: number;
  approvedAt: string | null;
  approvedByAdminId: string | null;
  suspensionReason: string | null;
  rejectionReason: string | null;
  documentsVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  documents: VendorDocument[];
  openingHours: unknown[];
  menuCategories: unknown[];
  menuItems: unknown[];
  wallet: VendorWallet | null;
}

// Copied from src/features/Rider/types.tsx
export type VehicleType = 'BICYCLE' | 'MOTORCYCLE' | 'CAR' | 'VAN';
export type RiderStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

// Copied from src/features/Rider/types.tsx and renamed to PendingRider
export interface PendingRider {
  id: string;
  userId: string;
  nationalId: string | null;
  license: string | null;
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleModel: string;
  status: RiderStatus;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  documentsVerified?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt?: string;
}

// New types for Admin feature
export interface AdminProfile {
  id: string;
  userId: string;
  adminRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfilePayload {
  adminRole: string;
}

export interface ApproveVendorPayload {
  approved: boolean;
  rejectionReason?: string;
  commissionRate?: number;
}

export interface ApproveRiderPayload {
  approved: boolean;
  rejectionReason?: string;
}

// ── Admin delivery / rider management ─────────────────────────────────────────

export type AdminOrderStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED';

export interface AdminOrderVendor {
  id?: string;
  businessName?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  user?: { firstName?: string; lastName?: string };
}

export interface AdminOrderItem {
  id?: string;
  menuItemName?: string;
  quantity?: number;
  totalPrice?: number | string;
  unitPrice?: string;
  notes?: string;
}

export interface AdminBuyerInfo {
  id?: string;
  userId?: string;
  user?: { firstName?: string; lastName?: string; phone?: string };
}

export interface AdminDeliveryAddress {
  id?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  deliveryInstructions?: string;
}

// ── Unassigned orders (GET /rider/admin/unassigned-orders) ───────────────────
// Response shape: { orders: [...], total, page, limit, totalPages }

export interface AdminUnassignedOrder {
  id?: string;
  orderNumber?: string;
  status?: string; // "READY_FOR_PICKUP" etc.
  subtotal?: string;
  deliveryFee?: string;
  serviceFee?: string;
  taxes?: string;
  discount?: string;
  total?: string;
  estimatedPrepMin?: number;
  specialInstructions?: string | null;
  vendorProfile?: AdminOrderVendor;
  buyerProfile?: AdminBuyerInfo;
  deliveryAddress?: AdminDeliveryAddress;
  orderItems?: AdminOrderItem[];
  estimatedDistanceKm?: number;
  estimatedEarnings?: {
    base?: number;
    bonus?: number;
    commission?: number;
    netEarning?: number;
  };
  createdAt?: string;
}

// ── Assigned orders (GET /rider/admin/assigned-orders) ───────────────────────
// Response shape: { deliveries: [...], total, page, limit, totalPages }

export interface AdminAssignedRider {
  riderProfileId?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  vehicleType?: string;
  vehiclePlate?: string;
  currentLatitude?: number;
  currentLongitude?: number;
}

export interface AdminNestedOrder {
  id?: string;
  orderNumber?: string;
  status?: string;
  subtotal?: string;
  deliveryFee?: string;
  total?: string;
  vendorProfile?: AdminOrderVendor;
  buyerProfile?: AdminBuyerInfo;
  deliveryAddress?: AdminDeliveryAddress;
  orderItems?: AdminOrderItem[];
}

export interface AdminAssignedOrder {
  deliveryId?: string;
  orderId?: string;
  deliveryStatus?: string; // "ASSIGNED", "PICKED_UP", "DELIVERED"
  assignedAt?: string;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  distanceKm?: string;
  deliveryFee?: string;
  riderPayout?: string;
  assignedRider?: AdminAssignedRider;
  order?: AdminNestedOrder;
}

// ── Available riders (GET /rider/admin/available-riders) ─────────────────────

export interface AdminAvailableRider {
  id?: string;
  userId?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleModel?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  status?: string;
}

// ── DTOs ─────────────────────────────────────────────────────────────────────

export interface ManualAssignPayload {
  riderProfileId: string;
}

export interface AutoAssignPayload {
  radiusKm: number;
}

export interface UnassignedOrdersResponse {
  orders: AdminUnassignedOrder[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface AssignedOrdersResponse {
  deliveries: AdminAssignedOrder[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
