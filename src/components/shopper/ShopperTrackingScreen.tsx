import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { MapSimulation } from '../common/MapSimulation';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { shoppingRequestRepository } from '../../services/mock/MockServices';
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Package,
  AlertCircle,
  Store,
  Bike
} from 'lucide-react';
import { ShoppingRequestStatus } from '../../types';

export const ShopperTrackingScreen: React.FC = () => {
  const {
    activeShoppingRequest,
    setActiveShoppingRequest,
    openChatWith,
    showSnackbar,
    navigateTo,
    availableHelpers,
    openHelperProfile,
    setSelectedCategoryFilter
  } = useApp();

  const [callModalOpen, setCallModalOpen] = useState(false);

  if (!activeShoppingRequest) {
    return (
      <div className="flex flex-col min-h-full pb-20">
        <AndroidTopAppBar title="Shopping Tracking" showLocation={false} />
        <div className="my-auto py-16 text-center px-4 space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Active Shopping Request
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You don't have any ongoing shopping assistance runs right now.
          </p>
          <button
            onClick={() => navigateTo('SHOPPER_CREATE_LIST')}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Create a Shopping Request
          </button>
        </div>
      </div>
    );
  }

  const req = activeShoppingRequest;

  // Workflow steps
  const steps: { status: ShoppingRequestStatus; label: string }[] = [
    { status: 'PENDING_ASSIGNMENT', label: 'Matching Helper' },
    { status: 'HELPER_ASSIGNED', label: 'Helper Assigned' },
    { status: 'ACCEPTED', label: 'Helper Accepted' },
    { status: 'SHOPPING', label: 'Shopping in Market' },
    { status: 'PURCHASED', label: 'Items Purchased' },
    { status: 'ON_THE_WAY', label: 'On The Way' },
    { status: 'DELIVERED', label: 'Delivered' },
    { status: 'COMPLETED', label: 'Completed' }
  ];

  const currentStepIndex = steps.findIndex(s => s.status === req.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 3;

  // Simulate state progression for demo / testing
  const handleAdvanceStatus = async (nextStatus: ShoppingRequestStatus) => {
    try {
      const updated = await shoppingRequestRepository.updateRequestStatus(req.id, nextStatus);
      setActiveShoppingRequest(updated);
      showSnackbar(`Status updated to ${nextStatus.replace('_', ' ')}`);
    } catch {
      showSnackbar('Failed to update status');
    }
  };

  const purchasedCount = req.items.filter(i => i.isPurchased).length;
  const progressPercent = Math.round((purchasedCount / req.items.length) * 100);

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar
        title="Live Shopping Tracker"
        showBack={true}
        onBack={() => navigateTo('SHOPPER_HOME')}
        showLocation={false}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4">
        {/* Interactive Delivery Map simulation */}
        <MapSimulation
          shopperLocation={req.deliveryAddress.fullAddress}
          helperLocation="Near Ikeja City Mall / Market Depot"
          storeLocation={req.targetMarketArea}
          distanceKm={2.8}
          estimatedEtaMinutes={14}
          privacyMasked={req.status !== 'ON_THE_WAY'}
        />

        {/* Status Stepper Header */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Request ID: {req.id}
              </span>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {req.title}
              </h2>
            </div>
            <StateBadge status={req.status} size="sm" />
          </div>

          {/* Stepper Dots & Line */}
          <div className="relative pt-2">
            <div className="flex items-center justify-between relative z-10">
              {steps.slice(0, 6).map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 max-w-[48px] text-center leading-tight truncate">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Background connection track */}
            <div className="absolute top-5 left-3 right-3 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />
          </div>

          {/* Verification Code Box (For Delivery Handshake) */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 block">
                Delivery Verification PIN
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Give this 4-digit code to helper at handover
              </p>
            </div>
            <div className="px-3 py-1 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl font-mono text-base font-extrabold text-amber-900 dark:text-amber-200 tracking-widest">
              {req.verificationCode || '4829'}
            </div>
          </div>
        </div>

        {/* Assigned Shopping Helper Profile & Communication */}
        {req.assignedHelperName && (() => {
          const matchingHelper = availableHelpers.find(
            h =>
              h.id === req.assignedHelperId ||
              (req.assignedHelperName && h.name.toLowerCase().includes(req.assignedHelperName.toLowerCase()))
          );

          return (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-base shadow-xs">
                    {req.assignedHelperName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        {req.assignedHelperName}
                      </h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {matchingHelper?.isSeller && (
                        <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded-sm">
                          Seller & Helper
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ★ {req.assignedHelperRating || 4.9} · Nigerian Certified Courier ({matchingHelper?.vehicleType || 'Motorcycle'})
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {req.assignedHelperPhone}
                    </p>
                  </div>
                </div>

                {/* Quick Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCallModalOpen(true)}
                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition"
                    title="Call Helper"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      openChatWith({
                        id: req.assignedHelperId || 'user_helper_01',
                        name: req.assignedHelperName || 'Shopping Helper',
                        role: 'SHOPPING_HELPER',
                        requestId: req.id
                      })
                    }
                    className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs hover:bg-emerald-700 transition"
                    title="Chat with Helper"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DUAL MERCHANT CALLOUT (If Helper also owns a store) */}
              {matchingHelper?.isSeller && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 block text-[11px]">
                        Also operates {matchingHelper.sellerStoreName}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        📍 {matchingHelper.sellerStoreAddress}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openHelperProfile(matchingHelper)}
                      className="px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/60 transition cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (matchingHelper.sellerCategory) {
                          setSelectedCategoryFilter(matchingHelper.sellerCategory);
                        } else {
                          setSelectedCategoryFilter('All');
                        }
                        navigateTo('SHOPPER_EXPLORE');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold transition cursor-pointer"
                    >
                      Browse Store
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Live Shopping Checklist Progress */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Shopping List Progress
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {purchasedCount} of {req.items.length} bought ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Items Checklist Display */}
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 pt-1">
            {req.items.map(item => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                      item.isPurchased
                        ? 'bg-emerald-600 text-white'
                        : item.isUnavailable
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                        : 'border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {item.isPurchased && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {item.isUnavailable && <span className="text-[10px] font-bold">✕</span>}
                  </div>
                  <div>
                    <span className={`font-semibold ${item.isPurchased ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {item.name} ({item.quantity})
                    </span>
                    {item.substituteNote && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400">
                        Substituted: {item.substituteNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    <NigerianCurrency amount={item.actualPriceNaira || item.estimatedPriceNaira || 0} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Controls for testing lifecycle */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Demo State Stepper (Test Lifecycle)
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleAdvanceStatus('SHOPPING')}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-[11px] font-medium"
            >
              Set: Shopping
            </button>
            <button
              onClick={() => handleAdvanceStatus('PURCHASED')}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-[11px] font-medium"
            >
              Set: Purchased
            </button>
            <button
              onClick={() => handleAdvanceStatus('ON_THE_WAY')}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-[11px] font-medium"
            >
              Set: On The Way
            </button>
            <button
              onClick={() => handleAdvanceStatus('COMPLETED')}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold"
            >
              Mark Completed
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Phone Call Dialog */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-slate-900 text-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-slate-800 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold">{req.assignedHelperName}</h3>
              <p className="text-xs text-slate-400 mt-1">{req.assignedHelperPhone}</p>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-2">Calling via ShopLink VoIP Masking...</span>
            </div>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
