// src/features/Buyer/types/cart.types.ts

export interface CartMenuItem {
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
}

// Unconfirmed — every cart response so far has menuItemVariant: null.
// Typed loosely on purpose, same as MenuItemVariant in vendor.types.ts.
export interface CartMenuItemVariant {
  id: string;
  [key: string]: unknown;
}

export interface CartItem {
  id: string;
  cartId: string;
  menuItemId: string;
  menuItemVariantId: string | null;
  quantity: number;
  unitPrice: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  menuItem: CartMenuItem;
  menuItemVariant: CartMenuItemVariant | null;
}

export interface Cart {
  id: string;
  buyerProfileId: string;
  vendorProfileId: string;
  promoCodeId: string | null;
  subtotal: string;
  deliveryFee: string;
  serviceFee: string;
  taxes: string;
  total: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
}

export interface UpdateCartPayload {
  menuItemId: string;
  menuItemVariantId?: string;
  quantity: number;
  notes?: string;
}