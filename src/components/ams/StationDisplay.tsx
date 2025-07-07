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
  return;
};