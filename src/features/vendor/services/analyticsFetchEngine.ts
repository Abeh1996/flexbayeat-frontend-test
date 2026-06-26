// src/features/Vendor/services/analyticsFetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import { VendorAnalytics } from '../types/analytics.types';

export const analyticsFetchEngine = {
  getAnalytics: async (): Promise<VendorAnalytics> => {
    const res = await api.get<VendorAnalytics>(API_ROUTES.vendor.analytics);
    if (process.env.NODE_ENV === 'development') {
      console.log('[analytics response]', res.data);
    }
    return res.data;
  },
};