
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Part, Station, RobotOperation, StorageLocation, QueuedPart } from '@/types/ams';
import { toast } from '@/hooks/use-toast';

const INITIAL_PARTS: Part[] = [
  { id: '1', name: 'Gear Assembly', type: 'mechanical', color: 'bg-blue-500', description: 'Small precision gear', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '2', name: 'Circuit Board', type: 'electronic', color: 'bg-green-500', description: 'Main control board', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '3', name: 'Housing Unit', type: 'structural', color: 'bg-gray-500', description: 'Aluminum housing', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '4', name: 'Sensor Module', type: 'electronic', color: 'bg-purple-500', description: 'Temperature sensor', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '5', name: 'Motor Unit', type: 'mechanical', color: 'bg-red-500', description: 'Stepper motor', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '6', name: 'Power Supply', type: 'electronic', color: 'bg-yellow-500', description: '12V power supply', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '7', name: 'Heat Sink', type: 'thermal', color: 'bg-indigo-500', description: 'Aluminum heat sink', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '8', name: 'Bearing Set', type: 'mechanical', color: 'bg-pink-500', description: 'Precision bearings', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '9', name: 'Control Panel', type: 'interface', color: 'bg-cyan-500', description: 'User interface panel', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '10', name: 'Cable Harness', type: 'wiring', color: 'bg-orange-500', description: 'Multi-wire harness', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '11', name: 'Filter Unit', type: 'filtration', color: 'bg-teal-500', description: 'Air filter assembly', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '12', name: 'Valve Assembly', type: 'hydraulic', color: 'bg-rose-500', description: 'Pressure control valve', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '13', name: 'Display Screen', type: 'interface', color: 'bg-lime-500', description: 'LCD display unit', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '14', name: 'Pump Unit', type: 'hydraulic', color: 'bg-amber-500', description: 'Hydraulic pump', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '15', name: 'Cooling Fan', type: 'thermal', color: 'bg-emerald-500', description: 'Cooling system fan', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '16', name: 'Encoder Disk', type: 'mechanical', color: 'bg-violet-500', description: 'Position encoder', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '17', name: 'Junction Box', type: 'electrical', color: 'bg-sky-500', description: 'Electrical junction', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '18', name: 'Pressure Gauge', type: 'instrument', color: 'bg-fuchsia-500', description: 'Pressure measurement', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '19', name: 'Spring Assembly', type: 'mechanical', color: 'bg-slate-500', description: 'Compression springs', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '20', name: 'LED Strip', type: 'lighting', color: 'bg-red-400', description: 'RGB LED lighting', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '21', name: 'Transformer', type: 'electrical', color: 'bg-blue-400', description: 'Step-down transformer', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '22', name: 'Relay Module', type: 'electronic', color: 'bg-green-400', description: 'Control relay bank', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '23', name: 'Bracket Set', type: 'structural', color: 'bg-purple-400', description: 'Mounting brackets', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '24', name: 'Gasket Kit', type: 'sealing', color: 'bg-orange-400', description: 'Rubber gasket set', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
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
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [robotStatus, setRobotStatus] = useState<'idle' | 'moving' | 'picking' | 'placing'>('idle');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [queue, setQueue] = useState<QueuedPart[]>([]);
  const [activeOperations, setActiveOperations] = useState<Set<string>>(new Set());

  const simulateRobotOperation = useCallback(async (operation: RobotOperation) => {
    const operationId = operation.id;
    setActiveOperations(prev => new Set(prev).add(operationId));
    
    if (activeOperations.size === 0) {
      setRobotStatus('moving');
    }
    
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
    
    setActiveOperations(prev => {
      const newSet = new Set(prev);
      newSet.delete(operationId);
      if (newSet.size === 0) {
        setRobotStatus('idle');
      }
      return newSet;
    });
  }, [activeOperations.size]);

  const processQueue = useCallback(async () => {
    if (queue.length === 0) return;
    
    const availableStation = stations.find(station => !station.occupied);
    if (!availableStation) return;

    const queuedItem = queue[0];
    setQueue(prev => prev.slice(1));

    const operation: RobotOperation = {
      id: Date.now().toString(),
      type: 'retrieve',
      part: queuedItem.part,
      station: availableStation,
      status: 'in-progress',
      timestamp: new Date(),
    };

    setOperations(prev => [operation, ...prev]);
    
    toast({
      title: "Processing Queue",
      description: `Retrieving ${queuedItem.part.name} from queue to ${availableStation.name}...`,
    });

    await simulateRobotOperation(operation);

    setStorage(prev => prev.map(item => 
      item.part.id === queuedItem.part.id ? { ...item, available: false } : item
    ));

    setStations(prev => prev.map(station => 
      station.id === availableStation.id 
        ? { ...station, occupied: true, part: queuedItem.part }
        : station
    ));

    setOperations(prev => prev.map(op => 
      op.id === operation.id ? { ...op, status: 'completed' } : op
    ));

    toast({
      title: "Queue Operation Complete",
      description: `${queuedItem.part.name} placed in ${availableStation.name}`,
    });
  }, [queue, stations, simulateRobotOperation]);

  useEffect(() => {
    processQueue();
  }, [stations, queue, processQueue]);

  const retrievePart = useCallback(async (part: Part) => {
    const storageItem = storage.find(item => item.part.id === part.id && item.available);
    if (!storageItem) {
      toast({
        title: "Part Unavailable",
        description: `${part.name} is not available in storage.`,
        variant: "destructive",
      });
      return;
    }

    const availableStation = stations.find(station => !station.occupied);
    if (!availableStation) {
      const queuedPart: QueuedPart = {
        id: Date.now().toString(),
        part,
        timestamp: new Date(),
      };
      setQueue(prev => [...prev, queuedPart]);
      
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

    setOperations(prev => [operation, ...prev]);
    
    toast({
      title: "Robot Operation Started",
      description: `Retrieving ${part.name} to ${availableStation.name}...`,
    });

    await simulateRobotOperation(operation);

    setStorage(prev => prev.map(item => 
      item.part.id === part.id ? { ...item, available: false } : item
    ));

    setStations(prev => prev.map(station => 
      station.id === availableStation.id 
        ? { ...station, occupied: true, part }
        : station
    ));

    setOperations(prev => prev.map(op => 
      op.id === operation.id ? { ...op, status: 'completed' } : op
    ));

    toast({
      title: "Operation Complete",
      description: `${part.name} placed in ${availableStation.name}`,
    });

    setSelectedPart(null);
  }, [stations, storage, simulateRobotOperation]);

  const retrieveMultipleParts = useCallback(async (parts: Part[]) => {
    const availableParts = parts.filter(part => 
      storage.find(item => item.part.id === part.id && item.available)
    );

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
      const queuedParts: QueuedPart[] = partsToQueue.map(part => ({
        id: Date.now().toString() + Math.random(),
        part,
        timestamp: new Date(),
      }));
      setQueue(prev => [...prev, ...queuedParts]);
      
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

      setOperations(prev => [operation, ...prev]);
      
      // Simulate concurrent operations
      simulateRobotOperation(operation).then(() => {
        setStorage(prev => prev.map(item => 
          item.part.id === part.id ? { ...item, available: false } : item
        ));

        setStations(prev => prev.map(s => 
          s.id === station.id 
            ? { ...s, occupied: true, part }
            : s
        ));

        setOperations(prev => prev.map(op => 
          op.id === operation.id ? { ...op, status: 'completed' } : op
        ));
      });
    }

    toast({
      title: "Multiple Operations Started",
      description: `Retrieving ${partsToRetrieve.length} parts simultaneously...`,
    });

    setSelectedParts([]);
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

  const clearAllStations = useCallback(async () => {
    const occupiedStations = stations.filter(station => station.occupied);
    
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
  }, [stations, robotStatus, releasePart]);

  const availableParts = useMemo(() => {
    const filtered = storage
      .filter(item => item.available)
      .map(item => item.part)
      .filter(part => 
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return filtered;
  }, [storage, searchTerm]);

  const occupiedStations = stations.filter(station => station.occupied);

  return {
    stations,
    storage,
    operations: operations.slice(0, 10),
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
