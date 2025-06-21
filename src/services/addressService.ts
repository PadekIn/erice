/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_CONFIG } from '@/config/api';

export interface Address {
  id: string;
  fullname: string;
  phone: string;
  street: string;
  village: string;
  subDistrict: string;
  city: string;
  province: string;
  country: string;
  postalCode: number;
}

export interface AddressResponse {
  status: boolean;
  message: string;
  data: Address[];
}

export interface AddAddressRequest {
  street: string;
  village: string;
  subDistrict: string;
  city: string;
  province: string;
  country: string;
  postalCode: number;
}

export interface AddAddressResponse {
  status: boolean;
  message: string;
  data: Address;
}

export class AddressService {
  private static baseURL = `${API_CONFIG.baseURL}/address`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getUserAddresses(): Promise<AddressResponse> {
    const response = await fetch(`${this.baseURL}`, {
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

  static async addAddress(addressData: AddAddressRequest): Promise<AddAddressResponse> {
    const response = await fetch(`${this.baseURL}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(addressData),
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
