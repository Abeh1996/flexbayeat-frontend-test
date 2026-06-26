// src/app/vendor/(dashboard)/dashboard/earnings/page.tsx
'use client';
import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Star,
  Wallet,
  Package,
  Tag,
  Percent,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useAnalyticsQuery } from '@/features/vendor/hooks/useAnalyticsQuery';
import { useVendorProfileQuery } from '@/features/vendor/hooks/useVendorProfileQuery';
import { useOrderHistoryQuery } from '@/features/vendor/hooks/useOrdersQuery';
import { useCategoriesQuery } from '@/features/vendor/hooks/useMenuQuery';
import { Order, OrderStatus } from '@/features/vendor/types/orders.types';
import { DailyRevenue, StatusBreakdown } from '@/features/vendor/types/analytics.types';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Partial<Record<OrderStatus, string>> = {
  DELIVERED:  '#10b981',
  CANCELLED:  '#a1a1aa',
  REJECTED:   '#ef4444',
  DISPUTED:   '#f59e0b',
  ACCEPTED:   '#3b82f6',
  PREPARING:  '#8b5cf6',
};

const PAYOUT_LABEL: Record<string, string> = {
  DAILY: 'Daily', WEEKLY: 'Weekly', MONTHLY: 'Monthly',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatXAF(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
  return String(val);
}

function getDailyRevenue(orders: Order[], days: number): DailyRevenue[] {
  const result: DailyRevenue[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayOrders = orders.filter((o) => {
      const od = new Date(o.createdAt);
      return (
        od.getDate() === d.getDate() &&
        od.getMonth() === d.getMonth() &&
        od.getFullYear() === d.getFullYear() &&
        o.status === 'DELIVERED'
      );
    });
    result.push({
      date: dateStr,
      revenue: dayOrders.reduce((sum, o) => sum + Number(o.totalAmount ?? o.total ?? 0), 0),
      orders: dayOrders.length,
    });
  }
  return result;
}

function getStatusBreakdown(orders: Order[]): StatusBreakdown[] {
  const counts: Partial<Record<OrderStatus, number>> = {};
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([status, value]) => ({
      name: status.replace(/_/g, ' '),
      value: value as number,
      color: STATUS_COLORS[status as OrderStatus] ?? '#a1a1aa',
    }))
    .sort((a, b) => b.value - a.value);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${
      accent
        ? 'bg-amber-500 border-amber-400 text-white'
        : 'bg-white border-zinc-100 shadow-sm'
    }`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
        accent ? 'bg-white/20' : 'bg-amber-50'
      }`}>
        <Icon size={17} className={accent ? 'text-white' : 'text-amber-500'} />
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
          accent ? 'text-white/70' : 'text-zinc-400'
        }`}>
          {label}
        </p>
        <p className={`text-2xl font-black ${accent ? 'text-white' : 'text-zinc-900'}`}>
          {value}
        </p>
        {sub && (
          <p className={`text-xs font-medium mt-0.5 ${accent ? 'text-white/60' : 'text-zinc-400'}`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// Custom tooltip for area chart
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-bold text-zinc-500 mb-1">{label}</p>
      <p className="text-sm font-black text-zinc-900">
        {Number(payload[0]?.value).toLocaleString()} XAF
      </p>
      <p className="text-xs text-zinc-400">{payload[1]?.value ?? 0} orders</p>
    </div>
  );
}

// Custom tooltip for pie
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-bold text-zinc-500 capitalize mb-0.5">
        {payload[0]?.name}
      </p>
      <p className="text-sm font-black text-zinc-900">{payload[0]?.value} orders</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Range = 7 | 14 | 30;

export default function VendorEarningsPage() {
  const [range, setRange] = useState<Range>(7);

  const { analytics, isLoadingAnalytics, refetchAnalytics } = useAnalyticsQuery();
  const { vendorProfile } = useVendorProfileQuery();
  const { orderHistory } = useOrderHistoryQuery();
  const { categories, allItems } = useCategoriesQuery();

  const dailyRevenue = useMemo(
    () => getDailyRevenue(orderHistory, range),
    [orderHistory, range]
  );

  const statusBreakdown = useMemo(
    () => getStatusBreakdown(orderHistory),
    [orderHistory]
  );

  const totalRevenue = orderHistory
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.totalAmount ?? o.total ?? 0), 0);

  const avgOrderValue =
    orderHistory.length > 0
      ? Math.round(totalRevenue / orderHistory.filter((o) => o.status === 'DELIVERED').length) || 0
      : 0;

  const availableItems = allItems.filter((i) => i.status === 'AVAILABLE').length;
  const outOfStockItems = allItems.filter((i) => i.status === 'OUT_OF_STOCK').length;
  const hiddenItems = allItems.filter((i) => i.status === 'HIDDEN').length;

  const commissionPercent = vendorProfile
    ? (parseFloat(vendorProfile.commissionRate) * 100).toFixed(0)
    : '—';

  const hasRevenueData = dailyRevenue.some((d) => d.revenue > 0);
  const hasStatusData = statusBreakdown.length > 0;

  return (
    <div className="p-6 lg:p-10 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">
            Earnings & Analytics
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Your business performance at a glance
          </p>
        </div>
        <button
          onClick={() => refetchAnalytics()}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 border border-zinc-200 hover:border-zinc-300 px-3 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Today's Revenue"
          value={`${(analytics?.todayRevenue ?? 0).toLocaleString()} XAF`}
          sub="Delivered orders today"
          accent
        />
        <StatCard
          icon={ShoppingBag}
          label="Today's Orders"
          value={analytics?.todayOrdersCount ?? 0}
          sub={isLoadingAnalytics ? 'Loading…' : 'New orders today'}
        />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={
            vendorProfile?.averageRating && parseFloat(vendorProfile.averageRating) > 0
              ? parseFloat(vendorProfile.averageRating).toFixed(1)
              : '—'
          }
          sub={`${vendorProfile?.totalReviews ?? 0} reviews`}
        />
        <StatCard
          icon={Wallet}
          label="Wallet"
          value={
            vendorProfile?.wallet
              ? `${Number(vendorProfile.wallet.balance).toLocaleString()} XAF`
              : '0 XAF'
          }
          sub={PAYOUT_LABEL[vendorProfile?.payoutSchedule ?? ''] ?? '—'}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue area chart — takes 2/3 width on desktop */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-zinc-900">Revenue Over Time</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Delivered orders only</p>
            </div>
            {/* Range selector */}
            <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
              {([7, 14, 30] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    range === r
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
          </div>

          {hasRevenueData ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyRevenue} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#a1a1aa' }}
                  axisLine={false}
                  tickLine={false}
                  interval={range === 7 ? 0 : range === 14 ? 1 : 4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#a1a1aa' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatXAF}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#e4e4e7"
                  strokeWidth={1.5}
                  fill="transparent"
                  dot={false}
                  activeDot={{ r: 4, fill: '#a1a1aa', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-zinc-300" />
              </div>
              <p className="text-sm font-semibold text-zinc-400">No revenue data yet</p>
              <p className="text-xs text-zinc-300">
                Delivered orders will appear here
              </p>
            </div>
          )}
        </div>

        {/* Order status donut — 1/3 width */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-sm font-black text-zinc-900">Order Breakdown</h3>
            <p className="text-xs text-zinc-400 mt-0.5">By status, all time</p>
          </div>

          {hasStatusData ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="space-y-2 mt-2">
                {statusBreakdown.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs text-zinc-600 capitalize truncate">
                        {entry.name.toLowerCase()}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 shrink-0">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-zinc-300" />
              </div>
              <p className="text-sm font-semibold text-zinc-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Menu health */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-zinc-900">Menu Health</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Current item status</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-zinc-600">Available</span>
              </div>
              <span className="text-sm font-black text-zinc-900">{availableItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-sm text-zinc-600">Out of Stock</span>
              </div>
              <span className="text-sm font-black text-zinc-900">{outOfStockItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-300 rounded-full" />
                <span className="text-sm text-zinc-600">Hidden</span>
              </div>
              <span className="text-sm font-black text-zinc-900">{hiddenItems}</span>
            </div>
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Categories</span>
              </div>
              <span className="text-sm font-black text-zinc-900">{categories.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Total Items</span>
              </div>
              <span className="text-sm font-black text-zinc-900">{allItems.length}</span>
            </div>
          </div>
        </div>

        {/* Lifetime stats */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-zinc-900">Lifetime Stats</h3>
            <p className="text-xs text-zinc-400 mt-0.5">All time performance</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Total Orders</span>
              </div>
              <span className="text-sm font-black text-zinc-900">
                {vendorProfile?.totalOrders ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Total Revenue</span>
              </div>
              <span className="text-sm font-black text-zinc-900">
                {totalRevenue.toLocaleString()} XAF
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Avg Order Value</span>
              </div>
              <span className="text-sm font-black text-zinc-900">
                {avgOrderValue > 0 ? `${avgOrderValue.toLocaleString()} XAF` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Total Reviews</span>
              </div>
              <span className="text-sm font-black text-zinc-900">
                {vendorProfile?.totalReviews ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-zinc-900">Account Info</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Your plan details</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Commission</span>
              </div>
              <span className="text-sm font-black text-zinc-900">{commissionPercent}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Payouts</span>
              </div>
              <span className="text-sm font-black text-zinc-900">
                {PAYOUT_LABEL[vendorProfile?.payoutSchedule ?? ''] ?? '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-600">Balance</span>
              </div>
              <span className="text-sm font-black text-zinc-900">
                {vendorProfile?.wallet
                  ? `${Number(vendorProfile.wallet.balance).toLocaleString()} XAF`
                  : '0 XAF'}
              </span>
            </div>
          </div>
          {/* Payout threshold if set */}
          {vendorProfile?.payoutThreshold && (
            <div className="pt-3 border-t border-zinc-100">
              <p className="text-xs text-zinc-400">
                Payout threshold:{' '}
                <span className="font-bold text-zinc-700">
                  {Number(vendorProfile.payoutThreshold).toLocaleString()} XAF
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}