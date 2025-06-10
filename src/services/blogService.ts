
import { API_CONFIG } from '@/config/api';

export interface Blog {
  id: string;
  title: string;
  metaDesc: string;
  content: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
  Author: {
    id: string;
    email: string;
    User: {
      fullname: string;
    }
  };
}

export interface BlogsResponse {
  status: boolean;
  message: string;
  data: Blog[];
}

export interface BlogResponse {
  status: boolean;
  message: string;
  data: Blog;
}

export interface BlogActionResponse {
  status: boolean;
  message: string;
  data: null;
}

export class BlogService {
  private static baseURL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async getBlogs(): Promise<BlogsResponse> {
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

  static async getBlog(id: string): Promise<BlogResponse> {
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

  static async createBlog(formData: FormData): Promise<BlogActionResponse> {
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

  static async updateBlog(id: string, formData: FormData): Promise<BlogActionResponse> {
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

  static async deleteBlog(id: string): Promise<BlogActionResponse> {
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
