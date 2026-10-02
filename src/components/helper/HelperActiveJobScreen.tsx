import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { MapSimulation } from '../common/MapSimulation';
import { shoppingRequestRepository } from '../../services/mock/MockServices';
import {
  CheckCircle2,
  XCircle,
  MessageCircle,
  Phone,
  Bike,
  MapPin,
  Clock,
  ShieldCheck,
  Receipt,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { ShoppingListItem } from '../../types';

export const HelperActiveJobScreen: React.FC = () => {
  const {
    activeShoppingRequest,
    setActiveShoppingRequest,
    openChatWith,
    showSnackbar,
    navigateTo
  } = useApp();

  const [verifyPin, setVerifyPin] = useState('');
  const [substituteModalItem, setSubstituteModalItem] = useState<ShoppingListItem | null>(null);
  const [substituteText, setSubstituteText] = useState('');

  if (!activeShoppingRequest) {
    return (
      <div className="flex flex-col min-h-full pb-20">
        <AndroidTopAppBar title="Active Run" showLocation={false} />
        <div className="my-auto py-16 text-center px-4 space-y-3">
          <Bike className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Active Run Assigned
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Check the available requests board to accept a new market run.
          </p>
          <button
            onClick={() => navigateTo('HELPER_DASHBOARD')}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            View Available Requests
          </button>
        </div>
      </div>
    );
  }

  const req = activeShoppingRequest;

  const handleTogglePurchased = async (item: ShoppingListItem) => {
    try {
      const updated = await shoppingRequestRepository.updateListItem(req.id, item.id, {
        isPurchased: !item.isPurchased,
        actualPriceNaira: item.actualPriceNaira || item.estimatedPriceNaira || 5000
      });
      setActiveShoppingRequest(updated);
      showSnackbar(`Updated ${item.name}`);
    } catch {
      showSnackbar('Failed to update item');
    }
  };

  const handleMarkUnavailable = async (item: ShoppingListItem) => {
    try {
      const updated = await shoppingRequestRepository.updateListItem(req.id, item.id, {
        isUnavailable: true,
        isPurchased: false
      });
      setActiveShoppingRequest(updated);
      showSnackbar(`Marked ${item.name} as unavailable`);
    } catch {
      showSnackbar('Failed to update item');
    }
  };

  const handleSaveSubstitute = async () => {
    if (!substituteModalItem || !substituteText.trim()) return;
    try {
      const updated = await shoppingRequestRepository.updateListItem(req.id, substituteModalItem.id, {
        substituteNote: substituteText.trim(),
        isPurchased: true
      });
      setActiveShoppingRequest(updated);
      setSubstituteModalItem(null);
      setSubstituteText('');
      showSnackbar('Substitute item noted for shopper');
    } catch {
      showSnackbar('Failed to save substitute');
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    try {
      const updated = await shoppingRequestRepository.updateRequestStatus(req.id, newStatus);
      setActiveShoppingRequest(updated);
      showSnackbar(`Status advanced to ${newStatus.replace('_', ' ')}`);
    } catch {
      showSnackbar('Failed to update status');
    }
  };

  const handleDeliveryVerification = async () => {
    if (!verifyPin.trim()) {
      showSnackbar('Please enter 4-digit code provided by shopper');
      return;
    }

    const success = await shoppingRequestRepository.verifyAndDeliver(req.id, verifyPin.trim());
    if (success) {
      const updated = await shoppingRequestRepository.getRequestById(req.id);
      setActiveShoppingRequest(updated);
      showSnackbar('Delivery verified! ₦' + req.helperFeeNaira.toLocaleString() + ' added to your earnings.');
      navigateTo('HELPER_EARNINGS');
    } else {
      showSnackbar('Invalid code. Please check with the shopper (Hint: 4829)');
    }
  };

  const purchasedCount = req.items.filter(i => i.isPurchased).length;
  const progressPercent = Math.round((purchasedCount / req.items.length) * 100);

  return (
    <div className="flex flex-col min-h-full pb-24">
      <AndroidTopAppBar title="Active Run Checklist" showLocation={false} />

      <div className="px-4 py-3 space-y-4">
        {/* Navigation & Live Map */}
        <MapSimulation
          shopperLocation={req.deliveryAddress.fullAddress}
          helperLocation="Currently inside Mile 12 / Ikeja Market"
          storeLocation={req.targetMarketArea}
          distanceKm={2.4}
          estimatedEtaMinutes={12}
          showRoute={true}
        />

        {/* Shopper Card & Contact */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              {req.shopperName[0]}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {req.shopperName}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {req.deliveryAddress.area} · {req.shopperPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                openChatWith({
                  id: req.shopperId,
                  name: req.shopperName,
                  role: 'SHOPPER',
                  requestId: req.id
                })
              }
              className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs active:scale-95 transition"
              title="Chat with Shopper"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Header */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Items Checklist ({purchasedCount}/{req.items.length})
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {progressPercent}% complete
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist of Items */}
        <div className="space-y-2">
          {req.items.map(item => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition space-y-2 ${
                item.isPurchased
                  ? 'border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : item.isUnavailable
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20'
                  : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className={`text-xs font-bold ${item.isPurchased ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.name} — <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.quantity}</span>
                  </h4>
                  {item.preferredBrand && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Brand: {item.preferredBrand}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5">
                      Shopper note: {item.notes}
                    </p>
                  )}
                  {item.substituteNote && (
                    <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">
                      Substituted with: {item.substituteNote}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                    <NigerianCurrency amount={item.actualPriceNaira || item.estimatedPriceNaira || 0} />
                  </span>
                </div>
              </div>

              {/* Action buttons per item */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTogglePurchased(item)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    item.isPurchased
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.isPurchased ? 'Purchased' : 'Mark Bought'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSubstituteModalItem(item);
                      setSubstituteText('');
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Substitute
                  </button>
                  <button
                    onClick={() => handleMarkUnavailable(item)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 transition"
                    title="Mark unavailable"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Phase Stepper Controls */}
        <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            Run Phase Actions
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleStatusChange('SHOPPING')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                req.status === 'SHOPPING' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              1. At Market (Shopping)
            </button>
            <button
              onClick={() => handleStatusChange('PURCHASED')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                req.status === 'PURCHASED' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              2. Items Paid (Checkout)
            </button>
          </div>

          <button
            onClick={() => handleStatusChange('ON_THE_WAY')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              req.status === 'ON_THE_WAY' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" /> 3. On The Way to Delivery Address
          </button>
        </div>

        {/* Final Handshake: Delivery PIN Verification */}
        <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Confirm Delivery with Shopper
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            Ask the shopper for their 4-digit verification code to complete this trip and credit your ₦{req.helperFeeNaira.toLocaleString()} fee.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              maxLength={4}
              value={verifyPin}
              onChange={e => setVerifyPin(e.target.value)}
              placeholder="e.g. 4829"
              className="w-32 px-3 py-2 text-center text-sm font-mono font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleDeliveryVerification}
              className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-98"
            >
              Verify PIN & Complete
            </button>
          </div>
        </div>
      </div>

      {/* Substitute Note Modal */}
      {substituteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-3 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Propose Substitute Item
            </h3>
            <p className="text-xs text-slate-500">
              For: <strong className="text-slate-800 dark:text-slate-200">{substituteModalItem.name}</strong>
            </p>
            <textarea
              value={substituteText}
              onChange={e => setSubstituteText(e.target.value)}
              placeholder="e.g. Only 5kg bag available at ₦7,500, bought with shopper approval"
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setSubstituteModalItem(null)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSubstitute}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
