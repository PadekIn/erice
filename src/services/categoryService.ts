
import { API_CONFIG } from '@/config/api';

export interface Category {
  id: string;
  name: string;
  description: string;
  cover: string;
  productCount: number;
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: Category[];
}

export class CategoryService {
  private static baseURL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.categories}`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getCategories(): Promise<CategoriesResponse> {
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
