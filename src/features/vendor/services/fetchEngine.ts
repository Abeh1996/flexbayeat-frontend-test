// src/features/Vendor/services/fetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import { VendorProfile, VendorProfilePayload } from '../types';

// Converts VendorProfilePayload to FormData for multipart requests
const toFormData = (payload: VendorProfilePayload): FormData => {
  const form = new FormData();

  if (payload.businessName) form.append('businessName', payload.businessName);
  if (payload.description) form.append('description', payload.description);
  if (payload.phone) form.append('phone', payload.phone);
  if (payload.email) form.append('email', payload.email);
  if (payload.addressLine1) form.append('addressLine1', payload.addressLine1);
  if (payload.city) form.append('city', payload.city);
  if (payload.region) form.append('region', payload.region);
  if (payload.latitude !== undefined) form.append('latitude', String(payload.latitude));
  if (payload.longitude !== undefined) form.append('longitude', String(payload.longitude));
  if (payload.logo) form.append('logo', payload.logo);
  if (payload.documents?.length) {
    payload.documents.forEach((doc) => form.append('documents', doc));
  }

  return form;
};

export const vendorFetchEngine = {
  /**
   * GET /user/vendor/profile - Fetch vendor profile + statistics
   */
  getProfile: async (): Promise<VendorProfile> => {
    const res = await api.get<VendorProfile>(API_ROUTES.vendor.profile);
    return res.data;
  },

  /**
   * POST /user/vendor/profile - Initial profile + document submission
   */
  createProfile: async (payload: VendorProfilePayload): Promise<VendorProfile> => {
    const res = await api.post<VendorProfile>(API_ROUTES.vendor.profile, toFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  /**
   * PATCH /user/vendor/profile - Update profile or resubmit documents
   */
  updateProfile: async (payload: Partial<VendorProfilePayload>): Promise<VendorProfile> => {
    const res = await api.patch<VendorProfile>(API_ROUTES.vendor.profile, toFormData(payload as VendorProfilePayload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};