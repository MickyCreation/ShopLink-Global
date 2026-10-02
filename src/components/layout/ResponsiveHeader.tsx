import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { NigerianCurrency } from '../common/NigerianCurrency';
import {
  MapPin,
  ChevronDown,
  Search,
  Bell,
  ShoppingCart,
  Sun,
  Moon,
  Store,
  Bike
} from 'lucide-react';

export const ResponsiveHeader: React.FC = () => {
  const {
    currentUser,
    userRole,
    currentScreen,
    navigateTo,
    switchRole,
    showSnackbar,
    cartCount,
    cartSubtotal,
    unreadNotificationCount,
    currentLocationArea,
    setIsLocationModalOpen,
    isDarkMode,
    toggleDarkMode,
    isMergedSellerHelper,
    activeWorkspace,
    toggleSellerHelperWorkspace
  } = useApp();

  const [searchFocused, setSearchFocused] = useState(false);

  // Triple-tap detection on header to unlock Administrator Dashboard
  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const tapTimeoutRef = useRef<any>(null);

  const handleHeaderTap = (e?: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 700) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapTimeRef.current = now;

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (currentUser?.role === 'SUB_ADMIN' || userRole === 'SUB_ADMIN') {
        navigateTo('SUBADMIN_DASHBOARD');
        showSnackbar(`⚡ Verified Regional Sub-Admin: ${currentUser?.name || 'Ngozi Eze'}`);
      } else {
        switchRole('ADMIN');
        navigateTo('ADMIN_DASHBOARD');
        showSnackbar(`🛡️ Verified Platform Administrator: ${currentUser?.name || 'Emeka Okonkwo'}`);
      }
      return;
    }

    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 800);

    // Default single tap navigates to user home screen
    navigateTo(userRole === 'SHOPPER' ? 'SHOPPER_HOME' : `${userRole}_DASHBOARD` as any);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors select-none">
      {/* Upper Utility Bar */}
      <div className="bg-slate-950 text-white px-4 lg:px-8 py-1.5 flex items-center justify-between gap-3 text-xs">
        <div
          onClick={handleHeaderTap}
          className="flex items-center gap-2 cursor-pointer group active:opacity-80 transition"
          title="Triple tap to unlock Administrator Console"
        >
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
            <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold shadow-xs">
              SL
            </span>
            <span className="group-hover:text-emerald-300 transition">ShopLink Nigeria</span>
            <span className="text-slate-400 font-normal text-[11px] hidden sm:inline">
              · Official Marketplace & Shopping Assistance Platform
            </span>
          </div>
        </div>

        {/* Theme Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Responsive Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Location */}
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <button
            onClick={handleHeaderTap}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            title="ShopLink Nigeria · Triple tap for Admin Access"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-emerald-600/20 group-hover:scale-105 active:scale-95 transition">
              SL
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-1.5">
                <span>ShopLink</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md font-semibold">
                  NG 🇳🇬
                </span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:block">
                Marketplace · Runners · Local
              </div>
            </div>
          </button>

          {/* Location Selector */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-left transition cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="truncate max-w-[150px] lg:max-w-[200px]">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 block leading-none">
                Deliver to
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                {currentLocationArea}
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </span>
            </div>
          </button>
        </div>

        {/* Global Search Bar (Shopper / General) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div
            onClick={() => navigateTo('SHOPPER_EXPLORE')}
            className={`flex items-center bg-slate-100 dark:bg-slate-800/80 border rounded-2xl px-3.5 py-2 cursor-pointer transition ${
              searchFocused
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-slate-800'
                : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <span className="text-xs text-slate-400 dark:text-slate-500 flex-1 truncate">
              Search Nigerian staples, rice, yam, palm oil, electronics...
            </span>
            <kbd className="hidden lg:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 font-mono">
              Explore
            </kbd>
          </div>
        </div>

        {/* Right Navigation & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications */}
          <button
            onClick={() => navigateTo('NOTIFICATIONS')}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Shopper Cart Button */}
          {userRole === 'SHOPPER' && (
            <button
              onClick={() => navigateTo('SHOPPER_CART')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100/70 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 active:scale-95 transition shadow-xs cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                {cartSubtotal > 0 ? <NigerianCurrency amount={cartSubtotal} /> : 'Cart'}
              </span>
            </button>
          )}

          {/* Merged Dual Workspace Toggle Button */}
          {isMergedSellerHelper && (
            <button
              onClick={toggleSellerHelperWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition cursor-pointer"
              title="Merged Account: Toggle between Seller Store Management and Helper Delivery Dispatch"
            >
              {activeWorkspace === 'SELLER' ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Store Mode</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium flex items-center gap-1">
                    Switch to Helper 🛵
                  </span>
                </>
              ) : (
                <>
                  <Bike className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Helper Mode</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium flex items-center gap-1">
                    Switch to Store 🏪
                  </span>
                </>
              )}
            </button>
          )}

          {/* User Profile Chip */}
          <button
            onClick={() => navigateTo(`${userRole}_PROFILE` as any)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-none">
                {currentUser?.name.split(' ')[0] || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 leading-none">
                {isMergedSellerHelper ? 'Seller + Helper (Merged)' : userRole.replace('_', ' ')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
