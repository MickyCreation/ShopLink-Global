import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { SellerUser } from '../../types';
import {
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  Plus,
  Store,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Bike,
  Sparkles,
  Shield,
  ShieldCheck,
  FileCheck,
  Edit3,
  X,
  Send,
  AlertCircle
} from 'lucide-react';

export const SellerDashboardScreen: React.FC = () => {
  const {
    currentUser,
    products,
    navigateTo,
    activeOrder,
    isMergedSellerHelper,
    toggleSellerHelperWorkspace,
    applyForHelperAccount,
    openKycModal,
    openProfileEditModal
  } = useApp();

  const sellerUser = currentUser as SellerUser | null;
  const helperStatus = sellerUser?.helperApplicationStatus || 'NONE';

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState<'Motorcycle' | 'Bicycle' | 'Car' | 'Walking'>('Motorcycle');
  const [serviceAreas, setServiceAreas] = useState('Ikeja, Allen Avenue, Opebi, Maryland');
  const [ninNumber, setNinNumber] = useState('NIN-8492019481');
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const areas = serviceAreas.split(',').map(s => s.trim()).filter(Boolean);
      const success = await applyForHelperAccount({
        vehicleType,
        serviceAreas: areas.length ? areas : ['Ikeja', 'Allen Avenue'],
        ninOrIdNumber: ninNumber
      });
      if (success) {
        setIsApplyModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const sellerProducts = products.filter(p => p.sellerId === currentUser?.id || p.sellerName.includes('Basirat') || p.sellerName.includes('Chinedu'));
  const lowStockCount = sellerProducts.filter(p => p.stockQuantity < 20).length;

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Seller Merchant Hub" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
        {/* Store Greeting & Status */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-base shadow-xs">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {(currentUser as any)?.storeName || 'Basirat Super Provisions'}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {(currentUser as any)?.storeAddress || '14 Allen Avenue, Ikeja'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Store Open & Accepting Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Merchant KYC & CAC Verification Security Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Merchant Security & CAC Registration (KYC)
                </span>
                <span className="text-[10px] text-slate-400">
                  Required under Nigerian commercial regulations for instant marketplace escrow settlements
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
                ? 'CAC Verified Merchant'
                : currentUser?.kyc?.status === 'UNDER_REVIEW'
                ? 'KYC Under Review'
                : 'KYC Action Required'}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {currentUser?.kyc?.status === 'VERIFIED'
              ? `Your corporate affairs registration (${currentUser?.kyc?.idNumber || 'CAC-Verified'}) and merchant profile are verified. Escrow payments automatically clear directly to your business account.`
              : currentUser?.kyc?.status === 'UNDER_REVIEW'
              ? `Your business documents (${currentUser?.kyc?.documentFileName || 'CAC Certificate'}) and BVN (${currentUser?.kyc?.bvn ? '•••• ' + currentUser.kyc.bvn.slice(-4) : 'Pending'}) are currently under administrative review.`
              : 'Submit your Corporate Affairs Commission (CAC) business certificate or NIN and update your store profile to enable automated escrow payouts and verified seller badges.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/80">
            <button
              onClick={openKycModal}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>
                {currentUser?.kyc?.status === 'VERIFIED'
                  ? 'View / Update KYC Record'
                  : currentUser?.kyc?.status === 'UNDER_REVIEW'
                  ? 'View Submitted Documents'
                  : 'Submit CAC / NIN for KYC'}
              </span>
            </button>

            <button
              onClick={openProfileEditModal}
              className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Update Store Profile</span>
            </button>
          </div>
        </div>

        {/* Dual Account / Shopping Helper Expansion Card */}
        {isMergedSellerHelper ? (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-emerald-950/50 border border-emerald-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">
                    Merged Seller & Helper Account Active
                  </h3>
                  <span className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                    Approved by Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Both your store sales and market shopping delivery runs are merged under one login.
                </p>
              </div>
            </div>
            <button
              onClick={toggleSellerHelperWorkspace}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <Bike className="w-4 h-4" />
              <span>Switch to Helper Workspace 🛵</span>
            </button>
          </div>
        ) : helperStatus === 'PENDING' ? (
          <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Helper Application Pending Administrator Review
                </h3>
                <span className="text-[9px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold px-1.5 py-0.5 rounded">
                  Pending Approval
                </span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-0.5">
                Your application to expand your seller account into a Shopping Helper is currently with the platform administrator. Once approved, your account will be merged with dual privileges under this single login.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-3xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Want to Earn More? Apply for Shopping Helper Account
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
                  As a registered Seller, you can also apply to run shopping errands and fulfill market deliveries. After administrator approval, both your seller and helper accounts will merge into one login!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply for Helper Account</span>
            </button>
          </div>
        )}

        {/* Sales & Orders Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Sales</span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              <NigerianCurrency amount={58200} />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">8 orders fulfilled</span>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Products</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {sellerProducts.length}
            </div>
            <span className="text-[10px] text-emerald-600 mt-1 block">All listed in Ikeja</span>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Stock Alert</span>
            <div className="text-xl font-extrabold text-amber-500 mt-1 tabular-nums flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              {lowStockCount}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Requires restocking</span>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Orders</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              1
            </div>
            <span className="text-[10px] text-emerald-600 mt-1 block">Needs preparation</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigateTo('SELLER_PRODUCTS')}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
          <button
            onClick={() => navigateTo('SELLER_ORDERS')}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Clock className="w-4 h-4 text-emerald-600" /> Manage Orders
          </button>
        </div>

        {/* Active Incoming Order Preview */}
        {activeOrder && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Incoming Order
              </span>
              <StateBadge status={activeOrder.status} size="sm" />
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">{activeOrder.shopperName}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{activeOrder.deliveryAddress.fullAddress}</p>
              <div className="mt-2 space-y-1">
                {activeOrder.items.map(i => (
                  <div key={i.productId} className="flex justify-between text-[11px]">
                    <span>{i.productName} x {i.quantity}</span>
                    <NigerianCurrency amount={i.price * i.quantity} />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                <NigerianCurrency amount={activeOrder.totalNaira} />
              </span>
              <button
                onClick={() => navigateTo('SELLER_ORDERS')}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                Open Order <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Modal: Apply for Shopping Helper Account */}
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Apply for Shopping Helper Account
                  </h3>
                  <p className="text-xs text-slate-500">
                    Expand {sellerUser?.storeName || 'your store'} with dual helper courier privileges
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Admin Approval & Account Merge Policy</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Upon submission, your application will be routed to the <strong>Platform Administrator</strong>. After approval, your seller account and helper account will be merged under your single login, giving you one-tap workspace switching.
                </p>
              </div>

              <form onSubmit={handleApply} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Delivery Vehicle / Transport
                  </label>
                  <select
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Motorcycle">Motorcycle (Okada / Dispatch Bike)</option>
                    <option value="Bicycle">Bicycle / E-Bike</option>
                    <option value="Car">Car / Delivery Van</option>
                    <option value="Walking">Walking / Within Local Market Perimeter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operating Coverage Areas in Nigeria
                  </label>
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={e => setServiceAreas(e.target.value)}
                    placeholder="e.g. Ikeja GRA, Allen, Maryland, Opebi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Separate areas by commas</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    National Identity (NIN) or CAC Registration Number
                  </label>
                  <input
                    type="text"
                    value={ninNumber}
                    onChange={e => setNinNumber(e.target.value)}
                    placeholder="e.g. NIN-12345678901"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Application to Administrator'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
