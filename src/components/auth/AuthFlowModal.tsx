import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/mock/MockServices';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Bike,
  Store,
  User,
  ArrowRight,
  Phone,
  Mail,
  Lock,
  CheckCircle2,
  X,
  AlertTriangle,
  Fingerprint,
  ScanFace,
  Sparkles
} from 'lucide-react';

interface AuthFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthFlowModal: React.FC<AuthFlowModalProps> = ({ isOpen, onClose }) => {
  const {
    switchRole,
    showSnackbar,
    isBiometricsEnrolled,
    isBiometricsEnabled,
    enrollBiometrics,
    requestBiometricAuth
  } = useApp();

  const [mode, setMode] = useState<
    'LOGIN' | 'REGISTER' | 'ROLE_SELECT' | 'OTP' | 'BIOMETRIC_SETUP' | 'FORGOT_PW' | 'SUSPENDED_DEMO'
  >('ROLE_SELECT');
  const [selectedRole, setSelectedRole] = useState<'SHOPPER' | 'SELLER' | 'SHOPPING_HELPER'>('SHOPPER');

  // Form fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('+234 802 345 6789');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [locationArea, setLocationArea] = useState('Ikeja, Lagos');

  // Seller specific
  const [storeName, setStoreName] = useState('');

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register({
        name: name || 'ShopLink User',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'user@shoplink.ng',
        phone: emailOrPhone.startsWith('+234') ? emailOrPhone : '+234 801 234 5678',
        role: selectedRole,
        locationArea,
        storeName: selectedRole === 'SELLER' ? storeName || `${name}'s Store` : undefined
      });
      setMode('OTP');
      showSnackbar('OTP Code sent to your phone (Use 123456 to verify)');
    } catch {
      showSnackbar('Registration error');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      showSnackbar('Phone number verified! Set up biometric security.');
      setMode('BIOMETRIC_SETUP');
    } else {
      showSnackbar('Please enter a 6-digit code (e.g. 123456)');
    }
  };

  const handleRoleQuickSelect = async (role: UserRole) => {
    await switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Role Selector Screen */}
        {mode === 'ROLE_SELECT' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl mx-auto shadow-md">
                S
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-2">
                Join ShopLink Nigeria
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your account type to proceed
              </p>
            </div>

            <div className="space-y-2">
              {[
                { role: 'SHOPPER', title: 'Shopper', desc: 'Shop from local markets or hire a personal helper', icon: User },
                { role: 'SELLER', title: 'Local Seller / Store', desc: 'List food items, groceries & receive direct orders', icon: Store },
                { role: 'SHOPPING_HELPER', title: 'Shopping Helper', desc: 'Accept market runs, inspect produce & earn daily fees', icon: Bike }
              ].map(item => (
                <button
                  key={item.role}
                  onClick={() => {
                    setSelectedRole(item.role as any);
                    setMode('REGISTER');
                  }}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left transition flex items-center gap-3 active:scale-98 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-700 dark:text-slate-300 transition">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setMode('LOGIN')}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Already have an account? Sign In
              </button>
              <button
                onClick={() => setMode('SUSPENDED_DEMO')}
                className="text-slate-400 hover:text-slate-600 text-[11px]"
              >
                Security notice
              </button>
            </div>
          </div>
        )}

        {/* Registration Screen */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                {selectedRole.replace('_', ' ')} Registration
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Create Account
              </h2>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Babajide Adeleke"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nigerian Phone Number
              </label>
              <input
                type="tel"
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                placeholder="+234 802 000 0000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {selectedRole === 'SELLER' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Store / Business Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="e.g. Mama Nkechi Provisions"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operating Location / City
              </label>
              <input
                type="text"
                value={locationArea}
                onChange={e => setLocationArea(e.target.value)}
                placeholder="e.g. Ikeja, Lagos"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98"
            >
              Continue to OTP Verification
            </button>

            <button
              type="button"
              onClick={() => setMode('ROLE_SELECT')}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600"
            >
              Back to Role Selection
            </button>
          </form>
        )}

        {/* OTP Verification Interface */}
        {mode === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enter Verification Code
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit code to <strong className="text-slate-800 dark:text-slate-200">{emailOrPhone}</strong>
              </p>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-48 mx-auto px-4 py-3 text-center text-lg font-mono font-bold tracking-widest rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                autoFocus
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Didn't receive SMS? <span className="text-emerald-600 font-semibold cursor-pointer">Resend OTP in 30s</span>
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98"
            >
              Verify & Enter App
            </button>
          </form>
        )}

        {/* Login Screen */}
        {mode === 'LOGIN' && (
          <form
            onSubmit={async e => {
              e.preventDefault();
              await switchRole('SHOPPER');
              onClose();
            }}
            className="space-y-3"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Sign In to ShopLink
              </h2>
              <p className="text-xs text-slate-500">
                Access your orders, helpers & store
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                defaultValue="+234 802 345 6789"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98"
            >
              Sign In with Password
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-2 text-[10px] text-slate-400 font-semibold uppercase">
                Or authenticate with
              </span>
            </div>

            {/* Quick Biometric Sign In button */}
            <button
              type="button"
              onClick={() => {
                requestBiometricAuth({
                  title: 'Sign In to ShopLink',
                  subtitle: 'Verify with your Fingerprint or Face Unlock to access your account securely',
                  actionType: 'SIGN_IN',
                  onSuccess: async () => {
                    await switchRole('SHOPPER');
                    showSnackbar('Biometric sign-in verified! Welcome back.');
                    onClose();
                  }
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-2xs"
            >
              <Fingerprint className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Fingerprint / Face Unlock</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setMode('ROLE_SELECT')}
                className="hover:underline"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => showSnackbar('Password reset link sent to registered email')}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {/* Biometric Security Setup Screen */}
        {mode === 'BIOMETRIC_SETUP' && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Fingerprint className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Android Biometric Security
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Enable Biometric Protection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Use Fingerprint or Face Unlock for instant 1-tap login and to authorize sensitive shopping and Escrow payments.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Instant sign-in without passwords</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Biometric authorization on grocery payments</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Protected by device hardware keystore</span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const success = await enrollBiometrics(name || 'ShopLink User');
                if (success) {
                  await switchRole(selectedRole);
                  onClose();
                }
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/15 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Enable Fingerprint / Face Unlock</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await switchRole(selectedRole);
                showSnackbar('Welcome to ShopLink Nigeria!');
                onClose();
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 py-1"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Account Suspended Demo State */}
        {mode === 'SUSPENDED_DEMO' && (
          <div className="space-y-3 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Account Suspended State (Demo)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When an account violates safety policies or fails KYC verification, ShopLink blocks all trading activities and prompts contact with compliance.
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 text-left font-mono">
              Status: SUSPENDED<br />
              Reason: Compliance Review #NG-4902<br />
              Contact: compliance@shoplink.ng
            </div>
            <button
              onClick={() => setMode('ROLE_SELECT')}
              className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-xs font-semibold rounded-xl"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
