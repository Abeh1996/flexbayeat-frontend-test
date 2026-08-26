// src/app/admin/dashboard/deliveries/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Package,
  Bike,
  MapPin,
  Store,
  User,
  Navigation,
  X,
  Search,
  RefreshCw,
  Loader2,
  Eye,
  Target,
} from 'lucide-react';
import {
  useUnassignedOrdersQuery,
  useAssignedOrdersQuery,
  useAvailableRidersQuery,
  useAdminDeliveryMutation,
} from '@/features/Admin/hooks/useAdminDeliveryQueries';
import { DataTable, StatusBadge, Pagination } from '@/features/Admin/components/DataTable';
import type { Column } from '@/features/Admin/components/DataTable';
import type {
  AdminUnassignedOrder,
  AdminAssignedOrder,
  AdminAvailableRider,
} from '@/features/Admin/types';

// ── Order status filter options ───────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Del.' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'RETURNED', label: 'Returned' },
];

type Tab = 'unassigned' | 'assigned' | 'riders';

export default function AdminDeliveriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') as Tab | null;
  const [tab, setTab] = useState<Tab>(tabParam || 'unassigned');

  useEffect(() => {
    if (tabParam && tabParam !== tab) setTab(tabParam);
  }, [tabParam, tab]);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    router.replace(`/admin/dashboard/deliveries?tab=${t}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Delivery Management</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Oversee orders, assign riders, and track delivery status
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 rounded-lg p-0.5 w-fit">
        {([
          { key: 'unassigned' as Tab, label: 'Unassigned', icon: Package },
          { key: 'assigned' as Tab, label: 'Assigned', icon: Navigation },
          { key: 'riders' as Tab, label: 'Available Riders', icon: Bike },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all ${
              tab === key
                ? 'bg-white text-zinc-800 shadow-sm border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'unassigned' && <UnassignedOrders />}
      {tab === 'assigned' && <AssignedOrders />}
      {tab === 'riders' && <AvailableRiders />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UNASSIGNED ORDERS
// ═══════════════════════════════════════════════════════════════════════════════

function UnassignedOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUnassignedOrdersQuery(page);
  const { autoAssign, isAutoAssigning } = useAdminDeliveryMutation();
  const [radius, setRadius] = useState('50');
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const handleAutoAssign = async (orderId: string) => {
    setAssigningId(orderId);
    await autoAssign({ id: orderId, payload: { radiusKm: parseFloat(radius) || 10 } });
    setAssigningId(null);
  };

  const columns: Column<AdminUnassignedOrder>[] = [
    {
      key: 'order',
      label: 'Order #',
      render: (o) => (
        <span className="font-medium text-zinc-800">
          #{o.orderNumber || o.id?.slice(-8).toUpperCase() || '—'}
        </span>
      ),
    },
    {
      key: 'vendor',
      label: 'Vendor',
      hideOnMobile: true,
      render: (o) => (
        <span className="text-zinc-700">{o.vendorProfile?.businessName || '—'}</span>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      hideOnMobile: true,
      render: (o) => (
        <span className="text-zinc-500">
          {o.orderItems?.length ?? 0} item{(o.orderItems?.length ?? 0) !== 1 ? 's' : ''}
          {o.total != null && ` · $${Number(o.total).toFixed(2)}`}
        </span>
      ),
    },
    {
      key: 'distance',
      label: 'Distance',
      hideOnMobile: true,
      render: (o) => (
        <span className="text-zinc-500">{o.estimatedDistanceKm != null ? `${o.estimatedDistanceKm.toFixed(1)} km` : '—'}</span>
      ),
    },
    {
      key: 'action',
      label: 'Auto-Assign',
      className: 'text-right',
      render: (o) => (
        <button
          onClick={(e) => { e.stopPropagation(); if (o.id) handleAutoAssign(o.id); }}
          disabled={isAutoAssigning || !o.id}
          className="px-3 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          {assigningId === o.id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Navigation size={12} />
          )}
          Assign
        </button>
      ),
    },
  ];

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {/* Auto-assign radius control */}
      <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl px-4 py-3">
        <Target size={14} className="text-zinc-400" />
        <span className="text-xs font-medium text-zinc-600">Auto-assign radius:</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-20 px-2.5 py-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-700"
            min={1}
            max={200}
            placeholder="50"
          />
          <span className="text-xs text-zinc-400">km</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={isLoading ? [] : (data?.orders || [])}
        loading={isLoading}
        emptyMessage="All orders are assigned. No pending unassigned orders."
        keyExtractor={(o) => o.id ?? ''}
        onRowClick={(order) => {
          // Open detail popover
        }}
        skeletonCount={4}
      />
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ASSIGNED ORDERS
// ═══════════════════════════════════════════════════════════════════════════════

function AssignedOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminAssignedOrder | null>(null);
  const { data, isLoading } = useAssignedOrdersQuery(
    page, 20, statusFilter || undefined,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const columns: Column<AdminAssignedOrder>[] = [
    {
      key: 'order',
      label: 'Order #',
      render: (o) => (
        <span className="font-medium text-zinc-800">
          #{o.order?.orderNumber || o.orderId?.slice(-8).toUpperCase() || '—'}
        </span>
      ),
    },
    {
      key: 'vendor',
      label: 'Vendor',
      hideOnMobile: true,
      render: (o) => {
        const v = o.order?.vendorProfile;
        return <span className="text-zinc-700">{v?.businessName || '—'}</span>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (o) => <StatusBadge status={o.deliveryStatus || 'PENDING'} />,
    },
    {
      key: 'rider',
      label: 'Rider',
      hideOnMobile: true,
      render: (o) => {
        const r = o.assignedRider;
        return (
          <div className="flex items-center gap-1.5">
            <Bike size={12} className="text-zinc-400 shrink-0" />
            <span className="text-zinc-600">{r?.vehiclePlate || r?.userId?.slice(0, 8) || '—'}</span>
          </div>
        );
      },
    },
    {
      key: 'action',
      label: '',
      className: 'text-right',
      render: (o) => (
        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
          <Eye size={12} />
          View
        </span>
      ),
    },
  ];

  const orders = data?.deliveries ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openDetail = (order: AdminAssignedOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setStatusFilter(opt.value); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === opt.value
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={isLoading ? [] : orders}
        loading={isLoading}
        emptyMessage={
          statusFilter
            ? `No orders with status "${statusFilter.replace(/_/g, ' ')}"`
            : 'No assigned deliveries yet'
        }
        keyExtractor={(o) => o.deliveryId ?? o.orderId ?? ''}
        skeletonCount={4}
        onRowClick={openDetail}
      />

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Detail popover */}
      {modalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => { setModalOpen(false); setSelectedOrder(null); }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AVAILABLE RIDERS
// ═══════════════════════════════════════════════════════════════════════════════

function AvailableRiders() {
  const [lat, setLat] = useState('4.1400');
  const [lng, setLng] = useState('9.2500');
  const [radius, setRadius] = useState('50');
  const [search, setSearch] = useState(false);
  const [selectedRider, setSelectedRider] = useState<AdminAvailableRider | null>(null);

  const { data: riders, isLoading, refetch } = useAvailableRidersQuery(
    search ? parseFloat(lat) : 0,
    search ? parseFloat(lng) : 0,
    search ? parseFloat(radius) : 10,
  );

  const columns: Column<AdminAvailableRider>[] = [
    {
      key: 'rider',
      label: 'Rider',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
            <Bike size={12} className="text-emerald-500" />
          </div>
          <span className="font-medium text-zinc-800">{r.vehiclePlate || 'Rider'}</span>
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      hideOnMobile: true,
      render: (r) => (
        <span className="text-zinc-500 capitalize">{r.vehicleType?.toLowerCase()}{r.vehicleModel ? ` · ${r.vehicleModel}` : ''}</span>
      ),
    },
    {
      key: 'distance',
      label: 'Distance',
      render: (r) => (
        <span className="text-zinc-600 tabular-nums">{r.distanceKm != null ? `${r.distanceKm.toFixed(1)} km` : '—'}</span>
      ),
    },
    {
      key: 'location',
      label: 'Coordinates',
      hideOnMobile: true,
      render: (r) => (
        <span className="text-[11px] text-zinc-400 font-mono">
          {r.latitude != null && r.longitude != null
            ? `${r.latitude.toFixed(3)}, ${r.longitude.toFixed(3)}`
            : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: () => <StatusBadge status="Available" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search controls */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Latitude
            </label>
            <input
              type="number" step="0.0001" value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-28 px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-700"
              placeholder="4.1400"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Longitude
            </label>
            <input
              type="number" step="0.0001" value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-28 px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-700"
              placeholder="9.2500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Radius (km)
            </label>
            <input
              type="number" value={radius} min={1} max={500}
              onChange={(e) => setRadius(e.target.value)}
              className="w-24 px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-700"
              placeholder="20"
            />
          </div>
          <button
            onClick={() => { setSearch(true); }}
            className="px-4 py-2 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Search size={13} />
            Search
          </button>
          <button
            onClick={() => refetch()}
            className="px-3 py-2 text-xs font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {!search ? (
        <div className="bg-white border border-zinc-200 rounded-xl px-6 py-12 text-center">
          <MapPin size={28} className="mx-auto text-zinc-300" />
          <p className="text-sm font-medium text-zinc-700 mt-3">Set Search Coordinates</p>
          <p className="text-xs text-zinc-500 mt-1">Enter a location and radius, then click Search</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={isLoading ? [] : (riders || [])}
          loading={isLoading}
          emptyMessage="No available riders found in this area. Try increasing the radius."
          keyExtractor={(r) => r.id ?? ''}
          skeletonCount={4}
          onRowClick={(r) => setSelectedRider(r)}
        />
      )}

      {/* Rider detail modal */}
      {selectedRider && (
        <RiderDetailModal
          rider={selectedRider}
          onClose={() => setSelectedRider(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════════════════════════════════════

function OrderDetailModal({
  order,
  onClose,
}: {
  order: AdminAssignedOrder;
  onClose: () => void;
}) {
  const nested = order.order;
  const rider = order.assignedRider;
  const vendor = nested?.vendorProfile;
  const items = nested?.orderItems || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">
            #{nested?.orderNumber || order.orderId?.slice(-8).toUpperCase() || 'Order'}
          </h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Status</span>
            <StatusBadge status={order.deliveryStatus || nested?.status || 'PENDING'} />
          </div>

          {/* Vendor */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Vendor</p>
            <div className="flex items-center gap-2">
              <Store size={13} className="text-amber-500" />
              <span className="text-sm text-zinc-800">{vendor?.businessName || '—'}</span>
            </div>
          </div>

          {/* Rider */}
          {rider && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Assigned Rider</p>
              <div className="flex items-center gap-2">
                <Bike size={13} className="text-zinc-400" />
                <span className="text-sm text-zinc-800">{rider.vehiclePlate || rider.name || 'Rider'}</span>
                {rider.vehicleType && (
                  <span className="text-xs text-zinc-400">({rider.vehicleType.toLowerCase()})</span>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          {items.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Items ({items.length})
              </p>
              <div className="space-y-1.5">
                {items.map((item, i) => (
                  <div key={item.id ?? i} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700">{item.menuItemName || 'Item'}</span>
                    <span className="text-zinc-500 font-medium">
                      {item.quantity ? `×${item.quantity}` : ''}
                      {item.totalPrice != null ? ` $${Number(item.totalPrice).toFixed(2)}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery address */}
          {nested?.deliveryAddress && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Delivery To</p>
              <p className="text-sm text-zinc-700">
                {nested.deliveryAddress.addressLine1 || ''}{nested.deliveryAddress.city ? `, ${nested.deliveryAddress.city}` : ''}
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-zinc-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-zinc-600 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RiderDetailModal({
  rider,
  onClose,
}: {
  rider: AdminAvailableRider;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">{rider.vehiclePlate || 'Rider Details'}</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <InfoRow icon={Bike} label="Vehicle" value={`${rider.vehicleType?.toLowerCase() || '—'}${rider.vehicleModel ? ` · ${rider.vehicleModel}` : ''}`} />
          <InfoRow icon={MapPin} label="Distance" value={rider.distanceKm != null ? `${rider.distanceKm.toFixed(1)} km` : '—'} />
          <InfoRow icon={MapPin} label="Location" value={rider.latitude != null && rider.longitude != null ? `${rider.latitude.toFixed(4)}, ${rider.longitude.toFixed(4)}` : '—'} />
          <InfoRow icon={User} label="Status" value={rider.status || 'Available'} />
        </div>
        <div className="px-5 py-4 border-t border-zinc-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-zinc-600 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-zinc-400" />
        <span className="text-xs font-medium text-zinc-500">{label}</span>
      </div>
      <span className="text-xs text-zinc-800 font-medium">{value}</span>
    </div>
  );
}