
import { authService } from './authService';

class ApiService {
  private readonly baseHeaders = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  };

  private getHeaders(): Record<string, string> {
    return {
      ...this.baseHeaders,
      ...authService.getAuthHeader()
    };
  }

  async get(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      ...options
    });
  }

  async post(url: string, data?: any, options?: RequestInit): Promise<Response> {
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });
  }

  async put(url: string, data?: any, options?: RequestInit): Promise<Response> {
    return fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });
  }

  async delete(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      ...options
    });
  }
}

export const apiService = new ApiService();
