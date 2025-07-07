
import { Part } from '@/types/ams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PartSelectorProps {
  parts: Part[];
  selectedPart: Part | null;
  onPartSelect: (part: Part) => void;
  onRetrieve: (part: Part) => void;
  robotStatus: string;
}

export const PartSelector = ({ 
  parts, 
  selectedPart, 
  onPartSelect, 
  onRetrieve, 
  robotStatus 
}: PartSelectorProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
          Available Parts
          <Badge variant="secondary" className="text-xs">{parts.length} available</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
          {parts.map((part) => (
            <div
              key={part.id}
              className={cn(
                "p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedPart?.id === part.id 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => onPartSelect(part)}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={cn("w-3 h-3 sm:w-4 sm:h-4 rounded-full", part.color)} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm truncate">{part.name}</div>
                  <div className="text-xs text-gray-500 truncate">{part.description}</div>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {part.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {selectedPart && (
          <div className="pt-3 sm:pt-4 border-t">
            <div className="mb-3">
              <div className="text-xs sm:text-sm font-medium">Selected Part:</div>
              <div className="text-base sm:text-lg font-bold text-blue-600 truncate">{selectedPart.name}</div>
            </div>
            <Button 
              onClick={() => onRetrieve(selectedPart)}
              disabled={robotStatus !== 'idle'}
              className="w-full text-sm"
            >
              {robotStatus !== 'idle' ? 'Robot Busy...' : 'Retrieve Part'}
            </Button>
          </div>
        )}

        {parts.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <div className="text-xs sm:text-sm">No parts available in storage</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
