import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useStationApi } from '@/hooks/useStationApi';
import { StationSlot } from '@/services/stationApiService';
import { RefreshCw, Clock, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { stationApiService } from '@/services/stationApiService';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

interface StationControlProps {
  stations: any[];
  selectedStation: any;
  onStationSelect: (station: any) => void;
  onRelease: (station: any) => void;
  onClearAll: () => void;
  robotStatus: string;
  onLogOperation?: (operation: any) => void;
}

export const StationControl = ({ 
  onStationSelect, 
  onRelease, 
  onClearAll,
  robotStatus,
  onLogOperation
}: StationControlProps) => {
  const [selectedApiStation, setSelectedApiStation] = useState<StationSlot | null>(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [releasing, setReleasing] = useState(false);
  
  const { 
    stations: apiStations, 
    loading, 
    error, 
    lastUpdated, 
    refetch,
    getStationStatus 
  } = useStationApi();

  const occupiedStations = apiStations.filter(station => station.tray_id !== null);

  const handleClearAll = () => {
    onClearAll();
    setClearAllOpen(false);
  };

  const handleRelease = async () => {
    if (!selectedApiStation?.tray_id) return;
    
    setReleasing(true);
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const url = `https://dev.qikpod.com/showcase/release_tray?tray_id=${selectedApiStation.tray_id}&tags=station`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Check if it's a conflict error (tray already being released)
        if (response.status === 409 || response.status === 400) {
          toast({
            title: (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Tray Release is in Processing
              </div>
            ),
            description: `Tray ${selectedApiStation.tray_id} is already being processed. Please wait.`,
            variant: "destructive",
          });
          
          // Log the operation as in progress
          if (onLogOperation) {
            onLogOperation({
              id: Date.now().toString(),
              type: 'release',
              part: { name: `Tray ${selectedApiStation.tray_id}` },
              station: { name: selectedApiStation.slot_name },
              status: 'in-progress',
              timestamp: new Date()
            });
          }
          
          return;
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Release API Response:', result);

      // Log the operation
      if (onLogOperation) {
        onLogOperation({
          id: Date.now().toString(),
          type: 'release',
          part: { name: `Tray ${selectedApiStation.tray_id}` },
          station: { name: selectedApiStation.slot_name },
          status: 'completed',
          timestamp: new Date()
        });
      }

      toast({
        title: "Tray Released Successfully",
        description: `Tray ${selectedApiStation.tray_id} has been released from ${selectedApiStation.slot_name}`,
      });

      // Refresh station data
      refetch();
      
    } catch (err) {
      console.error('Release tray error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to release tray';
      
      toast({
        title: "Release Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Log the failed operation
      if (onLogOperation) {
        onLogOperation({
          id: Date.now().toString(),
          type: 'release',
          part: { name: `Tray ${selectedApiStation.tray_id}` },
          station: { name: selectedApiStation.slot_name },
          status: 'error',
          timestamp: new Date()
        });
      }
    } finally {
      setReleasing(false);
      setReleaseOpen(false);
      setSelectedApiStation(null);
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  if (loading && apiStations.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading Stations...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Fetching station data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Station Control
            {error ? (
              <WifiOff className="w-4 h-4 text-red-500" />
            ) : (
              <Wifi className="w-4 h-4 text-green-500" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {occupiedStations.length}/{apiStations.length} occupied
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            Last updated {formatLastUpdated()}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Error: {error}
          </div>
        )}

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
        {/* Stations Grid - Updated to 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto scrollbar-thin">
          {apiStations.length > 0 ? (
            apiStations.map((station) => {
              const status = getStationStatus(station);
              return (
                <div
                  key={station.id}
                  className={cn(
                    "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedApiStation?.id === station.id 
                      ? "border-blue-500 bg-blue-50" 
                      : status.isOccupied 
                        ? "border-orange-200 hover:border-orange-300 bg-orange-50" 
                        : "border-green-200 hover:border-green-300 bg-green-50"
                  )}
                  onClick={() => setSelectedApiStation(station)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={status.isOccupied ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {status.isOccupied ? "Occupied" : "Free"}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-sm">Station {station.slot_name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {status.displayText}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Loading stations...</span>
                </div>
              ) : error ? (
                <div className="text-red-500">
                  Failed to load stations: {error}
                </div>
              ) : (
                "No stations available"
              )}
            </div>
          )}
        </div>

        {/* Selected Station Actions */}
        {selectedApiStation && (
          <div className="pt-4 border-t">
            <div className="mb-3">
              <div className="text-sm font-medium">Selected Station:</div>
              <div className="text-lg font-bold text-blue-600">Station {selectedApiStation.slot_name}</div>
              <div className="text-sm text-gray-600">
                {getStationStatus(selectedApiStation).displayText}
              </div>
            </div>
            
            {selectedApiStation.tray_id ? (
              <AlertDialog open={releaseOpen} onOpenChange={setReleaseOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={robotStatus !== 'idle' || releasing}
                    variant="destructive"
                    className="w-full"
                  >
                    {releasing ? 'Releasing...' : robotStatus !== 'idle' ? 'Robot Busy...' : 'Release Tray'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Release Tray</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to release "Tray ID: {selectedApiStation.tray_id}" from Station {selectedApiStation.slot_name}? 
                      The tray will be returned to storage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRelease} className="bg-red-600 hover:bg-red-700">
                      {releasing ? 'Releasing...' : 'Release Tray'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div className="text-center py-2 text-gray-500 text-sm">
                Station is available
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
