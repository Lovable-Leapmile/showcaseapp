
import { useState, useCallback } from 'react';
import { Part, Station, RobotOperation, StorageLocation } from '@/types/ams';
import { toast } from '@/hooks/use-toast';

const INITIAL_PARTS: Part[] = [
  { id: '1', name: 'Gear Assembly', type: 'mechanical', color: 'bg-blue-500', description: 'Small precision gear' },
  { id: '2', name: 'Circuit Board', type: 'electronic', color: 'bg-green-500', description: 'Main control board' },
  { id: '3', name: 'Housing Unit', type: 'structural', color: 'bg-gray-500', description: 'Aluminum housing' },
  { id: '4', name: 'Sensor Module', type: 'electronic', color: 'bg-purple-500', description: 'Temperature sensor' },
  { id: '5', name: 'Motor Unit', type: 'mechanical', color: 'bg-red-500', description: 'Stepper motor' },
];

const INITIAL_STATIONS: Station[] = [
  { id: 'A', name: 'Station A', occupied: false, position: { x: 100, y: 150 } },
  { id: 'B', name: 'Station B', occupied: false, position: { x: 250, y: 150 } },
  { id: 'C', name: 'Station C', occupied: false, position: { x: 400, y: 150 } },
  { id: 'D', name: 'Station D', occupied: false, position: { x: 175, y: 300 } },
  { id: 'E', name: 'Station E', occupied: false, position: { x: 325, y: 300 } },
];

export const useAMSSystem = () => {
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [storage, setStorage] = useState<StorageLocation[]>(
    INITIAL_PARTS.map(part => ({ id: part.id, part, available: true }))
  );
  const [operations, setOperations] = useState<RobotOperation[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [robotStatus, setRobotStatus] = useState<'idle' | 'moving' | 'picking' | 'placing'>('idle');

  const simulateRobotOperation = useCallback(async (operation: RobotOperation) => {
    setRobotStatus('moving');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (operation.type === 'retrieve') {
      setRobotStatus('picking');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRobotStatus('placing');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      setRobotStatus('picking');
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setRobotStatus('idle');
  }, []);

  const retrievePart = useCallback(async (part: Part) => {
    // Check if part is available in storage
    const storageItem = storage.find(item => item.part.id === part.id && item.available);
    if (!storageItem) {
      toast({
        title: "Part Unavailable",
        description: `${part.name} is not available in storage.`,
        variant: "destructive",
      });
      return;
    }

    // Find available station
    const availableStation = stations.find(station => !station.occupied);
    if (!availableStation) {
      toast({
        title: "No Available Stations",
        description: "All stations are currently occupied.",
        variant: "destructive",
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

    setOperations(prev => [operation, ...prev]);
    
    toast({
      title: "Robot Operation Started",
      description: `Retrieving ${part.name} to ${availableStation.name}...`,
    });

    // Simulate robot operation
    await simulateRobotOperation(operation);

    // Update storage
    setStorage(prev => prev.map(item => 
      item.part.id === part.id ? { ...item, available: false } : item
    ));

    // Update station
    setStations(prev => prev.map(station => 
      station.id === availableStation.id 
        ? { ...station, occupied: true, part }
        : station
    ));

    // Update operation status
    setOperations(prev => prev.map(op => 
      op.id === operation.id ? { ...op, status: 'completed' } : op
    ));

    toast({
      title: "Operation Complete",
      description: `${part.name} placed in ${availableStation.name}`,
    });

    setSelectedPart(null);
  }, [stations, storage, simulateRobotOperation]);

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

    setOperations(prev => [operation, ...prev]);
    
    toast({
      title: "Robot Operation Started",
      description: `Releasing ${station.part.name} from ${station.name}...`,
    });

    // Simulate robot operation
    await simulateRobotOperation(operation);

    // Update station
    setStations(prev => prev.map(s => 
      s.id === station.id 
        ? { ...s, occupied: false, part: undefined }
        : s
    ));

    // Update storage
    setStorage(prev => prev.map(item => 
      item.part.id === station.part!.id ? { ...item, available: true } : item
    ));

    // Update operation status
    setOperations(prev => prev.map(op => 
      op.id === operation.id ? { ...op, status: 'completed' } : op
    ));

    toast({
      title: "Operation Complete",
      description: `${station.part.name} returned to storage`,
    });

    setSelectedStation(null);
  }, [simulateRobotOperation]);

  const availableParts = storage.filter(item => item.available).map(item => item.part);
  const occupiedStations = stations.filter(station => station.occupied);

  return {
    stations,
    storage,
    operations: operations.slice(0, 10), // Show last 10 operations
    selectedPart,
    selectedStation,
    robotStatus,
    availableParts,
    occupiedStations,
    setSelectedPart,
    setSelectedStation,
    retrievePart,
    releasePart,
  };
};
