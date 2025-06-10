
import { API_CONFIG } from '@/config/api';

export interface CartItem {
  id: string;
  Product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  qty: number;
}

export interface CartResponse {
  status: boolean;
  message: string;
  data: CartItem[];
}

export interface CartItemResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    productId: string;
    qty: number;
  };
}

export interface CartActionResponse {
  status: boolean;
  message: string;
  data: null;
}

export class CartService {
  private static baseURL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getCart(): Promise<CartResponse> {
    const response = await fetch(this.baseURL, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async addToCart(productId: string, qty: number): Promise<CartItemResponse> {
    console.log({ productId, qty });
    const response = await fetch(`${this.baseURL}/add`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ productId, qty }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors[0].message || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async incrementItem(id: string): Promise<CartActionResponse> {
    const response = await fetch(`${this.baseURL}/item/inc/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors[0].message || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async decrementItem(id: string): Promise<CartActionResponse> {
    const response = await fetch(`${this.baseURL}/item/dec/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors[0].message || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async removeItem(id: string): Promise<CartActionResponse> {
    const response = await fetch(`${this.baseURL}/item/remove/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors[0].message || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }
}
