import { ShoppingRequest, ShoppingRequestStatus, ShoppingListItem } from '../../types';

export interface CreateShoppingRequestPayload {
  shopperId: string;
  shopperName: string;
  shopperPhone: string;
  title: string;
  items: Omit<ShoppingListItem, 'id'>[];
  targetMarketArea: string;
  deliveryAddressId: string;
  estimatedBudgetNaira: number;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface IShoppingRequestRepository {
  getRequests(filter?: {
    shopperId?: string;
    helperId?: string;
    status?: ShoppingRequestStatus[];
    zone?: string;
  }): Promise<ShoppingRequest[]>;

  getRequestById(id: string): Promise<ShoppingRequest | null>;
  createRequest(payload: CreateShoppingRequestPayload): Promise<ShoppingRequest>;
  assignHelper(requestId: string, helperId: string, helperName: string): Promise<ShoppingRequest>;
  acceptRequest(requestId: string, helperId: string): Promise<ShoppingRequest>;
  updateRequestStatus(requestId: string, status: ShoppingRequestStatus, metadata?: Record<string, unknown>): Promise<ShoppingRequest>;
  updateListItem(requestId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<ShoppingRequest>;
  completeShopping(requestId: string, actualTotal: number, receiptUrl?: string): Promise<ShoppingRequest>;
  verifyAndDeliver(requestId: string, verificationCode: string): Promise<boolean>;
}
