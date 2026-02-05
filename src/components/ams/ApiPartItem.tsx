import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CSPSafeImage } from '@/components/ui/csp-safe-image';

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

export const ApiPartItem = ({
  part,
  isSelected,
  onClick
}: ApiPartItemProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 80;
  const shouldTruncateDescription = part.item_description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = isDescriptionExpanded 
    ? part.item_description 
    : shouldTruncateDescription 
      ? part.item_description.substring(0, MAX_DESCRIPTION_LENGTH) + '...' 
      : part.item_description;
  
  return (
    <div 
      className={cn(
        "p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer select-none", 
        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/50"
      )} 
      onClick={onClick}
    >
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
          <CSPSafeImage 
            src={part.item_image} 
            alt={part.item_id} 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs sm:text-sm truncate">{part.item_id}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {displayDescription}
                {shouldTruncateDescription && (
                  <button 
                    onClick={e => {
                      e.stopPropagation();
                      setIsDescriptionExpanded(!isDescriptionExpanded);
                    }} 
                    className="ml-1 font-medium text-foreground"
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
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">
              {part.tray_id ? (
                <span className="font-medium">Tray ID: {part.tray_id}</span>
              ) : (
                <span className="text-warning">No Tray ID</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
