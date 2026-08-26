// src/features/Rider/types.ts

export type VehicleType = 'BICYCLE' | 'MOTORCYCLE' | 'CAR' | 'VAN';

export type RiderStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'ACTIVE';

// ── Profile ──────────────────────────────────────────────────────────────────
export interface RiderProfile {
  id?: string;
  userId?: string;
  status?: RiderStatus;
  nationalIdUrl?: string | null;
  licenseUrl?: string | null;
  vehicleType?: VehicleType;
  vehiclePlate?: string;
  vehicleNumber?: string;       // from spec DTO
  vehicleModel?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  isAvailable?: boolean;
  backgroundCheckDone?: boolean;
  isLocationEnabled?: boolean;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  lastLocationAt?: string;
  averageRating?: string;
  totalReviews?: number;
  totalDeliveries?: number;
  completionRate?: string;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  wallet?: RiderWallet;
}

export interface RiderWallet {
  id?: string;
  riderProfileId?: string;
  balance?: string;
  currency?: string;
  totalEarned?: string;
  totalPaidOut?: string;
}

export interface RiderProfilePayload {
  vehicleType?: VehicleType;
  vehicleNumber?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  licenseNumber?: string;
  phoneNumber?: string;
  nationalId?: File;
  license?: File;
}

export interface UpdateRiderProfilePayload {
  vehicleType?: VehicleType;
  phoneNumber?: string;
  isAvailable?: boolean;
}

// ── Location ─────────────────────────────────────────────────────────────────
export interface RiderLocationPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  isBackground?: boolean;
}

export interface RiderCurrentLocation {
  id?: string;
  riderProfileId?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp?: string;
  updatedAt?: string;
}

// ── Delivery ─────────────────────────────────────────────────────────────────
export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'READY_FOR_PICKUP'
  | 'EN_ROUTE_TO_VENDOR'
  | 'ARRIVED_AT_VENDOR'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'EN_ROUTE_TO_BUYER'
  | 'ARRIVED_AT_BUYER'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED'
  | 'CANCELLED';

export interface VendorInfo {
  id?: string;
  businessName?: string;
  name?: string;               // spec fallback
  addressLine1?: string;
  address?: string;            // spec fallback
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string | null;
  logoUrl?: string;
}

export interface DeliveryAddressInfo {
  id?: string;
  addressLine1?: string;
  street?: string;             // spec fallback
  addressLine2?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  deliveryInstructions?: string;
}

export interface BuyerProfileInfo {
  id?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
  };
}

export interface OrderItemInfo {
  id?: string;
  menuItemName?: string;
  variantName?: string | null;
  quantity?: number;
  unitPrice?: string;
  totalPrice?: string;
  notes?: string;
}

export interface EstimatedEarnings {
  base?: number;
  bonus?: number;
  commission?: number;
  netEarning?: number;
}

export interface DeliveryTask {
  id?: string;
  orderId?: string;
  orderNumber?: string;
  status?: DeliveryStatus;
  subtotal?: string;
  deliveryFee?: string;
  serviceFee?: string;
  taxes?: string;
  discount?: string;
  total?: string;
  specialInstructions?: string | null;
  estimatedPrepMin?: number | null;
  estimatedDeliveryMin?: number | null;
  createdAt?: string;
  updatedAt?: string;
  vendor?: VendorInfo;
  vendorProfile?: VendorInfo;   // real API key
  deliveryAddress?: DeliveryAddressInfo;
  buyerProfile?: BuyerProfileInfo;
  orderItems?: OrderItemInfo[];
  estimatedDistanceKm?: number;
  earnings?: number;            // spec
  estimatedEarnings?: EstimatedEarnings; // real API key
}

// ── DTOs ─────────────────────────────────────────────────────────────────────
export interface AcceptDeliveryDto {
  deliveryId: string;
}

export interface DeclineDeliveryDto {
  reason?: string;
  deliveryId?: string;
}

export interface ConfirmPickupDto {
  pickupNotes?: string;
  photoUrl?: string;
}

export interface ConfirmDeliveryDto {
  deliveryCode?: string;
  notes?: string;
}

export interface UpdateDeliveryStatusDto {
  status: DeliveryStatus;
  note?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeliveryActionResponse {
  success?: boolean;
  deliveryId?: string;
  status?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

// ── Earnings ──────────────────────────────────────────────────────────────────
export interface EarningsSummary {
  daily?: EarningsPeriod;
  weekly?: EarningsPeriod;
  monthly?: EarningsPeriod;
  totalEarned?: string;
  totalPending?: string;
  totalPaidOut?: string;
}

export interface EarningsPeriod {
  amount?: string;
  count?: number;
}

export interface EarningsEntry {
  id?: string;
  deliveryId?: string;
  amount?: string;
  status?: 'PENDING' | 'SETTLED' | 'CANCELLED';
  type?: 'DELIVERY_FEE' | 'BONUS' | 'TIP' | 'WITHDRAWAL';
  description?: string;
  createdAt?: string;
  settledAt?: string;
}

// ── Payouts ───────────────────────────────────────────────────────────────────
export interface Payout {
  id?: string;
  amount?: string;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  paymentMethod?: string;
  reference?: string;
  note?: string;
  requestedAt?: string;
  completedAt?: string;
}

export interface RequestPayoutPayload {
  amount: number;
  paymentMethod?: string;
  note?: string;
}

// ── Issue reporting ──────────────────────────────────────────────────────────
export interface ReportIssuePayload {
  issueType: 'WRONG_ADDRESS' | 'MISSING_ITEMS' | 'DAMAGED_ITEMS' | 'CUSTOMER_UNAVAILABLE' | 'OTHER';
  description: string;
  attachments?: string[];
}

// ── Socket events ────────────────────────────────────────────────────────────
export type RiderSocketEvent =
  | 'delivery.accepted'
  | 'delivery.declined'
  | 'delivery.status.updated'
  | 'delivery.completed'
  | 'delivery.picked_up'
  | 'escrow.release'
  | 'rider.location.updated';

export interface DeliveryAcceptedEvent {
  deliveryId?: string;
  orderId?: string;
  status?: string;
  riderId?: string;
  [key: string]: unknown;
}

export interface DeliveryDeclinedEvent {
  deliveryId?: string;
  riderId?: string;
  reason?: string;
  [key: string]: unknown;
}

export interface DeliveryStatusEvent {
  deliveryId?: string;
  status?: DeliveryStatus;
  timestamp?: string;
  [key: string]: unknown;
}

export interface RiderLocationEvent {
  riderId?: string;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
  [key: string]: unknown;
}