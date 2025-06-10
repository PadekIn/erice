import { API_CONFIG } from '@/config/api';

export interface LoginResponse {
  status: boolean;
  message: string;
  errors?: Array<{ message: string }>;
  data: {
    account: {
      id: string;
      email: string;
      fullname: string;
      role: 'Admin' | 'User';
      expToken: Date;
    };
    token: string;
  };
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  errors?: Array<{ message: string }>;
  data: null;
}

export interface VerifyResponse {
  status: boolean;
  message: string;
  errors?: Array<{ message: string }>;
  data: null;
}

export interface ResetPasswordResponse {
  status: boolean;
  message: string;
  errors?: Array<{ message: string }>;
  data: null;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
  errors?: Array<{ message: string }>;
  data: null;
}

export class AuthService {
  private static baseURL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}`;

  static async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Create error object with proper structure for error handling
      const errorMessage = data.errors && data.errors.length > 0 
        ? data.errors.map((err: any) => err.message || err).join(', ')
        : data.message || `HTTP error! status: ${response.status}`;
      
      const error = new Error(errorMessage);
      (error as any).response = { data };
      (error as any).errors = data.errors;
      throw error;
    }

    return data;
  }

  static async register(
    fullname: string, 
    phone: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullname, phone, email, password, confirmPassword }),
    });

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
  }

  static async verify(verificationCode: string): Promise<VerifyResponse> {
    const response = await fetch(`${this.baseURL}/verify/${verificationCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
  }

  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await fetch(`${this.baseURL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

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
  }

  static async resetPasswordWithCode(
    code: string, 
    password: string, 
    confirmPassword: string
  ): Promise<ResetPasswordResponse> {
    const response = await fetch(`${this.baseURL}/reset-password/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, confirmPassword }),
    });

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
  }

  static logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  static getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getStoredToken() {
    return localStorage.getItem('auth_token');
  }

  static isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    
    if (!token || !user) return false;
    
    // Check if token is expired
    const expDate = new Date(user.expToken);
    return expDate > new Date();
  }
}
