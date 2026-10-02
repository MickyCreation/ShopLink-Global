import {
  MOCK_USERS,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_SAVED_ADDRESSES,
  MOCK_SHOPPING_REQUESTS,
  MOCK_ORDERS,
  MOCK_NOTIFICATIONS,
  MOCK_CHAT_MESSAGES,
  MOCK_SELLER_HELPER_APPLICATIONS
} from './mockData';
import {
  AppUser,
  UserRole,
  UserStatus,
  Product,
  ProductCategory,
  Address,
  ShoppingRequest,
  ShoppingRequestStatus,
  ShoppingListItem,
  Order,
  OrderStatus,
  ChatMessage,
  AppNotification,
  LocationPermissionStatus,
  SellerHelperApplication,
  SellerUser,
  KycDetails,
  KycSubmissionPayload,
  UpdateProfilePayload
} from '../../types';
import { IAuthService, AuthCredentials, RegisterPayload } from '../api/IAuthService';
import { IProductRepository, ProductFilterParams } from '../api/IProductRepository';
import { IShoppingRequestRepository, CreateShoppingRequestPayload } from '../api/IShoppingRequestRepository';
import { IOrderRepository, CheckoutPayload } from '../api/IOrderRepository';
import { ILocationService, NigerianLocationArea } from '../api/ILocationService';
import { IChatService, SendMessagePayload } from '../api/IChatService';
import { INotificationService } from '../api/INotificationService';

// Storage keys
const STORAGE_PREFIX = 'shoplink_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

// In-Memory & Persisted Mock Auth Service
export class MockAuthService implements IAuthService {
  private users: Record<string, AppUser> = loadFromStorage('users', MOCK_USERS);
  private currentUserId: string = loadFromStorage('current_user_id', 'user_shopper_01');
  private applications: SellerHelperApplication[] = loadFromStorage('seller_helper_apps', MOCK_SELLER_HELPER_APPLICATIONS);

  async getCurrentUser(): Promise<AppUser | null> {
    const user =
      this.users[this.currentUserId] ||
      Object.values(this.users).find(u => u.id === this.currentUserId) ||
      MOCK_USERS.shopper;
    return user;
  }

  async login(credentials: AuthCredentials): Promise<AppUser> {
    const user = Object.values(this.users).find(
      u => u.email === credentials.emailOrPhone || u.phone === credentials.emailOrPhone
    ) || await this.getCurrentUser();

    if (!user) throw new Error('Account not found');
    if (user.status === 'SUSPENDED') throw new Error('Account is suspended. Please contact ShopLink compliance.');
    this.currentUserId = user.id;
    saveToStorage('current_user_id', user.id);
    return user;
  }

  async register(payload: RegisterPayload): Promise<AppUser> {
    const newId = `user_${Date.now()}`;
    const base = {
      id: newId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      status: 'ACTIVE' as UserStatus,
      createdAt: new Date().toISOString(),
      locationArea: payload.locationArea || 'Lagos, Nigeria'
    };

    let user: AppUser;
    if (payload.role === 'SELLER') {
      user = {
        ...base,
        role: 'SELLER',
        storeName: payload.storeName || `${payload.name}'s Shop`,
        storeDescription: payload.storeDescription || 'Quality retail and groceries in Nigeria.',
        storeAddress: payload.storeAddress || payload.locationArea,
        isOpen: true,
        rating: 5.0,
        totalSalesCount: 0,
        helperApplicationStatus: 'NONE',
        isMergedSellerHelper: false,
        activeWorkspace: 'SELLER'
      };
    } else if (payload.role === 'SHOPPING_HELPER') {
      user = {
        ...base,
        role: 'SHOPPING_HELPER',
        isAvailable: true,
        serviceAreas: payload.serviceAreas || ['Ikeja', 'Lekki'],
        rating: 5.0,
        completedJobsCount: 0,
        totalEarningsNaira: 0,
        currentWorkload: 0,
        vehicleType: payload.vehicleType || 'Motorcycle'
      };
    } else {
      user = {
        ...base,
        role: 'SHOPPER',
        loyaltyPoints: 50
      };
    }

    this.users[newId] = user;
    this.currentUserId = newId;
    saveToStorage('users', this.users);
    saveToStorage('current_user_id', this.currentUserId);
    return user;
  }

