
import { API_CONFIG } from '@/config/api';

export interface Shipping {
  id: string;
  name: string;
  cost: number;
}

export interface ShippingResponse {
  status: boolean;
  message: string;
  data: Shipping[];
}

export class ShippingService {
  private static baseURL = `${API_CONFIG.baseURL}/shippings`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getShippings(): Promise<ShippingResponse> {
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
}
