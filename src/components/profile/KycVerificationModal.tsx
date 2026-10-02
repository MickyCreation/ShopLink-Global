import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IdDocumentType, KycSubmissionPayload } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  UploadCloud,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ChevronRight,
  Eye,
  FileCheck,
  Building2,
  UserCheck
} from 'lucide-react';

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileEdit?: () => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({ isOpen, onClose, onOpenProfileEdit }) => {
  const { currentUser, submitKyc, updateUserProfile } = useApp();

  // Profile data to sync
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  const [idType, setIdType] = useState<IdDocumentType>(
    currentUser?.kyc?.idType || (currentUser?.role === 'SELLER' ? 'CAC_CERTIFICATE' : 'NIN_CARD')
  );
  const [idNumber, setIdNumber] = useState(currentUser?.kyc?.idNumber || '');
  const [bvn, setBvn] = useState(currentUser?.kyc?.bvn || '');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.kyc?.dateOfBirth || '1995-05-12');
  const [residentialAddress, setResidentialAddress] = useState(
    currentUser?.residentialAddress || currentUser?.locationArea || '12 Isaac John Street, Ikeja GRA'
  );
  const [stateOfResidence, setStateOfResidence] = useState(currentUser?.kyc?.stateOfResidence || 'Lagos');
  const [lga, setLga] = useState(currentUser?.kyc?.lga || 'Ikeja');

  // Document file state
  const [documentFileName, setDocumentFileName] = useState(
    currentUser?.kyc?.documentFileName || 'national_id_card_scan.jpg'
  );
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(
    currentUser?.kyc?.documentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const idTypeOptions: Array<{ type: IdDocumentType; label: string; desc: string; icon: string }> = [
    {
      type: 'NIN_CARD',
      label: 'National Identity Card (NIN)',
      desc: '11-digit National Identity Card issued by NIMC',
      icon: '🇳🇬'
    },
    {
      type: 'NIN_SLIP',
      label: 'NIN Digital Slip',
      desc: 'NIMC standard or premium digital verification slip',
      icon: '📄'
    },
    {
      type: 'DRIVERS_LICENSE',
      label: "Driver's License (FRSC)",
      desc: 'Valid Federal Road Safety Corps card',
      icon: '🚗'
    },
    {
      type: 'INTERNATIONAL_PASSPORT',
      label: 'International Passport',
      desc: 'Nigerian Immigration Service e-Passport',
      icon: '✈️'
    },
    {
      type: 'VOTERS_CARD',
      label: "Permanent Voter's Card (PVC)",
      desc: 'INEC biometric voting card',
      icon: '🗳️'
    },
    {
      type: 'CAC_CERTIFICATE',
      label: 'CAC Business Registration',
      desc: 'Corporate Affairs Commission certificate for merchants',
      icon: '🏛️'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFileName(file.name);
      const fakeUrl = URL.createObjectURL(file);
      setDocumentPreviewUrl(fakeUrl);
    }
  };

  const handleSimulateCameraCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setDocumentFileName(`camera_capture_${Date.now()}.jpg`);
      setDocumentPreviewUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400');
    }, 1200);
  };

  const handleLoadSampleVerifiedDoc = () => {
    setDocumentFileName('nimc_verified_identity_card.jpg');
    setDocumentPreviewUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400');
    if (!fullName) {
      setFullName(currentUser?.name || 'Micah Adeyemi');
    }
    if (!phone) {
      setPhone(currentUser?.phone || '+234 802 345 6789');
    }
    if (!idNumber) {
      setIdNumber(idType === 'NIN_CARD' || idType === 'NIN_SLIP' ? '49201948302' : 'LAG-8492019');
    }
    if (!bvn) {
      setBvn('22334455667');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please provide your full legal name as it appears on your identity document.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please provide a valid Nigerian contact phone number.');
      return;
    }

    if (!idNumber.trim()) {
      setErrorMessage('Please provide your valid identification document number.');
      return;
    }

    if ((idType === 'NIN_CARD' || idType === 'NIN_SLIP') && idNumber.replace(/\D/g, '').length !== 11) {
      setErrorMessage('Nigerian NIN must be exactly 11 digits.');
      return;
    }

    if (bvn && bvn.replace(/\D/g, '').length !== 11) {
      setErrorMessage('Bank Verification Number (BVN) must be exactly 11 digits.');
      return;
    }

    if (!documentFileName) {
      setErrorMessage('Please upload or capture a photo of your identity document.');
      return;
    }

    if (!termsAgreed) {
      setErrorMessage('Please confirm the declaration of identity accuracy.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Synchronize profile details with KYC identity record
      await updateUserProfile({
        name: fullName.trim(),
        phone: phone.trim(),
        residentialAddress: residentialAddress.trim(),
        locationArea: `${lga.trim()}, ${stateOfResidence}`
      });

      const payload: KycSubmissionPayload = {
        idType,
        idNumber: idNumber.trim(),
        bvn: bvn.trim() || undefined,
        dateOfBirth,
        residentialAddress: residentialAddress.trim(),
        stateOfResidence,
        lga: lga.trim(),
        documentFileName,
        documentUrl: documentPreviewUrl || undefined
      };

      await submitKyc(payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'KYC submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Banner */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>KNOW YOUR CUSTOMER (KYC)</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-normal">
                  TIER 2 SECURITY
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Submit government-issued ID & verify profile for fraud prevention & escrow safety
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Security Compliance Callout */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs block">Bank-Grade Identity Protection</span>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                ShopLink Nigeria complies with CBN financial guidelines and NIMC identity standards. Your ID details are encrypted and securely verified to authorize high-volume grocery requests, merchant payouts, and courier runs.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Document Type Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                1. Select Government-Issued ID Type
              </label>
              <button
                type="button"
                onClick={handleLoadSampleVerifiedDoc}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Autofill Demo Data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {idTypeOptions.map(opt => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setIdType(opt.type)}
                  className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                    idType === opt.type
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl shrink-0">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      {opt.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: User Profile & Contact Information (Synchronized with KYC) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                2. User Profile Verification (Legal Identity & Contact)
              </label>
              {onOpenProfileEdit && (
                <button
                  type="button"
                  onClick={onOpenProfileEdit}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Advanced Store/Vehicle Settings ➔
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Legal Name (as on ID) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Micah Babatunde Adeyemi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+234 802 345 6789"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  State of Residence *
                </label>
                <select
                  value={stateOfResidence}
                  onChange={e => setStateOfResidence(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja FCT">Federal Capital Territory (Abuja)</option>
                  <option value="Oyo">Oyo State (Ibadan)</option>
                  <option value="Rivers">Rivers State (Port Harcourt)</option>
                  <option value="Kano">Kano State</option>
                  <option value="Enugu">Enugu State</option>
                  <option value="Kaduna">Kaduna State</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Edo">Edo State</option>
                  <option value="Delta">Delta State</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Local Government Area (LGA) *
                </label>
                <input
                  type="text"
                  required
                  value={lga}
                  onChange={e => setLga(e.target.value)}
                  placeholder="e.g. Ikeja, Alimosho, Lagos Island"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Residential / Business Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={residentialAddress}
                  onChange={e => setResidentialAddress(e.target.value)}
                  placeholder="House number, street name, district/area"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Government ID & BVN Financial Verification */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              3. Identification & Financial Numbers
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document / ID Number *
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  placeholder={
                    idType === 'NIN_CARD' || idType === 'NIN_SLIP'
                      ? '11-digit NIN (e.g. 74829103847)'
                      : idType === 'CAC_CERTIFICATE'
                      ? 'RC or BN number (e.g. BN-2849102)'
                      : 'Enter document serial number'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Bank Verification Number (BVN) <span className="text-slate-400 font-normal">(Optional for Tier 2)</span>
                </label>
                <input
                  type="password"
                  maxLength={11}
                  value={bvn}
                  onChange={e => setBvn(e.target.value.replace(/\D/g, ''))}
                  placeholder="11-digit BVN for payout verification"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Date of Birth (as on ID) *
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Document Upload / Capture */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              3. Document Image & Proof of Identity
            </label>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              {documentPreviewUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative max-w-sm max-h-48 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img
                      src={documentPreviewUrl}
                      alt="ID Document Preview"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <FileCheck className="w-3 h-3" /> Ready
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono font-medium truncate max-w-[200px]">{documentFileName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDocumentFileName('');
                        setDocumentPreviewUrl(null);
                      }}
                      className="text-rose-500 hover:text-rose-600 text-[10px] ml-2 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Upload Document Scan or Take a Photo
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Clear color photo of the front of your ID card, slip, or certificate (JPG, PNG, PDF up to 10MB)
                    </span>
                  </div>
                </div>
              )}

              {/* Upload Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <label className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSimulateCameraCapture}
                  disabled={isCapturing}
                  className="py-2 px-3.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isCapturing ? 'Snapping...' : 'Snap with Camera'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Terms & Declaration */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={e => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer shrink-0"
              />
              <span>
                I solemnly certify that the identity document provided belongs to me, all details are authentic, and I authorize ShopLink Nigeria to verify my record with the National Identity Management Commission (NIMC) and relevant compliance registries.
              </span>
            </label>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Verification...' : 'Submit KYC for Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
