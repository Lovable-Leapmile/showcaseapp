
import { useState, useCallback } from 'react';
import { RobotOperation } from '@/types/ams';
import { simulateRobotOperation } from '@/services/robotService';

export const useRobotOperations = () => {
  const [operations, setOperations] = useState<RobotOperation[]>([]);
  const [robotStatus, setRobotStatus] = useState<'idle' | 'moving' | 'picking' | 'placing'>('idle');
  const [activeOperations, setActiveOperations] = useState<Set<string>>(new Set());

  const executeRobotOperation = useCallback(async (operation: RobotOperation) => {
    const operationId = operation.id;
    setActiveOperations(prev => new Set(prev).add(operationId));
    
    if (activeOperations.size === 0) {
      setRobotStatus('moving');
    }
    
    await simulateRobotOperation(operation);
    
    if (operation.type === 'retrieve') {
      setRobotStatus('picking');
      await new Promise(resolve => setTimeout(resolve, 0)); // Immediate for UI update
      setRobotStatus('placing');
      await new Promise(resolve => setTimeout(resolve, 0)); // Immediate for UI update
    } else {
      setRobotStatus('picking');
      await new Promise(resolve => setTimeout(resolve, 0)); // Immediate for UI update
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

  const addOperation = useCallback((operation: RobotOperation) => {
    setOperations(prev => [operation, ...prev]);
  }, []);

  const updateOperationStatus = useCallback((operationId: string, status: RobotOperation['status']) => {
    setOperations(prev => prev.map(op => 
      op.id === operationId ? { ...op, status } : op
    ));
  }, []);

  return {
    operations: operations.slice(0, 10),
    robotStatus,
    executeRobotOperation,
    addOperation,
    updateOperationStatus,
  };
};
