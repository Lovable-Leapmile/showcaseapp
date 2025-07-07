
import { Station } from '@/types/ams';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StationDisplayProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
  robotStatus: string;
}

export const StationDisplay = ({
  stations,
  selectedStation,
  onStationSelect,
  robotStatus
}: StationDisplayProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Station Layout</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={robotStatus === 'idle' ? 'secondary' : 'default'}>
            Robot: {robotStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stations.map((station) => (
            <div
              key={station.id}
              onClick={() => onStationSelect(station)}
              className={cn(
                "relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                station.occupied 
                  ? "border-red-300 bg-red-50 hover:border-red-400" 
                  : "border-green-300 bg-green-50 hover:border-green-400",
                selectedStation?.id === station.id && "ring-2 ring-blue-500"
              )}
            >
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {station.name}
                </div>
                
                {station.occupied && station.part ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 mx-auto rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {station.part.name}
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Occupied
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-8 h-8 mx-auto rounded-full border-2 border-gray-300 bg-white"></div>
                    <div className="text-xs text-gray-500">Empty</div>
                    <Badge variant="secondary" className="text-xs">
                      Available
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
