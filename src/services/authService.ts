interface LoginResponse {
  status: string;
  status_code: number;
  message: string;
  timestamp: string;
  token?: string;
  user_name?: string;
  id?: number;
  statusbool: boolean;
  ok: boolean;
  api_processing_time: number;
}

interface UserData {
  user_name: string;
  id: number;
  token: string;
}

class AuthService {
  private readonly API_BASE_URL = 'https://staging.qikpod.com/nanostore';
  private readonly STORAGE_KEYS = {
    USER_DATA: 'ams_user_data',
    TOKEN: 'ams_token'
  };

  async login(userPhone: string, password: string): Promise<LoginResponse> {
    const url = `${this.API_BASE_URL}/validate?user_phone=${encodeURIComponent(userPhone)}&password=${encodeURIComponent(password)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });

    const data: LoginResponse = await response.json();

    // Always return the parsed data, whether success or failure
    // The component will handle success/failure based on the status field
    return data;
  }

  storeUserData(userData: UserData): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(this.STORAGE_KEYS.TOKEN, userData.token);
      console.log('User data stored successfully:', userData);
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  getUserData(): UserData | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const userData = this.getUserData();
    return !!(token && userData);
  }

  clearUserData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
      console.log('User data cleared successfully');
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  // Helper method to get authorization header for API requests
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
