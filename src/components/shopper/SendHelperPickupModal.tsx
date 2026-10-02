import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvailableHelper } from '../../types';
import { NigerianCurrency } from '../common/NigerianCurrency';
import {
  X,
  Bike,
  Store,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  KeyRound,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';

export const SendHelperPickupModal: React.FC = () => {
  const {
    isSendHelperModalOpen,
    setIsSendHelperModalOpen,
    orderForHelperPickup,
    availableHelpers,
    assignHelperForOrderPickup,
    openHelperProfile
  } = useApp();

  const [selectedHelperId, setSelectedHelperId] = useState<string>(
    availableHelpers[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSendHelperModalOpen || !orderForHelperPickup) return null;

  const order = orderForHelperPickup;
  const selectedHelper = availableHelpers.find(h => h.id === selectedHelperId) || availableHelpers[0];

  const handleConfirmPickup = async () => {
    if (!selectedHelper) return;
    setIsSubmitting(true);
    try {
      await assignHelperForOrderPickup(order.id, selectedHelper);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setIsSendHelperModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white">
          <button
            onClick={() => setIsSendHelperModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20 text-white">
              <Bike className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Courier Store Pickup
            </span>
          </div>

          <h3 className="text-lg font-extrabold tracking-tight mt-1">
            Send a Helper to Pick Up from Seller
          </h3>
          <p className="text-xs text-emerald-100 mt-0.5">
            A verified Shopping Courier will go to the seller's storefront, inspect the items, and deliver directly to you.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Order Details & Pickup Route */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 uppercase">Order ID</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{order.id}</span>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Store className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Pickup From: {order.sellerName}
                </span>
                <span className="text-slate-500 text-[11px] block">
                  {order.sellerStoreAddress || `${order.sellerName} Central Storefront, Lagos`}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Deliver To: {order.shopperName}
                </span>
                <span className="text-slate-500 text-[11px] block">
                  {order.deliveryAddress.fullAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Helper Selection List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Select Courier Helper
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Tap helper to view full merchant profile
              </span>
            </div>

            <div className="space-y-2.5">
              {availableHelpers.map(helper => {
                const isSelected = selectedHelperId === helper.id;
                return (
                  <div
                    key={helper.id}
                    onClick={() => setSelectedHelperId(helper.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={helper.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={helper.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {helper.name}
                            </span>
                            <div className="flex items-center text-[11px] text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-current mr-0.5" />
                              {helper.rating}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{helper.vehicleType}</span>
                            <span>·</span>
                            <span>{helper.completedJobsCount} trips</span>
                          </div>

                          {/* DUAL IDENTITY BADGE: Helper who is also a Seller */}
                          {helper.isSeller && (
                            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800/60">
                              <Store className="w-3 h-3" />
                              <span>Store: {helper.sellerStoreName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <input
                          type="radio"
                          name="selectedPickupHelper"
                          checked={isSelected}
                          onChange={() => setSelectedHelperId(helper.id)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            openHelperProfile(helper);
                          }}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                        >
                          View Bio
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security PIN Release Guarantee */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-bold">
              <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Secure 4-Digit Pickup PIN Protection</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              When dispatched, a one-time Pickup PIN will be generated. The helper must present this PIN to the seller before goods are released, ensuring absolute chain-of-custody.
            </p>
          </div>

          {/* Fee & Escrow Breakdown */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Helper Dispatch & Pickup Run</span>
              <span className="font-bold">
                <NigerianCurrency amount={2500} />
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Escrow Released only on delivery
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsSendHelperModalOpen(false)}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmPickup}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-900/10 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Bike className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching...' : `Dispatch ${selectedHelper?.name} for Pickup`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
