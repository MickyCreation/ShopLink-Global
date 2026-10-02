import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { shoppingRequestRepository } from '../../services/mock/MockServices';
import { ShoppingRequest } from '../../types';
import {
  Layers,
  Bike,
  UserCheck,
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Phone,
  ShieldAlert,
  ArrowRight,
  Filter
} from 'lucide-react';

export const SubAdminDashboardScreen: React.FC = () => {
  const { openChatWith, showSnackbar, setActiveShoppingRequest, navigateTo } = useApp();

  const [requests, setRequests] = useState<ShoppingRequest[]>([]);
  const [selectedReqForAssign, setSelectedReqForAssign] = useState<ShoppingRequest | null>(null);

  // Available Helpers ranked by proximity, rating, and workload
  const availableHelpers = [
    {
      id: 'user_helper_01',
      name: 'Babatunde "Tunde" Ojo',
      phone: '+234 814 987 6543',
      rating: 4.9,
      vehicle: 'Motorcycle',
      distanceKm: 1.2,
      etaMins: 8,
      workload: 0,
      area: 'Ikeja / Maryland'
    },
    {
      id: 'user_helper_02',
      name: 'Emeka Sunday',
      phone: '+234 812 555 6677',
      rating: 4.8,
      vehicle: 'Motorcycle',
      distanceKm: 2.1,
      etaMins: 14,
      workload: 1,
      area: 'Opebi / Allen'
    },
    {
      id: 'user_helper_03',
      name: 'Akinwunmi Adeleke',
      phone: '+234 803 999 1234',
      rating: 4.7,
      vehicle: 'Bicycle / Runner',
      distanceKm: 3.4,
      etaMins: 22,
      workload: 0,
      area: 'Alausa / Ikeja Mall'
    }
  ];

  const loadRequests = async () => {
    const list = await shoppingRequestRepository.getRequests();
    setRequests(list);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAssign = async (reqId: string, helperId: string, helperName: string) => {
    try {
      const updated = await shoppingRequestRepository.assignHelper(reqId, helperId, helperName);
      setSelectedReqForAssign(null);
      showSnackbar(`Assigned ${helperName} to Request ${reqId}`);
      await loadRequests();
    } catch {
      showSnackbar('Error assigning helper');
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Regional Operations Center" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
        {/* Zone Header */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Lagos Mainland Operations Zone
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
              Live Monitor
            </span>
          </div>
          <h2 className="text-sm font-extrabold">Ikeja, Maryland, Opebi & Alausa Sector</h2>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Active Runs</span>
              <span className="font-bold text-white tabular-nums">
                {requests.filter(r => ['ACCEPTED', 'SHOPPING', 'PURCHASED', 'ON_THE_WAY'].includes(r.status)).length}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Pending Assign</span>
              <span className="font-bold text-amber-400 tabular-nums">
                {requests.filter(r => r.status === 'PENDING_ASSIGNMENT').length}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Active Helpers</span>
              <span className="font-bold text-emerald-400 tabular-nums">3 Online</span>
            </div>
          </div>
        </div>

        {/* Requests requiring assignment or dispatch */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Market Shopping Runs ({requests.length})
            </span>
            <span className="text-[11px] text-slate-400">Ranked by Priority</span>
          </div>

          <div className="space-y-3">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {req.id}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {req.title}
                    </h3>
                  </div>
                  <StateBadge status={req.status} size="sm" />
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Shopper: <strong>{req.shopperName}</strong> ({req.shopperPhone})</span>
                    <span>Budget: <strong><NigerianCurrency amount={req.estimatedBudgetNaira} /></strong></span>
                  </div>
                  <p className="text-slate-400">
                    Location: {req.targetMarketArea} → {req.deliveryAddress.area}
                  </p>
                  <p className="text-slate-500">
                    Assigned Helper: <strong>{req.assignedHelperName || 'None (Awaiting Dispatch)'}</strong>
                  </p>
                </div>

                {/* Sub-Admin Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        openChatWith({
                          id: req.shopperId,
                          name: req.shopperName,
                          role: 'SHOPPER',
                          requestId: req.id
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Shopper
                    </button>
                    {req.assignedHelperId && (
                      <button
                        onClick={() =>
                          openChatWith({
                            id: req.assignedHelperId!,
                            name: req.assignedHelperName || 'Helper',
                            role: 'SHOPPING_HELPER',
                            requestId: req.id
                          })
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Helper
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedReqForAssign(req)}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                  >
                    {req.assignedHelperId ? 'Reassign Helper' : 'Assign Helper'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Helper Bottom Sheet */}
      {selectedReqForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Dispatch Helper
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select ranked runner for {selectedReqForAssign.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedReqForAssign(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {availableHelpers.map(helper => (
                <div
                  key={helper.id}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {helper.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {helper.vehicle} · {helper.area}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-500">
                        ★ {helper.rating}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {helper.distanceKm} km ({helper.etaMins}m ETA)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAssign(selectedReqForAssign.id, helper.id, helper.name)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    Confirm Assignment
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
