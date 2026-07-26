// src/features/Buyer/services/orderFetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import { Order, CheckoutPayload, ReviewPayload } from '../types/order.types';
import { Cart } from '../types/cart.types';

const dev = process.env.NODE_ENV === 'development';

export const orderFetchEngine = {
  getOrders: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>(API_ROUTES.buyer.orders);
    return Array.isArray(res.data) ? res.data : [];
  },

  getOrder: async (orderId: string): Promise<Order | undefined> => {
    // No single-order GET endpoint exists yet — reusing the list and
    // finding by id. Fine at low order volume; ask backend for
    // GET /buyer/order/:id directly if this list ever gets large.
    const orders = await orderFetchEngine.getOrders();
    return orders.find((o) => o.id === orderId);
  },

  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const res = await api.post<Order>(API_ROUTES.buyer.checkout, payload);
    if (dev) console.log('[Checkout] response:', res.data);
    return res.data;
  },

  reorder: async (orderId: string): Promise<Cart> => {
    const res = await api.post<Cart>(API_ROUTES.buyer.reorder(orderId));
    return res.data;
  },

  review: async (orderId: string, payload: ReviewPayload): Promise<void> => {
    await api.post(API_ROUTES.buyer.review(orderId), payload);
  },
};