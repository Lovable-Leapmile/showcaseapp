
import { useState, useCallback } from 'react';
import { Station, Part } from '@/types/ams';
import { INITIAL_STATIONS } from '@/data/initialData';

export const useStationManager = () => {
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const occupyStation = useCallback((stationId: string, part: Part) => {
    setStations(prev => prev.map(station => 
      station.id === stationId 
        ? { ...station, occupied: true, part }
        : station
    ));
  }, []);

  const releaseStation = useCallback((stationId: string) => {
    setStations(prev => prev.map(station => 
      station.id === stationId 
        ? { ...station, occupied: false, part: undefined }
        : station
    ));
  }, []);

  const getAvailableStation = useCallback(() => {
    return stations.find(station => !station.occupied) || null;
  }, [stations]);

  const getOccupiedStations = useCallback(() => {
    return stations.filter(station => station.occupied);
  }, [stations]);

  return {
    stations,
    selectedStation,
    setSelectedStation,
    occupyStation,
    releaseStation,
    getAvailableStation,
    getOccupiedStations,
    occupiedStations: getOccupiedStations(),
  };
};
