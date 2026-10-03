import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { MOCK_CATEGORIES } from '../../services/mock/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Plus,
  Bike,
  Store,
  Star,
  ShieldCheck,
  MapPin,
  MessageSquare,
  ShoppingBag,
  ExternalLink,
  ClipboardList,
  Banknote,
  Car,
  Laptop,
  Smartphone,
  Tv
} from 'lucide-react';
import { Product } from '../../types';

interface PricePreset {
  id: string;
  label: string;
  sublabel: string;
  min: number | null;
  max: number | null;
}

const PRICE_PRESETS: PricePreset[] = [
  { id: 'under_50k', label: 'Under ₦50k', sublabel: 'Foodstuffs & Groceries', min: null, max: 50000 },
  { id: 'smartphones', label: '₦50k – ₦1M', sublabel: 'Smartphones & Gadgets', min: 50000, max: 1000000 },
  { id: 'electronics', label: '₦150k – ₦3M', sublabel: 'Laptops, TVs & Electronics', min: 150000, max: 3000000 },
  { id: 'commercial_tech', label: '₦3M – ₦10M', sublabel: 'Solar Systems & Equipment', min: 3000000, max: 10000000 },
  { id: 'vehicles', label: '₦1M – ₦25M+', sublabel: 'Vehicles, Tokunbo & Autos', min: 1000000, max: 25000000 }
];

