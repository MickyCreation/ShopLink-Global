import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import {
  User,
  Shield,
  MapPin,
  Bell,
  Sun,
  Moon,
  Smartphone,
  LayoutTemplate,
  LogOut,
  ChevronRight,
  Store,
  Bike,
  Star,
  Award,
  Building,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Edit3,
  Lock,
  FileText
} from 'lucide-react';

interface ProfileSettingsScreenProps {
  onOpenAuth: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    userRole,
    isDarkMode,
    toggleDarkMode,
    isDeviceFrameEnabled,
    toggleDeviceFrame,
    templateType,
    colorTheme,
    setIsTemplateModalOpen,
    setIsLocationModalOpen,
    currentLocationArea,
    showSnackbar,
    isBiometricsEnrolled,
    isBiometricsEnabled,
    enrollBiometrics,
    disableBiometrics,
    requestBiometricAuth,
    isMergedSellerHelper,
    activeWorkspace,
    toggleSellerHelperWorkspace,
    switchAccountUser,
    openKycModal,
    openProfileEditModal
  } = useApp();

  const kycStatus = currentUser?.kyc?.status || 'NOT_SUBMITTED';

  const demoAccounts = [
    { id: 'user_shopper_01', label: 'Shopper Account', name: 'Micah Adeyemi', desc: 'Personal Shopper · Strictly Shopper Interface' },
    { id: 'user_helper_01', label: 'Helper Account', name: 'Babatunde Ojo', desc: 'Shopping Courier · Strictly Helper Interface' },
    { id: 'user_seller_01', label: 'Seller Account', name: 'Basirat Super Provisions', desc: 'Local Merchant · Can apply for Helper' },
    { id: 'user_merged_seller_helper_01', label: 'Merged Seller + Helper', name: 'Chinedu Okeke', desc: 'Dual Account Approved · Manages Store & Courier' },
    { id: 'user_admin_01', label: 'Administrator', name: 'Emeka Okonkwo', desc: 'National Platform Executive' }
  ];

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
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white" title="KYC Verified Identity">
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

        {/* KNOW YOUR CUSTOMER (KYC) & Identity Security Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  KNOW YOUR CUSTOMER (KYC) & SECURITY
                </span>
                <span className="text-[10px] text-slate-400">
                  Government ID submission, NIMC & BVN verification for anti-fraud compliance
                </span>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                kycStatus === 'VERIFIED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : kycStatus === 'UNDER_REVIEW'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}
            >
              {kycStatus === 'VERIFIED' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Verified Tier 2
                </>
              ) : kycStatus === 'UNDER_REVIEW' ? (
                <>
                  <Clock className="w-3 h-3" /> Pending Compliance Review
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" /> Unverified (Action Needed)
                </>
              )}
            </span>
          </div>

          {/* Details Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-3">
            {kycStatus === 'VERIFIED' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold">
                      {currentUser?.kyc?.idType?.replace(/_/g, ' ') || 'National Identity Number (NIN)'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-semibold">
                    •••• •••• {currentUser?.kyc?.idNumber ? currentUser.kyc.idNumber.slice(-4) : '3847'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">BVN Status</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {currentUser?.kyc?.bvn ? '•••• •••• ' + currentUser.kyc.bvn.slice(-4) + ' (Verified)' : 'Not Linked'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Verified Date</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {currentUser?.kyc?.verifiedAt ? new Date(currentUser.kyc.verifiedAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Compliance Reviewer</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {currentUser?.kyc?.verifiedBy || 'National Admin (Emeka Okonkwo)'}
                    </span>
                  </div>
                </div>
              </div>
            ) : kycStatus === 'UNDER_REVIEW' ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Documents Submitted & Under Administrative Review
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Your government ID ({currentUser?.kyc?.idType?.replace(/_/g, ' ') || 'Document'}) and verification payload have been submitted to ShopLink compliance. You will receive an alert once approved.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                  <span>File: <strong className="text-slate-700 dark:text-slate-200 font-mono">{currentUser?.kyc?.documentFileName || 'document.jpg'}</strong></span>
                  <span>Submitted: <strong className="text-slate-700 dark:text-slate-200">{currentUser?.kyc?.submittedAt ? new Date(currentUser.kyc.submittedAt).toLocaleDateString() : 'Today'}</strong></span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Identity Verification Required for Full Security
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      To safeguard market transactions, release delivery escrow funds, and verify merchant listings, please submit your National Identity Number (NIN), Voter's Card, Driver's License, or CAC certificate.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Compliant with Central Bank of Nigeria (CBN) Anti-Money Laundering Framework</span>
            </div>

            <button
              onClick={openKycModal}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <FileCheck className="w-4 h-4" />
              <span>
                {kycStatus === 'VERIFIED'
                  ? 'View / Update KYC Documents'
                  : kycStatus === 'UNDER_REVIEW'
                  ? 'Update Submitted Documents'
                  : 'Submit ID for KYC Verification'}
              </span>
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

        {/* Application Preferences */}
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
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isDarkMode ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5 ${
                  isDarkMode ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1 text-xs border-t border-slate-100 dark:border-slate-700 pt-2">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-800 dark:text-slate-200">Android Phone Frame Mode</span>
            </div>
            <button
              onClick={toggleDeviceFrame}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isDeviceFrameEnabled ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5 ${
                  isDeviceFrameEnabled ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="w-full py-2 flex items-center justify-between text-xs text-left hover:text-emerald-600 transition border-t border-slate-100 dark:border-slate-700 pt-2"
          >
            <div className="flex items-center gap-2.5">
              <LayoutTemplate className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">App Template & Brand Theme</span>
                <span className="text-[10px] text-slate-400 capitalize">Layout: {templateType} · Theme: {colorTheme}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
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
            Enhance account security with Android Fingerprint or Face Unlock. Protect sensitive grocery orders, escrow payments, and helper payouts.
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

        {/* Account Category Identity & Permissions */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Account Category & Status
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                isMergedSellerHelper
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {isMergedSellerHelper ? 'Merged Seller + Helper' : userRole.replace('_', ' ')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{currentUser?.name}</span>
              <span className="text-[11px] font-normal text-slate-400">{currentUser?.email}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {currentUser?.role === 'SHOPPER' &&
                'Signed up as a Shopper. This account remains strictly isolated for personal grocery shopping, helper bookings, and live order tracking.'}
              {currentUser?.role === 'SHOPPING_HELPER' &&
                'Signed up as a Shopping Helper. This account remains strictly dedicated to accepting market shopping runs, inspecting produce, and earning delivery fees.'}
              {currentUser?.role === 'SELLER' &&
                !isMergedSellerHelper &&
                'Signed up as a Merchant / Store. You can apply for a Shopping Helper account from your Seller Dashboard; after administrator approval, both roles will merge under one login.'}
              {isMergedSellerHelper &&
                'Dual-account approved by Administrator. Both your Store Management and Shopping Helper Courier privileges are merged under this single login!'}
              {currentUser?.role === 'ADMIN' &&
                'National Platform Executive Administrator. Full oversight over user security, seller helper applications, and platform governance.'}
            </p>

            {isMergedSellerHelper && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Workspace</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {activeWorkspace === 'SELLER' ? 'Store Management 🏪' : 'Helper Dispatch 🛵'}
                  </span>
                </div>
                <button
                  onClick={toggleSellerHelperWorkspace}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  Switch to {activeWorkspace === 'SELLER' ? 'Helper Mode 🛵' : 'Store Mode 🏪'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Switch Account Identity (Testing Category Isolation)
            </span>
            <div className="space-y-1.5">
              {demoAccounts.map(acc => {
                const isSelected =
                  currentUser?.id === acc.id ||
                  (acc.id === 'user_seller_01' && currentUser?.role === 'SELLER' && !isMergedSellerHelper) ||
                  (acc.id === 'user_merged_seller_helper_01' && isMergedSellerHelper);
                return (
                  <button
                    key={acc.id}
                    onClick={() => switchAccountUser(acc.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{acc.name}</span>
                        <span className="text-[10px] opacity-75 font-normal">({acc.label})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal">{acc.desc}</p>
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Authentication & Logout */}
        <div className="pt-2">
          <button
            onClick={onOpenAuth}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
          >
            <User className="w-4 h-4 text-emerald-600" /> Switch Account / Sign In Modal
          </button>
        </div>
      </div>
    </div>
  );
};
