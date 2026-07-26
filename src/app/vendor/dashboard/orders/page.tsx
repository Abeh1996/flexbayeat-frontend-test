"use client";
import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  PackageCheck,
  Loader2,
  RefreshCw,
  AlertCircle,
  Phone,
  User,
  Receipt,
} from "lucide-react";
import {
  useActiveOrdersQuery,
  useOrderHistoryQuery,
} from "@/features/vendor/hooks/useOrdersQuery";
import { useOrdersMutation } from "@/features/vendor/hooks/useOrdersMutation";
import { Order, OrderStatus } from "@/features/vendor/types/orders.types";
import { format } from 'date-fns';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  PENDING: { label: "New", color: "text-amber-700", bg: "bg-amber-100", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "text-blue-700", bg: "bg-blue-100", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-600", bg: "bg-red-100", icon: XCircle },
  PREPARING: { label: "Preparing", color: "text-purple-700", bg: "bg-purple-100", icon: ChefHat },
  READY_FOR_PICKUP: { label: "Ready", color: "text-cyan-700", bg: "bg-cyan-100", icon: PackageCheck },
  RIDER_ASSIGNED: { label: "Rider Assigned", color: "text-teal-700", bg: "bg-teal-100", icon: User },
  PICKED_UP: { label: "Picked Up", color: "text-teal-700", bg: "bg-teal-100", icon: ShoppingBag },
  OUT_FOR_DELIVERY: { label: "En Route", color: "text-teal-700", bg: "bg-teal-100", icon: ShoppingBag },
  DELIVERED: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-stone-500", bg: "bg-stone-100", icon: XCircle },
  DISPUTED: { label: "Disputed", color: "text-red-600", bg: "bg-red-100", icon: AlertCircle },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] ?? { label: status, color: "text-stone-600", bg: "bg-stone-100", icon: AlertCircle };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}>
      <config.icon size={14} />
      <span>{config.label}</span>
    </span>
  );
}

