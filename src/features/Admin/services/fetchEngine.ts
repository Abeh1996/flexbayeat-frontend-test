// src/features/Admin/services/fetchEngine.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/endpoints";
import {
  AdminAssignedOrder,
  AdminAssignedRider,
  AdminAvailableRider,
  AdminNestedOrder,
  AdminOrderItem,
  AdminOrderVendor,
  AdminProfile,
  AdminProfilePayload,
  AdminUnassignedOrder,
  ApproveRiderPayload,
  ApproveVendorPayload,
  AssignedOrdersResponse,
  AutoAssignPayload,
  ManualAssignPayload,
  UnassignedOrdersResponse,
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

  // ── Delivery / Rider management ────────────────────────────────────────────

  getUnassignedOrders: async (
    page = 1,
    limit = 20,
  ): Promise<UnassignedOrdersResponse> => {
    const response = await api.get(API_ROUTES.admin.unassignedOrders, {
      params: { page, limit },
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('Unassigned Orders Response:', response.data);
    }
    return response.data;
  },

  getAssignedOrders: async (
    page = 1,
    limit = 20,
    status?: string,
    riderId?: string,
  ): Promise<AssignedOrdersResponse> => {
    const params: Record<string, unknown> = { page, limit };
    if (status) params.status = status;
    if (riderId) params.riderId = riderId;
    const response = await api.get(API_ROUTES.admin.assignedOrders, { params });
    if (process.env.NODE_ENV === 'development') {
      console.log('Assigned Orders Response:', response.data);
    }
    return response.data;
  },

  manualAssign: async (
    id: string,
    payload: ManualAssignPayload,
  ): Promise<void> => {
    const response = await api.post(API_ROUTES.admin.manualAssign(id), payload);
    return response.data;
  },

  autoAssign: async (
    id: string,
    payload: AutoAssignPayload,
  ): Promise<void> => {
    const response = await api.post(API_ROUTES.admin.autoAssign(id), payload);
    return response.data;
  },

  getAvailableRiders: async (
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<AdminAvailableRider[]> => {
    const response = await api.get(API_ROUTES.admin.availableRiders, {
      params: { latitude, longitude, radiusKm },
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('Available Riders Response:', response.data);
    }
    return response.data;
  },
};
