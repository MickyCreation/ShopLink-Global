export type UserRole = 'SHOPPER' | 'SELLER' | 'SHOPPING_HELPER' | 'SUB_ADMIN' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';

export type KycStatus = 'NOT_SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export type KycTier = 'TIER_0_UNVERIFIED' | 'TIER_1_BASIC' | 'TIER_2_VERIFIED' | 'TIER_3_PREMIUM';

export type IdDocumentType =
  | 'NIN_SLIP'
  | 'NIN_CARD'
  | 'DRIVERS_LICENSE'
  | 'INTERNATIONAL_PASSPORT'
  | 'VOTERS_CARD'
  | 'CAC_CERTIFICATE';

export interface KycDetails {
  status: KycStatus;
  tier: KycTier;
  idType?: IdDocumentType;
  idNumber?: string;
  bvn?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  stateOfResidence?: string;
  lga?: string;
  documentFileName?: string;
  documentUrl?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface KycSubmissionPayload {
  idType: IdDocumentType;
  idNumber: string;
  bvn?: string;
  dateOfBirth: string;
  residentialAddress: string;
  stateOfResidence: string;
  lga: string;
  documentFileName: string;
  documentUrl?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  email?: string;
  locationArea?: string;
  residentialAddress?: string;
  // Seller fields
  storeName?: string;
  storeDescription?: string;
  storeAddress?: string;
  businessRegNumber?: string;
  // Helper fields
  vehicleType?: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
  serviceAreas?: string[];
}

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  locationArea: string;
  residentialAddress?: string;
  kyc?: KycDetails;
}

export interface ShopperUser extends BaseUser {
  role: 'SHOPPER';
  defaultAddressId?: string;
  loyaltyPoints?: number;
}

