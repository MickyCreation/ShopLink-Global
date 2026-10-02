import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';
import {
  Home,
  Search,
  ShoppingCart,
  Clock,
  User,
  Package,
  Layers,
  DollarSign,
  Store,
  Compass,
  Bike,
  ShieldCheck,
  Users,
  Settings,
  ClipboardList
} from 'lucide-react';

export const AndroidBottomNav: React.FC = () => {
  const { userRole, currentScreen, navigateTo, cartCount, templateType } = useApp();

  interface NavItem {
    id: ScreenType;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }

  const getNavItems = (): NavItem[] => {
    switch (userRole) {
      case 'SHOPPER':
        return [
          { id: 'SHOPPER_HOME', label: 'Home', icon: Home },
          { id: 'SHOPPER_EXPLORE', label: 'Explore', icon: Search },
          { id: 'SHOPPER_CREATE_LIST', label: 'Shopping List', icon: ClipboardList },
          { id: 'SHOPPER_CART', label: 'Cart', icon: ShoppingCart, badge: cartCount },
          { id: 'SHOPPER_ORDERS', label: 'Orders', icon: Clock },
          { id: 'SHOPPER_PROFILE', label: 'Profile', icon: User }
        ];

      case 'SELLER':
        return [
          { id: 'SELLER_DASHBOARD', label: 'Dashboard', icon: Home },
          { id: 'SELLER_PRODUCTS', label: 'Products', icon: Package },
          { id: 'SELLER_ORDERS', label: 'Orders', icon: Clock },
          { id: 'SELLER_EARNINGS', label: 'Sales', icon: DollarSign },
          { id: 'SELLER_PROFILE', label: 'Store', icon: Store }
        ];

      case 'SHOPPING_HELPER':
        return [
          { id: 'HELPER_DASHBOARD', label: 'Requests', icon: Compass },
          { id: 'HELPER_ACTIVE_JOB', label: 'Active Run', icon: Bike },
          { id: 'HELPER_EARNINGS', label: 'Earnings', icon: DollarSign },
          { id: 'HELPER_PROFILE', label: 'Profile', icon: User }
        ];

      case 'SUB_ADMIN':
        return [
          { id: 'SUBADMIN_DASHBOARD', label: 'Ops Hub', icon: Home },
          { id: 'SUBADMIN_REQUESTS', label: 'Requests', icon: Layers },
          { id: 'SUBADMIN_HELPERS', label: 'Helpers', icon: Bike },
          { id: 'SETTINGS', label: 'Settings', icon: Settings }
        ];

      case 'ADMIN':
        return [
          { id: 'ADMIN_DASHBOARD', label: 'Overview', icon: ShieldCheck },
          { id: 'ADMIN_USERS', label: 'Users', icon: Users },
          { id: 'ADMIN_REQUESTS', label: 'Requests', icon: Layers },
          { id: 'ADMIN_TRANSACTIONS', label: 'Finance', icon: DollarSign },
          { id: 'ADMIN_SETTINGS', label: 'Config', icon: Settings }
        ];
    }
  };

  const items = getNavItems();

  return (
    <nav className={`sticky bottom-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around transition-colors ${
      templateType === 'responsive' ? 'md:hidden' : ''
    }`}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;

        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center justify-center min-w-[48px] py-1 px-1 rounded-2xl transition-all duration-200 active:scale-95 group ${
              isActive
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator */}
            <div
              className={`relative px-3.5 py-1 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 shadow-xs'
                  : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              {Boolean(item.badge && item.badge > 0) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[64px]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
