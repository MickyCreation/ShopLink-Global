import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppUser,
  UserRole,
  Product,
  CartItem,
  ShoppingRequest,
  Order,
  AppNotification,
  Address,
  LocationPermissionStatus,
  TemplateType,
  ColorTheme,
  SellerHelperApplication,
  SellerUser,
  KycDetails,
  KycSubmissionPayload,
  UpdateProfilePayload,
  AvailableHelper
} from '../types';
import {
  authService,
  productRepository,
  shoppingRequestRepository,
  orderRepository,
  locationService,
  notificationService
} from '../services/mock/MockServices';
import { biometricService } from '../services/biometrics/BiometricService';
import { MOCK_SAVED_ADDRESSES, MOCK_AVAILABLE_HELPERS } from '../services/mock/mockData';

export type ScreenType =
  // Shopper screens
  | 'SHOPPER_HOME'
  | 'SHOPPER_EXPLORE'
  | 'SHOPPER_CART'
  | 'SHOPPER_ORDERS'
  | 'SHOPPER_REQUESTS'
  | 'SHOPPER_CREATE_LIST'
  | 'SHOPPER_TRACKING'
  | 'SHOPPER_PROFILE'
  // Helper screens
  | 'HELPER_DASHBOARD'
  | 'HELPER_ACTIVE_JOB'
  | 'HELPER_EARNINGS'
  | 'HELPER_PROFILE'
  // Seller screens
  | 'SELLER_DASHBOARD'
  | 'SELLER_PRODUCTS'
  | 'SELLER_ORDERS'
  | 'SELLER_EARNINGS'
  | 'SELLER_PROFILE'
  // Sub-Admin screens
  | 'SUBADMIN_DASHBOARD'
  | 'SUBADMIN_REQUESTS'
  | 'SUBADMIN_HELPERS'
  // Admin screens
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_USERS'
  | 'ADMIN_REQUESTS'
  | 'ADMIN_TRANSACTIONS'
  | 'ADMIN_SETTINGS'
  // Shared
  | 'NOTIFICATIONS'
  | 'SETTINGS'
  | 'HELP_SUPPORT';

