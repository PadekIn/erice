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

export interface Review {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  createdAt: string;
}

export const ReviewService = {
  getReviews: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/reviews`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getReviewsRecap: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/reviews/recap`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createReview: async (reviewData: { rating: number; comment: string; productId: string }) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },
};
