import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MapPin,
  ChevronDown,
  ArrowLeft,
  Search
} from 'lucide-react';

interface AndroidTopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLocation?: boolean;
  showSearch?: boolean;
  onSearchClick?: () => void;
  actions?: React.ReactNode;
}

export const AndroidTopAppBar: React.FC<AndroidTopAppBarProps> = ({
  title,
  showBack = false,
  onBack,
  showLocation = true,
  showSearch = false,
  onSearchClick,
  actions
}) => {
  const {
    currentUser,
    userRole,
    currentLocationArea,
    setIsLocationModalOpen,
    unreadNotificationCount,
    navigateTo,
    switchRole,
    showSnackbar,
    templateType
  } = useApp();

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
  };

  // If in responsive template mode and this is just the default home header without back button, hide on desktop
  const isRedundantOnDesktop = templateType === 'responsive' && !showBack && !title;

  return (
    <header className={`sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 py-2.5 flex items-center justify-between transition-colors select-none ${
      isRedundantOnDesktop ? 'md:hidden' : ''
    }`}>
      {/* Left Slot: Back or Logo */}
      <div className="flex items-center gap-2 min-w-0">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div
            onClick={handleHeaderTap}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition"
            title="Triple tap for Admin Access"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              SL
            </div>
          </div>
        )}

        {/* Title or Location selector */}
        {title ? (
          <h1
            onClick={handleHeaderTap}
            className="text-base font-bold text-slate-900 dark:text-white truncate tracking-tight cursor-pointer active:opacity-80 transition"
            title="Triple tap for Admin Access"
          >
            {title}
          </h1>
        ) : showLocation ? (
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex flex-col text-left active:opacity-75 transition truncate cursor-pointer"
          >
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-500" /> Deliver to
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 truncate">
              <span className="truncate max-w-[130px]">{currentLocationArea}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </span>
          </button>
        ) : (
          <span
            onClick={handleHeaderTap}
            className="text-base font-bold text-slate-900 dark:text-white tracking-tight cursor-pointer active:opacity-80 transition"
            title="Triple tap for Admin Access"
          >
            ShopLink
          </span>
        )}
      </div>

      {/* Right Slot: Actions, Search, Notifications, Role Chip */}
      <div className="flex items-center gap-1.5 shrink-0">
        {showSearch && (
          <button
            onClick={onSearchClick}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95 transition cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => navigateTo('NOTIFICATIONS')}
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95 transition cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {actions}
      </div>
    </header>
  );
};
