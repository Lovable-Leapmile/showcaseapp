
import { Part } from '@/types/ams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartSelectorProps {
  parts: Part[];
  selectedPart: Part | null;
  searchTerm: string;
  onPartSelect: (part: Part) => void;
  onRetrieve: (part: Part) => void;
  onSearchChange: (term: string) => void;
  robotStatus: string;
}

export const PartSelector = ({ 
  parts, 
  selectedPart, 
  searchTerm,
  onPartSelect, 
  onRetrieve, 
  onSearchChange,
  robotStatus 
}: PartSelectorProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
          Available Parts
          <Badge variant="secondary" className="text-xs">{parts.length} available</Badge>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search parts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  <img 
                    src={part.imageUrl} 
                    alt={part.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
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
            <div className="text-xs sm:text-sm">
              {searchTerm ? 'No parts match your search' : 'No parts available in storage'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