  async verifyOtp(_phoneOrEmail: string, otp: string): Promise<boolean> {
    // Accepts "123456" or any 6-digit code for testing
    return otp.length === 6;
  }

  async sendOtp(_phoneOrEmail: string): Promise<boolean> {
    return true;
  }

  async requestPasswordReset(_phoneOrEmail: string): Promise<boolean> {
    return true;
  }

  async logout(): Promise<void> {
    // Mock logout resets to shopper account
    this.currentUserId = 'user_shopper_01';
    saveToStorage('current_user_id', this.currentUserId);
  }

  async switchAccountUser(userId: string): Promise<AppUser> {
    const user = Object.values(this.users).find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    this.currentUserId = user.id;
    saveToStorage('current_user_id', user.id);
    return user;
  }

  async switchUserRole(role: UserRole): Promise<AppUser> {
    // Look for existing user of this role, or update currentUser if appropriate
    const targetUser = Object.values(this.users).find(u => u.role === role);
    if (targetUser) {
      this.currentUserId = targetUser.id;
      saveToStorage('current_user_id', targetUser.id);
      return targetUser;
    }
    const curr = await this.getCurrentUser();
    return curr!;
  }

  async updateUserStatus(userId: string, status: UserStatus, _reason?: string): Promise<boolean> {
    const user = Object.values(this.users).find(u => u.id === userId);
    if (user) {
      user.status = status;
      saveToStorage('users', this.users);
      return true;
    }
    return false;
  }

  // Seller -> Helper Application Workflow
  async applyForHelperAccount(
    sellerId: string,
    details: {
      vehicleType: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
      serviceAreas: string[];
      ninOrIdNumber: string;
    }
  ): Promise<SellerHelperApplication> {
    const seller = Object.values(this.users).find(u => u.id === sellerId && u.role === 'SELLER') as SellerUser | undefined;
    if (!seller) throw new Error('Only registered Sellers can apply for a merged Helper account.');

    const newApp: SellerHelperApplication = {
      id: `app_${Date.now()}`,
      sellerId: seller.id,
      sellerName: seller.name,
      storeName: seller.storeName,
      phone: seller.phone,
      email: seller.email,
      locationArea: seller.locationArea,
      vehicleType: details.vehicleType,
      serviceAreas: details.serviceAreas,
      ninOrIdNumber: details.ninOrIdNumber,
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };

    seller.helperApplicationStatus = 'PENDING';
    seller.helperApplicationDetails = {
      vehicleType: details.vehicleType,
      serviceAreas: details.serviceAreas,
      appliedAt: newApp.appliedAt
    };

    this.applications.unshift(newApp);
    saveToStorage('users', this.users);
    saveToStorage('seller_helper_apps', this.applications);
    return newApp;
  }

  async getHelperApplications(): Promise<SellerHelperApplication[]> {
    return [...this.applications];
  }

  async reviewHelperApplication(applicationId: string, decision: 'APPROVE' | 'REJECT', reason?: string): Promise<void> {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    app.status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    app.reviewedAt = new Date().toISOString();
    app.reviewedBy = 'Emeka Okonkwo (Platform Administrator)';
    app.rejectionReason = reason;

    const seller = Object.values(this.users).find(u => u.id === app.sellerId && u.role === 'SELLER') as SellerUser | undefined;
    if (seller) {
      if (decision === 'APPROVE') {
        // Merge the accounts under one login
        seller.isMergedSellerHelper = true;
        seller.helperApplicationStatus = 'APPROVED';
        seller.activeWorkspace = seller.activeWorkspace || 'SELLER';
        seller.helperVehicleType = app.vehicleType;
        seller.helperServiceAreas = app.serviceAreas;
        seller.helperRating = 5.0;
        seller.helperCompletedJobsCount = 0;
        seller.helperTotalEarningsNaira = 0;
        seller.isHelperAvailable = true;
      } else {
        seller.helperApplicationStatus = 'REJECTED';
        if (seller.helperApplicationDetails) {
          seller.helperApplicationDetails.rejectionReason = reason || 'Requirements not satisfied.';
        }
      }
    }

    saveToStorage('users', this.users);
    saveToStorage('seller_helper_apps', this.applications);
  }

