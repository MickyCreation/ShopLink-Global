import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { shoppingRequestRepository } from '../../services/mock/MockServices';
import { ShoppingRequest } from '../../types';
import {
  Compass,
  Bike,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  ShieldCheck,
  FileCheck,
  Edit3,
  AlertCircle,
  Power
} from 'lucide-react';

export const HelperDashboardScreen: React.FC = () => {
  const {
    currentUser,
    activeShoppingRequest,
    setActiveShoppingRequest,
    navigateTo,
    showSnackbar,
    openKycModal,
    openProfileEditModal
  } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [availableRequests, setAvailableRequests] = useState<ShoppingRequest[]>([]);
  const [selectedRequestForModal, setSelectedRequestForModal] = useState<ShoppingRequest | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      const all = await shoppingRequestRepository.getRequests();
      // Available requests are PENDING_ASSIGNMENT or CREATED
      const available = all.filter(r => ['PENDING_ASSIGNMENT', 'CREATED'].includes(r.status));
      setAvailableRequests(available);
    };
    loadRequests();
  }, []);

  const handleAcceptRequest = async (req: ShoppingRequest) => {
    try {
      const updated = await shoppingRequestRepository.acceptRequest(
        req.id,
        currentUser?.id || 'user_helper_01'
      );
      setActiveShoppingRequest(updated);
      showSnackbar(`You accepted ${req.title}! Ready to start shopping.`);
      setSelectedRequestForModal(null);
      navigateTo('HELPER_ACTIVE_JOB');
    } catch {
      showSnackbar('Failed to accept request');
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Helper Terminal" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
        {/* Availability Online/Offline Bar */}
        <div className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
          isOnline
            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
            <div>
              <h2 className="text-xs font-bold leading-tight">
                {isOnline ? 'You Are Online & Available' : 'You Are Currently Offline'}
              </h2>
              <p className={`text-[11px] ${isOnline ? 'text-emerald-100' : 'text-slate-400'}`}>
                {isOnline ? 'Receiving shopping requests in Ikeja / Maryland' : 'Turn on to receive nearby market tasks'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOnline(prev => !prev);
              showSnackbar(isOnline ? 'Status changed to Offline' : 'Status changed to Online');
            }}
            className={`p-2.5 rounded-2xl transition active:scale-95 shadow-xs ${
              isOnline ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'
            }`}
            title="Toggle Status"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>

        {/* Courier Identity & Driver's License (KYC) Security Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Courier Identity & FRSC License (KYC)
                </span>
                <span className="text-[10px] text-slate-400">
                  Required to accept high-value grocery runs and activate instant wallet withdrawals
                </span>
              </div>
            </div>

            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                currentUser?.kyc?.status === 'VERIFIED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : currentUser?.kyc?.status === 'UNDER_REVIEW'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}
            >
              {currentUser?.kyc?.status === 'VERIFIED'
                ? 'Verified Courier'
                : currentUser?.kyc?.status === 'UNDER_REVIEW'
                ? 'License Under Review'
                : 'Action Required'}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {currentUser?.kyc?.status === 'VERIFIED'
              ? `Your Driver's License / NIN (${currentUser?.kyc?.idNumber || 'Verified'}) and courier profile are verified. You are authorized to accept high-priority market runs.`
              : 'Submit your FRSC Driver’s License, National ID (NIN), or Voter’s Card and update your courier profile (transit vehicle & service zones) for dispatch clearance.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/80">
            <button
              onClick={openKycModal}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>
                {currentUser?.kyc?.status === 'VERIFIED'
                  ? 'View / Update Courier License'
                  : 'Submit ID for Verification'}
              </span>
            </button>

            <button
              onClick={openProfileEditModal}
              className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Update Vehicle & Zones</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Today's Payout</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              ₦14,500
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Trips Done</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
              218
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Rating</span>
            <span className="text-sm font-extrabold text-amber-500 tabular-nums">
              ★ 4.9
            </span>
          </div>
        </div>

        {/* Active In-Progress Task Banner (if any) */}
        {activeShoppingRequest && ['ACCEPTED', 'SHOPPING', 'PURCHASED', 'ON_THE_WAY'].includes(activeShoppingRequest.status) && (
          <div
            onClick={() => navigateTo('HELPER_ACTIVE_JOB')}
            className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-700 shadow-lg cursor-pointer hover:border-emerald-500 transition active:scale-98 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 animate-bounce" /> Current Active Job
              </span>
              <StateBadge status={activeShoppingRequest.status} size="sm" />
            </div>

            <h3 className="text-xs font-bold text-white">
              {activeShoppingRequest.title}
            </h3>

            <p className="text-[11px] text-slate-300">
              Shopper: {activeShoppingRequest.shopperName} ({activeShoppingRequest.deliveryAddress.area})
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                Helper Fee: <NigerianCurrency amount={activeShoppingRequest.helperFeeNaira} />
              </span>
              <span className="text-xs font-semibold text-white flex items-center gap-1">
                Open Checklist <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* Available Market Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600" /> Nearby Shopping Requests ({availableRequests.length})
            </span>
            <span className="text-[11px] text-slate-400">Auto-refresh active</span>
          </div>

          {availableRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {req.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {req.title}
                    </h4>
                  </div>
                  <StateBadge status={req.priority} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-750 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{req.targetMarketArea}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>~25-40 mins</span>
                  </div>
                  <div>
                    <span>Items: <strong className="text-slate-800 dark:text-slate-200">{req.items.length} items</strong></span>
                  </div>
                  <div>
                    <span>Est. Budget: <strong className="text-slate-800 dark:text-slate-200"><NigerianCurrency amount={req.estimatedBudgetNaira} /></strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Your Helper Fee</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      <NigerianCurrency amount={req.helperFeeNaira} />
                    </span>
                  </div>

                  <button
                    onClick={() => handleAcceptRequest(req)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition flex items-center gap-1.5"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 space-y-2">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No new requests in your immediate zone
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Keep the app open and notification permissions enabled. When a shopper submits a list, it will appear here instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
