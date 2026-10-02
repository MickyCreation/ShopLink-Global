import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { HERO_BANNER_IMAGE, MOCK_CATEGORIES } from '../../services/mock/mockData';
import {
  Search,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Store,
  Bike,
  Star,
  ChevronRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Clock,
  Edit3,
  Smartphone,
  Laptop,
  Car,
  Shirt,
  Wrench,
  ShoppingBag,
  Tv
} from 'lucide-react';
import { Product } from '../../types';

export const ShopperHomeScreen: React.FC = () => {
  const {
    currentUser,
    products,
    setSelectedProductForDetail,
    activeShoppingRequest,
    navigateTo,
    navigateToCategory,
    setIsLocationModalOpen,
    openKycModal,
    openProfileEditModal,
    availableHelpers,
    openHelperProfile
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Car': return <Car className="w-4 h-4" />;
      case 'Shirt': return <Shirt className="w-4 h-4" />;
      case 'Wrench': return <Wrench className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'Tv': return <Tv className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const featuredProducts = products.filter(p => p.featured || p.popular).slice(0, 6);

  const nearbyStores = [
    { id: 's1', name: 'Basirat Super Provisions', area: 'Allen Ave, Ikeja', rating: 4.8, distance: '1.2 km', open: true },
    { id: 's2', name: 'Ebeano Supermarket', area: 'GRA Ikeja', rating: 4.9, distance: '2.1 km', open: true },
    { id: 's3', name: 'Mile 12 Produce Depot', area: 'Ketu / Mile 12', rating: 4.7, distance: '4.8 km', open: true }
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProductForDetail(product);
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top App Bar with location selector and notifications */}
      <AndroidTopAppBar showLocation={true} />

      {/* Main Home Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
        {/* User Greeting & Header (shown on mobile, or when top app bar is hidden) */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Welcome to ShopLink Nigeria 🇳🇬
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good day, {currentUser?.name.split(' ')[0] || 'Micah'} 👋
            </h1>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Change Location"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Change Area</span>
          </button>
        </div>

        {/* Search Bar Input (shown on mobile) */}
        <div
          onClick={() => navigateTo('SHOPPER_EXPLORE')}
          className="md:hidden relative flex items-center bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-3.5 py-3 shadow-xs cursor-pointer hover:border-emerald-500 transition group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition mr-2.5 shrink-0" />
          <span className="text-xs text-slate-400 dark:text-slate-500 select-none truncate">
            Search iPhones, laptops, cars, agbada, groceries, repairs...
          </span>
          <span className="ml-auto text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-md">
            Lagos
          </span>
        </div>

        {/* Active Shopping Request or Order Live Tracker Card (if active) */}
        {activeShoppingRequest && (
          <div
            onClick={() => navigateTo('SHOPPER_TRACKING')}
            className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/20 cursor-pointer active:scale-98 transition relative overflow-hidden"
          >
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 animate-bounce" /> Active Shopping Run
              </span>
              <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold">
                {activeShoppingRequest.status.replace('_', ' ')}
              </span>
            </div>

            <h3 className="font-bold text-sm tracking-tight line-clamp-1">
              {activeShoppingRequest.title}
            </h3>

            <p className="text-xs text-emerald-100 mt-1 line-clamp-1">
              Helper: {activeShoppingRequest.assignedHelperName || 'Assigning nearest helper...'}
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs">
              <span className="font-bold">
                <NigerianCurrency amount={activeShoppingRequest.estimatedBudgetNaira} /> est.
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-100 hover:text-white">
                Track Live <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* KNOW YOUR CUSTOMER (KYC) & SECURITY IMPLEMENTATION CARD */}
        {currentUser?.kyc?.status !== 'VERIFIED' ? (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-500/30 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  {currentUser?.kyc?.status === 'UNDER_REVIEW' ? (
                    <Clock className="w-5 h-5 animate-pulse text-amber-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      SECURITY IMPLEMENTATION · CBN AML COMPLIANT
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        currentUser?.kyc?.status === 'UNDER_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {currentUser?.kyc?.status === 'UNDER_REVIEW'
                        ? 'Documents Under Review'
                        : 'KYC Action Required'}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mt-1">
                    {currentUser?.kyc?.status === 'UNDER_REVIEW'
                      ? 'Identity Verification in Progress'
                      : 'Submit ID & Update Profile for KYC Verification'}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {currentUser?.kyc?.status === 'UNDER_REVIEW'
                      ? `Your ${currentUser?.kyc?.idType?.replace(/_/g, ' ') || 'ID document'} is currently being verified by platform compliance. You will be notified once Tier 2 status is unlocked.`
                      : 'Under Nigerian banking and consumer protection standards, submit your National ID (NIN, Driver’s License, Passport, or Voter’s Card) and update your profile to guarantee delivery escrow protection and seamless shopping.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
              <button
                onClick={openKycModal}
                className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>
                  {currentUser?.kyc?.status === 'UNDER_REVIEW'
                    ? 'View / Update Submitted Documents'
                    : 'Submit Government ID (NIN/Card)'}
                </span>
              </button>

              <button
                onClick={openProfileEditModal}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Update Profile Details</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-1.5 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                Verified Citizen: KYC Tier 2 Protected (NIN / National ID on File)
              </span>
            </div>
            <button
              onClick={openKycModal}
              className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              View Record
            </button>
          </div>
        )}

        {/* Promotional Banner with authentic Lagos market asset */}
        <div className="relative w-full h-36 rounded-3xl overflow-hidden shadow-md group">
          <img
            src={HERO_BANNER_IMAGE}
            alt="Lagos Fresh Market"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-center text-white">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Personal Shopping Assistance
            </span>
            <h2 className="text-base font-extrabold max-w-[200px] leading-tight mt-1">
              Send a Shopping Helper to Any Lagos Market
            </h2>
            <div className="mt-2.5">
              <button
                onClick={() => navigateTo('SHOPPER_CREATE_LIST')}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
              >
                <ClipboardList className="w-3.5 h-3.5" /> Create Shopping List
              </button>
            </div>
          </div>
        </div>

        {/* Shopping Categories */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Categories
            </span>
            <button
              onClick={() => navigateToCategory('All')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {MOCK_CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat.id}
                onClick={() => navigateToCategory(cat.name)}
                className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:shadow-xs transition active:scale-95 group"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mb-1 group-hover:scale-110 transition`}>
                  {renderCategoryIcon(cat.iconName)}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Nigerian Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Popular Nigerian Market Essentials
              </span>
            </div>
            <button
              onClick={() => navigateTo('SHOPPER_EXPLORE')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All ({products.length})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer active:scale-98 flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-700/50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                    {product.unit}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                      {product.sellerName}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        <NigerianCurrency amount={product.price} />
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          <NigerianCurrency amount={product.originalPrice} />
                        </span>
                      )}
                    </div>
                    <span className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs hover:bg-emerald-600 hover:text-white transition">
                      +
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Section on Desktop: Nearby Stores & Nearby Helpers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Nearby Stores in Nigerian Area */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-600" /> Nearby Stores & Supermarkets
                </span>
                <span className="text-xs text-slate-500 font-medium">Ikeja / Maryland</span>
              </div>

              <div className="space-y-2.5">
                {nearbyStores.map(store => (
                  <div
                    key={store.id}
                    onClick={() => navigateTo('SHOPPER_EXPLORE')}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:border-emerald-500 transition cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {store.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {store.area} · <span className="text-emerald-600 font-semibold">{store.distance}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {store.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigateTo('SHOPPER_EXPLORE')}
              className="w-full mt-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
            >
              Browse All Local Stores
            </button>
          </div>

          {/* Nearby Shopping Helpers Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-emerald-600" /> Active Shopping Helpers Near You
                </span>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  {availableHelpers.length} Online
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Verified couriers ready to pick up goods from sellers, inspect items, and run market procurement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableHelpers.slice(0, 4).map(helper => (
                  <div
                    key={helper.id}
                    onClick={() => openHelperProfile(helper)}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer active:scale-98 flex flex-col justify-between group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={helper.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={helper.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 transition">
                            {helper.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {helper.vehicleType} · {helper.completedJobsCount} runs
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-xs font-bold text-amber-500 shrink-0">
                        <Star className="w-3 h-3 fill-current mr-0.5" /> {helper.rating}
                      </div>
                    </div>

                    {/* DUAL IDENTITY INDICATOR: Helper who is also a Seller */}
                    {helper.isSeller && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-1 text-[10px]">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300 truncate">
                          <Store className="w-3 h-3 shrink-0 text-indigo-600 dark:text-indigo-400" />
                          <span className="truncate">{helper.sellerStoreName}</span>
                        </span>
                        <span className="px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-extrabold text-[9px] rounded-sm shrink-0 border border-indigo-200 dark:border-indigo-800/40">
                          Seller & Helper
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => navigateTo('SHOPPER_CREATE_LIST')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
              >
                <Bike className="w-3.5 h-3.5" /> Hire for Shopping Run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
