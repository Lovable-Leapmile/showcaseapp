import { Part } from '@/types/ams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback } from 'react';

interface PartSelectorProps {
  parts: Part[];
  selectedPart: Part | null;
  selectedParts: Part[];
  searchTerm: string;
  onPartSelect: (part: Part) => void;
  onPartsSelect: (parts: Part[]) => void;
  onRetrieve: (part: Part) => void;
  onRetrieveMultiple: (parts: Part[]) => void;
  onSearchChange: (term: string) => void;
  robotStatus: string;
  queueLength: number;
}

export const PartSelector = ({ 
  parts, 
  selectedPart,
  selectedParts,
  searchTerm,
  onPartSelect,
  onPartsSelect,
  onRetrieve, 
  onRetrieveMultiple,
  onSearchChange,
  robotStatus,
  queueLength
}: PartSelectorProps) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const pressStartTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const isQueueBlocked = queueLength > 0;

  const handleTouchStart = useCallback((part: Part, e: React.TouchEvent) => {
    if (isQueueBlocked) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    pressStartTime.current = Date.now();
    
    const timer = setTimeout(() => {
      setIsSelectionMode(true);
      onPartsSelect([part]);
    }, 500);
    setLongPressTimer(timer);
  }, [onPartsSelect, isQueueBlocked]);

  const handleTouchEnd = useCallback((part: Part, e: React.TouchEvent) => {
    if (isQueueBlocked) return;
    
    e.preventDefault();
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    const pressDuration = Date.now() - pressStartTime.current;
    const touch = e.changedTouches[0];
    const startPos = touchStartPos.current;
    
    // Check if touch moved significantly (drag)
    if (startPos) {
      const deltaX = Math.abs(touch.clientX - startPos.x);
      const deltaY = Math.abs(touch.clientY - startPos.y);
      if (deltaX > 10 || deltaY > 10) return; // Ignore if dragged
    }
    
    if (pressDuration < 500 && !isSelectionMode) {
      onPartSelect(part);
    }
    
    touchStartPos.current = null;
  }, [longPressTimer, isSelectionMode, onPartSelect, isQueueBlocked]);

  const handleTouchCancel = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    touchStartPos.current = null;
  }, [longPressTimer]);

  // Desktop mouse handlers (keeping existing functionality)
  const handleMouseDown = useCallback((part: Part) => {
    if (isQueueBlocked) return;
    pressStartTime.current = Date.now();
    const timer = setTimeout(() => {
      setIsSelectionMode(true);
      onPartsSelect([part]);
    }, 500);
    setLongPressTimer(timer);
  }, [onPartsSelect, isQueueBlocked]);

  const handleMouseUp = useCallback((part: Part) => {
    if (isQueueBlocked) return;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    const pressDuration = Date.now() - pressStartTime.current;
    if (pressDuration < 500 && !isSelectionMode) {
      onPartSelect(part);
    }
  }, [longPressTimer, isSelectionMode, onPartSelect, isQueueBlocked]);

  const handlePartCheck = useCallback((part: Part, checked: boolean) => {
    if (checked) {
      onPartsSelect([...selectedParts, part]);
    } else {
      onPartsSelect(selectedParts.filter(p => p.id !== part.id));
    }
  }, [selectedParts, onPartsSelect]);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    onPartsSelect([]);
  }, [onPartsSelect]);

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
        {isSelectionMode && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600">
              {selectedParts.length} parts selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={exitSelectionMode}
            >
              Cancel
            </Button>
          </div>
        )}
        
        {isQueueBlocked && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              Please wait. There are parts in the queue. Retrieve more parts once the queue is cleared.
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto scrollbar-thin">
          {parts.map((part) => (
            <div
              key={part.id}
              className={cn(
                "p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md select-none",
                isQueueBlocked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                selectedPart?.id === part.id && !isSelectionMode && !isQueueBlocked
                  ? "border-blue-500 bg-blue-50" 
                  : selectedParts.some(p => p.id === part.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
              )}
              onTouchStart={!isQueueBlocked ? (e) => handleTouchStart(part, e) : undefined}
              onTouchEnd={!isQueueBlocked ? (e) => handleTouchEnd(part, e) : undefined}
              onTouchCancel={handleTouchCancel}
              onMouseDown={!isQueueBlocked ? () => handleMouseDown(part) : undefined}
              onMouseUp={!isQueueBlocked ? () => handleMouseUp(part) : undefined}
              onMouseLeave={() => {
                if (longPressTimer) {
                  clearTimeout(longPressTimer);
                  setLongPressTimer(null);
                }
              }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                {isSelectionMode && !isQueueBlocked && (
                  <Checkbox
                    checked={selectedParts.some(p => p.id === part.id)}
                    onCheckedChange={(checked) => handlePartCheck(part, checked as boolean)}
                  />
                )}
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

        {isSelectionMode && selectedParts.length > 0 && !isQueueBlocked && (
          <div className="pt-3 sm:pt-4 border-t">
            <div className="mb-3">
              <div className="text-xs sm:text-sm font-medium">Selected Parts:</div>
              <div className="text-base sm:text-lg font-bold text-green-600">
                {selectedParts.length} parts selected
              </div>
            </div>
            <Button 
              onClick={() => onRetrieveMultiple(selectedParts)}
              disabled={robotStatus !== 'idle' || selectedParts.length === 0}
              className="w-full text-sm"
            >
              Retrieve Selected Parts
            </Button>
          </div>
        )}

        {!isSelectionMode && selectedPart && !isQueueBlocked && (
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
