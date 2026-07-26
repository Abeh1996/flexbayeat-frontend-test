// src/features/Buyer/services/cartFetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import { Cart, UpdateCartPayload } from '../types/cart.types';

const dev = process.env.NODE_ENV === 'development';

const EMPTY_CART_FIELDS = {
  cartItems: [],
  subtotal: '0',
  deliveryFee: '0',
  serviceFee: '0',
  taxes: '0',
  total: '0',
};

export const cartFetchEngine = {
  getCart: async (): Promise<Cart | null> => {
    const res = await api.get<Cart | '' | null>(API_ROUTES.buyer.cart);
    if (!res.data || typeof res.data !== 'object') {
      return null; // genuinely no cart yet — no vendorProfileId to fake
    }
    if (dev && !Array.isArray(res.data.cartItems)) {
      console.warn('[Cart] Response missing cartItems array — check shape:', res.data);
    }
    return res.data;
  },

  updateCartItem: async (payload: UpdateCartPayload): Promise<Cart> => {
    const res = await api.patch<Cart>(API_ROUTES.buyer.cart, payload);
    if (dev) console.log('[Cart] updateCartItem response:', res.data);
    return res.data;
  },
};