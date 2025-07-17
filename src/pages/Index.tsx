
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
import { Eye, EyeOff } from 'lucide-react';

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
    parts: apiParts,
    markPartReleased
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

  const handlePartReleased = (partId: string) => {
    // Mark the part as released so it appears back in the Available Parts list
    markPartReleased(partId);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-colors">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{apiParts.length}</div>
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
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{unmappedPartsCount}</div>
                    <div className="text-sm sm:text-base text-gray-700 font-medium">Unmapped Parts</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {unmappedPartsCount > 0 ? 'Parts without tray mapping' : 'All parts mapped to trays'}
                    </div>
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
                <EnhancedPartSelector parts={availableParts} selectedPart={selectedPart} selectedParts={selectedParts} searchTerm={searchTerm} onPartSelect={setSelectedPart} onPartsSelect={setSelectedParts} onRetrieve={retrievePart} onRetrieveMultiple={retrieveMultipleParts} onSearchChange={setSearchTerm} robotStatus={robotStatus} queueLength={queue.length} onLogApiRetrieve={logApiRetrieveOperation} />
              </SwipeableTabsContent>

              <SwipeableTabsContent value="stations" className="mt-0 pb-8 sm:pb-12">
                <StationControl stations={stations} selectedStation={selectedStation} onStationSelect={setSelectedStation} onRelease={releasePart} onClearAll={clearAllStations} robotStatus={robotStatus} onLogOperation={addOperation} onPartReleased={handlePartReleased} />
              </SwipeableTabsContent>

              <SwipeableTabsContent value="operations" className="mt-0 pb-8 sm:pb-12">
                <OperationLog operations={operations} />
              </SwipeableTabsContent>
            </SwipeableTabs>
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
