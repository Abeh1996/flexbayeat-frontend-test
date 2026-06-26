// src/features/Vendor/services/ordersFetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import {
  Order,
  AcceptOrderPayload,
  RejectOrderPayload,
  UpdateOrderStatusPayload,
} from '../types/orders.types';

export const ordersFetchEngine = {
  getActiveOrders: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>(API_ROUTES.vendor.activeOrders);
    // Log shape until we confirm real order structure
    if (process.env.NODE_ENV === 'development') {
      console.log('[activeOrders response]', res.data);
    }
    return res.data;
  },

  getOrderHistory: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>(API_ROUTES.vendor.orderHistory);
    if (process.env.NODE_ENV === 'development') {
      console.log('[orderHistory response]', res.data);
    }
    return res.data;
  },

  acceptOrder: async (id: string, payload: AcceptOrderPayload): Promise<Order> => {
    const res = await api.post<Order>(API_ROUTES.vendor.acceptOrder(id), payload);
    return res.data;
  },

  rejectOrder: async (id: string, payload: RejectOrderPayload): Promise<Order> => {
    const res = await api.post<Order>(API_ROUTES.vendor.rejectOrder(id), payload);
    return res.data;
  },

  updateOrderStatus: async (id: string, payload: UpdateOrderStatusPayload): Promise<Order> => {
    const res = await api.patch<Order>(API_ROUTES.vendor.updateOrderStatus(id), payload);
    return res.data;
  },
};