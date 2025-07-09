
import { authService } from './authService';

export interface StationSlot {
  id: number;
  slot_name: string;
  tray_id: string | null;
  created_at: string;
  updated_at: string;
  tags: string;
  order_by_field?: string;
  order_by_type?: string;
}

export interface StationApiResponse {
  status: string;
  status_code: number;
  message: string;
  timestamp: string;
  data: StationSlot[];
  total_records: number;
  statusbool: boolean;
  ok: boolean;
  api_processing_time: number;
}

class StationApiService {
  private readonly API_BASE_URL = 'https://staging.qikpod.com/showcase';

  async fetchStations(): Promise<StationApiResponse> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const url = `${this.API_BASE_URL}/slots?tags=station&order_by_field=id&order_by_type=DESC`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StationApiResponse = await response.json();
    console.log('Station API Response:', data);
    
    return data;
  }
}

export const stationApiService = new StationApiService();
