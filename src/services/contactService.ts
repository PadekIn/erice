
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

export interface SendContactRequest {
  fullname: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isReplied?: boolean;
  replyMessage?: string;
  createdAt: string;
}

export interface ReplyContactRequest {
  replyMessage: string;
}

export interface ReplyContactResponse {
  status: boolean;
  message: string;
  data: null;
}

export const ContactService = {
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

  sendMessage: async (contactData: SendContactRequest) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.contact}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    return handleResponse(response);
  },

  getMessages: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.contact}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  replyToMessage: async (messageId: string, replyData: ReplyContactRequest): Promise<ReplyContactResponse> => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.contact}/reply/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(replyData),
    });
    return handleResponse(response);
  },
};
