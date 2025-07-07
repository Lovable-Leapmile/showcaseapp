
import { useState, useCallback, useEffect } from 'react';
import { QueuedPart, Part, Station, RobotOperation } from '@/types/ams';
import { toast } from '@/hooks/use-toast';

interface UseQueueSystemProps {
  stations: Station[];
  executeRobotOperation: (operation: RobotOperation) => Promise<void>;
  addOperation: (operation: RobotOperation) => void;
  updateOperationStatus: (operationId: string, status: RobotOperation['status']) => void;
  occupyStation: (stationId: string, part: Part) => void;
  markPartUnavailable: (partId: string) => void;
}

export const useQueueSystem = ({
  stations,
  executeRobotOperation,
  addOperation,
  updateOperationStatus,
  occupyStation,
  markPartUnavailable,
}: UseQueueSystemProps) => {
  const [queue, setQueue] = useState<QueuedPart[]>([]);

  const addToQueue = useCallback((part: Part) => {
    const queuedPart: QueuedPart = {
      id: Date.now().toString(),
      part,
      timestamp: new Date(),
    };
    setQueue(prev => [...prev, queuedPart]);
  }, []);

  const addMultipleToQueue = useCallback((parts: Part[]) => {
    const queuedParts: QueuedPart[] = parts.map(part => ({
      id: Date.now().toString() + Math.random(),
      part,
      timestamp: new Date(),
    }));
    setQueue(prev => [...prev, ...queuedParts]);
  }, []);

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

    addOperation(operation);
    
    toast({
      title: "Processing Queue",
      description: `Retrieving ${queuedItem.part.name} from queue to ${availableStation.name}...`,
    });

    await executeRobotOperation(operation);

    markPartUnavailable(queuedItem.part.id);
    occupyStation(availableStation.id, queuedItem.part);
    updateOperationStatus(operation.id, 'completed');

    toast({
      title: "Queue Operation Complete",
      description: `${queuedItem.part.name} placed in ${availableStation.name}`,
    });
  }, [queue, stations, executeRobotOperation, addOperation, updateOperationStatus, occupyStation, markPartUnavailable]);

  useEffect(() => {
    processQueue();
  }, [stations, queue, processQueue]);

  return {
    queue,
    addToQueue,
    addMultipleToQueue,
  };
};
