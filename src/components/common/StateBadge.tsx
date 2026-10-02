import React from 'react';
import { ShoppingRequestStatus, OrderStatus, UserStatus } from '../../types';

interface StateBadgeProps {
  status: ShoppingRequestStatus | OrderStatus | UserStatus | 'NORMAL' | 'HIGH' | 'URGENT';
  size?: 'sm' | 'md';
}

export const StateBadge: React.FC<StateBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const getStatusConfig = () => {
    switch (status) {
      // Shopping Request statuses
      case 'CREATED':
      case 'PENDING_ASSIGNMENT':
      case 'PENDING':
        return { label: 'Pending Assignment', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' };
      case 'HELPER_ASSIGNED':
        return { label: 'Helper Assigned', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800' };
      case 'ACCEPTED':
      case 'CONFIRMED':
        return { label: 'Accepted', color: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' };
      case 'SHOPPING':
      case 'PROCESSING':
        return { label: 'Shopping in Progress', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' };
      case 'PURCHASED':
      case 'READY_FOR_PICKUP':
        return { label: 'Items Purchased', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' };
      case 'ON_THE_WAY':
      case 'OUT_FOR_DELIVERY':
        return { label: 'On The Way', color: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800' };
      case 'DELIVERED':
        return { label: 'Delivered', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' };
      case 'COMPLETED':
      case 'ACTIVE':
        return { label: 'Completed', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' };
      case 'REJECTED':
      case 'CANCELLED':
      case 'SUSPENDED':
        return { label: status === 'SUSPENDED' ? 'Suspended' : 'Cancelled', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' };
      case 'EXPIRED':
        return { label: 'Expired', color: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
      case 'PENDING_APPROVAL':
        return { label: 'Pending Verification', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' };
      case 'URGENT':
        return { label: 'Urgent', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' };
      case 'HIGH':
        return { label: 'High Priority', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' };
      case 'NORMAL':
      default:
        return { label: 'Standard', color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${sizeClasses} ${config.color} whitespace-nowrap`}>
      {config.label}
    </span>
  );
};
