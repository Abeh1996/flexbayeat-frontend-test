// src/features/Vendor/types/analytics.types.ts

// Current backend response — minimal, will grow
export interface VendorAnalytics {
  todayOrdersCount: number;
  todayRevenue: number;
  // future fields — add as backend adds them
  [key: string]: unknown;
}

// Derived chart data — computed client-side from orders history
export interface DailyRevenue {
  date: string;   // formatted e.g. "Jun 20"
  revenue: number;
  orders: number;
}

export interface StatusBreakdown {
  name: string;
  value: number;
  color: string;
}