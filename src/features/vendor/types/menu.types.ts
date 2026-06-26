// src/features/Vendor/types/menu.types.ts

export type MenuItemStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'HIDDEN';

export interface MenuCategory {
  id: string;
  vendorProfileId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  menuItems?: MenuItem[]; // backend nests items here, not items[]
}

export interface MenuItem {
  id: string;
  vendorProfileId: string;
  menuCategoryId: string;
  name: string;
  description?: string | null;
  price: number | string; // backend returns string e.g. "1000"
  imageUrl?: string | null;
  stockCount?: number | null;
  preparationTimeMin?: number | null;
  isSpicy: boolean;
  isVegetarian: boolean;
  sortOrder?: number;
  status: MenuItemStatus;
  totalOrders?: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null; // soft delete — filter these out client-side
}

// ── Payloads ───────────────────────────────────────────────────────────────

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateMenuItemPayload {
  menuCategoryId: string;
  name: string;
  description?: string;
  price: number;
  stockCount?: number;
  preparationTimeMin?: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  sortOrder?: number;
  image?: File; 
}

export interface UpdateMenuItemPayload {
  menuCategoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  stockCount?: number;
  preparationTimeMin?: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  sortOrder?: number;
  status?: MenuItemStatus;
  image?: File; // not active yet — Aubin adding to DTO
}