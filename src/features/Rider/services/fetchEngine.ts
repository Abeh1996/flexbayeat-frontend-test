// src/features/Rider/services/fetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import { RiderProfile, RiderProfilePayload, RiderLocationPayload } from '../types';

// Converts RiderProfilePayload to FormData for multipart requests
const toFormData = (payload: Partial<RiderProfilePayload>): FormData => {
  const form = new FormData();

  if (payload.vehicleType) form.append('vehicleType', payload.vehicleType);
  if (payload.vehiclePlate) form.append('vehiclePlate', payload.vehiclePlate);
  if (payload.vehicleModel) form.append('vehicleModel', payload.vehicleModel);
  if (payload.nationalId) form.append('nationalId', payload.nationalId);
  if (payload.license) form.append('license', payload.license);

  return form;
};

export const riderFetchEngine = {
  /**
   * GET /user/rider/profile - Fetch rider profile
   */
  getProfile: async (): Promise<RiderProfile> => {
    const res = await api.get<RiderProfile>(API_ROUTES.rider.profile);
    return res.data;
  },

  /**
   * POST /user/rider/profile - Initial profile + document submission
   */
  createProfile: async (payload: RiderProfilePayload): Promise<RiderProfile> => {
    const res = await api.post<RiderProfile>(API_ROUTES.rider.profile, toFormData(payload));
    return res.data;
  },

  /**
   * PATCH /user/rider/profile - Update profile or resubmit documents
   */
  updateProfile: async (payload: Partial<RiderProfilePayload>): Promise<RiderProfile> => {
    const res = await api.patch<RiderProfile>(API_ROUTES.rider.profile, toFormData(payload));
    return res.data;
  },

  /**
   * PATCH /user/rider/location - Update current GPS location (JSON, not multipart)
   */
  updateLocation: async (payload: RiderLocationPayload): Promise<void> => {
    await api.patch(API_ROUTES.rider.location, payload);
  },
};