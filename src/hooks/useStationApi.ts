
import { useState, useEffect, useCallback } from 'react';
import { stationApiService, StationSlot } from '@/services/stationApiService';
import { toast } from '@/hooks/use-toast';

export const useStationApi = () => {
  const [stations, setStations] = useState<StationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStations = useCallback(async () => {
    try {
      setError(null);
      const response = await stationApiService.fetchStations();
      
      if (response.statusbool && response.data) {
        setStations(response.data);
        setLastUpdated(new Date());
        console.log('Stations updated:', response.data.length, 'stations');
      } else {
        throw new Error(response.message || 'Failed to fetch stations');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stations';
      setError(errorMessage);
      console.error('Station fetch error:', errorMessage);
      
      if (errorMessage.includes('401') || errorMessage.includes('authentication')) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Set up polling every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStations();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchStations]);

  const getStationStatus = (station: StationSlot) => {
    return {
      isOccupied: station.tray_id !== null,
      displayText: station.tray_id 
        ? `Occupied – Tray ID: ${station.tray_id}` 
        : 'Available / Free',
      statusColor: station.tray_id ? 'occupied' : 'available'
    };
  };

  return {
    stations,
    loading,
    error,
    lastUpdated,
    refetch: fetchStations,
    getStationStatus
  };
};