export const ShopperExploreScreen: React.FC = () => {
  const {
    products,
    setSelectedProductForDetail,
    addToCart,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    availableHelpers,
    openHelperProfile,
    openChatWith,
    navigateTo
  } = useApp();

  const [viewMode, setViewMode] = useState<'PRODUCTS' | 'HELPERS'>('PRODUCTS');
  const [helperFilter, setHelperFilter] = useState<'ALL' | 'SELLERS_ONLY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Range-based Price Filter States
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [activePricePreset, setActivePricePreset] = useState<string | null>(null);
  const [minInputVal, setMinInputVal] = useState<string>('');
  const [maxInputVal, setMaxInputVal] = useState<string>('');
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  const categories = ['All', ...MOCK_CATEGORIES.map(c => c.name)];

  const handleApplyPreset = (preset: PricePreset) => {
    if (activePricePreset === preset.id) {
      setActivePricePreset(null);
      setMinPrice(null);
      setMaxPrice(null);
      setMinInputVal('');
      setMaxInputVal('');
    } else {
      setActivePricePreset(preset.id);
      setMinPrice(preset.min);
      setMaxPrice(preset.max);
      setMinInputVal(preset.min !== null ? preset.min.toString() : '');
      setMaxInputVal(preset.max !== null ? preset.max.toString() : '');
    }
  };

  const handleCustomMinChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setMinInputVal(cleaned);
    setActivePricePreset(null);
    setMinPrice(cleaned ? parseInt(cleaned, 10) : null);
  };

  const handleCustomMaxChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setMaxInputVal(cleaned);
    setActivePricePreset(null);
    setMaxPrice(cleaned ? parseInt(cleaned, 10) : null);
  };

  const clearPriceFilter = () => {
    setMinPrice(null);
    setMaxPrice(null);
    setMinInputVal('');
    setMaxInputVal('');
    setActivePricePreset(null);
    setShowCustomInputs(false);
  };

  const isPriceFilterActive = minPrice !== null || maxPrice !== null;

  const getActivePriceLabel = () => {
    if (minPrice !== null && maxPrice !== null) {
      return `₦${minPrice.toLocaleString()} – ₦${maxPrice.toLocaleString()}`;
    }
    if (minPrice !== null) {
      return `From ₦${minPrice.toLocaleString()}`;
    }
    if (maxPrice !== null) {
      return `Up to ₦${maxPrice.toLocaleString()}`;
    }
    return null;
  };

  const helpersWhoAreSellers = useMemo(() => {
    return availableHelpers.filter(h => h.isSeller);
  }, [availableHelpers]);

  const filteredHelpers = useMemo(() => {
    return availableHelpers.filter(h => {
      const matchesFilter = helperFilter === 'ALL' || h.isSeller;
      const matchesQuery =
        !searchQuery.trim() ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.serviceAreas && h.serviceAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (h.sellerStoreName && h.sellerStoreName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.sellerStoreAddress && h.sellerStoreAddress.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesQuery;
    });
  }, [availableHelpers, helperFilter, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategoryFilter === 'All' || p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
      const matchesQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !inStockOnly || (p.isAvailable && p.stockQuantity > 0);
      const matchesMinPrice = minPrice === null || p.price >= minPrice;
      const matchesMaxPrice = maxPrice === null || p.price <= maxPrice;
      return matchesCategory && matchesQuery && matchesStock && matchesMinPrice && matchesMaxPrice;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.sellerRating || 0) - (a.sellerRating || 0);
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [products, selectedCategoryFilter, searchQuery, inStockOnly, sortBy, minPrice, maxPrice]);

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Explore Nigerian Marketplace" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4">
        {/* VIEW MODE TABS: Products vs Couriers & Helpers */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setViewMode('PRODUCTS')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'PRODUCTS'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Products & Services ({filteredProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('HELPERS')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'HELPERS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Couriers & Helpers ({availableHelpers.length})</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                viewMode === 'PRODUCTS'
                  ? 'Search gadgets, laptops, vehicles, fashion, services, groceries...'
                  : 'Search helpers by name, vehicle, or area (e.g. Opebi, Computer Village)...'
              }
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {viewMode === 'PRODUCTS' && (
            <button
              onClick={() => setShowFilterDrawer(prev => !prev)}
              className={`p-2.5 rounded-2xl border transition relative ${
                showFilterDrawer || inStockOnly || sortBy !== 'popularity' || isPriceFilterActive
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Filter and Sort"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {isPriceFilterActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          )}
        </div>

        {/* Filter Drawer / Expanded controls */}
        {showFilterDrawer && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3.5 text-xs animate-in slide-in-from-top-2 duration-150">
            {/* Sort Options */}
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5 uppercase tracking-wider text-[11px]">
                Sort by:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'popularity', label: 'Popular' },
                  { id: 'price_asc', label: 'Price: Low to High' },
                  { id: 'price_desc', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Top Rated Sellers' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-2.5 py-1 rounded-xl font-medium transition cursor-pointer ${
                      sortBy === s.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RANGE-BASED PRICE FILTER SECTION */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Price Range (₦)</span>
                </span>
                {isPriceFilterActive && (
                  <button
                    type="button"
                    onClick={clearPriceFilter}
                    className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Reset Price
                  </button>
                )}
              </div>

              {/* Quick Presets tailored for Nigerian Marketplace */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {PRICE_PRESETS.map(preset => {
                  const isSelected = activePricePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-2 rounded-xl text-left border transition active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-600'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-extrabold block text-[11px] leading-tight">
                        {preset.label}
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate mt-0.5">
                        {preset.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Min / Max numeric inputs */}
              <div className="pt-1">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Or set custom range:
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-slate-400">
                      ₦
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={minInputVal ? parseInt(minInputVal, 10).toLocaleString() : ''}
                      onChange={e => handleCustomMinChange(e.target.value)}
                      placeholder="Min (e.g. 500,000)"
                      className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <span className="text-slate-400 text-xs font-bold">–</span>

                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-slate-400">
                      ₦
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={maxInputVal ? parseInt(maxInputVal, 10).toLocaleString() : ''}
                      onChange={e => handleCustomMaxChange(e.target.value)}
                      placeholder="Max (e.g. 15,000,000)"
                      className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                In Stock Items Only
              </label>

              <button
                type="button"
                onClick={() => {
                  setSortBy('popularity');
                  setInStockOnly(false);
                  setSelectedCategoryFilter('All');
                  setSearchQuery('');
                  clearPriceFilter();
                }}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: COURIERS & HELPERS TAB (WITH DUAL MERCHANT FILTER) */}
        {/* ======================================================== */}
        {viewMode === 'HELPERS' ? (
          <div className="space-y-4">
            {/* Helper Sub-Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setHelperFilter('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  helperFilter === 'ALL'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>All Couriers ({availableHelpers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setHelperFilter('SELLERS_ONLY')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  helperFilter === 'SELLERS_ONLY'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>🏪 Helpers Who Are Sellers ({helpersWhoAreSellers.length})</span>
              </button>
            </div>

            {/* Helper Description Banner */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-[11px] text-indigo-900 dark:text-indigo-200">
                  {helperFilter === 'SELLERS_ONLY'
                    ? 'Showing verified Couriers who also operate registered retail storefronts across Nigerian markets. You can send them for pickup runs or buy directly from their stalls.'
                    : 'Showing all active platform shopping helpers and couriers available for store pickups, market procurement, and express runs.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('SHOPPER_ORDERS')}
                className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition shrink-0 active:scale-95 cursor-pointer"
              >
                Pickup an Order
              </button>
            </div>

            {/* Helpers List / Grid */}
            {filteredHelpers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredHelpers.map(helper => (
                  <div
                    key={helper.id}
                    className={`p-4 rounded-3xl border transition flex flex-col justify-between ${
                      helper.isSeller
                        ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800/80 shadow-xs hover:border-indigo-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Header Profile Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={helper.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={helper.name}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {helper.name}
                              </h4>
                              <div className="flex items-center text-xs font-bold text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                                {helper.rating}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Bike className="w-3 h-3 text-emerald-600" />
                                {helper.vehicleType}
                              </span>
                              <span>·</span>
                              <span>{helper.completedJobsCount} trips completed</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                          Online
                        </span>
                      </div>

                      {/* DUAL IDENTITY SPOTLIGHT: Helper who is also a Seller */}
                      {helper.isSeller && (
                        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-50 dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300">
                              <Store className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>{helper.sellerStoreName}</span>
                            </span>
                            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded-sm">
                              Verified Seller & Helper
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                            {helper.sellerStoreDescription || 'Wholesale and retail storefront with expedited courier dispatch.'}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-500" />
                              {helper.sellerStoreAddress}
                            </span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              ★ {helper.sellerRating || 4.9} Store Rating
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Service Coverage Tags */}
                      {helper.serviceAreas && helper.serviceAreas.length > 0 && (
                        <div className="mt-2.5 flex items-center gap-1 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-medium">Areas:</span>
                          {helper.serviceAreas.map((area, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openHelperProfile(helper)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          View Bio
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openChatWith({
                              id: helper.id,
                              name: helper.name,
                              role: 'SHOPPING_HELPER'
                            })
                          }
                          className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          Chat
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {helper.isSeller && (
                          <button
                            type="button"
                            onClick={() => {
                              if (helper.sellerCategory) {
                                setSelectedCategoryFilter(helper.sellerCategory);
                              } else {
                                setSelectedCategoryFilter('All');
                              }
                              setViewMode('PRODUCTS');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
                          >
                            Browse Store
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => navigateTo('SHOPPER_ORDERS')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Send on Pickup</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <Bike className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No couriers found
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try searching with another name or reset the helper filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setHelperFilter('ALL');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold transition"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: PRODUCTS & SERVICES TAB */
          /* ======================================================== */
          <div className="space-y-4">
            {/* Category Scrollable Tab List */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => {
                const isSelected = selectedCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* RANGE-BASED PRICE FILTER FOR HIGH-VALUE ITEMS (VEHICLES, ELECTRONICS) & MARKET STAPLES */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                      Price Range Filter
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Narrow down vehicles, electronics, tech or set custom ₦ budget
                    </span>
                  </div>
                </div>

                {isPriceFilterActive && (
                  <button
                    type="button"
                    onClick={clearPriceFilter}
                    className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <X className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Quick Range Presets Tailored for High-Value Searches */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {PRICE_PRESETS.map(preset => {
                  const isSelected = activePricePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span className={`text-[10px] font-normal opacity-80 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        ({preset.sublabel.split('&')[0].trim()})
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setShowCustomInputs(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    showCustomInputs || (isPriceFilterActive && !activePricePreset)
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Custom Range</span>
                </button>
              </div>

              {/* Custom Min / Max Inputs and Range Slider */}
              {(showCustomInputs || (isPriceFilterActive && !activePricePreset)) && (
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/80 space-y-2.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Minimum Price (₦)
                      </span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          ₦
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={minInputVal ? parseInt(minInputVal, 10).toLocaleString() : ''}
                          onChange={e => handleCustomMinChange(e.target.value)}
                          placeholder="e.g. 500,000 (Electronics)"
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Maximum Price (₦)
                      </span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          ₦
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={maxInputVal ? parseInt(maxInputVal, 10).toLocaleString() : ''}
                          onChange={e => handleCustomMaxChange(e.target.value)}
                          placeholder="e.g. 20,000,000 (Vehicles)"
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Range Slider for fast dragging between ₦0 and ₦25,000,000 */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
                      <span>₦0</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {maxPrice !== null ? `Max Price: ₦${maxPrice.toLocaleString()}` : 'No Upper Price Cap'}
                      </span>
                      <span>₦25,000,000+ (Vehicles)</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25000000}
                      step={250000}
                      value={maxPrice !== null ? maxPrice : 25000000}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        if (val >= 25000000) {
                          handleCustomMaxChange('');
                        } else {
                          handleCustomMaxChange(val.toString());
                        }
                      }}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Active Filters Display */}
            {isPriceFilterActive && (
              <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                <span className="text-slate-400 text-[11px] font-semibold">Price Filter:</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-bold shadow-2xs">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{getActivePriceLabel()}</span>
                  <button
                    type="button"
                    onClick={clearPriceFilter}
                    className="p-0.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-600 dark:text-emerald-400 cursor-pointer ml-0.5"
                    title="Remove price filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={clearPriceFilter}
                  className="text-[11px] text-slate-500 hover:text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Price
                </button>
              </div>
            )}

            {/* Product Count & Active Filters Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
              <span>{filteredProducts.length} Nigerian products found</span>
              {selectedCategoryFilter !== 'All' && (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  In: {selectedCategoryFilter}
                </span>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pt-1">
                {filteredProducts.map(product => {
                  const sellerIsHelper = availableHelpers.some(
                    h =>
                      h.isSeller &&
                      (h.name.toLowerCase().includes(product.sellerName.toLowerCase()) ||
                        product.sellerName.toLowerCase().includes(h.name.toLowerCase()) ||
                        (h.sellerStoreName && h.sellerStoreName.toLowerCase().includes(product.sellerName.toLowerCase())))
                  );

                  return (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                    >
                      {/* Image and Badges */}
                      <div
                        onClick={() => setSelectedProductForDetail(product)}
                        className="relative w-full h-32 bg-slate-100 dark:bg-slate-700/50 cursor-pointer overflow-hidden"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                          {product.unit}
                        </div>
                        {sellerIsHelper && (
                          <div className="absolute bottom-2 left-2 bg-indigo-900/90 backdrop-blur-xs text-amber-300 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <Bike className="w-2.5 h-2.5" />
                            <span>Seller is Courier</span>
                          </div>
                        )}
                      </div>

                      {/* Info & Add to Cart button */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div
                          onClick={() => setSelectedProductForDetail(product)}
                          className="cursor-pointer"
                        >
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                            {product.sellerName} · {product.sellerLocation}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
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

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              addToCart(product, 1);
                            }}
                            className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition active:scale-95 shadow-xs"
                            title="Add to cart"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No products found
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isPriceFilterActive
                    ? `No items found ${searchQuery ? `for "${searchQuery}" ` : ''}within ${getActivePriceLabel()}. Try adjusting or resetting your price range.`
                    : `We couldn't find any products matching "${searchQuery}". Try searching for iPhones, laptops, Toyota, Agbada, solar systems, or groceries.`}
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                  {isPriceFilterActive && (
                    <button
                      type="button"
                      onClick={clearPriceFilter}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      Reset Price Range
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryFilter('All');
                      clearPriceFilter();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
