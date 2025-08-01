import { useState, useEffect, useMemo } from 'react';
import { useAMSSystem } from '@/hooks/useAMSSystem';
import { EnhancedPartSelector } from '@/components/ams/EnhancedPartSelector';
import { StationControl } from '@/components/ams/StationControl';
import { OperationLog } from '@/components/ams/OperationLog';
import { AppBar } from '@/components/layout/AppBar';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SwipeableTabs, SwipeableTabsContent } from '@/components/ui/swipeable-tabs';
import { authService } from '@/services/authService';
import { useStationApi } from '@/hooks/useStationApi';
import { usePartsApi } from '@/hooks/usePartsApi';
import { Eye, EyeOff, Package, MapPinOff, MonitorCheck, MonitorDot } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('parts');
  const [showSystemStatus, setShowSystemStatus] = useState(true);

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
    addOperation,
    logApiRetrieveOperation
  } = useAMSSystem();

  // Get API station data for System Status - only when authenticated
  const {
    stations: apiStations
  } = useStationApi();
  const apiOccupiedStations = apiStations.filter(station => station.tray_id !== null);
  const apiFreeStations = apiStations.filter(station => station.tray_id === null);

  // Get API parts data for System Status - only when authenticated
  const {
    parts: apiParts
  } = usePartsApi(isAuthenticated);

  // Calculate unmapped parts (parts without tray_id)
  const unmappedPartsCount = useMemo(() => {
    return apiParts.filter(part => !part.tray_id).length;
  }, [apiParts]);

  const tabs = [{
    value: 'parts',
    label: 'Available Parts'
  }, {
    value: 'stations',
    label: 'Station Control'
  }, {
    value: 'operations',
    label: 'Operation Log'
  }];

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
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Fixed App Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-slate-50 to-blue-50">
        <AppBar onLogout={handleLogout} />
      </div>
      
      {/* Main Content with top padding to account for fixed header */}
      <div className={`px-3 sm:px-6 ${showSystemStatus ? 'pt-20 sm:pt-24' : 'pt-16 sm:pt-20'}`}>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 py-[8px]">
          {/* System Status with Show/Hide Toggle */}
          {showSystemStatus && <Card className="mb-4 sm:mb-6">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl">System Status</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowSystemStatus(false)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:inline">Hide</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                  {/* Row 1: Parts Available (left), Unmapped Parts (right) */}
                  <div className="text-left p-3 pt-4 pb-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-colors">
                    <div className="text-sm sm:text-base text-gray-700 font-medium mb-1 mt-2">Parts Available</div>
                    <div className="flex items-center justify-between mb-2 mt-2">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600">{apiParts.length}</div>
                      <Package className="w-5 h-5 text-blue-500 ml-2" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">Ready for retrieval</div>
                  </div>
                  <div className="text-left p-3 pt-4 pb-4 sm:p-6 bg-purple-50 rounded-xl border-2 border-purple-100 hover:border-purple-200 transition-colors">
                    <div className="text-sm sm:text-base text-gray-700 font-medium mb-1 mt-2">Unmapped Parts</div>
                    <div className="flex items-center justify-between mb-2 mt-2">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600">{unmappedPartsCount}</div>
                      <MapPinOff className="w-5 h-5 text-purple-500 ml-2" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {unmappedPartsCount > 0 ? 'Parts without tray mapping' : 'All parts mapped to trays'}
                    </div>
                  </div>
                  {/* Row 2: Free Stations (left), Occupied Stations (right) */}
                  <div className="text-left p-3 pt-4 pb-4 sm:p-6 bg-green-50 rounded-xl border-2 border-green-100 hover:border-green-200 transition-colors">
                    <div className="text-sm sm:text-base text-gray-700 font-medium mb-1 mt-2">Free Stations</div>
                    <div className="flex items-center justify-between mb-2 mt-2">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600">{apiFreeStations.length}</div>
                      <MonitorCheck className="w-5 h-5 text-green-500 ml-2" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">Available for use</div>
                  </div>
                  <div className="text-left p-3 pt-4 pb-4 sm:p-6 bg-orange-50 rounded-xl border-2 border-orange-100 hover:border-orange-200 transition-colors">
                    <div className="text-sm sm:text-base text-gray-700 font-medium mb-1 mt-2">Occupied Stations</div>
                    <div className="flex items-center justify-between mb-2 mt-2">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-600">{apiOccupiedStations.length}</div>
                      <MonitorDot className="w-5 h-5 text-orange-500 ml-2" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">Currently in use</div>
                  </div>
                </div>
              </CardContent>
            </Card>}

          {/* Show System Status Button (when hidden) */}
          {!showSystemStatus && <div className="flex justify-center mb-4">
              <Button variant="outline" size="sm" onClick={() => setShowSystemStatus(true)} className="flex items-center gap-2 bg-white shadow-sm hover:shadow-md transition-shadow my-[18px]">
                <Eye className="h-4 w-4" />
                Show System Status
              </Button>
            </div>}

          {/* Enhanced Tab Navigation */}
          <div className={`${showSystemStatus ? 'min-h-[600px] sm:min-h-[700px]' : 'min-h-[calc(100vh-8rem)]'}`}>
            <SwipeableTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs} className="touch-none">
              <SwipeableTabsContent value="parts" className="mt-0 pb-8 sm:pb-12">
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto sm:max-h-none sm:overflow-visible">
                  <EnhancedPartSelector parts={availableParts} selectedPart={selectedPart} selectedParts={selectedParts} searchTerm={searchTerm} onPartSelect={setSelectedPart} onPartsSelect={setSelectedParts} onRetrieve={retrievePart} onRetrieveMultiple={retrieveMultipleParts} onSearchChange={setSearchTerm} robotStatus={robotStatus} queueLength={queue.length} onLogApiRetrieve={logApiRetrieveOperation} />
                </div>
              </SwipeableTabsContent>

              <SwipeableTabsContent value="stations" className="mt-0 pb-8 sm:pb-12">
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto sm:max-h-none sm:overflow-visible">
                  <StationControl stations={stations} selectedStation={selectedStation} onStationSelect={setSelectedStation} onRelease={releasePart} onClearAll={clearAllStations} robotStatus={robotStatus} onLogOperation={addOperation} />
                </div>
              </SwipeableTabsContent>

              <SwipeableTabsContent value="operations" className="mt-0 pb-8 sm:pb-12">
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto sm:max-h-none sm:overflow-visible">
                  <OperationLog operations={operations} />
                </div>
              </SwipeableTabsContent>
            </SwipeableTabs>
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
