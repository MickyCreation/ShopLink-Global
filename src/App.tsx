/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidDeviceFrame } from './components/android/AndroidDeviceFrame';
import { AndroidBottomNav } from './components/android/AndroidBottomNav';
import { AndroidSnackbar } from './components/android/AndroidSnackbar';
import { AndroidPermissionDialog } from './components/android/AndroidPermissionDialog';
import { AndroidBiometricPrompt } from './components/common/AndroidBiometricPrompt';

import { LocationModal } from './components/common/LocationModal';
import { ProductDetailSheet } from './components/shopper/ProductDetailSheet';
import { InAppChatModal } from './components/chat/InAppChatModal';
import { AuthFlowModal } from './components/auth/AuthFlowModal';
import { KycVerificationModal } from './components/profile/KycVerificationModal';
import { ProfileEditModal } from './components/profile/ProfileEditModal';
import { HelperProfileModal } from './components/shopper/HelperProfileModal';
import { SendHelperPickupModal } from './components/shopper/SendHelperPickupModal';

// Screens
import { ShopperHomeScreen } from './components/shopper/ShopperHomeScreen';
import { ShopperExploreScreen } from './components/shopper/ShopperExploreScreen';
import { ShopperCartScreen } from './components/shopper/ShopperCartScreen';
import { ShopperOrdersScreen } from './components/shopper/ShopperOrdersScreen';
import { ShoppingListCreatorScreen } from './components/shopper/ShoppingListCreatorScreen';
import { ShopperTrackingScreen } from './components/shopper/ShopperTrackingScreen';

import { HelperDashboardScreen } from './components/helper/HelperDashboardScreen';
import { HelperActiveJobScreen } from './components/helper/HelperActiveJobScreen';
import { HelperEarningsScreen } from './components/helper/HelperEarningsScreen';

import { SellerDashboardScreen } from './components/seller/SellerDashboardScreen';
import { SellerProductsScreen } from './components/seller/SellerProductsScreen';
import { SellerOrdersScreen } from './components/seller/SellerOrdersScreen';

import { SubAdminDashboardScreen } from './components/subadmin/SubAdminDashboardScreen';
import { AdminDashboardScreen } from './components/admin/AdminDashboardScreen';
import { NotificationCenterScreen } from './components/notifications/NotificationCenterScreen';
import { ProfileSettingsScreen } from './components/profile/ProfileSettingsScreen';

const AppContent: React.FC = () => {
  const {
    currentScreen,
    locationPermission,
    requestLocationPermission,
    userRole,
    biometricPromptState,
    closeBiometricPrompt,
    isKycModalOpen,
    setIsKycModalOpen,
    openKycModal,
    isProfileEditModalOpen,
    setIsProfileEditModalOpen,
    openProfileEditModal
  } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  // Render current active screen
  const renderScreen = () => {
    switch (currentScreen) {
      // Shopper
      case 'SHOPPER_HOME':
        return <ShopperHomeScreen />;
      case 'SHOPPER_EXPLORE':
        return <ShopperExploreScreen />;
      case 'SHOPPER_CART':
        return <ShopperCartScreen />;
      case 'SHOPPER_ORDERS':
      case 'SHOPPER_REQUESTS':
        return <ShopperOrdersScreen />;
      case 'SHOPPER_CREATE_LIST':
        return <ShoppingListCreatorScreen />;
      case 'SHOPPER_TRACKING':
        return <ShopperTrackingScreen />;
      case 'SHOPPER_PROFILE':
        return <ProfileSettingsScreen onOpenAuth={() => setIsAuthModalOpen(true)} />;

      // Helper
      case 'HELPER_DASHBOARD':
        return <HelperDashboardScreen />;
      case 'HELPER_ACTIVE_JOB':
        return <HelperActiveJobScreen />;
      case 'HELPER_EARNINGS':
        return <HelperEarningsScreen />;
      case 'HELPER_PROFILE':
        return <ProfileSettingsScreen onOpenAuth={() => setIsAuthModalOpen(true)} />;

      // Seller
      case 'SELLER_DASHBOARD':
        return <SellerDashboardScreen />;
      case 'SELLER_PRODUCTS':
        return <SellerProductsScreen />;
      case 'SELLER_ORDERS':
      case 'SELLER_EARNINGS':
        return <SellerOrdersScreen />;
      case 'SELLER_PROFILE':
        return <ProfileSettingsScreen onOpenAuth={() => setIsAuthModalOpen(true)} />;

      // Sub-Admin
      case 'SUBADMIN_DASHBOARD':
      case 'SUBADMIN_REQUESTS':
      case 'SUBADMIN_HELPERS':
        return <SubAdminDashboardScreen />;

      // Admin
      case 'ADMIN_DASHBOARD':
      case 'ADMIN_USERS':
      case 'ADMIN_REQUESTS':
      case 'ADMIN_TRANSACTIONS':
      case 'ADMIN_SETTINGS':
        return <AdminDashboardScreen />;

      // Shared
      case 'NOTIFICATIONS':
        return <NotificationCenterScreen />;
      case 'SETTINGS':
      case 'HELP_SUPPORT':
        return <ProfileSettingsScreen onOpenAuth={() => setIsAuthModalOpen(true)} />;

      default:
        return <ShopperHomeScreen />;
    }
  };

  return (
    <AndroidDeviceFrame>
      <div className="flex-1 flex flex-col relative w-full h-full">
        {/* Active Screen View */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar">
          {renderScreen()}
        </div>

        {/* Material 3 Bottom Navigation Bar */}
        <AndroidBottomNav />

        {/* Global Sheets & Modals */}
        <ProductDetailSheet />
        <LocationModal />
        <InAppChatModal />
        <AuthFlowModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <KycVerificationModal
          isOpen={isKycModalOpen}
          onClose={() => setIsKycModalOpen(false)}
          onOpenProfileEdit={() => {
            setIsKycModalOpen(false);
            setIsProfileEditModalOpen(true);
          }}
        />
        <ProfileEditModal
          isOpen={isProfileEditModalOpen}
          onClose={() => setIsProfileEditModalOpen(false)}
          onOpenKyc={() => {
            setIsProfileEditModalOpen(false);
            setIsKycModalOpen(true);
          }}
        />
        <HelperProfileModal />
        <SendHelperPickupModal />
        <AndroidSnackbar />
        <AndroidBiometricPrompt
          isOpen={biometricPromptState.isOpen}
          title={biometricPromptState.title}
          subtitle={biometricPromptState.subtitle}
          amountNaira={biometricPromptState.amountNaira}
          actionType={biometricPromptState.actionType}
          onSuccess={biometricPromptState.onSuccess}
          onCancel={biometricPromptState.onCancel || closeBiometricPrompt}
          onUsePin={closeBiometricPrompt}
        />

        {/* Android 14 Location Permission Dialog */}
        <AndroidPermissionDialog
          isOpen={showLocationDialog}
          onGrant={async () => {
            await requestLocationPermission();
            setShowLocationDialog(false);
          }}
          onDeny={() => setShowLocationDialog(false)}
        />
      </div>
    </AndroidDeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