interface SnackbarState {
  open: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface AppContextType {
  currentUser: AppUser | null;
  userRole: UserRole;
  currentScreen: ScreenType;
  switchRole: (role: UserRole) => Promise<void>;
  navigateTo: (screen: ScreenType) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Active items
  activeShoppingRequest: ShoppingRequest | null;
  setActiveShoppingRequest: (req: ShoppingRequest | null) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  refreshRequests: () => Promise<void>;
  refreshOrders: () => Promise<void>;

  // Location & Addresses
  currentLocationArea: string;
  setCurrentLocationArea: (area: string) => void;
  locationPermission: LocationPermissionStatus;
  requestLocationPermission: () => Promise<void>;
  savedAddresses: Address[];
  defaultAddress: Address | null;
  setDefaultAddress: (id: string) => Promise<void>;
  addNewAddress: (addr: Omit<Address, 'id'>) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;

  // Device & Template UI
  templateType: TemplateType;
  setTemplateType: (template: TemplateType) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isDeviceFrameEnabled: boolean;
  toggleDeviceFrame: () => void;

  // Active Modals & Overlays
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;
  navigateToCategory: (categoryName: string) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  isChatOpen: boolean;
  chatTarget: { id: string; name: string; role: UserRole; requestId?: string } | null;
  openChatWith: (target: { id: string; name: string; role: UserRole; requestId?: string }) => void;
  closeChat: () => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Snackbar
  snackbar: SnackbarState;
  showSnackbar: (message: string, actionLabel?: string, onAction?: () => void) => void;
  closeSnackbar: () => void;

  // Biometrics
  isBiometricsEnrolled: boolean;
  isBiometricsEnabled: boolean;
  enrollBiometrics: (userName?: string) => Promise<boolean>;
  disableBiometrics: () => void;
  biometricPromptState: {
    isOpen: boolean;
    title: string;
    subtitle: string;
    amountNaira?: number;
    actionType?: 'SIGN_IN' | 'PAYMENT' | 'PAYOUT' | 'SECURITY';
    onSuccess: () => void;
    onCancel?: () => void;
  };
  requestBiometricAuth: (options: {
    title: string;
    subtitle: string;
    amountNaira?: number;
    actionType?: 'SIGN_IN' | 'PAYMENT' | 'PAYOUT' | 'SECURITY';
    onSuccess: () => void;
    onCancel?: () => void;
  }) => void;
  closeBiometricPrompt: () => void;

  // Repositories access
  products: Product[];
  refreshProducts: () => Promise<void>;

  // User Category Isolation & Merged Seller/Helper Account
  isMergedSellerHelper: boolean;
  activeWorkspace: 'SELLER' | 'SHOPPING_HELPER';
  toggleSellerHelperWorkspace: () => Promise<void>;
  applyForHelperAccount: (details: {
    vehicleType: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
    serviceAreas: string[];
    ninOrIdNumber: string;
  }) => Promise<boolean>;
  helperApplications: SellerHelperApplication[];
  approveHelperApplication: (applicationId: string) => Promise<void>;
  rejectHelperApplication: (applicationId: string, reason?: string) => Promise<void>;
  switchAccountUser: (userId: string) => Promise<void>;

  // Profile Update & KYC Security Implementation
  isKycModalOpen: boolean;
  setIsKycModalOpen: (open: boolean) => void;
  openKycModal: () => void;
  isProfileEditModalOpen: boolean;
  setIsProfileEditModalOpen: (open: boolean) => void;
  openProfileEditModal: () => void;
  updateUserProfile: (payload: UpdateProfilePayload) => Promise<void>;
  submitKyc: (payload: KycSubmissionPayload) => Promise<void>;
  kycSubmissions: Array<{ user: AppUser; kyc: KycDetails }>;
  refreshKycSubmissions: () => Promise<void>;
  approveKyc: (userId: string) => Promise<void>;
  rejectKyc: (userId: string, reason?: string) => Promise<void>;

  // Helper Pickup & Dual Merchant-Helper Infrastructure
  availableHelpers: AvailableHelper[];
  selectedHelperForDetail: AvailableHelper | null;
  setSelectedHelperForDetail: (helper: AvailableHelper | null) => void;
  isHelperProfileModalOpen: boolean;
  setIsHelperProfileModalOpen: (open: boolean) => void;
  openHelperProfile: (helper: AvailableHelper) => void;
  isSendHelperModalOpen: boolean;
  setIsSendHelperModalOpen: (open: boolean) => void;
  orderForHelperPickup: Order | null;
  openSendHelperForOrder: (order: Order) => void;
  assignHelperForOrderPickup: (orderId: string, helper: AvailableHelper) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('SHOPPER');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('SHOPPER_HOME');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('shoplink_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [activeShoppingRequest, setActiveShoppingRequest] = useState<ShoppingRequest | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [currentLocationArea, setCurrentLocationArea] = useState<string>('Ikeja GRA, Lagos');
  const [locationPermission, setLocationPermission] = useState<LocationPermissionStatus>('GRANTED');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(MOCK_SAVED_ADDRESSES);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('shoplink_dark') === 'true';
    } catch {
      return false;
    }
  });

  const [templateType, setTemplateTypeState] = useState<TemplateType>(() => {
    try {
      const stored = localStorage.getItem('shoplink_template');
      if (stored === 'pixel9' || stored === 'minimal' || stored === 'tablet' || stored === 'responsive') {
        return stored as TemplateType;
      }
      return 'responsive';
    } catch {
      return 'responsive';
    }
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    try {
      const stored = localStorage.getItem('shoplink_color_theme');
      if (stored === 'emerald' || stored === 'sunset' || stored === 'cobalt' || stored === 'purple') {
        return stored as ColorTheme;
      }
      return 'emerald';
    } catch {
      return 'emerald';
    }
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isDeviceFrameEnabled, setIsDeviceFrameEnabled] = useState<boolean>(templateType !== 'responsive');

  const setTemplateType = (t: TemplateType) => {
    setTemplateTypeState(t);
    setIsDeviceFrameEnabled(t !== 'responsive');
    try {
      localStorage.setItem('shoplink_template', t);
    } catch {
      // ignore
    }
  };

  const setColorTheme = (c: ColorTheme) => {
    setColorThemeState(c);
    try {
      localStorage.setItem('shoplink_color_theme', c);
    } catch {
      // ignore
    }
  };

  // Category Filter & Exploration
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const navigateToCategory = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    navigateTo('SHOPPER_EXPLORE');
  };

  // Modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string; role: UserRole; requestId?: string } | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '' });

  const showSnackbar = (message: string, actionLabel?: string, onAction?: () => void) => {
    setSnackbar({ open: true, message, actionLabel, onAction });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Biometrics State
  const [isBiometricsEnrolled, setIsBiometricsEnrolled] = useState<boolean>(() => {
    return biometricService.isEnrolled();
  });

  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState<boolean>(() => {
    return biometricService.isEnabled();
  });

  const [biometricPromptState, setBiometricPromptState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    amountNaira?: number;
    actionType?: 'SIGN_IN' | 'PAYMENT' | 'PAYOUT' | 'SECURITY';
    onSuccess: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    onSuccess: () => {}
  });

  const enrollBiometrics = async (userName?: string): Promise<boolean> => {
    const targetName = userName || currentUser?.name || 'ShopLink User';
    const targetId = currentUser?.id || 'shoplink_user_default';
    const res = await biometricService.enrollBiometrics(targetId, targetName);
    if (res.success) {
      setIsBiometricsEnrolled(true);
      setIsBiometricsEnabled(true);
      showSnackbar('Biometrics (Fingerprint / Face Unlock) successfully enabled!');
      return true;
    } else {
      showSnackbar(res.error || 'Failed to enroll biometrics');
      return false;
    }
  };

  const disableBiometrics = () => {
    biometricService.removeBiometrics();
    setIsBiometricsEnrolled(false);
    setIsBiometricsEnabled(false);
    showSnackbar('Biometric security disabled');
  };

  const requestBiometricAuth = (options: {
    title: string;
    subtitle: string;
    amountNaira?: number;
    actionType?: 'SIGN_IN' | 'PAYMENT' | 'PAYOUT' | 'SECURITY';
    onSuccess: () => void;
    onCancel?: () => void;
  }) => {
    setBiometricPromptState({
      isOpen: true,
      title: options.title,
      subtitle: options.subtitle,
      amountNaira: options.amountNaira,
      actionType: options.actionType,
      onSuccess: () => {
        setBiometricPromptState(prev => ({ ...prev, isOpen: false }));
        options.onSuccess();
      },
      onCancel: () => {
        setBiometricPromptState(prev => ({ ...prev, isOpen: false }));
        options.onCancel?.();
      }
    });
  };

  const closeBiometricPrompt = () => {
    setBiometricPromptState(prev => ({ ...prev, isOpen: false }));
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shoplink_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart save error:', e);
    }
  }, [cart]);

  const [helperApplications, setHelperApplications] = useState<SellerHelperApplication[]>([]);
  const [kycSubmissions, setKycSubmissions] = useState<Array<{ user: AppUser; kyc: KycDetails }>>([]);

  // Global KYC & Profile Update Modals
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState<boolean>(false);

  const openKycModal = () => setIsKycModalOpen(true);
  const openProfileEditModal = () => setIsProfileEditModalOpen(true);

  // Helper Pickup & Dual Merchant-Helper Infrastructure
  const [availableHelpers, setAvailableHelpers] = useState<AvailableHelper[]>(MOCK_AVAILABLE_HELPERS);
  const [selectedHelperForDetail, setSelectedHelperForDetail] = useState<AvailableHelper | null>(null);
  const [isHelperProfileModalOpen, setIsHelperProfileModalOpen] = useState<boolean>(false);
  const [isSendHelperModalOpen, setIsSendHelperModalOpen] = useState<boolean>(false);
  const [orderForHelperPickup, setOrderForHelperPickup] = useState<Order | null>(null);

  const openHelperProfile = (helper: AvailableHelper) => {
    setSelectedHelperForDetail(helper);
    setIsHelperProfileModalOpen(true);
  };

  const openSendHelperForOrder = (order: Order) => {
    setOrderForHelperPickup(order);
    setIsSendHelperModalOpen(true);
  };

  const assignHelperForOrderPickup = async (orderId: string, helper: AvailableHelper) => {
    try {
      const updated = await orderRepository.assignHelperForPickup(orderId, {
        id: helper.id,
        name: helper.name,
        phone: helper.phone,
        rating: helper.rating,
        vehicleType: helper.vehicleType,
        isSeller: helper.isSeller,
        sellerStoreName: helper.sellerStoreName
      });

      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(updated);
      }
      showSnackbar(
        `Helper ${helper.name} dispatched to pick up order from ${updated.sellerName}!`,
        'View Runs',
        () => navigateTo('SHOPPER_ORDERS')
      );
      setIsSendHelperModalOpen(false);
    } catch (e: any) {
      showSnackbar(e?.message || 'Failed to dispatch helper for pickup');
    }
  };

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        if (
          user.role === 'SELLER' &&
          (user as SellerUser).isMergedSellerHelper &&
          (user as SellerUser).activeWorkspace === 'SHOPPING_HELPER'
        ) {
          setUserRole('SHOPPING_HELPER');
          setRoleDefaultScreen('SHOPPING_HELPER');
        } else {
          setUserRole(user.role);
          setRoleDefaultScreen(user.role);
        }
      }
      const apps = await authService.getHelperApplications();
      setHelperApplications(apps);
      const kycs = await authService.getKycSubmissions();
      setKycSubmissions(kycs);
      await refreshProducts();
      await refreshRequests();
      await refreshOrders();
      if (user) {
        const notifs = await notificationService.getNotifications(user.id);
        setNotifications(notifs);
      }
      const perm = await locationService.getPermissionStatus();
      setLocationPermission(perm);
    };

    initialize();
  }, []);

  const refreshProducts = async () => {
    const prods = await productRepository.getProducts();
    setProducts(prods);
  };

  const refreshRequests = async () => {
    const reqs = await shoppingRequestRepository.getRequests();
    // Prioritize active in-progress request
    const inProgress = reqs.find(r => ['ACCEPTED', 'SHOPPING', 'PURCHASED', 'ON_THE_WAY'].includes(r.status));
    setActiveShoppingRequest(inProgress || reqs[0] || null);
  };

  const refreshOrders = async () => {
    const ords = await orderRepository.getOrders();
    setActiveOrder(ords[0] || null);
  };

  const setRoleDefaultScreen = (role: UserRole) => {
    switch (role) {
      case 'SHOPPER':
        setCurrentScreen('SHOPPER_HOME');
        break;
      case 'SELLER':
        setCurrentScreen('SELLER_DASHBOARD');
        break;
      case 'SHOPPING_HELPER':
        setCurrentScreen('HELPER_DASHBOARD');
        break;
      case 'SUB_ADMIN':
        setCurrentScreen('SUBADMIN_DASHBOARD');
        break;
      case 'ADMIN':
        setCurrentScreen('ADMIN_DASHBOARD');
        break;
    }
  };

  const switchRole = async (role: UserRole) => {
    const updatedUser = await authService.switchUserRole(role);
    setCurrentUser(updatedUser);
    setUserRole(role);
    setRoleDefaultScreen(role);
    showSnackbar(`Switched to ${role.replace('_', ' ')} Mode`);
  };

  const switchAccountUser = async (userId: string) => {
    const user = await authService.switchAccountUser(userId);
    setCurrentUser(user);
    if (
      user.role === 'SELLER' &&
      (user as SellerUser).isMergedSellerHelper &&
      (user as SellerUser).activeWorkspace === 'SHOPPING_HELPER'
    ) {
      setUserRole('SHOPPING_HELPER');
      setRoleDefaultScreen('SHOPPING_HELPER');
    } else {
      setUserRole(user.role);
      setRoleDefaultScreen(user.role);
    }
    const notifs = await notificationService.getNotifications(user.id);
    setNotifications(notifs);
    showSnackbar(`Logged in as ${user.name} (${user.role.replace('_', ' ')} Account)`);
  };

  const isMergedSellerHelper = Boolean(
    currentUser?.role === 'SELLER' && (currentUser as SellerUser).isMergedSellerHelper
  );

  const activeWorkspace: 'SELLER' | 'SHOPPING_HELPER' =
    ((currentUser as SellerUser)?.activeWorkspace as 'SELLER' | 'SHOPPING_HELPER') || 'SELLER';

  const toggleSellerHelperWorkspace = async () => {
    if (!currentUser || currentUser.role !== 'SELLER' || !(currentUser as SellerUser).isMergedSellerHelper) {
      showSnackbar('Only approved merged Seller & Helper accounts can toggle workspaces.');
      return;
    }
    const currentWs = (currentUser as SellerUser).activeWorkspace || 'SELLER';
    const nextWs: 'SELLER' | 'SHOPPING_HELPER' = currentWs === 'SELLER' ? 'SHOPPING_HELPER' : 'SELLER';
    const updated = await authService.switchWorkspace(currentUser.id, nextWs);
    setCurrentUser(updated);
    if (nextWs === 'SHOPPING_HELPER') {
      setUserRole('SHOPPING_HELPER');
      setCurrentScreen('HELPER_DASHBOARD');
      showSnackbar('Switched to Helper Workspace (Accepting deliveries)');
    } else {
      setUserRole('SELLER');
      setCurrentScreen('SELLER_DASHBOARD');
      showSnackbar('Switched to Seller Workspace (Store Management)');
    }
  };

  const applyForHelperAccount = async (details: {
    vehicleType: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
    serviceAreas: string[];
    ninOrIdNumber: string;
  }): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'SELLER') {
      showSnackbar('Only sellers can apply for a merged helper account.');
      return false;
    }
    try {
      const app = await authService.applyForHelperAccount(currentUser.id, details);
      const refreshed = await authService.getCurrentUser();
      setCurrentUser(refreshed);
      setHelperApplications(prev => [app, ...prev.filter(a => a.id !== app.id)]);
      showSnackbar('Application submitted! Awaiting Administrator review & account merge approval.');
      return true;
    } catch (err: any) {
      showSnackbar(err.message || 'Application submission failed.');
      return false;
    }
  };

  const approveHelperApplication = async (applicationId: string) => {
    await authService.reviewHelperApplication(applicationId, 'APPROVE');
    const apps = await authService.getHelperApplications();
    setHelperApplications(apps);
    const refreshedUser = await authService.getCurrentUser();
    setCurrentUser(refreshedUser);
    showSnackbar('Seller Helper Application APPROVED. Account privileges successfully merged under one login!');
  };

  const rejectHelperApplication = async (applicationId: string, reason?: string) => {
    await authService.reviewHelperApplication(applicationId, 'REJECT', reason);
    const apps = await authService.getHelperApplications();
    setHelperApplications(apps);
    const refreshedUser = await authService.getCurrentUser();
    setCurrentUser(refreshedUser);
    showSnackbar('Application rejected. Seller notified.');
  };

  // KYC Security Implementation & Profile Updates
  const refreshKycSubmissions = async () => {
    const list = await authService.getKycSubmissions();
    setKycSubmissions(list);
  };

  const updateUserProfile = async (payload: UpdateProfilePayload) => {
    if (!currentUser) return;
    try {
      const updated = await authService.updateProfile(currentUser.id, payload);
      setCurrentUser(updated);
      showSnackbar('Profile details updated successfully!');
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  const submitKyc = async (payload: KycSubmissionPayload) => {
    if (!currentUser) return;
    try {
      const updated = await authService.submitKyc(currentUser.id, payload);
      setCurrentUser(updated);
      await refreshKycSubmissions();
      showSnackbar('Identity & KYC submitted! Your documents are now under compliance review.');
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to submit KYC documents.');
      throw err;
    }
  };

  const approveKyc = async (userId: string) => {
    try {
      const updated = await authService.reviewKyc(userId, 'APPROVE');
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updated);
      }
      await refreshKycSubmissions();
      showSnackbar(`KYC approved for ${updated.name}! User verified.`);
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to approve KYC.');
    }
  };

  const rejectKyc = async (userId: string, reason?: string) => {
    try {
      const updated = await authService.reviewKyc(userId, 'REJECT', reason);
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updated);
      }
      await refreshKycSubmissions();
      showSnackbar(`KYC rejected for ${updated.name}.`);
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to reject KYC.');
    }
  };

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showSnackbar(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showSnackbar('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Location operations
  const requestLocationPermission = async () => {
    const perm = await locationService.requestPermission();
    setLocationPermission(perm);
    if (perm === 'GRANTED') {
      showSnackbar('Location access granted. Nearby stores & helpers activated.');
    }
  };

  const defaultAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || null;

  const setDefaultAddress = async (id: string) => {
    if (!currentUser) return;
    await locationService.setDefaultAddress(currentUser.id, id);
    setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    const addr = savedAddresses.find(a => a.id === id);
    if (addr) setCurrentLocationArea(addr.area);
    showSnackbar('Default delivery address updated');
  };

  const addNewAddress = async (addr: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const created = await locationService.saveAddress(currentUser.id, addr);
    setSavedAddresses(prev => [...prev, created]);
    showSnackbar('Address saved successfully');
  };

  // Notifications
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = async () => {
    if (!currentUser) return;
    await notificationService.markAllAsRead(currentUser.id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showSnackbar('All notifications marked as read');
  };

  // Chat
  const openChatWith = (target: { id: string; name: string; role: UserRole; requestId?: string }) => {
    setChatTarget(target);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setChatTarget(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('shoplink_dark', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleDeviceFrame = () => {
    setIsDeviceFrameEnabled(prev => {
      const next = !prev;
      setTemplateTypeState(next ? 'pixel9' : 'responsive');
      try {
        localStorage.setItem('shoplink_template', next ? 'pixel9' : 'responsive');
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        currentScreen,
        switchRole,
        navigateTo,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,

        activeShoppingRequest,
        setActiveShoppingRequest,
        activeOrder,
        setActiveOrder,
        refreshRequests,
        refreshOrders,

        currentLocationArea,
        setCurrentLocationArea,
        locationPermission,
        requestLocationPermission,
        savedAddresses,
        defaultAddress,
        setDefaultAddress,
        addNewAddress,

        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        templateType,
        setTemplateType,
        colorTheme,
        setColorTheme,
        isTemplateModalOpen,
        setIsTemplateModalOpen,
        isDarkMode,
        toggleDarkMode,
        isDeviceFrameEnabled,
        toggleDeviceFrame,

        selectedCategoryFilter,
        setSelectedCategoryFilter,
        navigateToCategory,

        selectedProductForDetail,
        setSelectedProductForDetail,
        isChatOpen,
        chatTarget,
        openChatWith,
        closeChat,
        isLocationModalOpen,
        setIsLocationModalOpen,

        snackbar,
        showSnackbar,
        closeSnackbar,

        isBiometricsEnrolled,
        isBiometricsEnabled,
        enrollBiometrics,
        disableBiometrics,
        biometricPromptState,
        requestBiometricAuth,
        closeBiometricPrompt,

        products,
        refreshProducts,

        isMergedSellerHelper,
        activeWorkspace,
        toggleSellerHelperWorkspace,
        applyForHelperAccount,
        helperApplications,
        approveHelperApplication,
        rejectHelperApplication,
        switchAccountUser,

        isKycModalOpen,
        setIsKycModalOpen,
        openKycModal,
        isProfileEditModalOpen,
        setIsProfileEditModalOpen,
        openProfileEditModal,
        updateUserProfile,
        submitKyc,
        kycSubmissions,
        refreshKycSubmissions,
        approveKyc,
        rejectKyc,

        availableHelpers,
        selectedHelperForDetail,
        setSelectedHelperForDetail,
        isHelperProfileModalOpen,
        setIsHelperProfileModalOpen,
        openHelperProfile,
        isSendHelperModalOpen,
        setIsSendHelperModalOpen,
        orderForHelperPickup,
        openSendHelperForOrder,
        assignHelperForOrderPickup
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
