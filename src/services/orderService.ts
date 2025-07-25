/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_CONFIG } from '@/config/api';

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.errors && data.errors.length > 0
      ? data.errors.map((err: any) => err.message || err).join(', ')
      : data.message || `HTTP error! status: ${response.status}`;

    const error = new Error(errorMessage);
    (error as any).response = { data };
    (error as any).errors = data.errors;
    throw error;
  }
  return data;
};

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

export const OrderService = {
  getOrders: async (params?: string) => {
    const token = localStorage.getItem('auth_token');
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}${params || ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getMyOrders: async (params?: string) => {
    const token = localStorage.getItem('auth_token');
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}/me${params || ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getOrderDetail: async (orderId: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  getOrdersCount: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/orders/count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getRecentOrders: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/orders/recent?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createOrder: async (orderData: CreateOrderRequest) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },
};
