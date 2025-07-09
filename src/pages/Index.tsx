
import { useState, useEffect } from 'react';
import { useAMSSystem } from '@/hooks/useAMSSystem';
import { EnhancedPartSelector } from '@/components/ams/EnhancedPartSelector';
import { StationControl } from '@/components/ams/StationControl';
import { OperationLog } from '@/components/ams/OperationLog';
import { AppBar } from '@/components/layout/AppBar';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SwipeableTabs, SwipeableTabsContent } from '@/components/ui/swipeable-tabs';
import { authService } from '@/services/authService';
import { useStationApi } from '@/hooks/useStationApi';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('parts');
  
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
    clearAllStations,
    addOperation
  } = useAMSSystem();

  // Get API station data for System Status
  const { stations: apiStations } = useStationApi();
  const apiOccupiedStations = apiStations.filter(station => station.tray_id !== null);
  const apiFreeStations = apiStations.filter(station => station.tray_id === null);

  const tabs = [
    { value: 'parts', label: 'Available Parts' },
    { value: 'stations', label: 'Station Control' },
    { value: 'operations', label: 'Operation Log' }
  ];

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = () => {
      const isUserAuthenticated = authService.isAuthenticated();
      setIsAuthenticated(isUserAuthenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.clearUserData();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Fixed App Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-slate-50 to-blue-50">
        <AppBar onLogout={handleLogout} />
      </div>
      
      {/* Main Content with top padding to account for fixed header */}
      <div className="pt-20 sm:pt-24 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* System Status - Updated to use API data */}
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
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{apiFreeStations.length}</div>
                  <div className="text-sm sm:text-base text-gray-700 font-medium">Free Stations</div>
                  <div className="text-xs text-gray-500 mt-1">Available for use</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-orange-50 rounded-xl border-2 border-orange-100 hover:border-orange-200 transition-colors">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{apiOccupiedStations.length}</div>
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
                    ) : 'Waiting for parts'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Swipeable Tab Navigation with increased height */}
          <div className="min-h-[600px] sm:min-h-[700px]">
            <SwipeableTabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              tabs={tabs}
              className="touch-pan-x"
            >
              <SwipeableTabsContent value="parts" className="mt-0 pb-8 sm:pb-12">
                <EnhancedPartSelector
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
                  queueLength={queue.length}
                />
              </SwipeableTabsContent>

              <SwipeableTabsContent value="stations" className="mt-0 pb-8 sm:pb-12">
                <StationControl
                  stations={stations}
                  selectedStation={selectedStation}
                  onStationSelect={setSelectedStation}
                  onRelease={releasePart}
                  onClearAll={clearAllStations}
                  robotStatus={robotStatus}
                  onLogOperation={addOperation}
                />
              </SwipeableTabsContent>

              <SwipeableTabsContent value="operations" className="mt-0 pb-8 sm:pb-12">
                <OperationLog operations={operations} />
              </SwipeableTabsContent>
            </SwipeableTabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
