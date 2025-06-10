
import { API_CONFIG } from '@/config/api';

export interface CreateOrderRequest {
  shippingId: string;
  addressId: string;
  voucherId?: string;
  notes?: string;
  tax: number;
  total: number;
  products: Array<{
    productId: string;
    qty: number;
    price: number;
  }>;
}

export interface CreateOrderResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    orderNumber: string;
    total: number;
    paymentUrl: string;
  };
}

export class OrderService {
  private static baseURL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }
}
