/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_CONFIG } from '@/config/api';

export interface Voucher {
  id: string;
  voucherCode: string;
  value: number;
}

export interface VoucherResponse {
  status: boolean;
  message: string;
  data: Voucher;
}

export class VoucherService {
  private static baseURL = `${API_CONFIG.baseURL}/voucher`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getVoucher(code: string): Promise<VoucherResponse> {
    const response = await fetch(`${this.baseURL}?code=${code}`, {
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
