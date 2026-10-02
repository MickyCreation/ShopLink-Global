import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import {
  Bell,
  CheckCheck,
  Package,
  Bike,
  Megaphone,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationCenterScreen: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    setActiveShoppingRequest
  } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'ORDERS' | 'REQUESTS' | 'ANNOUNCEMENTS'>('ALL');

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'ORDER_UPDATE':
      case 'NEW_ORDER':
        return <Package className="w-4 h-4 text-sky-500" />;
      case 'SHOPPING_REQUEST':
      case 'HELPER_ASSIGNED':
      case 'HELPER_ACCEPTED':
      case 'SHOPPING_PROGRESS':
      case 'DELIVERY_APPROACHING':
        return <Bike className="w-4 h-4 text-emerald-500" />;
      case 'SECURITY_ALERT':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'ADMIN_ANNOUNCEMENT':
      default:
        return <Megaphone className="w-4 h-4 text-amber-500" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'ORDERS') return n.type.includes('ORDER');
    if (filter === 'REQUESTS') return n.type.includes('SHOPPING') || n.type.includes('HELPER');
    if (filter === 'ANNOUNCEMENTS') return n.type.includes('ANNOUNCEMENT') || n.type.includes('SECURITY');
    return true;
  });

  const handleNotificationClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.relatedId?.startsWith('REQ')) {
      navigateTo('SHOPPER_TRACKING');
    } else if (n.relatedId?.startsWith('ORD')) {
      navigateTo('SHOPPER_ORDERS');
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar
        title="Notification Center"
        showBack={true}
        onBack={() => navigateTo('SHOPPER_HOME')}
        showLocation={false}
      />

      <div className="px-4 py-3 space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {['ALL', 'REQUESTS', 'ORDERS', 'ANNOUNCEMENTS'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${
                  filter === tab
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tab.toLowerCase()}
              </button>
            ))}
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  item.isRead
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 opacity-80'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    {item.body}
                  </p>

                  {item.relatedId && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-flex items-center gap-0.5">
                      View details <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                )}
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No notifications in this filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
