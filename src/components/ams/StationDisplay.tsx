
import { Station } from '@/types/ams';
import { cn } from '@/lib/utils';

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
    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-8 h-96 border-2 border-slate-300">
      {/* Robot Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            robotStatus === 'idle' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          )} />
          <span className="text-sm font-medium text-slate-700">
            Robot: {robotStatus.charAt(0).toUpperCase() + robotStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Storage Area */}
      <div className="absolute top-4 left-4 bg-blue-100 rounded-lg p-3 border-2 border-blue-300">
        <div className="text-xs font-semibold text-blue-800 mb-1">STORAGE</div>
        <div className="w-8 h-8 bg-blue-200 rounded border-2 border-blue-400" />
      </div>

      {/* Stations */}
      {stations.map((station) => (
        <div
          key={station.id}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
            "bg-white rounded-lg p-3 border-2 shadow-lg hover:shadow-xl",
            selectedStation?.id === station.id 
              ? "border-blue-500 ring-2 ring-blue-200" 
              : station.occupied 
                ? "border-orange-400 hover:border-orange-500" 
                : "border-gray-300 hover:border-gray-400"
          )}
          style={{
            left: `${station.position.x}px`,
            top: `${station.position.y}px`,
          }}
          onClick={() => onStationSelect(station)}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800 mb-2">
              {station.name}
            </div>
            <div className={cn(
              "w-12 h-12 rounded-lg border-2 flex items-center justify-center",
              station.occupied 
                ? `${station.part?.color} border-gray-400` 
                : "bg-gray-100 border-gray-300 border-dashed"
            )}>
              {station.occupied ? (
                <div className="text-white text-xs font-bold">
                  {station.part?.name.charAt(0)}
                </div>
              ) : (
                <div className="text-gray-400 text-xs">Empty</div>
              )}
            </div>
            <div className={cn(
              "text-xs mt-1 font-medium",
              station.occupied ? "text-orange-600" : "text-green-600"
            )}>
              {station.occupied ? "Occupied" : "Free"}
            </div>
          </div>
        </div>
      ))}

      {/* Robot Arm Visualization */}
      <div className="absolute bottom-4 right-8">
        <div className={cn(
          "w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center border-4 border-gray-400 shadow-lg",
          robotStatus !== 'idle' && "animate-pulse"
        )}>
          <div className="text-white text-xs font-bold">ROBOT</div>
        </div>
      </div>
    </div>
  );
};
