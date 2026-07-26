// src/features/Buyer/utils/orderStatus.ts
import { OrderStatus } from '../types/order.types';

interface StatusConfig {
  label: string;
  className: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING: { label: 'Pending confirmation', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACCEPTED: { label: 'Accepted', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  PREPARING: { label: 'Preparing', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  READY: { label: 'Ready for pickup', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  DELIVERED: { label: 'Delivered', className: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
};

export function getStatusConfig(status: string): StatusConfig {
  return STATUS_CONFIG[status] ?? { label: status, className: 'bg-neutral-50 text-neutral-700 border-neutral-200' };
}