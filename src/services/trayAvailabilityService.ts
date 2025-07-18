
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

export interface TaskResponse {
  status: string;
  status_code: number;
  message: string;
  timestamp: string;
  records: Array<{
    id: number;
    task_id: string;
    tray_id: string;
    task_status: string;
    created_at: string;
    updated_at: string;
  }>;
  count: number;
  statusbool: boolean;
  ok: boolean;
  api_processing_time: number;
}

class TrayAvailabilityService {
  private readonly API_BASE_URL = 'https://dev.qikpod.com/showcase';

  async checkTrayAvailability(trayId: string): Promise<{ isAvailable: boolean; stationName?: string; isInProgress?: boolean }> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      // First check if there's an in-progress task for this tray
      const taskUrl = `${this.API_BASE_URL}/task?tray_id=${encodeURIComponent(trayId)}&task_status=inprogress`;
      
      const taskResponse = await fetch(taskUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (taskResponse.ok) {
        const taskData: TaskResponse = await taskResponse.json();
        console.log('Task check response:', taskData);
        
        // If there are in-progress tasks, the tray is not available
        if (taskData.records && taskData.records.length > 0) {
          return { 
            isAvailable: false, 
            isInProgress: true 
          };
        }
      } else {
        console.warn(`Task check failed: ${taskResponse.status}`);
      }

      // Then check if the tray is already at a station
      const slotsUrl = `${this.API_BASE_URL}/slots?tray_id=${encodeURIComponent(trayId)}&tags=station&order_by_field=updated_at&order_by_type=ASC`;
      
      const slotsResponse = await fetch(slotsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!slotsResponse.ok) {
        console.warn(`Slots availability check failed: ${slotsResponse.status}`);
        // If API fails, allow retrieval
        return { isAvailable: true };
      }

      const slotsData: TrayAvailabilityResponse = await slotsResponse.json();
      console.log('Slots availability check response:', slotsData);
      
      // If there are records, the tray is already at a station
      if (slotsData.records && slotsData.records.length > 0) {
        const stationSlot = slotsData.records[0];
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
