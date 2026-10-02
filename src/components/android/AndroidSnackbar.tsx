import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const AndroidSnackbar: React.FC = () => {
  const { snackbar, closeSnackbar } = useApp();

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        closeSnackbar();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open, closeSnackbar]);

  if (!snackbar.open) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-sm w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <span className="text-xs font-medium leading-snug line-clamp-2">
          {snackbar.message}
        </span>
        {snackbar.actionLabel && (
          <button
            onClick={() => {
              if (snackbar.onAction) snackbar.onAction();
              closeSnackbar();
            }}
            className="text-xs font-bold text-emerald-400 dark:text-emerald-600 hover:underline uppercase tracking-wider shrink-0 px-1 py-0.5"
          >
            {snackbar.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