  async switchWorkspace(sellerId: string, workspace: 'SELLER' | 'SHOPPING_HELPER'): Promise<AppUser> {
    const seller = Object.values(this.users).find(u => u.id === sellerId && u.role === 'SELLER') as SellerUser | undefined;
    if (!seller || !seller.isMergedSellerHelper) {
      throw new Error('Account does not have merged dual-workspace permissions.');
    }
    seller.activeWorkspace = workspace;
    saveToStorage('users', this.users);
    return seller;
  }

  async updateProfile(userId: string, payload: UpdateProfilePayload): Promise<AppUser> {
    const user = Object.values(this.users).find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    if (payload.name) user.name = payload.name;
    if (payload.phone) user.phone = payload.phone;
    if (payload.email) user.email = payload.email;
    if (payload.locationArea) user.locationArea = payload.locationArea;
    if (payload.residentialAddress) user.residentialAddress = payload.residentialAddress;

    if (user.role === 'SELLER') {
      const seller = user as SellerUser;
      if (payload.storeName) seller.storeName = payload.storeName;
      if (payload.storeDescription) seller.storeDescription = payload.storeDescription;
      if (payload.storeAddress) seller.storeAddress = payload.storeAddress;
      if (payload.businessRegNumber) seller.businessRegNumber = payload.businessRegNumber;
    } else if (user.role === 'SHOPPING_HELPER') {
      const helper = user as any;
      if (payload.vehicleType) helper.vehicleType = payload.vehicleType;
      if (payload.serviceAreas) helper.serviceAreas = payload.serviceAreas;
    }

    saveToStorage('users', this.users);
    return user;
  }

  async submitKyc(userId: string, payload: KycSubmissionPayload): Promise<AppUser> {
    const user = Object.values(this.users).find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const submittedKyc: KycDetails = {
      status: 'UNDER_REVIEW',
      tier: 'TIER_1_BASIC',
      idType: payload.idType,
      idNumber: payload.idNumber,
      bvn: payload.bvn,
      dateOfBirth: payload.dateOfBirth,
      residentialAddress: payload.residentialAddress,
      stateOfResidence: payload.stateOfResidence,
      lga: payload.lga,
      documentFileName: payload.documentFileName,
      documentUrl: payload.documentUrl,
      submittedAt: new Date().toISOString()
    };

    user.kyc = submittedKyc;
    if (payload.residentialAddress) {
      user.residentialAddress = payload.residentialAddress;
    }

    saveToStorage('users', this.users);
    return user;
  }

  async getKycSubmissions(): Promise<Array<{ user: AppUser; kyc: KycDetails }>> {
    const results: Array<{ user: AppUser; kyc: KycDetails }> = [];
    for (const u of Object.values(this.users)) {
      if (u.kyc && u.kyc.status !== 'NOT_SUBMITTED') {
        results.push({ user: u, kyc: u.kyc });
      }
    }
    return results.sort((a, b) => (b.kyc.submittedAt || '').localeCompare(a.kyc.submittedAt || ''));
  }

  async reviewKyc(userId: string, decision: 'APPROVE' | 'REJECT', reason?: string): Promise<AppUser> {
    const user = Object.values(this.users).find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    if (!user.kyc) throw new Error('No KYC record found for this user');

    if (decision === 'APPROVE') {
      user.kyc.status = 'VERIFIED';
      user.kyc.tier = user.role === 'ADMIN' ? 'TIER_3_PREMIUM' : 'TIER_2_VERIFIED';
      user.kyc.verifiedAt = new Date().toISOString();
      user.kyc.verifiedBy = 'Platform Compliance Administrator';
      user.kyc.rejectionReason = undefined;
    } else {
      user.kyc.status = 'REJECTED';
      user.kyc.rejectionReason = reason || 'Identification document or BVN could not be verified by national identity database.';
      user.kyc.verifiedAt = undefined;
    }

    saveToStorage('users', this.users);
    return user;
  }
}

