'use client';
import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { DollarSign, ShoppingBag, Star, TrendingUp, Users, Calendar, Filter, Loader2 } from 'lucide-react';
import { useOrderHistoryQuery } from '@/features/vendor/hooks/useOrdersQuery';
import { useCategoriesQuery } from '@/features/vendor/hooks/useMenuQuery';
import { Order } from '@/features/vendor/types/orders.types';
import { MenuCategory, MenuItem } from '@/features/vendor/types/menu.types';
import { format, subDays } from 'date-fns';
import Image from 'next/image';

type TimeRange = '7d' | '30d' | '90d';

const StatCard = ({ icon: Icon, title, value, change, isLoading, color = 'bg-amber-500' }: {
  icon: React.ElementType, title: string, value: string | number, change?: string, isLoading?: boolean, color?: string
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200/80">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      {isLoading ? <Loader2 size={24} className="animate-spin text-stone-300" /> : (
        change && <span className={`text-sm font-bold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-stone-800">{isLoading ? '...' : value}</p>
      <h3 className="text-sm font-semibold text-stone-500 mt-1">{title}</h3>
    </div>
  </div>
);

const CHART_COLORS = ['#fb923c', '#a78bfa', '#4ade80', '#f472b6', '#38bdf8'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-stone-200/80">
        <p className="text-sm font-bold text-stone-700">{label}</p>
        <p className="text-sm text-amber-600">Revenue: {payload[0].value.toLocaleString()} XAF</p>
      </div>
    );
  }
  return null;
};

export default function VendorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { orderHistory, isLoadingHistory } = useOrderHistoryQuery();
  const { categories, allItems, isLoadingCategories } = useCategoriesQuery();
  const isLoading = isLoadingHistory || isLoadingCategories;

  const filteredData = useMemo(() => {
    const days = { '7d': 7, '30d': 30, '90d': 90 }[timeRange];
    const startDate = subDays(new Date(), days);
    const relevantOrders = orderHistory.filter(o => new Date(o.createdAt) >= startDate && o.status === 'DELIVERED');

    const dailyRevenue: { [key: string]: number } = {};
    for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), i), 'MMM d');
        dailyRevenue[date] = 0;
    }
    relevantOrders.forEach(order => {
      const date = format(new Date(order.createdAt), 'MMM d');
      dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(order.total || order.totalAmount || 0);
    });

    const totalRevenue = relevantOrders.reduce((sum, o) => sum + Number(o.total || o.totalAmount || 0), 0);
    const totalOrders = relevantOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const salesByCat = categories.map(cat => ({
        name: cat.name,
        revenue: relevantOrders.filter(o => (o.orderItems || o.items)?.some(oi => (oi as any).menuItem?.menuCategoryId === cat.id))
                                .reduce((sum, o) => sum + Number(o.total || o.totalAmount || 0), 0),
    })).filter(c => c.revenue > 0).sort((a,b) => b.revenue - a.revenue);

    const topItems = allItems.map(item => {
        const ordersForItem = relevantOrders.flatMap(o => (o.orderItems || o.items)?.filter(oi => (oi as any).menuItemId === item.id) ?? []);
        return {
            name: item.name,
            quantity: ordersForItem.reduce((sum, oi) => sum + oi.quantity, 0),
            revenue: ordersForItem.reduce((sum, oi) => sum + Number((oi as any).totalPrice || 0), 0),
        };
    }).filter(i => i.quantity > 0).sort((a,b) => b.revenue - a.revenue).slice(0, 5);

    return {
      chartData: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue })).reverse(),
      totalRevenue,
      totalOrders,
      avgOrderValue,
      salesByCat,
      topItems
    };
  }, [orderHistory, categories, allItems, timeRange]);

  return (
    <div className="p-6 lg:p-8 bg-stone-50 min-h-full">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Analytics</h1>
          <p className="text-stone-500 mt-1">Your performance over the last {timeRange.replace('d','')} days.</p>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-stone-200/80 shadow-sm">
          {(['7d', '30d', '90d'] as TimeRange[]).map(range => (
            <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors capitalize ${timeRange === range ? "bg-amber-500 text-white" : "text-stone-600 hover:bg-stone-100"}`}>
              {range.replace('d', ' Days')}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard icon={DollarSign} title="Total Revenue" value={`${filteredData.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} XAF`} isLoading={isLoading} color="bg-green-500" />
        <StatCard icon={ShoppingBag} title="Total Orders" value={filteredData.totalOrders.toLocaleString()} isLoading={isLoading} color="bg-blue-500" />
        <StatCard icon={TrendingUp} title="Avg. Order Value" value={`${filteredData.avgOrderValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} XAF`} isLoading={isLoading} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-stone-200/80">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false}/>
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#a8a29e" axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} stroke="#a8a29e" axisLine={false} tickLine={false} tickFormatter={(val) => `${(val as number / 1000)}k`}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-stone-200/80">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Sales by Category</h3>
           <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.salesByCat} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize: 12}} stroke="#a8a29e" axisLine={false} tickLine={false} tickFormatter={(val) => `${(val as number / 1000)}k`} />
                  <YAxis type="category" dataKey="name" tick={{fontSize: 12}} stroke="#a8a29e" axisLine={false} tickLine={false} width={80} />
                  <Tooltip cursor={{fill: '#f5f5f4'}}/>
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                      {filteredData.salesByCat.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                  </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-stone-200/80">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Top Selling Items</h3>
          <div className="space-y-3">
              <div className="grid grid-cols-6 gap-4 text-xs font-bold uppercase text-stone-500 px-4">
                  <span className="col-span-3">Item</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Quantity Sold</span>
                  <span className="text-right">Total Revenue</span>
              </div>
              {isLoading ? <div className="h-40 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-stone-300" /></div> : 
              filteredData.topItems.map((item, index) => {
                  const originalItem = allItems.find(i => i.name === item.name);
                  return (
                    <div key={index} className="grid grid-cols-6 gap-4 items-center bg-stone-50/70 p-4 rounded-lg">
                        <div className="col-span-3 flex items-center gap-4">
                           <div className="w-12 h-12 rounded-lg bg-stone-100 flex-shrink-0">
                                {originalItem?.imageUrl && <Image src={originalItem.imageUrl} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />}
                           </div>
                            <span className="font-semibold text-stone-700 truncate">{item.name}</span>
                        </div>
                        <p className="font-semibold text-stone-600 text-right">{originalItem ? `${Number(originalItem.price).toLocaleString()} XAF` : '-'}</p>
                        <p className="font-semibold text-stone-600 text-right">{item.quantity}</p>
                        <p className="font-bold text-stone-800 text-right">{item.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} XAF</p>
                    </div>
                  )
              })}
          </div>
      </div>

    </div>
  );
}
