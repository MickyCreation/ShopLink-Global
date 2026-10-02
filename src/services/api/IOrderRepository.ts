import { Order, OrderStatus, CartItem, Address } from '../../types';

export interface CheckoutPayload {
  shopperId: string;
  shopperName: string;
  cartItems: CartItem[];
  deliveryAddress: Address;
  paymentMethod: 'BANK_TRANSFER' | 'CARD_PAYSTACK' | 'USSD' | 'CASH_ON_DELIVERY';
  deliveryType?: 'STANDARD_SHIPPING' | 'HELPER_PICKUP';
  pickupHelper?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicleType?: string;
    isSeller?: boolean;
    sellerStoreName?: string;
  };
}

export interface IOrderRepository {
  getOrders(params?: {
    shopperId?: string;
    sellerId?: string;
    status?: OrderStatus;
  }): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(payload: CheckoutPayload): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  assignHelperForPickup(orderId: string, helper: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicleType?: string;
    isSeller?: boolean;
    sellerStoreName?: string;
  }): Promise<Order>;
  cancelOrder(orderId: string, reason?: string): Promise<Order>;
}
