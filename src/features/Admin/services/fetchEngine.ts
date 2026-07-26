// src/features/Admin/services/fetchEngine.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/endpoints";
import {
  AdminProfile,
  AdminProfilePayload,
  ApproveRiderPayload,
  ApproveVendorPayload,
  PendingRider,
  PendingVendor,
} from "../types";

export const adminFetchEngine = {
  getProfile: async (): Promise<AdminProfile> => {
    const response = await api.get(API_ROUTES.admin.profile);
    console.log("fetched admin profile", response.data)
    return response.data;
  },

  createProfile: async (payload: AdminProfilePayload): Promise<AdminProfile> => {
    const response = await api.post(API_ROUTES.admin.profile, payload);
    return response.data;
  },

  updateProfile: async (payload: AdminProfilePayload): Promise<AdminProfile> => {
    const response = await api.patch(API_ROUTES.admin.profile, payload);
    return response.data;
  },

  getPendingVendors: async (): Promise<PendingVendor[]> => {
    const response = await api.get(API_ROUTES.admin.pendingVendors);
    if (process.env.NODE_ENV === "development") {
      console.log("Pending Vendors Response:", response.data);
    }
    return response.data;
  },

  approveVendor: async (id: string, payload: ApproveVendorPayload): Promise<void> => {
    const response = await api.post(API_ROUTES.admin.approveVendor(id), payload);
    return response.data;
  },

  getPendingRiders: async (): Promise<PendingRider[]> => {
    const response = await api.get(API_ROUTES.admin.pendingRiders);
    if (process.env.NODE_ENV === "development") {
      console.log("Pending Riders Response:", response.data);
    }
    return response.data;
  },

  approveRider: async (id: string, payload: ApproveRiderPayload): Promise<void> => {
    const response = await api.post(API_ROUTES.admin.approveRider(id), payload);
    return response.data;
  },
};
