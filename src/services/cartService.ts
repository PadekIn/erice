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

export interface CartItem {
  id: string;
  qty: number;
  Product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export const CartService = {
  getCart: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  addToCart: async (productId: string, qty: number) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, qty }),
    });
    return handleResponse(response);
  },

  incrementItem: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}/increment/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  incrementCartItem: async (id: string) => {
    return CartService.incrementItem(id);
  },

  decrementItem: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}/decrement/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  decrementCartItem: async (id: string) => {
    return CartService.decrementItem(id);
  },

  removeItem: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  removeCartItem: async (id: string) => {
    return CartService.removeItem(id);
  },
};
