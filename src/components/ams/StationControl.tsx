
import { Station } from '@/types/ams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StationControlProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
  onRelease: (station: Station) => void;
  onClearAll: () => void;
  robotStatus: string;
}

export const StationControl = ({ 
  stations, 
  selectedStation, 
  onStationSelect, 
  onRelease, 
  onClearAll,
  robotStatus 
}: StationControlProps) => {
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const occupiedStations = stations.filter(station => station.occupied);

  const handleClearAll = () => {
    onClearAll();
    setClearAllOpen(false);
  };

  const handleRelease = () => {
    if (selectedStation) {
      onRelease(selectedStation);
      setReleaseOpen(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Station Control
          <Badge variant="secondary">{occupiedStations.length}/5 occupied</Badge>
        </CardTitle>
        {occupiedStations.length > 0 && (
          <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={robotStatus !== 'idle'}
                variant="outline"
                className="w-full"
              >
                {robotStatus !== 'idle' ? 'Robot Busy...' : 'Clear All Stations'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Stations</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear all {occupiedStations.length} occupied stations? 
                  All parts will be returned to storage. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>
                  Clear All Stations
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          {stations.map((station) => (
            <div
              key={station.id}
              className={cn(
                "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedStation?.id === station.id 
                  ? "border-blue-500 bg-blue-50" 
                  : station.occupied 
                    ? "border-orange-200 hover:border-orange-300" 
                    : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => onStationSelect(station)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full",
                    station.occupied ? "bg-orange-500" : "bg-green-500"
                  )} />
                  <div>
                    <div className="font-semibold text-sm">{station.name}</div>
                    <div className="text-xs text-gray-500">
                      {station.occupied ? station.part?.name : 'Available'}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={station.occupied ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {station.occupied ? "Occupied" : "Free"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {selectedStation && (
          <div className="pt-4 border-t">
            <div className="mb-3">
              <div className="text-sm font-medium">Selected Station:</div>
              <div className="text-lg font-bold text-blue-600">{selectedStation.name}</div>
              {selectedStation.occupied && (
                <div className="text-sm text-gray-600">
                  Contains: {selectedStation.part?.name}
                </div>
              )}
            </div>
            
            {selectedStation.occupied ? (
              <AlertDialog open={releaseOpen} onOpenChange={setReleaseOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={robotStatus !== 'idle'}
                    variant="destructive"
                    className="w-full"
                  >
                    {robotStatus !== 'idle' ? 'Robot Busy...' : 'Release Part'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Release Part</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to release "{selectedStation.part?.name}" from {selectedStation.name}? 
                      The part will be returned to storage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRelease} className="bg-red-600 hover:bg-red-700">
                      Release Part
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div className="text-center py-2 text-gray-500 text-sm">
                Station is empty
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
