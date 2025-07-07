
import { RobotOperation } from '@/types/ams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface OperationLogProps {
  operations: RobotOperation[];
}

export const OperationLog = ({ operations }: OperationLogProps) => {
  const getStatusColor = (status: RobotOperation['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Operation Log
          <Badge variant="secondary">{operations.length} operations</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {operations.map((operation) => (
              <div
                key={operation.id}
                className="p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={cn("w-2 h-2 rounded-full", getStatusColor(operation.status))} />
                      <span className="text-sm font-medium capitalize">
                        {operation.type} Operation
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {operation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {operation.type === 'retrieve' 
                        ? `Retrieved ${operation.part?.name} to ${operation.station?.name}`
                        : `Released ${operation.part?.name} from ${operation.station?.name}`
                      }
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {operation.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {operations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">No operations recorded</div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
