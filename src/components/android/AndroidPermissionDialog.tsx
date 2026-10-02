import React, { useState } from 'react';
import { MapPin, ShieldCheck, Check } from 'lucide-react';

interface AndroidPermissionDialogProps {
  isOpen: boolean;
  onGrant: (isPrecise: boolean) => void;
  onDeny: () => void;
  appName?: string;
}

export const AndroidPermissionDialog: React.FC<AndroidPermissionDialogProps> = ({
  isOpen,
  onGrant,
  onDeny,
  appName = 'ShopLink'
}) => {
  const [isPrecise, setIsPrecise] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim Scrim */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in" />

      {/* Android 14 Material Design Dialog Card */}
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl p-6 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Android Icon & Title */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
            Allow {appName} to access this device's location?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            ShopLink needs location to calculate delivery fees, locate nearby markets and match you with available Shopping Helpers in your area.
          </p>
        </div>

        {/* Precise vs Approximate Graphic Toggle */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setIsPrecise(true)}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
              isPrecise
                ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="relative w-8 h-8 rounded-full border border-current flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-current" />
              {isPrecise && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <span className="text-xs font-bold">Precise</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPrecise(false)}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
              !isPrecise
                ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="relative w-8 h-8 rounded-full border-2 border-dashed border-current flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-current/30" />
              {!isPrecise && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <span className="text-xs font-bold">Approximate</span>
          </button>
        </div>

        {/* Privacy reassurance note */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
            Exact coordinates are never exposed publicly.
          </span>
        </div>

        {/* Standard Android Button Stack */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onGrant(isPrecise)}
            className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition active:scale-98 shadow-sm"
          >
            While using the app
          </button>
          <button
            onClick={() => onGrant(isPrecise)}
            className="w-full py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs transition active:scale-98"
          >
            Only this time
          </button>
          <button
            onClick={onDeny}
            className="w-full py-2.5 px-4 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-medium text-xs transition active:scale-98"
          >
            Don't allow
          </button>
        </div>
      </div>
    </div>
  );
};
