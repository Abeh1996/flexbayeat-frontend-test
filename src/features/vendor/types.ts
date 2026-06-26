// src/features/Vendor/types.ts

export type VendorStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type PayoutSchedule = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface VendorDocument {
  id: string;
  vendorProfileId: string;
  documentType: string;
  fileUrl: string;
  verifiedAt: string | null;
  createdAt: string;
}

export interface VendorWallet {
  balance: number;
  currency?: string;
  [key: string]: unknown;
}

export interface VendorProfile {
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

export interface VendorProfilePayload {
  businessName: string;
  description?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  logo?: File;
  documents?: File[];
}

export type VendorAccessState = 'loading' | 'pending' | 'rejected' | 'active' | 'error';