export interface SellerHelperApplication {
  id: string;
  sellerId: string;
  sellerName: string;
  storeName: string;
  phone: string;
  email: string;
  locationArea: string;
  vehicleType: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
  serviceAreas: string[];
  ninOrIdNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface SellerUser extends BaseUser {
  role: 'SELLER';
  storeName: string;
  storeDescription: string;
  storeAddress: string;
  businessRegNumber?: string;
  isOpen: boolean;
  rating: number;
  totalSalesCount: number;
  bannerUrl?: string;
  // Merged Seller & Helper account features
  helperApplicationStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  helperApplicationDetails?: {
    vehicleType: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
    serviceAreas: string[];
    appliedAt: string;
    rejectionReason?: string;
  };
  isMergedSellerHelper?: boolean;
  activeWorkspace?: 'SELLER' | 'SHOPPING_HELPER';
  helperVehicleType?: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
  helperServiceAreas?: string[];
  helperRating?: number;
  helperCompletedJobsCount?: number;
  helperTotalEarningsNaira?: number;
  isHelperAvailable?: boolean;
}

export interface ShoppingHelperUser extends BaseUser {
  role: 'SHOPPING_HELPER';
  isAvailable: boolean;
  serviceAreas: string[];
  rating: number;
  completedJobsCount: number;
  totalEarningsNaira: number;
  currentWorkload: number;
  vehicleType?: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
  approxLocation?: { lat: number; lng: number; areaName: string };
}

export interface SubAdminUser extends BaseUser {
  role: 'SUB_ADMIN';
  assignedZone: string; // e.g. "Lagos Mainland", "Lekki & Island", "Abuja Municipal"
  activeSupervisedRequestsCount: number;
}

export interface AdminUser extends BaseUser {
  role: 'ADMIN';
  isMasterAdmin: boolean;
}

export type AppUser = ShopperUser | SellerUser | ShoppingHelperUser | SubAdminUser | AdminUser;

export interface ProductCategory {
  id: string;
  name: string;
  iconName: string;
  itemCount: number;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // in Nigerian Naira (₦)
  originalPrice?: number;
  description: string;
  imageUrl: string;
  images?: string[]; // Multiple product photos / carousel angles
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerLocation: string;
  stockQuantity: number;
  isAvailable: boolean;
  unit: string; // e.g. "50kg bag", "1 Derica", "Bottle", "Pack of 10"
  featured?: boolean;
  popular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Address {
  id: string;
  title: string; // e.g. "Home", "Office", "Family House"
  fullAddress: string;
  area: string; // e.g. "Ikeja GRA", "Lekki Phase 1", "Wuse 2"
  city: string; // e.g. "Lagos", "Abuja", "Port Harcourt"
  state: string; // e.g. "Lagos State", "FCT", "Rivers State"
  isDefault: boolean;
  contactPhone: string;
  coordinates?: { lat: number; lng: number };
}

export type ShoppingRequestStatus =
  | 'CREATED'
  | 'PENDING_ASSIGNMENT'
  | 'HELPER_ASSIGNED'
  | 'ACCEPTED'
  | 'SHOPPING'
  | 'PURCHASED'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  preferredBrand?: string;
  notes?: string;
  estimatedPriceNaira?: number;
  isPurchased?: boolean;
  isUnavailable?: boolean;
  substituteNote?: string;
  actualPriceNaira?: number;
}

export interface ShoppingRequest {
  id: string;
  shopperId: string;
  shopperName: string;
  shopperPhone: string;
  title: string;
  items: ShoppingListItem[];
  targetMarketArea: string; // e.g. "Mile 12 Market", "Tejuosho Market", "Utako Market Abuja"
  deliveryAddress: Address;
  estimatedBudgetNaira: number;
  helperFeeNaira: number;
  status: ShoppingRequestStatus;
  assignedHelperId?: string;
  assignedHelperName?: string;
  assignedHelperPhone?: string;
  assignedHelperRating?: number;
  subAdminId?: string;
  createdAt: string;
  updatedAt: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  shoppingReceiptUrl?: string;
  totalActualAmountPaidNaira?: number;
  verificationCode?: string; // 4-digit code shopper provides to helper at delivery
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl: string;
  sellerId: string;
}

export interface OrderPickupHelper {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleType?: string;
  isSeller?: boolean;
  sellerStoreName?: string;
  pickupCode: string;
  pickupStatus: 'DISPATCHED' | 'ARRIVED_AT_SELLER' | 'ITEMS_COLLECTED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  assignedAt: string;
}

export interface Order {
  id: string;
  shopperId: string;
  shopperName: string;
  sellerId: string;
  sellerName: string;
  sellerStoreAddress?: string;
  items: OrderItem[];
  subtotalNaira: number;
  deliveryFeeNaira: number;
  totalNaira: number;
  status: OrderStatus;
  paymentMethod: 'BANK_TRANSFER' | 'CARD_PAYSTACK' | 'USSD' | 'CASH_ON_DELIVERY';
  isPaid: boolean;
  deliveryAddress: Address;
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveryType?: 'STANDARD_SHIPPING' | 'HELPER_PICKUP';
  pickupHelper?: OrderPickupHelper;
  helperAssigned?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
  };
}

export interface AvailableHelper {
  id: string;
  name: string;
  phone: string;
  rating: number;
  completedJobsCount: number;
  vehicleType: string;
  serviceAreas: string[];
  isAvailable: boolean;
  avatarUrl?: string;
  isSeller: boolean;
  sellerStoreName?: string;
  sellerStoreAddress?: string;
  sellerStoreDescription?: string;
  sellerRating?: number;
  sellerCategory?: string;
  kycTier?: KycTier;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  imageUrl?: string;
  isSystemMessage?: boolean;
  relatedRequestId?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type:
    | 'NEW_ORDER'
    | 'SHOPPING_REQUEST'
    | 'HELPER_ASSIGNED'
    | 'HELPER_ACCEPTED'
    | 'SHOPPING_PROGRESS'
    | 'PRODUCT_UPDATE'
    | 'ORDER_UPDATE'
    | 'DELIVERY_APPROACHING'
    | 'PAYMENT_UPDATE'
    | 'ADMIN_ANNOUNCEMENT'
    | 'SECURITY_ALERT';
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
  relatedId?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  amountNaira: number;
  type: 'ORDER_PAYMENT' | 'HELPER_PAYOUT' | 'COMMISSION_FEE' | 'REFUND';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  description: string;
  createdAt: string;
  reference: string;
}

export type LocationPermissionStatus = 'GRANTED' | 'DENIED' | 'PROMPT' | 'UNAVAILABLE';

export type TemplateType = 'responsive' | 'pixel9' | 'minimal' | 'tablet';
export type ColorTheme = 'emerald' | 'sunset' | 'cobalt' | 'purple';