// Mock Product Repository
export class MockProductRepository implements IProductRepository {
  private products: Product[] = loadFromStorage('products', MOCK_PRODUCTS);
  private categories: ProductCategory[] = loadFromStorage('categories', MOCK_CATEGORIES);

  async getCategories(): Promise<ProductCategory[]> {
    return [...this.categories];
  }

  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    let result = [...this.products];

    if (params?.category && params.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q)
      );
    }

    if (params?.minPrice !== undefined) {
      result = result.filter(p => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= params.maxPrice!);
    }

    if (params?.inStockOnly) {
      result = result.filter(p => p.isAvailable && p.stockQuantity > 0);
    }

    if (params?.sellerId) {
      result = result.filter(p => p.sellerId === params.sellerId);
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => (b.sellerRating || 0) - (a.sellerRating || 0));
          break;
        case 'newest':
          result.reverse();
          break;
        case 'popularity':
        default:
          result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
          break;
      }
    }

    return result;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return this.products.filter(p => p.sellerId === sellerId);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`
    };
    this.products.unshift(newProduct);
    saveToStorage('products', this.products);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.products[index] = { ...this.products[index], ...updates };
    saveToStorage('products', this.products);
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    this.products = this.products.filter(p => p.id !== id);
    saveToStorage('products', this.products);
    return true;
  }

  async toggleProductStock(id: string, isAvailable: boolean): Promise<boolean> {
    const prod = this.products.find(p => p.id === id);
    if (prod) {
      prod.isAvailable = isAvailable;
      saveToStorage('products', this.products);
      return true;
    }
    return false;
  }
}

// Mock Shopping Request Repository
export class MockShoppingRequestRepository implements IShoppingRequestRepository {
  private requests: ShoppingRequest[] = loadFromStorage('shopping_requests', MOCK_SHOPPING_REQUESTS);

  async getRequests(filter?: {
    shopperId?: string;
    helperId?: string;
    status?: ShoppingRequestStatus[];
    zone?: string;
  }): Promise<ShoppingRequest[]> {
    let list = [...this.requests];
    if (filter?.shopperId) {
      list = list.filter(r => r.shopperId === filter.shopperId);
    }
    if (filter?.helperId) {
      list = list.filter(r => r.assignedHelperId === filter.helperId);
    }
    if (filter?.status && filter.status.length > 0) {
      list = list.filter(r => filter.status!.includes(r.status));
    }
    return list;
  }

  async getRequestById(id: string): Promise<ShoppingRequest | null> {
    return this.requests.find(r => r.id === id) || null;
  }

  async createRequest(payload: CreateShoppingRequestPayload): Promise<ShoppingRequest> {
    const items: ShoppingListItem[] = payload.items.map((item, idx) => ({
      ...item,
      id: `item_${Date.now()}_${idx}`,
      isPurchased: false
    }));

    const newRequest: ShoppingRequest = {
      id: `REQ-NG-${Math.floor(10000 + Math.random() * 90000)}`,
      shopperId: payload.shopperId,
      shopperName: payload.shopperName,
      shopperPhone: payload.shopperPhone,
      title: payload.title,
      items,
      targetMarketArea: payload.targetMarketArea,
      deliveryAddress: MOCK_SAVED_ADDRESSES[0],
      estimatedBudgetNaira: payload.estimatedBudgetNaira,
      helperFeeNaira: Math.round(payload.estimatedBudgetNaira * 0.08) + 1500,
      status: 'PENDING_ASSIGNMENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: payload.priority,
      verificationCode: String(Math.floor(1000 + Math.random() * 9000))
    };

    this.requests.unshift(newRequest);
    saveToStorage('shopping_requests', this.requests);
    return newRequest;
  }

  async assignHelper(requestId: string, helperId: string, helperName: string): Promise<ShoppingRequest> {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    req.assignedHelperId = helperId;
    req.assignedHelperName = helperName;
    req.assignedHelperRating = 4.9;
    req.assignedHelperPhone = '+234 814 987 6543';
    req.status = 'HELPER_ASSIGNED';
    req.updatedAt = new Date().toISOString();
    saveToStorage('shopping_requests', this.requests);
    return req;
  }

  async acceptRequest(requestId: string, helperId: string): Promise<ShoppingRequest> {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    req.assignedHelperId = helperId;
    req.status = 'ACCEPTED';
    req.updatedAt = new Date().toISOString();
    saveToStorage('shopping_requests', this.requests);
    return req;
  }

  async updateRequestStatus(
    requestId: string,
    status: ShoppingRequestStatus,
    metadata?: Record<string, unknown>
  ): Promise<ShoppingRequest> {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    req.status = status;
    req.updatedAt = new Date().toISOString();
    if (metadata?.actualTotal) {
      req.totalActualAmountPaidNaira = metadata.actualTotal as number;
    }
    saveToStorage('shopping_requests', this.requests);
    return req;
  }

  async updateListItem(
    requestId: string,
    itemId: string,
    updates: Partial<ShoppingListItem>
  ): Promise<ShoppingRequest> {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    const item = req.items.find(i => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      saveToStorage('shopping_requests', this.requests);
    }
    return req;
  }

  async completeShopping(requestId: string, actualTotal: number, receiptUrl?: string): Promise<ShoppingRequest> {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    req.status = 'PURCHASED';
    req.totalActualAmountPaidNaira = actualTotal;
    req.shoppingReceiptUrl = receiptUrl || '/receipt_placeholder.png';
    req.updatedAt = new Date().toISOString();
    saveToStorage('shopping_requests', this.requests);
    return req;
  }

  async verifyAndDeliver(requestId: string, verificationCode: string): Promise<boolean> {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return false;
    if (req.verificationCode === verificationCode || verificationCode === '4829' || verificationCode === '1234') {
      req.status = 'COMPLETED';
      req.updatedAt = new Date().toISOString();
      saveToStorage('shopping_requests', this.requests);
      return true;
    }
    return false;
  }
}

// Mock Order Repository
export class MockOrderRepository implements IOrderRepository {
  private orders: Order[] = loadFromStorage('orders', MOCK_ORDERS);

  async getOrders(params?: { shopperId?: string; sellerId?: string; status?: OrderStatus }): Promise<Order[]> {
    let list = [...this.orders];
    if (params?.shopperId) {
      list = list.filter(o => o.shopperId === params.shopperId);
    }
    if (params?.sellerId) {
      list = list.filter(o => o.sellerId === params.sellerId);
    }
    if (params?.status) {
      list = list.filter(o => o.status === params.status);
    }
    return list;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null;
  }

  async createOrder(payload: CheckoutPayload): Promise<Order[]> {
    // Group cart items by seller
    const groups: Record<string, typeof payload.cartItems> = {};
    for (const item of payload.cartItems) {
      const sellerId = item.product.sellerId;
      if (!groups[sellerId]) groups[sellerId] = [];
      groups[sellerId].push(item);
    }

    const createdOrders: Order[] = [];

    for (const sellerId of Object.keys(groups)) {
      const items = groups[sellerId];
      const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const deliveryFee = payload.deliveryType === 'HELPER_PICKUP' ? 2500 : 2000;
      const pickupCode = payload.deliveryType === 'HELPER_PICKUP'
        ? `${Math.floor(1000 + Math.random() * 9000)}`
        : undefined;

      const order: Order = {
        id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        shopperId: payload.shopperId,
        shopperName: payload.shopperName,
        sellerId,
        sellerName: items[0].product.sellerName,
        sellerStoreAddress: items[0].product.sellerLocation || `${items[0].product.sellerName} Store`,
        items: items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          unit: i.product.unit,
          imageUrl: i.product.imageUrl,
          sellerId: i.product.sellerId
        })),
        subtotalNaira: subtotal,
        deliveryFeeNaira: deliveryFee,
        totalNaira: subtotal + deliveryFee,
        status: payload.deliveryType === 'HELPER_PICKUP' ? 'PROCESSING' : 'PENDING',
        paymentMethod: payload.paymentMethod,
        isPaid: payload.paymentMethod !== 'CASH_ON_DELIVERY',
        deliveryAddress: payload.deliveryAddress,
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: payload.deliveryType === 'HELPER_PICKUP' ? '30 mins (Helper Dispatched)' : '45 mins',
        deliveryType: payload.deliveryType || 'STANDARD_SHIPPING',
        pickupHelper: payload.pickupHelper && pickupCode
          ? {
              id: payload.pickupHelper.id,
              name: payload.pickupHelper.name,
              phone: payload.pickupHelper.phone,
              rating: payload.pickupHelper.rating,
              vehicleType: payload.pickupHelper.vehicleType,
              isSeller: payload.pickupHelper.isSeller,
              sellerStoreName: payload.pickupHelper.sellerStoreName,
              pickupCode,
              pickupStatus: 'DISPATCHED',
              assignedAt: new Date().toISOString()
            }
          : undefined,
        helperAssigned: payload.pickupHelper
          ? {
              id: payload.pickupHelper.id,
              name: payload.pickupHelper.name,
              phone: payload.pickupHelper.phone,
              rating: payload.pickupHelper.rating
            }
          : undefined
      };
      createdOrders.push(order);
      this.orders.unshift(order);
    }

    saveToStorage('orders', this.orders);
    return createdOrders;
  }

  async assignHelperForPickup(orderId: string, helper: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicleType?: string;
    isSeller?: boolean;
    sellerStoreName?: string;
  }): Promise<Order> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const pickupCode = `${Math.floor(1000 + Math.random() * 9000)}`;

    order.deliveryType = 'HELPER_PICKUP';
    order.pickupHelper = {
      id: helper.id,
      name: helper.name,
      phone: helper.phone,
      rating: helper.rating,
      vehicleType: helper.vehicleType,
      isSeller: helper.isSeller,
      sellerStoreName: helper.sellerStoreName,
      pickupCode,
      pickupStatus: 'DISPATCHED',
      assignedAt: new Date().toISOString()
    };
    order.helperAssigned = {
      id: helper.id,
      name: helper.name,
      phone: helper.phone,
      rating: helper.rating
    };
    if (order.status === 'PENDING' || order.status === 'CONFIRMED') {
      order.status = 'PROCESSING';
    }

    saveToStorage('orders', this.orders);
    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    saveToStorage('orders', this.orders);
    return order;
  }

  async cancelOrder(orderId: string, _reason?: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'CANCELLED');
  }
}

// Mock Location Service
export class MockLocationService implements ILocationService {
  private permission: LocationPermissionStatus = loadFromStorage('location_perm', 'GRANTED');
  private addresses: Address[] = loadFromStorage('addresses', MOCK_SAVED_ADDRESSES);

  async getPermissionStatus(): Promise<LocationPermissionStatus> {
    return this.permission;
  }

  async requestPermission(): Promise<LocationPermissionStatus> {
    this.permission = 'GRANTED';
    saveToStorage('location_perm', 'GRANTED');
    return this.permission;
  }

  async getCurrentPosition(): Promise<{ lat: number; lng: number; areaName: string } | null> {
    if (this.permission === 'DENIED') return null;
    return {
      lat: 6.5925,
      lng: 3.3542,
      areaName: 'Ikeja GRA, Lagos'
    };
  }

  async getSavedAddresses(_userId: string): Promise<Address[]> {
    return [...this.addresses];
  }

  async saveAddress(_userId: string, address: Omit<Address, 'id'>): Promise<Address> {
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`
    };
    if (newAddress.isDefault) {
      this.addresses.forEach(a => (a.isDefault = false));
    }
    this.addresses.push(newAddress);
    saveToStorage('addresses', this.addresses);
    return newAddress;
  }

  async deleteAddress(_userId: string, addressId: string): Promise<boolean> {
    this.addresses = this.addresses.filter(a => a.id !== addressId);
    saveToStorage('addresses', this.addresses);
    return true;
  }

  async setDefaultAddress(_userId: string, addressId: string): Promise<boolean> {
    this.addresses.forEach(a => {
      a.isDefault = a.id === addressId;
    });
    saveToStorage('addresses', this.addresses);
    return true;
  }

  async getOperationalAreas(): Promise<NigerianLocationArea[]> {
    return [
      { id: 'area_ikeja', name: 'Ikeja (GRA, Allen, Alausa)', state: 'Lagos', city: 'Ikeja', isPopularMarket: true, coordinates: { lat: 6.5925, lng: 3.3542 } },
      { id: 'area_lekki', name: 'Lekki Phase 1 & Victoria Island', state: 'Lagos', city: 'Lagos', isPopularMarket: false, coordinates: { lat: 6.4474, lng: 3.4734 } },
      { id: 'area_surulere', name: 'Surulere & Tejuosho Market', state: 'Lagos', city: 'Lagos', isPopularMarket: true, coordinates: { lat: 6.5000, lng: 3.3500 } },
      { id: 'area_mile12', name: 'Mile 12 International Food Market', state: 'Lagos', city: 'Ketu', isPopularMarket: true, coordinates: { lat: 6.6111, lng: 3.3986 } },
      { id: 'area_wuse', name: 'Wuse 2 & Wuse Market', state: 'FCT', city: 'Abuja', isPopularMarket: true, coordinates: { lat: 9.0667, lng: 7.4833 } },
      { id: 'area_utako', name: 'Utako Ultra Modern Market', state: 'FCT', city: 'Abuja', isPopularMarket: true, coordinates: { lat: 9.0558, lng: 7.4389 } }
    ];
  }
}

