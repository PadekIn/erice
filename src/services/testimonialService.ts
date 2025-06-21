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

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  createdAt: string;
}

export const TestimonialService = {
  getTestimonials: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}/testimonials`);
    return handleResponse(response);
  },

  createTestimonial: async (testimonialData: { name: string; content: string; rating: number }) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(testimonialData),
    });
    return handleResponse(response);
  },
};
