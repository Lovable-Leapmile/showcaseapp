
import { Part } from '@/types/ams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback, useMemo } from 'react';

interface EnhancedPartSelectorProps {
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

interface PartItemProps {
  part: Part;
  isSelected: boolean;
  isMultiSelected: boolean;
  isSelectionMode: boolean;
  isQueueBlocked: boolean;
  onTouchStart: (part: Part, e: React.TouchEvent) => void;
  onTouchEnd: (part: Part, e: React.TouchEvent) => void;
  onTouchCancel: () => void;
  onMouseDown: (part: Part) => void;
  onMouseUp: (part: Part) => void;
  onMouseLeave: () => void;
  onPartCheck: (part: Part, checked: boolean) => void;
}

const PartItem = ({
  part,
  isSelected,
  isMultiSelected,
  isSelectionMode,
  isQueueBlocked,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onPartCheck
}: PartItemProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 80;
  
  const shouldTruncateDescription = part.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = isDescriptionExpanded 
    ? part.description 
    : shouldTruncateDescription 
      ? part.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
      : part.description;

  return (
    <div
      className={cn(
        "p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md select-none",
        isQueueBlocked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        isSelected && !isSelectionMode && !isQueueBlocked
          ? "border-blue-500 bg-blue-50" 
          : isMultiSelected
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-gray-300"
      )}
      onTouchStart={!isQueueBlocked ? (e) => onTouchStart(part, e) : undefined}
      onTouchEnd={!isQueueBlocked ? (e) => onTouchEnd(part, e) : undefined}
      onTouchCancel={onTouchCancel}
      onMouseDown={!isQueueBlocked ? () => onMouseDown(part) : undefined}
      onMouseUp={!isQueueBlocked ? () => onMouseUp(part) : undefined}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-start space-x-2 sm:space-x-3">
        {isSelectionMode && !isQueueBlocked && (
          <div className="pt-1">
            <Checkbox
              checked={isMultiSelected}
              onCheckedChange={(checked) => onPartCheck(part, checked as boolean)}
            />
          </div>
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
          <div className="text-xs text-gray-500 mt-1">
            {displayDescription}
            {shouldTruncateDescription && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescriptionExpanded(!isDescriptionExpanded);
                }}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                {isDescriptionExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-xs flex-shrink-0">
          {part.type}
        </Badge>
      </div>
    </div>
  );
};

export const EnhancedPartSelector = ({ 
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
}: EnhancedPartSelectorProps) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const pressStartTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const isQueueBlocked = queueLength > 0;

  // Get unique categories from parts
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(parts.map(part => part.type))).sort();
    return [{ value: 'all', label: 'All Categories' }, ...uniqueCategories.map(cat => ({ value: cat, label: cat }))];
  }, [parts]);

  // Filter parts based on search term and selected category
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || part.type === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [parts, searchTerm, selectedCategory]);

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
    
    if (startPos) {
      const deltaX = Math.abs(touch.clientX - startPos.x);
      const deltaY = Math.abs(touch.clientY - startPos.y);
      if (deltaX > 10 || deltaY > 10) return;
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
          <Badge variant="secondary" className="text-xs">{filteredParts.length} available</Badge>
        </CardTitle>
        
        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto scrollbar-thin">
          {filteredParts.map((part) => (
            <PartItem
              key={part.id}
              part={part}
              isSelected={selectedPart?.id === part.id}
              isMultiSelected={selectedParts.some(p => p.id === part.id)}
              isSelectionMode={isSelectionMode}
              isQueueBlocked={isQueueBlocked}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                if (longPressTimer) {
                  clearTimeout(longPressTimer);
                  setLongPressTimer(null);
                }
              }}
              onPartCheck={handlePartCheck}
            />
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

        {filteredParts.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <div className="text-xs sm:text-sm">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No parts match your search criteria' 
                : 'No parts available in storage'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
