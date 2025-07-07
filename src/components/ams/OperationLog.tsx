
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

  const getStatusVariant = (status: RobotOperation['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Operation Log
          <Badge variant="secondary" className="text-xs">
            {operations.length} operations
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {operations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm">No operations recorded yet</div>
              </div>
            ) : (
              operations.map((operation) => (
                <div
                  key={operation.id}
                  className="p-3 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{operation.type}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {operation.partName && `Part: ${operation.partName}`}
                        {operation.stationId && ` • Station: ${operation.stationId}`}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(operation.status)} className="text-xs">
                      {operation.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(operation.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
