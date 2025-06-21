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

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  weight: number;
  unit: string;
  image: string;
  description?: string;
  CategoryProduct: {
    id: string;
    name: string;
  };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const ProductService = {
  getProducts: async (filters?: ProductFilters) => {
    let url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}`;

    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const response = await fetch(url);
    return handleResponse(response);
  },

  getProduct: async (id: string) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}/${id}`);
    return handleResponse(response);
  },

  getProductById: async (id: string) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}/${id}`);
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.categories}`);
    return handleResponse(response);
  },

  getProductsCount: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}/products/count`);
    return handleResponse(response);
  },

  createProduct: async (formData: FormData) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  updateProduct: async (id: string, formData: FormData) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  deleteProduct: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
