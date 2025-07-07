
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
    selectedParts,
    selectedStation,
    robotStatus,
    availableParts,
    occupiedStations,
    searchTerm,
    queue,
    setSelectedPart,
    setSelectedParts,
    setSelectedStation,
    setSearchTerm,
    retrievePart,
    retrieveMultipleParts,
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

        {/* System Status - Updated with queue information */}
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
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{queue.length}</div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">Queued Parts</div>
                <div className="text-xs text-gray-500 mt-1">
                  {queue.length > 0 ? (
                    <div className="flex flex-wrap gap-1 justify-center mt-2">
                      {queue.slice(0, 3).map((item, index) => (
                        <Badge key={item.id} variant="secondary" className="text-xs">
                          {item.part.name}
                        </Badge>
                      ))}
                      {queue.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{queue.length - 3} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    'Waiting for parts'
                  )}
                </div>
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
                selectedParts={selectedParts}
                searchTerm={searchTerm} 
                onPartSelect={setSelectedPart}
                onPartsSelect={setSelectedParts}
                onRetrieve={retrievePart}
                onRetrieveMultiple={retrieveMultipleParts}
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
            <StationDisplay 
              stations={stations} 
              selectedStation={selectedStation} 
              onStationSelect={setSelectedStation} 
              robotStatus={robotStatus} 
            />
          </div>

          {/* Operation Log */}
          <div className="lg:col-span-1">
            <OperationLog operations={operations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
