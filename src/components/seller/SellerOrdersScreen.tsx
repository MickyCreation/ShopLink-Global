import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { orderRepository } from '../../services/mock/MockServices';
import { Order, OrderStatus } from '../../types';
import {
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Bike,
  XCircle,
  Phone
} from 'lucide-react';

export const SellerOrdersScreen: React.FC = () => {
  const { currentUser, showSnackbar } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const ords = await orderRepository.getOrders();
    setOrders(ords);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderRepository.updateOrderStatus(orderId, newStatus);
      showSnackbar(`Order status updated to ${newStatus.replace('_', ' ')}`);
      await loadOrders();
    } catch {
      showSnackbar('Failed to update order status');
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Customer Store Orders" showLocation={false} />

      <div className="px-4 py-3 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            All Incoming Orders ({orders.length})
          </span>
          <span className="text-[11px] text-slate-400">Real-time sync</span>
        </div>

        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {order.id}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    Shopper: {order.shopperName}
                  </h3>
                </div>
                <StateBadge status={order.status} size="sm" />
              </div>

              {/* Items */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 space-y-1.5 text-xs">
                {order.items.map(i => (
                  <div key={i.productId} className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">
                      {i.productName} <strong className="text-slate-900 dark:text-white">x {i.quantity}</strong>
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      <NigerianCurrency amount={i.price * i.quantity} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Address & Delivery */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{order.deliveryAddress.fullAddress} · Tel: {order.deliveryAddress.contactPhone}</span>
              </div>

              {/* Status Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Revenue</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    <NigerianCurrency amount={order.totalNaira} />
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                    >
                      Accept & Pack
                    </button>
                  )}
                  {order.status === 'PROCESSING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                    >
                      Ready for Dispatch
                    </button>
                  )}
                  {order.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                      className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                    >
                      Hand to Courier
                    </button>
                  )}
                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                    >
                      Confirm Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
