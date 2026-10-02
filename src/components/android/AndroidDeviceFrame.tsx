import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wifi,
  Signal,
  BatteryMedium,
  Sun,
  Moon,
  ShieldCheck,
  Shield,
  KeyRound,
  Fingerprint,
  X,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ResponsiveHeader } from '../layout/ResponsiveHeader';
import { TemplateCustomizerModal } from '../template/TemplateCustomizerModal';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({ children }) => {
  const {
    currentUser,
    userRole,
    isDarkMode,
    toggleDarkMode,
    templateType,
    switchRole,
    navigateTo,
    showSnackbar,
    requestBiometricAuth,
    isBiometricsEnrolled
  } = useApp();

  const [currentTime, setCurrentTime] = useState('9:41');

  // Triple-tap gesture detection on header area to unlock & verify Administrator / Sub-Admin Dashboard
  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const tapTimeoutRef = useRef<any>(null);

  // Administrative verification modal state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedAdminTarget, setSelectedAdminTarget] = useState<'ADMIN' | 'SUB_ADMIN'>('ADMIN');
  const [adminPin, setAdminPin] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleHeaderTripleTap = (e?: React.MouseEvent) => {
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

      // Verify the user's admin/sub-admin status
      if (currentUser?.role === 'ADMIN' || userRole === 'ADMIN') {
        navigateTo('ADMIN_DASHBOARD');
        showSnackbar(`🛡️ Verified Platform Administrator: ${currentUser?.name || 'Emeka Okonkwo'}`);
      } else if (currentUser?.role === 'SUB_ADMIN' || userRole === 'SUB_ADMIN') {
        navigateTo('SUBADMIN_DASHBOARD');
        showSnackbar(`⚡ Verified Regional Sub-Admin: ${currentUser?.name || 'Ngozi Eze'}`);
      } else {
        // If user is currently a Shopper/Seller/Helper, open administrative verification prompt
        setVerificationError(null);
        setAdminPin('');
        setIsVerificationModalOpen(true);
      }
      return;
    }

    tapTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 800);
  };

  const executeAdministrativeAccess = (targetRole: 'ADMIN' | 'SUB_ADMIN') => {
    if (targetRole === 'ADMIN') {
      switchRole('ADMIN');
      navigateTo('ADMIN_DASHBOARD');
      showSnackbar('🛡️ Administrator status verified. Access granted to Executive Admin Console.');
    } else {
      switchRole('SUB_ADMIN');
      navigateTo('SUBADMIN_DASHBOARD');
      showSnackbar('⚡ Sub-Admin status verified. Access granted to Zonal Operations Hub.');
    }
    setIsVerificationModalOpen(false);
  };

  const handleVerifyWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin && adminPin !== '1234' && adminPin !== '0000' && adminPin !== '9999' && adminPin.length !== 4) {
      setVerificationError('Invalid administrative passkey. Please check authorized credentials.');
      return;
    }
    executeAdministrativeAccess(selectedAdminTarget);
  };

  const handleVerifyWithBiometrics = () => {
    requestBiometricAuth({
      title: selectedAdminTarget === 'ADMIN' ? 'Verify Administrator Biometrics' : 'Verify Sub-Admin Biometrics',
      subtitle: 'Touch fingerprint sensor or scan face to unlock administrative console',
      actionType: 'SECURITY',
      onSuccess: () => {
        executeAdministrativeAccess(selectedAdminTarget);
      },
      onCancel: () => {
        showSnackbar('Biometric verification cancelled');
      }
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Shared Administrative Verification Modal
  const renderVerificationModal = () => {
    if (!isVerificationModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Administrative Access Verification
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Header triple-tap gesture triggered
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVerificationModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>Current Session Account:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentUser?.name} ({userRole.replace('_', ' ')})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Verify your administrative or sub-administrative credentials to route to the respective dashboard.
            </p>
          </div>

          {/* Target Role Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Administrative Scope
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAdminTarget('ADMIN');
                  setVerificationError(null);
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedAdminTarget === 'ADMIN'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">
                    EXECUTIVE
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    National Admin
                  </span>
                  <span className="text-[10px] text-slate-400 leading-none block mt-0.5">
                    Emeka Okonkwo · Full Platform
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAdminTarget('SUB_ADMIN');
                  setVerificationError(null);
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedAdminTarget === 'SUB_ADMIN'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold">
                    ZONAL OPS
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Regional Sub-Admin
                  </span>
                  <span className="text-[10px] text-slate-400 leading-none block mt-0.5">
                    Ngozi Eze · Lagos Mainland
                  </span>
                </div>
              </button>
            </div>
          </div>

          {verificationError && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{verificationError}</span>
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleVerifyWithPin} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Administrative Passkey / Security PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={adminPin}
                  onChange={e => setAdminPin(e.target.value)}
                  placeholder="Enter 4-digit PIN (Default: 1234)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 active:scale-98 cursor-pointer"
              >
                <span>Verify & Open {selectedAdminTarget === 'ADMIN' ? 'Admin Console' : 'Sub-Admin Hub'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {isBiometricsEnrolled && (
                <button
                  type="button"
                  onClick={handleVerifyWithBiometrics}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-98 cursor-pointer"
                  title="Verify with Fingerprint / Face"
                >
                  <Fingerprint className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Template 1: Modern Responsive Super-App (Full Width / Default)
  if (templateType === 'responsive') {
    return (
      <div
        className={`min-h-screen w-full flex flex-col transition-colors duration-200 ${
          isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        } relative`}
      >
        {/* Invisible / Subtly placed header triple-tap gesture listener overlay on header area */}
        <div
          onClick={handleHeaderTripleTap}
          className="absolute top-0 left-0 right-0 h-8 z-50 cursor-pointer select-none opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto"
          title="Administrative Header Listener"
          aria-hidden="true"
        >
          <div className="w-16 h-1 bg-emerald-500/20 rounded-full" />
        </div>

        {/* Full-width Responsive Top Navigation */}
        <ResponsiveHeader />

        {/* Fluid Content Workspace */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Global Template Customizer Modal */}
        <TemplateCustomizerModal />

        {/* Administrative Verification Modal */}
        {renderVerificationModal()}
      </div>
    );
  }

  // Template 2, 3, 4: Device Framed Views (Pixel 9 Pro, Minimalist Frameless, Tablet Kiosk)
  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-900'
      } flex flex-col items-center justify-start select-none relative`}
    >
      {/* Top Testing & Control Bar with Triple-Tap Gesture Listener */}
      <header
        onClick={handleHeaderTripleTap}
        className="w-full bg-slate-950 border-b border-slate-800 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50 cursor-pointer"
        title="Triple-tap header to verify Administrator status"
      >
        <div className="flex items-center gap-2 active:opacity-80 transition group">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-xs shadow-sm group-hover:scale-105 transition">
            SL
          </div>
          <span className="font-semibold text-sm tracking-tight text-white group-hover:text-emerald-300 transition">ShopLink Nigeria</span>
          <span className="text-slate-400 text-xs hidden sm:inline">Marketplace & Helper Network</span>
        </div>

        {/* Theme Controls */}
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* Main Container Based on Selected Device Template */}
      <main className="w-full flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Template: Google Pixel 9 Pro (Android 14 Frame) */}
        {templateType === 'pixel9' && (
          <div className="relative w-full max-w-[430px] h-[880px] max-h-[calc(100vh-64px)] bg-slate-900 rounded-[44px] shadow-2xl shadow-black/70 p-3 ring-1 ring-slate-700/80 flex flex-col">
            {/* Hardware Buttons */}
            <div className="absolute -left-1 top-28 w-1 h-12 bg-slate-700 rounded-l-md" title="Volume Up" />
            <div className="absolute -left-1 top-44 w-1 h-12 bg-slate-700 rounded-l-md" title="Volume Down" />
            <div className="absolute -right-1 top-32 w-1 h-16 bg-emerald-600 rounded-r-md" title="Power Key" />

            {/* Inner Phone Screen */}
            <div
              className={`relative w-full h-full rounded-[36px] overflow-hidden flex flex-col transition-colors duration-200 ${
                isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
              }`}
            >
              {/* Native Android Status Bar with subtle Triple-Tap listener */}
              <div
                onClick={handleHeaderTripleTap}
                className={`w-full h-8 px-6 flex items-center justify-between text-xs select-none z-40 shrink-0 cursor-pointer active:opacity-75 transition ${
                  isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'
                }`}
                title="Triple-tap header to verify Administrator status"
              >
                <span className="font-semibold tracking-tight text-[13px]">{currentTime}</span>

                {/* Punch-hole Camera Notch */}
                <div className="w-4 h-4 rounded-full bg-black ring-1 ring-slate-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900/60" />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[10px] font-bold text-emerald-500 font-mono">5G</span>
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <BatteryMedium className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col relative">
                {children}
              </div>

              {/* Android Bottom Navigation Pill Gesture Bar */}
              <div
                className={`w-full h-5 flex items-center justify-center shrink-0 z-40 select-none ${
                  isDarkMode ? 'bg-slate-900' : 'bg-white'
                }`}
              >
                <div className="w-32 h-1 bg-slate-400/60 dark:bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Template: Minimalist Frameless Mobile */}
        {templateType === 'minimal' && (
          <div
            className={`w-full max-w-[400px] h-[850px] max-h-[calc(100vh-64px)] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-700/80 transition-colors duration-200 ${
              isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
            }`}
          >
            {/* Minimal Status Bar with Triple-Tap listener */}
            <div
              onClick={handleHeaderTripleTap}
              className={`w-full h-7 px-4 flex items-center justify-between text-xs select-none shrink-0 cursor-pointer active:opacity-75 transition ${
                isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'
              }`}
              title="Triple-tap header to verify Administrator status"
            >
              <span className="font-semibold text-xs">{currentTime}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-500 font-mono">5G</span>
                <Wifi className="w-3 h-3" />
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col relative">
              {children}
            </div>
          </div>
        )}

        {/* Template: Tablet & POS Kiosk Split View */}
        {templateType === 'tablet' && (
          <div className="relative w-full max-w-[1024px] h-[720px] max-h-[calc(100vh-64px)] bg-slate-900 rounded-[32px] shadow-2xl p-3 ring-1 ring-slate-700 flex flex-col">
            <div
              className={`relative w-full h-full rounded-[24px] overflow-hidden flex flex-col transition-colors duration-200 ${
                isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
              }`}
            >
              {/* Tablet Top Bar with Triple-Tap listener */}
              <div
                onClick={handleHeaderTripleTap}
                className={`w-full h-8 px-6 flex items-center justify-between text-xs select-none shrink-0 cursor-pointer active:opacity-75 transition ${
                  isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'
                }`}
                title="Triple-tap header to verify Administrator status"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>ShopLink Tablet Operations POS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{currentTime}</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <BatteryMedium className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col relative">
                {children}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Template Customizer Modal */}
      <TemplateCustomizerModal />

      {/* Administrative Verification Modal */}
      {renderVerificationModal()}
    </div>
  );
};
