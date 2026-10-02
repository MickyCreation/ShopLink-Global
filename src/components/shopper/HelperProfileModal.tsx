import React from 'react';
import { useApp } from '../../context/AppContext';
import { AvailableHelper } from '../../types';
import {
  X,
  Star,
  Bike,
  MapPin,
  ShieldCheck,
  Store,
  Phone,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';

export const HelperProfileModal: React.FC = () => {
  const {
    selectedHelperForDetail,
    isHelperProfileModalOpen,
    setIsHelperProfileModalOpen,
    openChatWith,
    navigateTo,
    setSelectedCategoryFilter
  } = useApp();

  if (!isHelperProfileModalOpen || !selectedHelperForDetail) return null;

  const helper = selectedHelperForDetail;

  const handleChat = () => {
    setIsHelperProfileModalOpen(false);
    openChatWith({
      id: helper.id,
      name: helper.name,
      role: 'SHOPPING_HELPER'
    });
  };

  const handleHireForRun = () => {
    setIsHelperProfileModalOpen(false);
    navigateTo('SHOPPER_CREATE_LIST');
  };

  const handleBrowseStore = () => {
    setIsHelperProfileModalOpen(false);
    if (helper.sellerCategory) {
      setSelectedCategoryFilter(helper.sellerCategory);
    } else {
      setSelectedCategoryFilter('All');
    }
    navigateTo('SHOPPER_EXPLORE');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setIsHelperProfileModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white">
          <button
            onClick={() => setIsHelperProfileModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={helper.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={helper.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold tracking-tight truncate">
                  {helper.name}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-emerald-100 mt-1">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-current" /> {helper.rating}
                </span>
                <span>·</span>
                <span>{helper.completedJobsCount} runs completed</span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  <Bike className="w-3 h-3" /> {helper.vehicleType}
                </span>

                {helper.isSeller && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                    <Store className="w-3 h-3 text-slate-950" /> Verified Merchant & Helper
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Identity & Verification Tier */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  ShopLink Verified Identity (KYC Tier 2)
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  National ID (NIN) & Verified Driver Credentials on File
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
              Active
            </span>
          </div>

          {/* DUAL ACCOUNT PROMINENT SECTION: Helper is also a Seller */}
          {helper.isSeller && (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-800 border border-indigo-200 dark:border-indigo-800/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        Dual Merchant & Courier Hub
                      </span>
                      <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded-sm">
                        Physical Storefront
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {helper.sellerStoreName || 'Commercial Storefront'}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                  <Star className="w-3 h-3 fill-current" /> {helper.sellerRating || 4.9}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {helper.sellerStoreDescription ||
                  'Operates a physical marketplace retail store and provides fast courier and pickup services for shoppers across Lagos.'}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="font-semibold">{helper.sellerStoreAddress || 'Ikeja / Opebi, Lagos'}</span>
              </div>

              <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  You can order goods directly from their store, or send them to pick up from other sellers!
                </span>
                <button
                  type="button"
                  onClick={handleBrowseStore}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Browse Store</span>
                </button>
              </div>
            </div>
          )}

          {/* Operational Service Areas */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Service Areas & Coverage
            </span>
            <div className="flex flex-wrap gap-1.5">
              {helper.serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-medium flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Dispatch Quick Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Contact Phone</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> {helper.phone}
              </span>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Vehicle Transport</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <Bike className="w-3.5 h-3.5 text-emerald-600" /> {helper.vehicleType}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleChat}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Chat In-App</span>
          </button>

          <button
            type="button"
            onClick={handleHireForRun}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-900/10 active:scale-95 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Hire for Shopping Run</span>
          </button>
        </div>
      </div>
    </div>
  );
};
