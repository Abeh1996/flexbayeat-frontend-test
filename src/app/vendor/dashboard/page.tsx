'use client';
import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart2,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  Package,
  Star,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useVendorProfileQuery } from '@/features/vendor/hooks/useVendorProfileQuery';
import {
  useActiveOrdersQuery,
  useOrderHistoryQuery,
} from '@/features/vendor/hooks/useOrdersQuery';
import { Order } from '@/features/vendor/types/orders.types';
import { format } from 'date-fns';

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  isLoading,
  color = 'bg-amber-500',
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
  isLoading?: boolean;
  color?: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200/80">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-md ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      {isLoading && <Loader2 size={20} className="animate-spin text-stone-400" />}
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-stone-800">{isLoading ? '...' : value}</p>
      <h3 className="text-sm font-semibold text-stone-500 mt-1">{title}</h3>
      <p className="text-xs text-stone-400 mt-2">{description}</p>
    </div>
  </div>
);

const RecentOrderRow = ({ order }: { order: Order }) => (
  <div className="flex items-center justify-between py-3 px-1">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-stone-100 rounded-md">
        <Package size={18} className="text-stone-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-700">Order #{order.orderNumber?.slice(-6)}</p>
        <p className="text-xs text-stone-500">
          {(order.orderItems?.length || 0)} item(s) &bull;{' '}
          {format(new Date(order.createdAt), 'MMM d, h:mm a')}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-stone-800">{Number(order.total).toLocaleString()} XAF</p>
      <span className="text-xs font-semibold capitalize px-2 py-1 rounded-full bg-amber-100 text-amber-700">
        {order.status.toLowerCase()}
      </span>
    </div>
  </div>
);

export default function VendorOverviewPage() {
  const { vendorProfile, isLoadingVendorProfile } = useVendorProfileQuery();
  const { activeOrders, isLoadingActiveOrders } = useActiveOrdersQuery();
  const { orderHistory, isLoadingHistory } = useOrderHistoryQuery();

  const totalOrders = (activeOrders?.length || 0) + (orderHistory?.length || 0);
  const walletBalance = vendorProfile?.wallet?.balance ?? 0;

  // Mock sales data for the chart for UI purposes
  // const salesData = [
  //   { name: 'Mon', revenue: 4000 },
  //   { name: 'Tue', revenue: 3000 },
  //   { name: 'Wed', revenue: 2000 },
  //   { name: 'Thu', revenue: 2780 },
  //   { name: 'Fri', revenue: 1890 },
  //   { name: 'Sat', revenue: 2390 },
  //   { name: 'Sun', revenue: 3490 },
  // ];

  const isLoading = isLoadingVendorProfile || isLoadingActiveOrders || isLoadingHistory;

  return (
    <div className="p-6 lg:p-8 bg-stone-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">
          Welcome back, {vendorProfile?.businessName || '...'}!
        </h1>
        <p className="text-stone-500 mt-1">
          Here's a snapshot of your business performance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Wallet Balance"
          value={`${walletBalance.toLocaleString()} XAF`}
          description="Your current earnings"
          isLoading={isLoadingVendorProfile}
          color="bg-green-500"
        />
        <StatCard
          icon={Package}
          title="Total Orders"
          value={totalOrders}
          description="Active and completed orders"
          isLoading={isLoading}
          color="bg-blue-500"
        />
        <StatCard
          icon={Clock}
          title="Active Orders"
          value={activeOrders?.length || 0}
          description="Orders needing processing"
          isLoading={isLoadingActiveOrders}
          color="bg-amber-500"
        />
        <StatCard
          icon={Star}
          title="Average Rating"
          value={parseFloat(vendorProfile?.averageRating || '0').toFixed(1)}
          description={`${vendorProfile?.totalReviews || 0} reviews`}
          isLoading={isLoadingVendorProfile}
          color="bg-indigo-500"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1  gap-6 mt-8">
        {/* Sales Chart */}
        {/* <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-stone-200/80">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Weekly Revenue</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
                  contentStyle={{
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Recent Active Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800">Active Orders</h3>
            <Link
              href="/vendor/dashboard/orders"
              className="text-sm font-semibold text-amber-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {isLoadingActiveOrders ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 size={24} className="animate-spin text-stone-400" />
              </div>
            ) : activeOrders && activeOrders.length > 0 ? (
              activeOrders.slice(0, 5).map((order) => (
                <RecentOrderRow key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-stone-500">No active orders right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
