import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { StateBadge } from '../common/StateBadge';
import {
  Shield,
  MapPin,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Store,
  Bike,
  Fingerprint,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Lock,
  Sparkles
} from 'lucide-react';

interface ProfileSettingsScreenProps {
  onOpenAuth?: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = () => {
  const {
    currentUser,
    userRole,
    isDarkMode,
    toggleDarkMode,
    setIsLocationModalOpen,
    currentLocationArea,
    showSnackbar,
    isBiometricsEnrolled,
    enrollBiometrics,
    disableBiometrics,
    requestBiometricAuth,
    openKycModal,
    openProfileEditModal,
    signOut,
    verifyCurrentUserKyc,
    availableHelpers,
    navigateTo
  } = useApp();

  const kycStatus = currentUser?.kyc?.status || 'NOT_SUBMITTED';

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Account & Profile" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
        {/* User Profile Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {currentUser?.name[0] || 'U'}
              </div>
              {kycStatus === 'VERIFIED' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white shadow-xs" title="KYC Tier 2 Verified Identity">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </h2>
                <StateBadge status={currentUser?.status || 'ACTIVE'} size="sm" />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {currentUser?.phone} · {currentUser?.email}
              </p>

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                  {userRole.replace('_', ' ')}
                </span>

                {/* KYC Tier Tag */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    kycStatus === 'VERIFIED'
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                      : kycStatus === 'UNDER_REVIEW'
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>
                    {kycStatus === 'VERIFIED'
                      ? 'KYC Verified (Tier 2)'
                      : kycStatus === 'UNDER_REVIEW'
                      ? 'KYC Under Review'
                      : 'KYC Required'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openProfileEditModal}
              className="py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECURITY IMPLEMENTATION · CBN AML COMPLIANT                               */}
        {/* Requirement: Moved from home page to profile page.                         */}
        {/* After successful verification (kycStatus === 'VERIFIED'), it NO LONGER     */}
        {/* appears on the user profile!                                              */}
        {/* ========================================================================= */}
        {kycStatus !== 'VERIFIED' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white border border-emerald-500/40 shadow-lg space-y-4 relative overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  {kycStatus === 'UNDER_REVIEW' ? (
                    <Clock className="w-5 h-5 animate-pulse text-amber-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      SECURITY IMPLEMENTATION · CBN AML COMPLIANT
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        kycStatus === 'UNDER_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {kycStatus === 'UNDER_REVIEW'
                        ? 'Documents Under Review'
                        : 'KYC Action Required'}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white mt-1">
                    {kycStatus === 'UNDER_REVIEW'
                      ? 'Identity Verification in Progress'
                      : 'Submit ID & Update Profile for KYC Verification'}
                  </h3>

                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed max-w-2xl">
                    {kycStatus === 'UNDER_REVIEW'
                      ? `Your ${currentUser?.kyc?.idType?.replace(/_/g, ' ') || 'ID document'} is currently being reviewed by compliance. Once verified, this security requirement will be satisfied and this alert will disappear.`
                      : 'Under Nigerian banking and consumer protection standards, submit your National ID (NIN, Driver’s License, Passport, or Voter’s Card) and update your profile to guarantee delivery escrow protection and anti-fraud coverage.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Escrow Protection & Anti-Fraud Guarantee
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Level 2 Clearance
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                National ID data is cryptographically matched with NIMC/BVN databases to authorize seller fund release, courier store release PINs, and high-value vehicle/electronics transactions.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={openKycModal}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>
                    {kycStatus === 'UNDER_REVIEW'
                      ? 'Update Submitted Documents'
                      : 'Submit Government ID (NIN/Card)'}
                  </span>
                </button>

                <button
                  onClick={openProfileEditModal}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Update Profile Details</span>
                </button>
              </div>

              {/* Fast verification trigger so the user can test the card disappearing */}
              <button
                onClick={verifyCurrentUserKyc}
                className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Simulate successful verification to confirm this card disappears"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulate Fast Verification</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STOREFRONT PICKUP & DISPATCH                                             */}
        {/* Requirement: Present on Checkout Page & Profile (not on Home page)        */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-500/30 shadow-md space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    Storefront Pickup & Dispatch
                  </span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    Active Service
                  </span>
                </div>
                <h3 className="text-sm font-extrabold mt-0.5 text-white">
                  Send a Verified Courier to Pick Up from Any Seller
                </h3>
                <p className="text-xs text-indigo-100/80 mt-1 max-w-xl leading-relaxed">
                  Need instant store pickup? Dispatch a verified runner or dual-merchant courier to physically inspect items at the seller's stall, release a secure 4-digit PIN, and deliver straight to your door.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">
                {availableHelpers.length} Verified Couriers Available Nearby
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-bold">
              {availableHelpers.filter(h => h.isSeller).length} Dual Merchant-Couriers Operating
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-indigo-900/60">
            <button
              onClick={() => navigateTo('SHOPPER_ORDERS')}
              className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Bike className="w-3.5 h-3.5" />
              <span>View Order Pickups & PINs</span>
            </button>
            <button
              onClick={() => navigateTo('SHOPPER_EXPLORE')}
              className="py-2.5 px-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              Browse Available Couriers
            </button>
          </div>
        </div>

        {/* Role-Specific Detail Card */}
        {userRole === 'SELLER' && (
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" /> Store Information
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {(currentUser as any)?.storeName}
            </p>
            <p className="text-xs text-slate-500">
              {(currentUser as any)?.storeAddress}
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold pt-1 text-slate-700 dark:text-slate-300">
              <span>★ {(currentUser as any)?.rating || 4.8} rating</span>
              <span>{(currentUser as any)?.totalSalesCount || 842} total orders fulfilled</span>
            </div>
          </div>
        )}

        {userRole === 'SHOPPING_HELPER' && (
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-emerald-600" /> Helper Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white dark:bg-slate-700/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block">All-time Trips</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {(currentUser as any)?.completedJobsCount || 218} Completed
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-700/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Runner Vehicle</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {(currentUser as any)?.vehicleType || 'Motorcycle'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Location & Saved Addresses */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
            Locations & Addresses
          </span>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="w-full py-2.5 flex items-center justify-between text-xs text-left hover:text-emerald-600 transition"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Manage Delivery Addresses</span>
                <span className="text-[10px] text-slate-400">Current: {currentLocationArea}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* Application Preferences (SYSTEM & DISPLAY)                               */}
        {/* Requirement: Removed Android Phone Frame Mode and App Template & Theme.   */}
        {/* Retains Dark Mode.                                                       */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
            System & Display
          </span>

          <div className="flex items-center justify-between py-1 text-xs">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isDarkMode ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5 ${
                  isDarkMode ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Biometric Security Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-emerald-600" /> Biometric Authentication
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isBiometricsEnrolled
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {isBiometricsEnrolled ? 'Enrolled & Active' : 'Not Set Up'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Enhance account security with Android Fingerprint or Face Unlock. Protect sensitive orders, escrow payments, and helper payouts.
          </p>

          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700 text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Biometric Login & Escrow Authorization
              </span>
              <span className="text-[10px] text-slate-400">
                1-tap authentication on high-value actions
              </span>
            </div>
            <button
              onClick={async () => {
                if (isBiometricsEnrolled) {
                  disableBiometrics();
                } else {
                  await enrollBiometrics(currentUser?.name || 'ShopLink User');
                }
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isBiometricsEnrolled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5 ${
                  isBiometricsEnrolled ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Test sensor button */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                requestBiometricAuth({
                  title: 'Test Biometric Sensor',
                  subtitle: 'Touch the fingerprint sensor or look at the camera to verify your biometric hardware',
                  actionType: 'SECURITY',
                  onSuccess: () => {
                    showSnackbar('Biometric verification test successful!');
                  }
                });
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <Fingerprint className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Test Biometric Sensor</span>
            </button>

            {!isBiometricsEnrolled && (
              <button
                onClick={async () => {
                  await enrollBiometrics(currentUser?.name || 'ShopLink User');
                }}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition active:scale-98 cursor-pointer"
              >
                Enroll Now
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SIGN OUT ACTION                                                          */}
        {/* Requirement: Replace "switch account / sign in modal" with "sign out"    */}
        {/* ========================================================================= */}
        <div className="pt-2">
          <button
            onClick={signOut}
            className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
