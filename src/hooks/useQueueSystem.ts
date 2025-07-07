
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
  const [isProcessing, setIsProcessing] = useState(false);

  const addToQueue = useCallback((part: Part) => {
    const queuedPart: QueuedPart = {
      id: Date.now().toString(),
      part,
      timestamp: new Date(),
    };
    setQueue(prev => {
      const newQueue = [...prev, queuedPart];
      console.log('Added to queue, new length:', newQueue.length);
      return newQueue;
    });
  }, []);

  const addMultipleToQueue = useCallback((parts: Part[]) => {
    const queuedParts: QueuedPart[] = parts.map((part, index) => ({
      id: (Date.now() + index).toString(),
      part,
      timestamp: new Date(),
    }));
    setQueue(prev => {
      const newQueue = [...prev, ...queuedParts];
      console.log('Added multiple to queue, new length:', newQueue.length);
      return newQueue;
    });
  }, []);

  const processQueue = useCallback(async () => {
    if (queue.length === 0 || isProcessing) return;
    
    const availableStation = stations.find(station => !station.occupied);
    if (!availableStation) return;

    setIsProcessing(true);

    const queuedItem = queue[0];
    setQueue(prev => {
      const newQueue = prev.slice(1);
      console.log('Processed queue item, new length:', newQueue.length);
      return newQueue;
    });

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

    try {
      await executeRobotOperation(operation);

      markPartUnavailable(queuedItem.part.id);
      occupyStation(availableStation.id, queuedItem.part);
      updateOperationStatus(operation.id, 'completed');

      toast({
        title: "Queue Operation Complete",
        description: `${queuedItem.part.name} placed in ${availableStation.name}`,
      });
    } catch (error) {
      console.error('Queue processing error:', error);
      updateOperationStatus(operation.id, 'failed');
    } finally {
      setIsProcessing(false);
    }
  }, [queue, stations, isProcessing, executeRobotOperation, addOperation, updateOperationStatus, occupyStation, markPartUnavailable]);

  // Process queue when stations become available or queue changes
  useEffect(() => {
    const availableStations = stations.filter(station => !station.occupied);
    if (queue.length > 0 && availableStations.length > 0 && !isProcessing) {
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        processQueue();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [stations, queue.length, isProcessing, processQueue]);

  return {
    queue,
    addToQueue,
    addMultipleToQueue,
  };
};
