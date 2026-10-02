import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { orderRepository, shoppingRequestRepository } from '../../services/mock/MockServices';
import { Order, ShoppingRequest } from '../../types';
import {
  Package,
  Bike,
  Clock,
  ArrowRight,
  Store,
  ChevronRight,
  KeyRound,
  ShieldCheck,
  Star,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ShopperOrdersScreen: React.FC = () => {
  const {
    currentUser,
    navigateTo,
    setActiveShoppingRequest,
    setActiveOrder,
    openSendHelperForOrder,
    openChatWith,
    isSendHelperModalOpen,
    openHelperProfile,
    availableHelpers
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'REQUESTS'>('ORDERS');
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ShoppingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [o, r] = await Promise.all([
        orderRepository.getOrders({ shopperId: currentUser?.id }),
        shoppingRequestRepository.getRequests({ shopperId: currentUser?.id })
      ]);
      setOrders(o);
      setRequests(r);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser, isSendHelperModalOpen]);

  const handleSelectRequest = (req: ShoppingRequest) => {
    setActiveShoppingRequest(req);
    navigateTo('SHOPPER_TRACKING');
  };

  const handleTrackOrderPickup = (order: Order) => {
    // Find matching or create shopping request tracking
    const matchingReq = requests.find(r => r.title.includes(order.sellerName) || r.title.includes(order.id));
    if (matchingReq) {
      setActiveShoppingRequest(matchingReq);
    } else {
      // Set active order and navigate to tracking
      setActiveShoppingRequest({
        id: `REQ-${order.id}`,
        shopperId: order.shopperId,
        shopperName: order.shopperName,
        shopperPhone: '+234 802 345 6789',
        title: `Pick up from ${order.sellerName} (${order.id})`,
        items: order.items.map(i => ({
          id: i.productId,
          name: i.productName,
          quantity: `${i.quantity} ${i.unit}`,
          estimatedPriceNaira: i.price,
          isPurchased: true
        })),
        targetMarketArea: order.sellerStoreAddress || `${order.sellerName} Store`,
        deliveryAddress: order.deliveryAddress,
        estimatedBudgetNaira: order.subtotalNaira,
        helperFeeNaira: 2500,
        status: 'ON_THE_WAY',
        assignedHelperId: order.pickupHelper?.id,
        assignedHelperName: order.pickupHelper?.name,
        assignedHelperPhone: order.pickupHelper?.phone,
        assignedHelperRating: order.pickupHelper?.rating,
        createdAt: order.createdAt,
        updatedAt: new Date().toISOString(),
        priority: 'HIGH',
        verificationCode: order.pickupHelper?.pickupCode
      });
    }
    navigateTo('SHOPPER_TRACKING');
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Orders & Runs" showLocation={false} />

      <div className="px-4 py-3 space-y-4">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'REQUESTS'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Shopping Runs ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ORDERS'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Store Orders ({orders.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'REQUESTS' ? (
          <div className="space-y-3">
            {requests.length > 0 ? (
              requests.map(req => (
                <div
                  key={req.id}
                  onClick={() => handleSelectRequest(req)}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500 transition cursor-pointer active:scale-98 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {req.id}
                    </span>
                    <StateBadge status={req.status} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {req.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {req.targetMarketArea} · {req.items.length} items
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Estimated Budget</span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        <NigerianCurrency amount={req.estimatedBudgetNaira} />
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      Track Run <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3">
                <Bike className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">No shopping runs submitted yet.</p>
                <button
                  onClick={() => navigateTo('SHOPPER_CREATE_LIST')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Create Shopping List
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.length > 0 ? (
              orders.map(order => (
                <div
                  key={order.id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {order.id}
                    </span>
                    <StateBadge status={order.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {order.sellerName}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {order.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}
                  </div>

                  {/* COURIER STORE PICKUP STATUS (IF HELPER ASSIGNED) */}
                  {order.pickupHelper ? (
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            <Bike className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {order.pickupHelper.name}
                              </span>
                              <div className="flex items-center text-[10px] font-bold text-amber-500">
                                <Star className="w-3 h-3 fill-current mr-0.5" />
                                {order.pickupHelper.rating}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Assigned Pickup Courier ({order.pickupHelper.vehicleType || 'Motorcycle'})
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                          {order.pickupHelper.pickupStatus.replace('_', ' ')}
                        </span>
                      </div>

                      {/* DUAL IDENTITY INDICATOR: Helper who is also a Seller */}
                      {order.pickupHelper.isSeller && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold">
                          <Store className="w-3 h-3 shrink-0 text-indigo-600" />
                          <span>Merchant Courier: Also operates {order.pickupHelper.sellerStoreName}</span>
                        </div>
                      )}

                      {/* Secure Pickup Code PIN */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="text-[11px] font-medium">Pickup Release Code:</span>
                          <span className="font-mono font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wider">
                            {order.pickupHelper.pickupCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              openChatWith({
                                id: order.pickupHelper!.id,
                                name: order.pickupHelper!.name,
                                role: 'SHOPPING_HELPER'
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                          >
                            Chat
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTrackOrderPickup(order)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition active:scale-95 shadow-xs cursor-pointer"
                          >
                            <span>Track Live</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : order.status !== 'DELIVERED' && order.status !== 'CANCELLED' ? (
                    /* SEND HELPER TO PICK UP CALLOUT */
                    <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            Send a Helper to Pick Up from Seller
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            Hire a verified courier (including merchant helpers) to inspect and deliver.
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openSendHelperForOrder(order)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shrink-0 flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span>Send Helper</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Total Paid</span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        <NigerianCurrency amount={order.totalNaira} />
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {order.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3">
                <Package className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">No store orders placed yet.</p>
                <button
                  onClick={() => navigateTo('SHOPPER_EXPLORE')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
