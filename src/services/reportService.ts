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

export const ReportService = {
  getMonthlySales: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/reports/sales/monthly`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getSalesChart: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_CONFIG.baseURL}/reports/sales/grafik`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getSalesReportByUser: async (startDate?: string, endDate?: string) => {
    const token = localStorage.getItem('auth_token');
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${API_CONFIG.baseURL}/reports/sales/user${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getSalesReportByProduct: async (startDate?: string, endDate?: string) => {
    const token = localStorage.getItem('auth_token');
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${API_CONFIG.baseURL}/reports/sales/product${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
