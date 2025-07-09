import { Part } from '@/types/ams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback, useMemo } from 'react';
import { usePartsApi } from '@/hooks/usePartsApi';
import { ApiPartItem } from './ApiPartItem';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

interface EnhancedPartSelectorProps {
  // Legacy props for backward compatibility
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
  onLogApiRetrieve?: (partId: string, trayId: string) => void;
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
  // Legacy props - keeping for backward compatibility but using API data
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
  queueLength,
  onLogApiRetrieve
}: EnhancedPartSelectorProps) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [apiSearchTerm, setApiSearchTerm] = useState<string>('');
  const [selectedApiPart, setSelectedApiPart] = useState<string | null>(null);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const pressStartTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const { parts: apiParts, categories, isLoading, error, fetchParts, refetch } = usePartsApi();

  const isQueueBlocked = queueLength > 0;

  // Filter API parts based on search term
  const filteredApiParts = useMemo(() => {
    if (!apiSearchTerm) return apiParts;
    
    return apiParts.filter(part => 
      part.item_id.toLowerCase().includes(apiSearchTerm.toLowerCase()) ||
      part.item_description.toLowerCase().includes(apiSearchTerm.toLowerCase()) ||
      part.item_category.toLowerCase().includes(apiSearchTerm.toLowerCase())
    );
  }, [apiParts, apiSearchTerm]);

  // Get selected part details
  const selectedPartDetails = useMemo(() => {
    if (!selectedApiPart) return null;
    return filteredApiParts.find(part => part.item_id === selectedApiPart);
  }, [selectedApiPart, filteredApiParts]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    fetchParts(category);
  }, [fetchParts]);

  const handlePartClick = (partId: string) => {
    setSelectedApiPart(selectedApiPart === partId ? null : partId);
  };

  const handleRetrieve = useCallback(async () => {
    if (!selectedPartDetails?.tray_id) return;
    
    setIsRetrieving(true);
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const url = `https://staging.qikpod.com/showcase/retrieve_tray?tray_id=${selectedPartDetails.tray_id}&required_tags=station`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Retrieve API Response:', result);

      // Log the retrieve operation
      if (onLogApiRetrieve) {
        onLogApiRetrieve(selectedPartDetails.item_id, selectedPartDetails.tray_id);
      }

      toast({
        title: "Tray Retrieved Successfully",
        description: `Tray ${selectedPartDetails.tray_id} has been retrieved to a station`,
      });

      // Refresh the parts list and clear selection
      refetch();
      setSelectedApiPart(null);
      
    } catch (err) {
      console.error('Retrieve tray error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve tray';
      
      toast({
        title: "Retrieve Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRetrieving(false);
    }
  }, [selectedPartDetails, refetch, onLogApiRetrieve]);

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
    <div className="space-y-4">
      <Card className="h-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
            Available Parts
            <Badge variant="secondary" className="text-xs">{filteredApiParts.length} available</Badge>
          </CardTitle>
          
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search parts..."
                value={apiSearchTerm}
                onChange={(e) => setApiSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-gray-600">Loading parts...</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto scrollbar-thin">
              {filteredApiParts.map((part) => (
                <ApiPartItem
                  key={part.item_id}
                  part={part}
                  isSelected={selectedApiPart === part.item_id}
                  onClick={() => handlePartClick(part.item_id)}
                  onRetrieve={() => {}} // Remove individual retrieve functionality
                />
              ))}
            </div>
          )}

          {!isLoading && filteredApiParts.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <div className="text-xs sm:text-sm">
                {apiSearchTerm || selectedCategory !== 'All Categories' 
                  ? 'No parts match your search criteria' 
                  : 'No parts available'}
              </div>
            </div>
          )}

          {/* Selected Part Actions - Similar to Station Control */}
          {selectedPartDetails && (
            <div className="pt-4 border-t">
              <div className="mb-3">
                <div className="text-sm font-medium">Selected Part:</div>
                <div className="text-lg font-bold text-blue-600">{selectedPartDetails.item_id}</div>
                <div className="text-sm text-gray-600">
                  {selectedPartDetails.tray_id ? `Tray ID: ${selectedPartDetails.tray_id}` : 'No Tray ID'}
                </div>
              </div>
              
              {selectedPartDetails.tray_id ? (
                <Button 
                  disabled={robotStatus !== 'idle' || isRetrieving}
                  variant="default"
                  className="w-full"
                  onClick={handleRetrieve}
                >
                  {isRetrieving ? 'Retrieving...' : robotStatus !== 'idle' ? 'Robot Busy...' : 'Retrieve Tray'}
                </Button>
              ) : (
                <div className="text-center py-2 text-gray-500 text-sm">
                  Part has no tray assigned
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
