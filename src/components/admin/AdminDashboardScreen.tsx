import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { StateBadge } from '../common/StateBadge';
import { authService, notificationService } from '../../services/mock/MockServices';
import { MOCK_USERS } from '../../services/mock/mockData';
import {
  ShieldCheck,
  Users,
  DollarSign,
  AlertTriangle,
  Megaphone,
  Sliders,
  CheckCircle,
  Ban,
  Activity,
  Layers,
  ChevronRight,
  Bike,
  Sparkles,
  CheckCheck,
  XCircle,
  Clock,
  Send,
  FileCheck,
  FileText,
  Eye,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';
import { AppUser, UserRole, UserStatus } from '../../types';

export const AdminDashboardScreen: React.FC = () => {
  const {
    showSnackbar,
    helperApplications,
    approveHelperApplication,
    rejectHelperApplication,
    kycSubmissions,
    approveKyc,
    rejectKyc,
    refreshKycSubmissions
  } = useApp();

  const [usersList, setUsersList] = useState<AppUser[]>(Object.values(MOCK_USERS));
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedKycFilter, setSelectedKycFilter] = useState<'ALL' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [previewDocModal, setPreviewDocModal] = useState<{ isOpen: boolean; url?: string; title?: string; docName?: string }>({ isOpen: false });

  // Broadcast announcement
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Platform fees config
  const [baseHelperFee, setBaseHelperFee] = useState(1500);
  const [platformCommissionPercent, setPlatformCommissionPercent] = useState(8);

  const handleToggleUserStatus = async (user: AppUser) => {
    const nextStatus: UserStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    await authService.updateUserStatus(user.id, nextStatus);
    setUsersList(prev =>
      prev.map(u => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    showSnackbar(
      nextStatus === 'SUSPENDED'
        ? `Account for ${user.name} has been suspended.`
        : `Account for ${user.name} has been reactivated.`
    );
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementBody.trim()) {
      showSnackbar('Please enter title and announcement body');
      return;
    }

    setIsBroadcasting(true);
    try {
      await notificationService.sendNotification({
        userId: 'all',
        title: announcementTitle.trim(),
        body: announcementBody.trim(),
        type: 'ADMIN_ANNOUNCEMENT'
      });
      setAnnouncementTitle('');
      setAnnouncementBody('');
      showSnackbar('Broadcast announcement sent to all Nigerian users');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const filteredUsers = usersList.filter(u => {
    if (selectedRoleFilter === 'ALL') return true;
    return u.role === selectedRoleFilter;
  });

  const filteredKycSubmissions = kycSubmissions.filter(s => {
    if (selectedKycFilter === 'ALL') return true;
    return s.kyc.status === selectedKycFilter;
  });

  const pendingKycCount = kycSubmissions.filter(s => s.kyc.status === 'UNDER_REVIEW').length;

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Main Executive Admin Console" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
        {/* Executive Platform Summary Card */}
        <div className="p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ShopLink National Oversight
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              v1.0-NG
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Platform GMV</span>
            <div className="text-2xl font-black text-white tracking-tight mt-0.5">
              <NigerianCurrency amount={18450000} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Net Commission</span>
              <span className="font-extrabold text-emerald-400 tabular-nums">₦1,476,000</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Verified Sellers</span>
              <span className="font-extrabold text-white tabular-nums">48</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Active Helpers</span>
              <span className="font-extrabold text-white tabular-nums">114</span>
            </div>
          </div>
        </div>

        {/* KNOW YOUR CUSTOMER (KYC) & IDENTITY SECURITY COMPLIANCE QUEUE */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    KNOW YOUR CUSTOMER (KYC) IDENTITY QUEUE
                  </span>
                  {pendingKycCount > 0 && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                      {pendingKycCount} Action Required
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">
                  Audit government ID submissions (NIN, Driver’s License, Passport, CAC, Voter’s Card) for CBN anti-fraud security
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl text-[11px] self-start sm:self-auto">
              {(['ALL', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'] as const).map(tab => {
                const count = tab === 'ALL'
                  ? kycSubmissions.length
                  : kycSubmissions.filter(s => s.kyc.status === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedKycFilter(tab)}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ${
                      selectedKycFilter === tab
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>
                      {tab === 'ALL'
                        ? 'All'
                        : tab === 'UNDER_REVIEW'
                        ? 'Pending Review'
                        : tab === 'VERIFIED'
                        ? 'Verified'
                        : 'Rejected'}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      selectedKycFilter === tab
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submissions List */}
          {filteredKycSubmissions.length > 0 ? (
            <div className="space-y-3">
              {filteredKycSubmissions.map(({ user, kyc }: { user: AppUser; kyc: any }) => (
                <div
                  key={user.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    {/* User and ID Summary */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {user.name}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                          {user.role.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            kyc.status === 'VERIFIED'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : kyc.status === 'UNDER_REVIEW'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {kyc.status === 'VERIFIED' && <CheckCircle2 className="w-3 h-3" />}
                          {kyc.status === 'UNDER_REVIEW' && <Clock className="w-3 h-3 animate-pulse" />}
                          {kyc.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                          <span>
                            {kyc.status === 'VERIFIED'
                              ? 'KYC Verified (Tier 2)'
                              : kyc.status === 'UNDER_REVIEW'
                              ? 'Compliance Review Pending'
                              : 'Submission Rejected'}
                          </span>
                        </span>
                      </div>

                      {/* Contact details */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {user.phone} · {user.email}
                      </p>

                      {/* Verified address */}
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        📍 Residence: {kyc.residentialAddress || user.residentialAddress || user.locationArea}, {kyc.lga ? `${kyc.lga}, ` : ''}{kyc.stateOfResidence || 'Lagos'}
                      </p>

                      {/* ID Details grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Document Type</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {kyc.idType?.replace(/_/g, ' ') || 'Government ID'}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Document Number</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
                            {kyc.idNumber || 'Pending'}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Bank BVN Status</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">
                            {kyc.bvn ? '•••• ' + kyc.bvn.slice(-4) + ' (Linked)' : 'Not Linked'}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Submitted Date</span>
                          <span className="text-slate-800 dark:text-slate-200">
                            {kyc.submittedAt ? new Date(kyc.submittedAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Document Image & Action Buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0">
                      {kyc.documentUrl && (
                        <div
                          onClick={() => setPreviewDocModal({
                            isOpen: true,
                            url: kyc.documentUrl,
                            title: `${user.name} - ${kyc.idType?.replace(/_/g, ' ')}`,
                            docName: kyc.documentFileName
                          })}
                          className="relative w-28 h-18 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group cursor-pointer shadow-xs bg-slate-200 dark:bg-slate-800"
                        >
                          <img
                            src={kyc.documentUrl}
                            alt="Submitted ID Document"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold gap-1">
                            <Eye className="w-3.5 h-3.5" /> View
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {kyc.status === 'UNDER_REVIEW' ? (
                          <>
                            <button
                              onClick={() => approveKyc(user.id)}
                              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Approve Tier 2</span>
                            </button>
                            <button
                              onClick={() => rejectKyc(user.id, 'Document scan illegible or numbers do not match NIMC identity register.')}
                              className="py-1.5 px-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : kyc.status === 'VERIFIED' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                            <button
                              onClick={() => rejectKyc(user.id, 'Identity verification revoked for audit re-submission.')}
                              className="text-[10px] text-slate-400 hover:text-rose-500 underline cursor-pointer"
                            >
                              Revoke
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => approveKyc(user.id)}
                            className="py-1 px-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white rounded-xl text-[11px] font-semibold transition cursor-pointer"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-1">
              <FileCheck className="w-7 h-7 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No KYC submissions under this filter
              </p>
              <p className="text-[11px] text-slate-400">
                Switch filters or submit an ID from a shopper, seller, or helper profile to test identity compliance verification.
              </p>
            </div>
          )}
        </div>

        {/* Seller Helper Applications & Account Merging Oversight */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Seller Dual-Account Applications (Helper Expansion)
                </span>
                <span className="text-[10px] text-slate-400">
                  Review & approve seller applications to merge shopping helper courier privileges into a single login
                </span>
              </div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {helperApplications.filter(a => a.status === 'PENDING').length} Pending
            </span>
          </div>

          {helperApplications.length > 0 ? (
            <div className="space-y-3">
              {helperApplications.map(app => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        {app.sellerName}
                      </span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.2 rounded font-medium">
                        {app.storeName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'PENDING'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : app.status === 'APPROVED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Vehicle: <strong className="text-slate-700 dark:text-slate-200">{app.vehicleType}</strong></span>
                      <span>Areas: <strong className="text-slate-700 dark:text-slate-200">{app.serviceAreas.join(', ')}</strong></span>
                      <span>ID: <strong className="font-mono text-slate-700 dark:text-slate-200">{app.ninOrIdNumber}</strong></span>
                      <span>Contact: {app.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => approveHelperApplication(app.id)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Approve & Merge Account</span>
                        </button>
                        <button
                          onClick={() => rejectHelperApplication(app.id, 'Insufficient identification provided.')}
                          className="py-1.5 px-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : app.status === 'APPROVED' ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Merged Account Active
                      </span>
                    ) : (
                      <span className="text-xs text-rose-500 font-medium">Application Declined</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-2 text-center">
              No seller helper expansion applications currently submitted.
            </p>
          )}
        </div>

        {/* User Management & Governance */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Platform Accounts & Security
            </span>
            <span className="text-[11px] text-slate-400">{filteredUsers.length} total</span>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
            {['ALL', 'SHOPPER', 'SELLER', 'SHOPPING_HELPER', 'SUB_ADMIN'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition ${
                  selectedRoleFilter === role
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {role.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* User Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredUsers.map(user => {
              const isMerged = (user as any).isMergedSellerHelper;
              return (
                <div key={user.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <StateBadge status={user.status} size="sm" />
                      {user.kyc?.status === 'VERIFIED' ? (
                        <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified
                        </span>
                      ) : user.kyc?.status === 'UNDER_REVIEW' ? (
                        <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> KYC Review
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 font-medium px-1.5 py-0.2 rounded-full">
                          Unverified
                        </span>
                      )}
                      {isMerged && (
                        <span className="text-[9px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                          Seller + Helper Merged
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {user.email} · {user.phone} · <strong className="text-slate-600 dark:text-slate-300">{isMerged ? 'SELLER & HELPER (MERGED)' : user.role}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleUserStatus(user)}
                      className={`py-1.5 px-3 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                        user.status === 'SUSPENDED'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                      }`}
                    >
                      {user.status === 'SUSPENDED' ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Reactivate
                        </>
                      ) : (
                        <>
                          <Ban className="w-3 h-3" /> Suspend
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Broadcast System Announcement */}
        <form
          onSubmit={handleSendBroadcast}
          className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Megaphone className="w-4 h-4 text-emerald-600" /> Broadcast Push Announcement
          </div>

          <div>
            <input
              type="text"
              value={announcementTitle}
              onChange={e => setAnnouncementTitle(e.target.value)}
              placeholder="Announcement title (e.g. Market Weekend Flash Discounts)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <textarea
              value={announcementBody}
              onChange={e => setAnnouncementBody(e.target.value)}
              placeholder="Message body broadcasted to all active Shoppers, Sellers, and Helpers across Nigeria..."
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isBroadcasting}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98"
          >
            {isBroadcasting ? 'Broadcasting...' : 'Publish Announcement'}
          </button>
        </form>

        {/* Commissions & Rates Configuration */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-emerald-600" /> Platform Fee Engine
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Base Helper Flat Fee (₦)
              </label>
              <input
                type="number"
                value={baseHelperFee}
                onChange={e => setBaseHelperFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Platform Commission (%)
              </label>
              <input
                type="number"
                value={platformCommissionPercent}
                onChange={e => setPlatformCommissionPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Changes update helper compensation algorithms across Lagos, Abuja, Port Harcourt & Ibadan.
          </p>
        </div>

        {/* High-Resolution Document Inspection Modal */}
        {previewDocModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-xl w-full flex flex-col max-h-[90vh]">
              <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold truncate max-w-xs">{previewDocModal.title || 'Submitted Document Audit'}</span>
                </div>
                <button
                  onClick={() => setPreviewDocModal({ isOpen: false })}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
                {previewDocModal.url ? (
                  <img
                    src={previewDocModal.url}
                    alt="Audited Document"
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] w-auto rounded-xl object-contain shadow-md"
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No image URL provided for this document.
                  </div>
                )}
                {previewDocModal.docName && (
                  <p className="font-mono text-[11px] text-slate-500 mt-3">{previewDocModal.docName}</p>
                )}
              </div>

              <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
                <button
                  onClick={() => setPreviewDocModal({ isOpen: false })}
                  className="py-1.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
