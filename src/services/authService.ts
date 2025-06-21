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

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
  phone?: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    account: User;
  };
}

export interface RegisterResponse {
  status: boolean;
  message: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
}

export interface VerifyResponse {
  status: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  status: boolean;
  message: string;
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (fullname: string, phone: string, email: string, password: string, confirmPassword: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullname, phone, email, password, confirmPassword }),
    });
    return handleResponse(response);
  },

  verify: async (verificationCode: string): Promise<VerifyResponse> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verificationCode }),
    });
    return handleResponse(response);
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  resetPasswordWithCode: async (code: string, password: string, confirmPassword: string): Promise<ResetPasswordResponse> => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/reset-password/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, password, confirmPassword }),
    });
    return handleResponse(response);
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
};
