
import { authService } from './authService';

export interface TrayTaskResponse {
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
    task_type?: string;
    description?: string;
  }>;
  count: number;
  statusbool: boolean;
  ok: boolean;
  api_processing_time: number;
}

class TrayAvailabilityService {
  private readonly API_BASE_URL = 'https://dev.qikpod.com/showcase';

  async checkTrayAvailability(trayId: string): Promise<{ isAvailable: boolean; isInProgress: boolean; taskInfo?: any }> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const url = `${this.API_BASE_URL}/task?tray_id=${encodeURIComponent(trayId)}&task_status=inprogress`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn(`Tray task check failed: ${response.status}`);
        // If API fails, allow retrieval
        return { isAvailable: true, isInProgress: false };
      }

      const data: TrayTaskResponse = await response.json();
      console.log('Tray task check response:', data);
      
      // If there are records with inprogress status, the tray retrieval is in progress
      if (data.records && data.records.length > 0) {
        const inProgressTask = data.records.find(task => task.task_status === 'inprogress');
        if (inProgressTask) {
          return { 
            isAvailable: false, 
            isInProgress: true,
            taskInfo: inProgressTask
          };
        }
      }
      
      // No in-progress tasks found, tray is available for retrieval
      return { isAvailable: true, isInProgress: false };
      
    } catch (error) {
      console.warn('Tray task check error:', error);
      // If API fails, allow retrieval
      return { isAvailable: true, isInProgress: false };
    }
  }
}

export const trayAvailabilityService = new TrayAvailabilityService();
