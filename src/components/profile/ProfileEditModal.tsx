import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UpdateProfilePayload, SellerUser } from '../../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Store,
  Bike,
  X,
  CheckCircle2,
  Building,
  Save,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  FileCheck
} from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKyc?: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onOpenKyc }) => {
  const { currentUser, userRole, updateUserProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [locationArea, setLocationArea] = useState(currentUser?.locationArea || 'Ikeja GRA, Lagos');
  const [residentialAddress, setResidentialAddress] = useState(
    currentUser?.residentialAddress || currentUser?.locationArea || ''
  );

  // Seller fields
  const sellerUser = userRole === 'SELLER' ? (currentUser as SellerUser) : undefined;
  const [storeName, setStoreName] = useState(sellerUser?.storeName || '');
  const [storeDescription, setStoreDescription] = useState(sellerUser?.storeDescription || '');
  const [storeAddress, setStoreAddress] = useState(sellerUser?.storeAddress || '');
  const [businessRegNumber, setBusinessRegNumber] = useState(sellerUser?.businessRegNumber || '');

  // Helper fields
  const helperUser = userRole === 'SHOPPING_HELPER' ? (currentUser as any) : undefined;
  const [vehicleType, setVehicleType] = useState<'Motorcycle' | 'Bicycle' | 'Car' | 'Walking'>(
    helperUser?.vehicleType || 'Motorcycle'
  );
  const [serviceAreasInput, setServiceAreasInput] = useState(
    helperUser?.serviceAreas ? helperUser.serviceAreas.join(', ') : 'Ikeja GRA, Allen Avenue, Maryland'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!phone.trim()) {
      setError('Please provide a valid Nigerian phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateProfilePayload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        locationArea: locationArea.trim(),
        residentialAddress: residentialAddress.trim()
      };

      if (userRole === 'SELLER') {
        payload.storeName = storeName.trim();
        payload.storeDescription = storeDescription.trim();
        payload.storeAddress = storeAddress.trim();
        payload.businessRegNumber = businessRegNumber.trim();
      } else if (userRole === 'SHOPPING_HELPER') {
        payload.vehicleType = vehicleType;
        payload.serviceAreas = serviceAreasInput
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }

      await updateUserProfile(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Update Account Profile
              </h2>
              <p className="text-[11px] text-slate-400">
                Keep your legal name, contact information, and address synchronized with your KYC record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Personal Information
            </span>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="First and Last Name as on official ID"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.ng"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Primary Nigerian Area / District *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={locationArea}
                  onChange={e => setLocationArea(e.target.value)}
                  placeholder="e.g. Ikeja GRA, Lagos"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Residential Street Address
              </label>
              <input
                type="text"
                value={residentialAddress}
                onChange={e => setResidentialAddress(e.target.value)}
                placeholder="House / Flat number and street name"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Role-Specific Sections */}
          {userRole === 'SELLER' && (
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Store & Merchant Details
              </span>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Store Front Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Store Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={storeAddress}
                  onChange={e => setStoreAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    CAC Registration Number
                  </label>
                  <input
                    type="text"
                    value={businessRegNumber}
                    onChange={e => setBusinessRegNumber(e.target.value)}
                    placeholder="e.g. BN-2849102"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Store Bio / Tagline
                  </label>
                  <input
                    type="text"
                    value={storeDescription}
                    onChange={e => setStoreDescription(e.target.value)}
                    placeholder="Specialty goods and provisions"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {userRole === 'SHOPPING_HELPER' && (
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Courier & Runner Logistics
              </span>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Transit Vehicle *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Motorcycle', 'Bicycle', 'Car', 'Walking'] as const).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVehicleType(v)}
                      className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        vehicleType === v
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v === 'Motorcycle' && '🛵 '}
                      {v === 'Bicycle' && '🚲 '}
                      {v === 'Car' && '🚗 '}
                      {v === 'Walking' && '🚶 '}
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Delivery Coverage Areas (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={serviceAreasInput}
                  onChange={e => setServiceAreasInput(e.target.value)}
                  placeholder="e.g. Ikeja GRA, Allen Avenue, Opebi, Maryland"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* KYC Security Status & ID Submission Callout */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Know Your Customer (KYC) Security Link
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  currentUser?.kyc?.status === 'VERIFIED'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : currentUser?.kyc?.status === 'UNDER_REVIEW'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                }`}
              >
                {currentUser?.kyc?.status === 'VERIFIED'
                  ? 'Tier 2 Verified'
                  : currentUser?.kyc?.status === 'UNDER_REVIEW'
                  ? 'Under Review'
                  : 'Unverified ID'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {currentUser?.kyc?.status === 'VERIFIED'
                ? `Identity verified with ${currentUser?.kyc?.idType?.replace(/_/g, ' ') || 'National ID'} (•••• ${currentUser?.kyc?.idNumber ? currentUser.kyc.idNumber.slice(-4) : '3847'}). Profile and legal name are in sync.`
                : 'Central Bank of Nigeria (CBN) regulations require a verified National ID (NIN, Driver’s License, Passport, or CAC) to authorize escrow transfers and merchant payouts.'}
            </p>

            {onOpenKyc && currentUser?.kyc?.status !== 'VERIFIED' && (
              <button
                type="button"
                onClick={onOpenKyc}
                className="w-full mt-1 py-2 px-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {currentUser?.kyc?.status === 'UNDER_REVIEW'
                    ? 'View or Update Submitted ID Documents ➔'
                    : 'Submit Government ID for KYC Security ➔'}
                </span>
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
