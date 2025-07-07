import { RobotOperation } from '@/types/ams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
interface OperationLogProps {
  operations: RobotOperation[];
}
export const OperationLog = ({
  operations
}: OperationLogProps) => {
  const getStatusColor = (status: RobotOperation['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <Card className="h-full">
      
      
    </Card>;
};