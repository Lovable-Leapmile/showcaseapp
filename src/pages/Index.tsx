
import { useAMSSystem } from '@/hooks/useAMSSystem';
import { StationDisplay } from '@/components/ams/StationDisplay';
import { PartSelector } from '@/components/ams/PartSelector';
import { StationControl } from '@/components/ams/StationControl';
import { OperationLog } from '@/components/ams/OperationLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const {
    stations,
    operations,
    selectedPart,
    selectedStation,
    robotStatus,
    availableParts,
    occupiedStations,
    searchTerm,
    setSelectedPart,
    setSelectedStation,
    setSearchTerm,
    retrievePart,
    releasePart,
    clearAllStations
  } = useAMSSystem();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            AMS Showcase
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Automated Material Storage & Station Management
          </p>
        </div>

        {/* System Status - Improved alignment and expansion */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl text-center">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{availableParts.length}</div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">Parts Available</div>
                <div className="text-xs text-gray-500 mt-1">Ready for retrieval</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-green-50 rounded-xl border-2 border-green-100 hover:border-green-200 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{stations.filter(s => !s.occupied).length}</div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">Free Stations</div>
                <div className="text-xs text-gray-500 mt-1">Available for use</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-orange-50 rounded-xl border-2 border-orange-100 hover:border-orange-200 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{occupiedStations.length}</div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">Occupied Stations</div>
                <div className="text-xs text-gray-500 mt-1">Currently in use</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-xl border-2 border-purple-100 hover:border-purple-200 transition-colors">
                <div className="flex items-center justify-center mb-2">
                  <div className={`w-4 h-4 rounded-full mr-2 ${robotStatus === 'idle' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {robotStatus.charAt(0).toUpperCase() + robotStatus.slice(1)}
                  </div>
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">Robot Status</div>
                <div className="text-xs text-gray-500 mt-1">Current operation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Layout - Stack on mobile, grid on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Controls Section - Stack on mobile */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-4 sm:gap-6">
            <div className="flex-1">
              <PartSelector 
                parts={availableParts} 
                selectedPart={selectedPart} 
                searchTerm={searchTerm}
                onPartSelect={setSelectedPart} 
                onRetrieve={retrievePart} 
                onSearchChange={setSearchTerm}
                robotStatus={robotStatus} 
              />
            </div>
            
            <div className="flex-1">
              <StationControl 
                stations={stations} 
                selectedStation={selectedStation} 
                onStationSelect={setSelectedStation} 
                onRelease={releasePart} 
                onClearAll={clearAllStations}
                robotStatus={robotStatus} 
              />
            </div>
          </div>

          {/* Station Display - Full width on mobile */}
          <div className="order-first lg:order-none lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Station Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <StationDisplay 
                  stations={stations} 
                  selectedStation={selectedStation} 
                  onStationSelect={setSelectedStation} 
                  robotStatus={robotStatus} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Operation Log */}
          <div className="lg:col-span-1">
            <OperationLog operations={operations} />
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Retrieving Parts:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Select a part from the Available Parts list</li>
                  <li>Click "Retrieve Part" to move it to a station</li>
                  <li>Watch the robot simulation in action</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Managing Stations:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Select an occupied station</li>
                  <li>Click "Release Part" to return it to storage</li>
                  <li>Use "Clear All Stations" to empty all stations</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
