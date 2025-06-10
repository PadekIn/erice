import { API_CONFIG } from '@/config/api';

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  return data;
};

export const ApiService = {
  getProducts: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}`);
    return handleResponse(response);
  },

  getProductById: async (id: string) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}/${id}`);
    return handleResponse(response);
  },

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

  getTestimonials: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.testimonials}`);
    return handleResponse(response);
  },

  getBlogPosts: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.blog}`);
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
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

  submitContact: async (contactData: { name: string; email: string; message: string }) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.contact}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.categories}`);
    return handleResponse(response);
  },

  getCart: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  incrementCartItem: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}/increment/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  decrementCartItem: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}/decrement/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  removeCartItem: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  getReviews: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  getReviewsRecap: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}/reviews/recap`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews recap');
    }
    return response.json();
  },
};