const OrderCard = ({ order, onAccept, onReject, onUpdateStatus, isAccepting, isRejecting, isUpdatingStatus }: {
  order: Order;
  onAccept: (id: string, prepMin?: number) => void;
  onReject: (id: string, reason: string) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  isAccepting: boolean; isRejecting: boolean; isUpdatingStatus: boolean;
}) => {
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const { customer } = order;
  const isLoading = isAccepting || isRejecting || isUpdatingStatus;

  const handleAccept = (prepMin?: number) => {
    onAccept(order.id, prepMin);
    setShowAccept(false);
  };
  const handleReject = (reason: string) => {
    if (!reason.trim()) return;
    onReject(order.id, reason);
    setShowReject(false);
  };

  const renderActionButtons = () => {
    if (showAccept) return <AcceptForm onAccept={handleAccept} onCancel={() => setShowAccept(false)} isLoading={isAccepting} />;
    if (showReject) return <RejectForm onReject={handleReject} onCancel={() => setShowReject(false)} isLoading={isRejecting} />;

    switch (order.status) {
      case 'PENDING':
        return (
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAccept(true)} className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={16}/> Accept
            </button>
            <button onClick={() => setShowReject(true)} className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2">
              <XCircle size={16}/> Reject
            </button>
          </div>
        );
      case 'ACCEPTED':
        return (
          <button onClick={() => onUpdateStatus(order.id, 'PREPARING')} disabled={isLoading} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:bg-stone-300">
            {isLoading ? <Loader2 className="animate-spin" /> : <ChefHat size={16}/>}
            Start Preparing
          </button>
        );
      case 'PREPARING':
        return (
          <button onClick={() => onUpdateStatus(order.id, 'READY_FOR_PICKUP')} disabled={isLoading} className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-2 disabled:bg-stone-300">
            {isLoading ? <Loader2 className="animate-spin" /> : <PackageCheck size={16}/>}
            Ready for Pickup
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200/80 flex flex-col">
      <div className="p-5 border-b border-stone-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-stone-800">Order #{order.orderNumber?.slice(-6)}</h3>
            <p className="text-xs text-stone-400">{format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <User size={16} className="text-stone-400"/>
          <p className="text-sm font-semibold text-stone-600">{customer?.name ?? 'Customer'}</p>
        </div>
      </div>
      <div className="p-5 space-y-2 flex-grow">
        {(order.orderItems || order.items)?.map(item => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="font-semibold text-stone-600">{item.quantity}x</span>
            <span className="text-stone-600">{item.name}</span>
            <span className="font-semibold text-stone-800">{Number(item.price).toLocaleString()} XAF</span>
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-stone-100">
        <div className="flex justify-between items-center font-bold text-lg">
          <span className="text-stone-600">Total</span>
          <span className="text-stone-800">{Number(order.total || order.totalAmount).toLocaleString()} XAF</span>
        </div>
      </div>
      <div className="p-4 bg-stone-50/50 rounded-b-xl">
        {renderActionButtons()}
      </div>
    </div>
  );
};

const AcceptForm = ({ onAccept, onCancel, isLoading }: { onAccept: (p?:number)=>void, onCancel:()=>void, isLoading:boolean }) => {
  const [prepMin, setPrepMin] = useState('');
  return (
    <div className="space-y-3">
      <input type="number" value={prepMin} onChange={e => setPrepMin(e.target.value)} placeholder="Est. preparation time (minutes)" className="w-full border border-stone-300 rounded-lg px-6 py-2 bg-white " />
      <div className="flex gap-3">
        <button onClick={() => onAccept(Number(prepMin) || undefined)} disabled={isLoading} className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 disabled:bg-stone-300">
          {isLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={16}/>} Confirm
        </button>
        <button onClick={onCancel} className="flex-1 bg-stone-200 text-stone-700 font-bold py-2 rounded-lg hover:bg-stone-300">Cancel</button>
      </div>
    </div>
  );
};
const RejectForm = ({ onReject, onCancel, isLoading }: { onReject: (r:string)=>void, onCancel:()=>void, isLoading:boolean }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="space-y-3">
      <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for rejection" className="w-full border border-stone-300 rounded-lg px-6 py-4 bg-white " />
      <div className="flex gap-3">
        <button onClick={() => onReject(reason)} disabled={isLoading || !reason.trim()} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 disabled:bg-stone-300">
          {isLoading ? <Loader2 className="animate-spin" /> : <XCircle size={16}/>} Confirm
        </button>
        <button onClick={onCancel} className="flex-1 bg-stone-200 text-stone-700 font-bold py-2 rounded-lg hover:bg-stone-300">Cancel</button>
      </div>
    </div>
  );
};


const HistoryRow = ({ order }: { order: Order }) => (
    <div className="grid grid-cols-5 items-center gap-4 py-3 px-5 bg-white rounded-lg border border-stone-200/80 hover:shadow-sm hover:border-stone-300 transition-all">
      <p className="font-semibold text-stone-700">#{order.orderNumber?.slice(-6)}</p>
      <p className="text-stone-500">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
      <p className="text-stone-600 font-semibold">{order.customer?.name ?? 'Customer'}</p>
      <StatusBadge status={order.status} />
      <p className="font-bold text-stone-800 text-right">{Number(order.total || order.totalAmount).toLocaleString()} XAF</p>
    </div>
);

const EmptyState = ({ tab }: { tab: Tab }) => (
  <div className="text-center py-20 lg:py-32 rounded-xl bg-stone-50 border-2 border-dashed border-stone-200">
    <ShoppingBag size={32} className="mx-auto text-stone-300"/>
    <h3 className="mt-4 text-lg font-semibold text-stone-700">No {tab} orders</h3>
    <p className="mt-1 text-sm text-stone-500">
      {tab === 'active' ? 'New orders will appear here as they come in.' : 'Completed or cancelled orders will be shown here.'}
    </p>
  </div>
);

type Tab = "active" | "history";

export default function VendorOrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const { activeOrders, isLoadingActiveOrders, isErrorActiveOrders, refetchActiveOrders } = useActiveOrdersQuery();
  const { orderHistory, isLoadingHistory } = useOrderHistoryQuery();
  const { acceptOrder, isAccepting, acceptingId, rejectOrder, isRejecting, rejectingId, updateOrderStatus, isUpdatingStatus, updatingStatusId } = useOrdersMutation();

  const handleAccept = (id: string, prepMin?: number) => {
    acceptOrder({ id, payload: { estimatedPrepMin: prepMin } });
  };
  const handleReject = (id: string, reason: string) => {
    rejectOrder({ id, payload: { reason } });
  };
  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus({ id, payload: { status } });
  };

  const pendingCount = activeOrders.filter(o => o.status === 'PENDING').length;

  return (
    <div className="p-6 lg:p-8 bg-stone-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Orders</h1>
          <p className="text-stone-500 mt-1">Manage incoming and past orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-stone-200/80 shadow-sm">
            {(["active", "history"] as Tab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors capitalize flex items-center gap-2 ${activeTab === tab ? "bg-amber-500 text-white" : "text-stone-600 hover:bg-stone-100"}`}>
                {tab}
                {tab === 'active' && pendingCount > 0 && <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{pendingCount}</span>}
              </button>
            ))}
          </div>
          <button onClick={() => refetchActiveOrders()} className="p-3 bg-white rounded-lg border border-stone-200/80 shadow-sm text-stone-600 hover:bg-stone-100 hover:text-amber-600 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'active' && (
          <>
            {isLoadingActiveOrders && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="h-96 bg-white rounded-xl shadow-sm animate-pulse" />)}</div>}
            {!isLoadingActiveOrders && activeOrders.length === 0 && <EmptyState tab="active" />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} 
                  onAccept={handleAccept} onReject={handleReject} onUpdateStatus={handleUpdateStatus}
                  isAccepting={isAccepting && acceptingId === order.id}
                  isRejecting={isRejecting && rejectingId === order.id}
                  isUpdatingStatus={isUpdatingStatus && updatingStatusId === order.id}
                />
              ))}
            </div>
          </>
        )}
        {activeTab === 'history' && (
          <div className="space-y-3">
             {isLoadingHistory && <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-lg shadow-sm animate-pulse" />)}</div>}
            {!isLoadingHistory && orderHistory.length === 0 && <EmptyState tab="history" />}
             <div className="hidden md:grid grid-cols-5 items-center gap-4 py-2 px-5 text-xs font-bold uppercase text-stone-500">
                <span>Order ID</span>
                <span>Date</span>
                <span>Customer</span>
                <span>Status</span>
                <span className="text-right">Amount</span>
            </div>
            {orderHistory.map(order => <HistoryRow key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
