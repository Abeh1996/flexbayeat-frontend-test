// src/features/Rider/services/fetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import type {
  RiderProfile,
  RiderProfilePayload,
  UpdateRiderProfilePayload,
  RiderLocationPayload,
  RiderCurrentLocation,
  DeliveryTask,
  AcceptDeliveryDto,
  DeclineDeliveryDto,
  ConfirmPickupDto,
  ConfirmDeliveryDto,
  UpdateDeliveryStatusDto,
  DeliveryActionResponse,
  EarningsSummary,
  EarningsEntry,
  Payout,
  RequestPayoutPayload,
  ReportIssuePayload,
} from '../types';

export const riderFetchEngine = {
  // ── Profile ───────────────────────────────────────────────────────────────
  getProfile: async (): Promise<RiderProfile> => {
    const res = await api.get<RiderProfile>(API_ROUTES.rider.profile);
    return res.data;
  },

  createProfile: async (payload: RiderProfilePayload): Promise<RiderProfile> => {
    const res = await api.post<RiderProfile>(
      API_ROUTES.rider.profile,
      payload,
    );
    return res.data;
  },

  updateProfile: async (
    payload: UpdateRiderProfilePayload,
  ): Promise<RiderProfile> => {
    const res = await api.patch<RiderProfile>(
      API_ROUTES.rider.profile,
      payload,
    );
    return res.data;
  },

  // ── Location ───────────────────────────────────────────────────────────────
  updateLocation: async (payload: RiderLocationPayload): Promise<void> => {
    await api.patch(API_ROUTES.rider.location, payload);
  },

  getLocation: async (): Promise<RiderCurrentLocation | null> => {
    const res = await api.get(API_ROUTES.rider.getLocation);
    return res.data ?? null;
  },

  // ── Deliveries ────────────────────────────────────────────────────────────
  getAvailableDeliveries: async (): Promise<DeliveryTask[]> => {
    const res = await api.get(API_ROUTES.rider.availableDeliveries);
    return Array.isArray(res.data) ? res.data : [];
  },

  getAssignedDeliveries: async (): Promise<DeliveryTask[]> => {
    const res = await api.get(API_ROUTES.rider.assignedDeliveries);
    return Array.isArray(res.data) ? res.data : [];
  },

  acceptDelivery: async (
    payload: AcceptDeliveryDto,
  ): Promise<DeliveryActionResponse> => {
    const res = await api.post(API_ROUTES.rider.acceptDelivery, payload);
    return res.data;
  },

  declineDelivery: async (
    id: string,
    payload: DeclineDeliveryDto,
  ): Promise<DeliveryActionResponse> => {
    const res = await api.post(
      API_ROUTES.rider.declineDelivery(id),
      payload,
    );
    return res.data;
  },

  updateDeliveryStatus: async (
    id: string,
    payload: UpdateDeliveryStatusDto,
  ): Promise<DeliveryActionResponse> => {
    const res = await api.patch(
      API_ROUTES.rider.updateDeliveryStatus(id),
      payload,
    );
    return res.data;
  },

  confirmPickup: async (
    id: string,
    payload: ConfirmPickupDto,
  ): Promise<DeliveryActionResponse> => {
    const res = await api.post(
      API_ROUTES.rider.confirmPickup(id),
      payload,
    );
    return res.data;
  },

  confirmDelivery: async (
    id: string,
    payload: ConfirmDeliveryDto,
  ): Promise<DeliveryActionResponse> => {
    const res = await api.post(
      API_ROUTES.rider.confirmDelivery(id),
      payload,
    );
    return res.data;
  },

  // ── Earnings ────────────────────────────────────────────────────────────────
  getEarningsHistory: async (): Promise<EarningsEntry[]> => {
    const res = await api.get(API_ROUTES.rider.earningsHistory);
    return Array.isArray(res.data) ? res.data : [];
  },

  getEarningsSummary: async (): Promise<EarningsSummary | null> => {
    const res = await api.get(API_ROUTES.rider.earningsSummary);
    return res.data ?? null;
  },

  // ── Payouts ─────────────────────────────────────────────────────────────────
  getPayouts: async (): Promise<Payout[]> => {
    const res = await api.get(API_ROUTES.rider.payouts);
    return Array.isArray(res.data) ? res.data : [];
  },

  requestPayout: async (payload: RequestPayoutPayload): Promise<Payout> => {
    const res = await api.post(API_ROUTES.rider.requestPayout, payload);
    return res.data;
  },

  // ── Issues ──────────────────────────────────────────────────────────────────
  reportIssue: async (
    id: string,
    payload: ReportIssuePayload,
  ): Promise<{ success: boolean }> => {
    const res = await api.post(API_ROUTES.rider.reportIssue(id), payload);
    return res.data;
  },
};