
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

interface ApiPartItemProps {
  part: {
    item_id: string;
    item_description: string;
    item_image: string | null;
    item_category: string;
    tray_id: string | null;
  };
  isSelected?: boolean;
  onClick?: () => void;
  onRetrieve?: (trayId: string) => void;
}

export const ApiPartItem = ({ part, isSelected, onClick, onRetrieve }: ApiPartItemProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  
  const MAX_DESCRIPTION_LENGTH = 80;
  const shouldTruncateDescription = part.item_description.length > MAX_DESCRIPTION_LENGTH;
  
  const displayDescription = isDescriptionExpanded 
    ? part.item_description 
    : shouldTruncateDescription 
      ? part.item_description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
      : part.item_description;

  const defaultImageUrl = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop';

  const handleRetrieve = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!part.tray_id) {
      toast({
        title: "No Tray ID",
        description: "This part doesn't have a tray ID assigned",
        variant: "destructive",
      });
      return;
    }

    setIsRetrieving(true);
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const url = `https://staging.qikpod.com/showcase/retrieve_tray?tray_id=${part.tray_id}&required_tags=station`;
      
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

      toast({
        title: "Tray Retrieved Successfully",
        description: `Tray ${part.tray_id} has been retrieved to a station`,
      });

      if (onRetrieve) {
        onRetrieve(part.tray_id);
      }
      
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
  };

  return (
    <div
      className={cn(
        "p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer select-none",
        isSelected 
          ? "border-blue-500 bg-blue-50" 
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
          <img 
            src={imageError || !part.item_image ? defaultImageUrl : part.item_image}
            alt={part.item_id}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs sm:text-sm truncate">{part.item_id}</div>
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
            <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
              {part.item_category}
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {part.tray_id ? (
                <span className="font-medium">Tray ID: {part.tray_id}</span>
              ) : (
                <span className="text-orange-600">No Tray ID</span>
              )}
            </div>
            {isSelected && part.tray_id && (
              <Button
                size="sm"
                onClick={handleRetrieve}
                disabled={isRetrieving}
                className="text-xs h-7 px-2"
              >
                {isRetrieving ? 'Retrieving...' : 'Retrieve'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
