
import { authService } from './authService';

export interface TrayAvailabilityResponse {
  status: string;
  status_code: number;
  message: string;
  timestamp: string;
  records: Array<{
    id: number;
    slot_name: string;
    tray_id: string | null;
    created_at: string;
    updated_at: string;
    slot_id: string;
    slot_status: string;
    slot_height: number;
    row: number;
    rack: number;
    slot: number;
    depth: number;
    tags: string[];
    status?: string | null;
  }>;
  count: number;
  statusbool: boolean;
  ok: boolean;
  api_processing_time: number;
}

class TrayAvailabilityService {
  private readonly API_BASE_URL = 'https://dev.qikpod.com/showcase';

  async checkTrayAvailability(trayId: string): Promise<{ isAvailable: boolean; stationName?: string }> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const url = `${this.API_BASE_URL}/slots?tray_id=${encodeURIComponent(trayId)}&tags=station&order_by_field=updated_at&order_by_type=ASC`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn(`Tray availability check failed: ${response.status}`);
        // If API fails, allow retrieval
        return { isAvailable: true };
      }

      const data: TrayAvailabilityResponse = await response.json();
      console.log('Tray availability check response:', data);
      
      // If there are records, the tray is already at a station
      if (data.records && data.records.length > 0) {
        const stationSlot = data.records[0];
        return { 
          isAvailable: false, 
          stationName: stationSlot.slot_name 
        };
      }
      
      // No records means tray is not at any station, so it's available for retrieval
      return { isAvailable: true };
      
    } catch (error) {
      console.warn('Tray availability check error:', error);
      // If API fails, allow retrieval
      return { isAvailable: true };
    }
  }
}

export const trayAvailabilityService = new TrayAvailabilityService();
