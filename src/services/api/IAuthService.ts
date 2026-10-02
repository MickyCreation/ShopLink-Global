import {
  AppUser,
  UserRole,
  UserStatus,
  SellerHelperApplication,
  KycDetails,
  KycSubmissionPayload,
  UpdateProfilePayload
} from '../../types';

export interface AuthCredentials {
  emailOrPhone: string;
  password?: string;
  otp?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  role: 'SHOPPER' | 'SELLER' | 'SHOPPING_HELPER';
  password?: string;
  locationArea: string;
  // Role specific
  storeName?: string;
  storeAddress?: string;
  storeDescription?: string;
  serviceAreas?: string[];
  vehicleType?: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
}

export interface IAuthService {
  getCurrentUser(): Promise<AppUser | null>;
  login(credentials: AuthCredentials): Promise<AppUser>;
  register(payload: RegisterPayload): Promise<AppUser>;
  verifyOtp(phoneOrEmail: string, otp: string): Promise<boolean>;
  sendOtp(phoneOrEmail: string): Promise<boolean>;
  requestPasswordReset(phoneOrEmail: string): Promise<boolean>;
  logout(): Promise<void>;
  switchUserRole(role: UserRole): Promise<AppUser>;
  updateUserStatus(userId: string, status: UserStatus, reason?: string): Promise<boolean>;
  applyForHelperAccount(
    sellerId: string,
    details: {
      vehicleType: 'Motorcycle' | 'Bicycle' | 'Car' | 'Walking';
      serviceAreas: string[];
      ninOrIdNumber: string;
    }
  ): Promise<SellerHelperApplication>;
  getHelperApplications(): Promise<SellerHelperApplication[]>;
  reviewHelperApplication(applicationId: string, decision: 'APPROVE' | 'REJECT', reason?: string): Promise<void>;
  switchWorkspace(sellerId: string, workspace: 'SELLER' | 'SHOPPING_HELPER'): Promise<AppUser>;
  switchAccountUser(userId: string): Promise<AppUser>;
  updateProfile(userId: string, payload: UpdateProfilePayload): Promise<AppUser>;
  submitKyc(userId: string, payload: KycSubmissionPayload): Promise<AppUser>;
  getKycSubmissions(): Promise<Array<{ user: AppUser; kyc: KycDetails }>>;
  reviewKyc(userId: string, decision: 'APPROVE' | 'REJECT', reason?: string): Promise<AppUser>;
}
