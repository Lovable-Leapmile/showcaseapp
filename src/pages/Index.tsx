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
    setSelectedPart,
    setSelectedStation,
    retrievePart,
    releasePart
  } = useAMSSystem();
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Automated Material Storage & Station Management
          </p>
        </div>

        {/* System Status */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center p-2 sm:p-4 bg-blue-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{availableParts.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Parts Available</div>
              </div>
              <div className="text-center p-2 sm:p-4 bg-green-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-green-600">{stations.filter(s => !s.occupied).length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Free Stations</div>
              </div>
              <div className="text-center p-2 sm:p-4 bg-orange-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-orange-600">{occupiedStations.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Occupied Stations</div>
              </div>
              <div className="text-center p-2 sm:p-4 bg-purple-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">{operations.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Operations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Layout - Stack on mobile, grid on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Controls Section - Stack on mobile */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-4 sm:gap-6">
            <div className="flex-1">
              <PartSelector parts={availableParts} selectedPart={selectedPart} onPartSelect={setSelectedPart} onRetrieve={retrievePart} robotStatus={robotStatus} />
            </div>
            
            <div className="flex-1">
              <StationControl stations={stations} selectedStation={selectedStation} onStationSelect={setSelectedStation} onRelease={releasePart} robotStatus={robotStatus} />
            </div>
          </div>

          {/* Station Display - Full width on mobile */}
          <div className="order-first lg:order-none lg:col-span-1">
            <Card className="h-full">
              
              
            </Card>
          </div>

          {/* Operation Log */}
          <div className="lg:col-span-1">
            <OperationLog operations={operations} />
          </div>
        </div>

        {/* Instructions */}
        <Card>
          
          
        </Card>
      </div>
    </div>;
};
export default Index;