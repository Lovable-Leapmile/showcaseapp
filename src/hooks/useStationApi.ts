
import { useState, useEffect, useCallback } from 'react';
import { stationApiService, StationSlot } from '@/services/stationApiService';

export const useStationApi = () => {
  const [stations, setStations] = useState<StationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStations = useCallback(async () => {
    try {
      setError(null);
      console.log('Fetching stations from API...');
      
      const response = await stationApiService.fetchStations();
      console.log('Station API Response received:', {
        status: response.status,
        statusbool: response.statusbool,
        recordsLength: response.records?.length || 0,
        count: response.count,
        fullResponse: response
      });
      
      if (response.statusbool && response.records) {
        // Only update state if data has actually changed
        const newStations = response.records;
        setStations(prevStations => {
          // Compare if data has changed to avoid unnecessary re-renders
          if (JSON.stringify(prevStations) !== JSON.stringify(newStations)) {
            console.log('Stations updated successfully:', {
              count: newStations.length,
              stations: newStations.map(s => ({ id: s.id, name: s.slot_name, tray_id: s.tray_id }))
            });
            setLastUpdated(new Date());
            return newStations;
          }
          return prevStations;
        });
      } else {
        const errorMsg = response.message || 'Failed to fetch stations - invalid response';
        console.error('API returned unsuccessful response:', response);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stations';
      setError(errorMessage);
      console.error('Station fetch error details:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });
      
      // Removed toast notifications to prevent popups
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    console.log('useStationApi: Initial fetch triggered');
    fetchStations();
  }, [fetchStations]);

  // Set up polling every 3 seconds
  useEffect(() => {
    console.log('useStationApi: Setting up 3-second polling');
    const interval = setInterval(() => {
      console.log('useStationApi: Polling fetch triggered');
      fetchStations();
    }, 3000);

    return () => {
      console.log('useStationApi: Cleaning up polling interval');
      clearInterval(interval);
    };
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

  console.log('useStationApi hook state:', {
    stationsCount: stations.length,
    loading,
    error,
    lastUpdated: lastUpdated?.toISOString()
  });

  return {
    stations,
    loading,
    error,
    lastUpdated,
    refetch: fetchStations,
    getStationStatus
  };
};
