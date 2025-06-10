
import { API_CONFIG } from '@/config/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  weight: number;
  price: number;
  stock: number;
  image: string;
  CategoryProduct: {
    id: string;
    name: string;
  };
}

export interface ProductsResponse {
  status: boolean;
  message: string;
  data: Product[];
}

export interface ProductResponse {
  status: boolean;
  message: string;
  data: Product;
}

export interface ProductActionResponse {
  status: boolean;
  message: string;
  data: Product | null;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  categoryProductId?: string;
}

export class ProductService {
  private static baseURL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.categoryProductId) params.append('categoryProductId', filters.categoryProductId);

    const url = `${this.baseURL}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async getProduct(id: string): Promise<ProductResponse> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async createProduct(formData: FormData): Promise<ProductActionResponse> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async updateProduct(id: string, formData: FormData): Promise<ProductActionResponse> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async deleteProduct(id: string): Promise<ProductActionResponse> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }
}
