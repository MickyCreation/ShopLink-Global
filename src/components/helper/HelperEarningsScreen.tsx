import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { MOCK_TRANSACTIONS } from '../../services/mock/mockData';
import {
  DollarSign,
  TrendingUp,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Award,
  Fingerprint
} from 'lucide-react';

export const HelperEarningsScreen: React.FC = () => {
  const { showSnackbar, requestBiometricAuth } = useApp();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [bankAccount, setBankAccount] = useState('GTBank · 0123456789');

  const availableBalance = 42800;

  const handleWithdraw = () => {
    requestBiometricAuth({
      title: 'Authorize Payout Withdrawal',
      subtitle: `Authenticate with your fingerprint or face to transfer ₦${availableBalance.toLocaleString()} to ${bankAccount}`,
      amountNaira: availableBalance,
      actionType: 'PAYOUT',
      onSuccess: () => {
        setIsWithdrawing(true);
        setTimeout(() => {
          setIsWithdrawing(false);
          showSnackbar('₦' + availableBalance.toLocaleString() + ' withdrawal authorized via biometrics & sent to ' + bankAccount);
        }, 1200);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Helper Earnings & Payouts" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
        {/* Total Balance Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg shadow-emerald-950/20 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 block">
              Available For Immediate Cashout
            </span>
            <div className="text-3xl font-black tracking-tight mt-1">
              <NigerianCurrency amount={availableBalance} />
            </div>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
            <span>Linked Account: {bankAccount}</span>
            <span className="font-semibold text-white">Instant NIP</span>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="w-full py-3 bg-white text-emerald-900 rounded-2xl font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-2 hover:bg-emerald-50 cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 text-emerald-700" />
            {isWithdrawing ? 'Processing Biometric Transfer...' : 'Withdraw with Biometrics'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">All-Time Earnings</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              <NigerianCurrency amount={382500} />
            </span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
              +14% vs last week
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Customer Rating</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                4.9 / 5.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              218 verified runs
            </span>
          </div>
        </div>

        {/* Settlement & Banking Settings */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" /> Settlement Bank
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
              Verified
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs">
            <p className="font-bold text-slate-900 dark:text-white">
              Guaranty Trust Bank (GTBank)
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 font-mono">
              Account No: 0123456789 · Babatunde Ojo
            </p>
          </div>
        </div>

        {/* Recent Payout History */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
            Recent Shopping Trip Payouts
          </span>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {[
              { id: '1', title: 'Mile 12 Market Run (Micah)', fee: 3500, date: 'Today, 06:45 AM', tip: 500 },
              { id: '2', title: 'Surulere Fresh Fish Run', fee: 3200, date: 'Yesterday, 04:20 PM', tip: 1000 },
              { id: '3', title: 'Ikeja Supermarket Restock', fee: 2800, date: '28 Sep 2026', tip: 0 },
              { id: '4', title: 'Oyingbo Market Spices', fee: 4000, date: '27 Sep 2026', tip: 800 }
            ].map(p => (
              <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    {p.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {p.date} {p.tip > 0 && `· +₦${p.tip} shopper tip`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    <NigerianCurrency amount={p.fee + p.tip} />
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Settled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
