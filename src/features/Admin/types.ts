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
