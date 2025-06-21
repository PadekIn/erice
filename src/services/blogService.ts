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

export interface Blog {
  id: string;
  title: string;
  content: string;
  image: string;
  slug: string;
  metaDesc: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  Author: {
    User: {
      fullname: string;
    };
  };
}

export const BlogService = {
  getBlogPosts: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}`);
    return handleResponse(response);
  },

  getBlogs: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}`);
    return handleResponse(response);
  },

  getBlog: async (id: string) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}/${id}`);
    return handleResponse(response);
  },

  createBlog: async (formData: FormData) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  updateBlog: async (id: string, formData: FormData) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  deleteBlog: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
