// src/features/Buyer/types/vendor.types.ts

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  phone: string | null;
  email: string;
  addressLine1: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  commissionRate: string;
  payoutSchedule: string;
  payoutThreshold: string | null;
  averageRating: string;
  totalReviews: number;
  totalOrders: number;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// NOTE: variants has only ever come back as [] so far — shape unconfirmed.
// Typed loosely on purpose. Do not tighten this until we see a real one.
export interface MenuItemVariant {
  id: string;
  [key: string]: unknown;
}

export interface MenuItem {
  id: string;
  vendorProfileId: string;
  menuCategoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'OUT_OF_STOCK';
  stockCount: number | null;
  preparationTimeMin: number;
  isSpicy: boolean;
  isVegetarian: boolean;
  sortOrder: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  variants: MenuItemVariant[];
}

export interface MenuCategory {
  id: string;
  vendorProfileId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  menuItems: MenuItem[];
}