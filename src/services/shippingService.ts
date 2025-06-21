/* eslint-disable @typescript-eslint/no-explicit-any */

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
      // Create error object with proper structure for error handling
      const errorMessage = data.errors && data.errors.length > 0
        ? data.errors.map((err: any) => err.message || err).join(', ')
        : data.message || `HTTP error! status: ${response.status}`;

      const error = new Error(errorMessage);
      (error as any).response = { data };
      (error as any).errors = data.errors;
      throw error;
    }

    return data;
  }
}
