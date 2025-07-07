
import { useState, useCallback } from 'react';
import { Part, RobotOperation, Station } from '@/types/ams';
import { toast } from '@/hooks/use-toast';
import { useRobotOperations } from './useRobotOperations';
import { useStationManager } from './useStationManager';
import { useStorageManager } from './useStorageManager';
import { useQueueSystem } from './useQueueSystem';

export const useAMSSystem = () => {
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);

  const {
    operations,
    robotStatus,
    executeRobotOperation,
    addOperation,
    updateOperationStatus,
  } = useRobotOperations();

  const {
    stations,
    selectedStation,
    setSelectedStation,
    occupyStation,
    releaseStation,
    getAvailableStation,
    occupiedStations,
  } = useStationManager();

  const {
    searchTerm,
    setSearchTerm,
    markPartUnavailable,
    markPartAvailable,
    isPartAvailable,
    availableParts,
  } = useStorageManager();

  const { queue, addToQueue, addMultipleToQueue } = useQueueSystem({
    stations,
    executeRobotOperation,
    addOperation,
    updateOperationStatus,
    occupyStation,
    markPartUnavailable,
  });

  const retrievePart = useCallback(async (part: Part) => {
    if (!isPartAvailable(part.id)) {
      toast({
        title: "Part Unavailable",
        description: `${part.name} is not available in storage.`,
        variant: "destructive",
      });
      return;
    }

    const availableStation = getAvailableStation();
    if (!availableStation) {
      addToQueue(part);
      
      toast({
        title: "Added to Queue",
        description: `${part.name} added to queue. Will be retrieved when a station becomes available.`,
      });
      return;
    }

    const operation: RobotOperation = {
      id: Date.now().toString(),
      type: 'retrieve',
      part,
      station: availableStation,
      status: 'in-progress',
      timestamp: new Date(),
    };

    addOperation(operation);
    
    toast({
      title: "Robot Operation Started",
      description: `Retrieving ${part.name} to ${availableStation.name}...`,
    });

    await executeRobotOperation(operation);

    markPartUnavailable(part.id);
    occupyStation(availableStation.id, part);
    updateOperationStatus(operation.id, 'completed');

    toast({
      title: "Operation Complete",
      description: `${part.name} placed in ${availableStation.name}`,
    });

    setSelectedPart(null);
  }, [isPartAvailable, getAvailableStation, addToQueue, addOperation, executeRobotOperation, markPartUnavailable, occupyStation, updateOperationStatus]);

  const retrieveMultipleParts = useCallback(async (parts: Part[]) => {
    const availableParts = parts.filter(part => isPartAvailable(part.id));

    if (availableParts.length === 0) {
      toast({
        title: "No Parts Available",
        description: "None of the selected parts are available in storage.",
        variant: "destructive",
      });
      return;
    }

    const availableStations = stations.filter(station => !station.occupied);
    const partsToRetrieve = availableParts.slice(0, availableStations.length);
    const partsToQueue = availableParts.slice(availableStations.length);

    // Add remaining parts to queue
    if (partsToQueue.length > 0) {
      addMultipleToQueue(partsToQueue);
      
      toast({
        title: "Parts Queued",
        description: `${partsToQueue.length} parts added to queue. ${partsToRetrieve.length} parts will be retrieved immediately.`,
      });
    }

    // Retrieve parts to available stations
    for (let i = 0; i < partsToRetrieve.length; i++) {
      const part = partsToRetrieve[i];
      const station = availableStations[i];
      
      const operation: RobotOperation = {
        id: Date.now().toString() + i,
        type: 'retrieve',
        part,
        station,
        status: 'in-progress',
        timestamp: new Date(),
      };

      addOperation(operation);
      
      // Simulate concurrent operations
      executeRobotOperation(operation).then(() => {
        markPartUnavailable(part.id);
        occupyStation(station.id, part);
        updateOperationStatus(operation.id, 'completed');
      });
    }

    toast({
      title: "Multiple Operations Started",
      description: `Retrieving ${partsToRetrieve.length} parts simultaneously...`,
    });

    setSelectedParts([]);
  }, [isPartAvailable, stations, addMultipleToQueue, addOperation, executeRobotOperation, markPartUnavailable, occupyStation, updateOperationStatus]);

  const releasePart = useCallback(async (station: Station) => {
    if (!station.occupied || !station.part) {
      toast({
        title: "Station Empty",
        description: `${station.name} does not contain any parts.`,
        variant: "destructive",
      });
      return;
    }

    const operation: RobotOperation = {
      id: Date.now().toString(),
      type: 'release',
      part: station.part,
      station,
      status: 'in-progress',
      timestamp: new Date(),
    };

    addOperation(operation);
    
    toast({
      title: "Robot Operation Started",
      description: `Releasing ${station.part.name} from ${station.name}...`,
    });

    await executeRobotOperation(operation);

    releaseStation(station.id);
    markPartAvailable(station.part!.id);
    updateOperationStatus(operation.id, 'completed');

    toast({
      title: "Operation Complete",
      description: `${station.part!.name} returned to storage`,
    });

    setSelectedStation(null);
  }, [addOperation, executeRobotOperation, releaseStation, markPartAvailable, updateOperationStatus, setSelectedStation]);

  const clearAllStations = useCallback(async () => {
    if (occupiedStations.length === 0) {
      toast({
        title: "No Stations to Clear",
        description: "All stations are already empty.",
        variant: "destructive",
      });
      return;
    }

    if (robotStatus !== 'idle') {
      toast({
        title: "Robot Busy",
        description: "Please wait for the current operation to complete.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Clearing All Stations",
      description: `Clearing ${occupiedStations.length} occupied stations...`,
    });

    // Clear stations one by one
    for (const station of occupiedStations) {
      await releasePart(station);
      // Add a small delay between operations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast({
      title: "All Stations Cleared",
      description: "All parts have been returned to storage.",
    });
  }, [occupiedStations, robotStatus, releasePart]);

  return {
    stations,
    operations,
    selectedPart,
    selectedParts,
    selectedStation,
    robotStatus,
    availableParts,
    occupiedStations,
    searchTerm,
    queue,
    setSelectedPart,
    setSelectedParts,
    setSelectedStation,
    setSearchTerm,
    retrievePart,
    retrieveMultipleParts,
    releasePart,
    clearAllStations,
  };
};
