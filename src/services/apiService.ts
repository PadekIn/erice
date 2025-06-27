/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_CONFIG } from '@/config/api';
import { BlogService } from './blogService';
import { OrderService } from './orderService';
import { ContactService } from './contactService';
import { TestimonialService } from './testimonialService';
import { ReviewService } from './reviewService';

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

export const ApiService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);

    // Return in the format expected by useApi
    return {
      token: data.data?.token,
      user: data.data?.account
    };
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getTestimonials: async () => {
    return TestimonialService.getTestimonials();
  },

  getBlogPosts: async () => {
    return BlogService.getBlogPosts();
  },

  getOrders: async (params?: string) => {
    return OrderService.getOrders(params);
  },

  getMyOrders: async (params?: string) => {
    return OrderService.getMyOrders(params);
  },

  getOrderDetail: async (orderId: string) => {
    return OrderService.getOrderDetail(orderId);
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return OrderService.updateOrderStatus(orderId, status);
  },

  getReviews: async () => {
    return ReviewService.getReviews();
  },

  getReviewsRecap: async () => {
    return ReviewService.getReviewsRecap();
  },

  submitContact: async (contactData: { name: string; email: string; message: string }) => {
    return ContactService.submitContact(contactData);
  },
};