// Mock Chat Service
export class MockChatService implements IChatService {
  private messages: ChatMessage[] = loadFromStorage('chat_messages', MOCK_CHAT_MESSAGES);
  private listeners: ((message: ChatMessage) => void)[] = [];

  async getMessages(_userId1: string, _userId2: string, requestId?: string): Promise<ChatMessage[]> {
    if (requestId) {
      return this.messages.filter(m => m.relatedRequestId === requestId);
    }
    return [...this.messages];
  }

  async sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: payload.senderId,
      senderName: payload.senderName,
      senderRole: payload.senderRole,
      receiverId: payload.receiverId,
      content: payload.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      relatedRequestId: payload.relatedRequestId,
      imageUrl: payload.imageUrl
    };

    this.messages.push(newMsg);
    saveToStorage('chat_messages', this.messages);
    this.listeners.forEach(cb => cb(newMsg));
    return newMsg;
  }

  async markAsRead(messageIds: string[]): Promise<void> {
    this.messages.forEach(m => {
      if (messageIds.includes(m.id)) m.isRead = true;
    });
    saveToStorage('chat_messages', this.messages);
  }

  subscribeToChat(_userId: string, callback: (message: ChatMessage) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
}

// Mock Notification Service
export class MockNotificationService implements INotificationService {
  private notifications: AppNotification[] = loadFromStorage('notifications', MOCK_NOTIFICATIONS);
  private listeners: ((n: AppNotification) => void)[] = [];

  async getNotifications(_userId: string): Promise<AppNotification[]> {
    return [...this.notifications];
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) notif.isRead = true;
    saveToStorage('notifications', this.notifications);
  }

  async markAllAsRead(_userId: string): Promise<void> {
    this.notifications.forEach(n => (n.isRead = true));
    saveToStorage('notifications', this.notifications);
  }

  async sendNotification(data: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): Promise<AppNotification> {
    const newNotif: AppNotification = {
      ...data,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };
    this.notifications.unshift(newNotif);
    saveToStorage('notifications', this.notifications);
    this.listeners.forEach(cb => cb(newNotif));
    return newNotif;
  }

  subscribeToNotifications(_userId: string, callback: (notification: AppNotification) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
}

// Global Singleton Services
export const authService = new MockAuthService();
export const productRepository = new MockProductRepository();
export const shoppingRequestRepository = new MockShoppingRequestRepository();
export const orderRepository = new MockOrderRepository();
export const locationService = new MockLocationService();
export const chatService = new MockChatService();
export const notificationService = new MockNotificationService();
