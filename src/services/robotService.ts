
import { RobotOperation } from '@/types/ams';

export const simulateRobotOperation = async (operation: RobotOperation): Promise<void> => {
  // Simulate robot moving to location
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (operation.type === 'retrieve') {
    // Simulate picking from storage
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate placing at station
    await new Promise(resolve => setTimeout(resolve, 1500));
  } else {
    // Simulate picking from station
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
};
