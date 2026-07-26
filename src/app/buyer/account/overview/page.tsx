
'use client';

import React from 'react';
import { useOrdersQuery } from '@/features/Buyer/hooks/useOrdersQuery';
import { useAddressesQuery } from '@/features/Addresses/hooks/useAddressesQuery';
import { BookMarked, Home, ShoppingCart } from 'lucide-react';
import { Order } from '@/features/Buyer/types/order.types';
import { format } from 'date-fns';
import Link from 'next/link';

// StatCard component for displaying overview metrics
const StatCard = ({
  title,
  value,
  icon: Icon,
  bgColor = 'bg-gray-100',
  textColor = 'text-gray-800',
  iconColor = 'text-gray-500',
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
}) => (
  <div className={`p-5 rounded-lg shadow-sm flex items-start gap-4 ${bgColor}`}>
    <div className={`p-3 rounded-full ${iconColor} bg-white`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

// ProfileCompletionCard component for the profile completion metric
const ProfileCompletionCard = ({ percentage }: { percentage: number }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm">
    <h3 className="text-sm font-medium text-gray-500 mb-2">Profile Completion</h3>
    <div className="flex items-center gap-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-lg font-bold text-gray-800">{percentage}%</span>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      {percentage === 100
        ? "You're all set! Your profile is complete."
        : 'Add a delivery address to complete your profile.'}
    </p>
  </div>
);

// RecentOrdersTable component to display a list of recent orders
const RecentOrdersTable = ({
  orders,
  isLoading,
}: {
  orders: Order[];
  isLoading: boolean;
}) => (
  <div className="bg-white p-5 rounded-lg shadow-sm mt-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
      <Link href="/buyer/account/orders" className="text-sm font-medium text-amber-600 hover:text-amber-700">
        View All
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="text-center py-10">
                <p className="text-gray-500">Loading recent orders...</p>
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-10">
                <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
                <Link href="/restaurants" className="mt-2 inline-block bg-amber-500 text-white font-bold py-2 px-4 rounded hover:bg-amber-600">
                  Start Ordering
                </Link>
              </td>
            </tr>
          ) : (
            orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(order.total).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// Main component for the buyer overview page
export default function BuyerOverviewPage() {
  const { orders, isLoadingOrders } = useOrdersQuery();
  const { addresses, hasAddresses, isLoadingAddresses } = useAddressesQuery();

  const profileCompletion = hasAddresses ? 100 : 75;

  const sortedOrders = React.useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Account Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={isLoadingOrders ? '...' : orders.length}
          icon={ShoppingCart}
          bgColor="bg-blue-50"
          textColor="text-blue-800"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Saved Addresses"
          value={isLoadingAddresses ? '...' : addresses.length}
          icon={Home}
          bgColor="bg-indigo-50"
          textColor="text-indigo-800"
          iconColor="text-indigo-500"
        />
        <div className="md:col-span-2 lg:col-span-1">
          <ProfileCompletionCard percentage={profileCompletion} />
        </div>
      </div>

      <RecentOrdersTable orders={sortedOrders} isLoading={isLoadingOrders} />
    </div>
  );
}
