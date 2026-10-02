import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NigerianCurrency } from './NigerianCurrency';
import {
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  ShieldCheck,
  ScanFace,
  Sparkles
} from 'lucide-react';

export interface BiometricPromptOptions {
  isOpen: boolean;
  title: string;
  subtitle: string;
  amountNaira?: number;
  actionType?: 'SIGN_IN' | 'PAYMENT' | 'PAYOUT' | 'SECURITY';
  onSuccess: () => void;
  onCancel?: () => void;
  onUsePin?: () => void;
}

export const AndroidBiometricPrompt: React.FC<BiometricPromptOptions> = ({
  isOpen,
  title,
  subtitle,
  amountNaira,
  actionType = 'SECURITY',
  onSuccess,
  onCancel,
  onUsePin
}) => {
  const { isDarkMode } = useApp();
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('IDLE');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setStatus('SCANNING');
    setErrorMessage('');

    setTimeout(() => {
      // 95% success simulation
      setStatus('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1100);
  };

  const handleTriggerError = () => {
    setStatus('ERROR');
    setErrorMessage('Biometrics not recognized. Please adjust your finger and press firmly.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm sm:rounded-3xl rounded-t-[32px] p-6 shadow-2xl border transition-all duration-300 animate-in slide-in-from-bottom-6 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Android Material 3 Drag Handle (Mobile) */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Top Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                ShopLink Biometric Security
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle & Monetary amount if payment */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          {subtitle}
        </p>

        {amountNaira && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Escrow Authorization
            </span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              <NigerianCurrency amount={amountNaira} />
            </span>
          </div>
        )}

        {/* Central Fingerprint Scanner Animation */}
        <div className="my-6 flex flex-col items-center justify-center space-y-3">
          <div
            onClick={handleSimulateScan}
            className="relative cursor-pointer group select-none active:scale-95 transition"
            title="Touch to verify with fingerprint"
          >
            {/* Animated Radiating Rings */}
            {status === 'SCANNING' && (
              <>
                <div className="absolute inset-0 -m-3 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="absolute inset-0 -m-6 rounded-full bg-emerald-500/10 animate-pulse" />
              </>
            )}

            {/* Fingerprint Sensor Circle */}
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                status === 'SUCCESS'
                  ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                  : status === 'ERROR'
                  ? 'bg-rose-500 text-white shadow-rose-500/30 animate-shake'
                  : status === 'SCANNING'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/40 hover:border-emerald-500 hover:shadow-emerald-500/20'
              }`}
            >
              {status === 'SUCCESS' ? (
                <CheckCircle2 className="w-12 h-12 stroke-[2.5] animate-in zoom-in-75 duration-200" />
              ) : status === 'ERROR' ? (
                <AlertCircle className="w-12 h-12 stroke-[2.5]" />
              ) : (
                <Fingerprint className="w-12 h-12 stroke-[1.8] group-hover:scale-110 transition duration-200" />
              )}
            </div>
          </div>

          {/* Status Label */}
          <div className="text-center">
            {status === 'SCANNING' && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Verifying Fingerprint / Face...
              </span>
            )}
            {status === 'SUCCESS' && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified! Processing authorization...
              </span>
            )}
            {status === 'ERROR' && (
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
              </span>
            )}
            {status === 'IDLE' && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Touch sensor to confirm
              </span>
            )}
          </div>
        </div>

        {/* Alternative Actions / PIN Fallback */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onUsePin || onCancel}
            className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 font-semibold"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Use PIN Instead</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateScan}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs active:scale-95 transition"
          >
            Authorize
          </button>
        </div>
      </div>
    </div>
  );
};
