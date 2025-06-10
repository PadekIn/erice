
import { API_CONFIG } from '@/config/api';

export interface ContactMessage {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  isReplied: boolean;
}

export interface ContactResponse {
  status: boolean;
  message: string;
  data: ContactMessage[];
}

export interface SendContactRequest {
  fullname: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export interface SendContactResponse {
  status: boolean;
  message: string;
  data: null;
}

export class ContactService {
  private static baseURL = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.contact}`;

  private static getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async sendMessage(contactData: SendContactRequest): Promise<SendContactResponse> {
    const response = await fetch(`${this.baseURL}s`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(contactData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async getMessages(): Promise<ContactResponse> {
    const response = await fetch(`${this.baseURL}s`, {
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
