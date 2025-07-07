
import { Part, Station, StorageLocation } from '@/types/ams';

export const INITIAL_PARTS: Part[] = [
  { id: '1', name: 'Gear Assembly', type: 'mechanical', color: 'bg-blue-500', description: 'Small precision gear', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '2', name: 'Circuit Board', type: 'electronic', color: 'bg-green-500', description: 'Main control board', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '3', name: 'Housing Unit', type: 'structural', color: 'bg-gray-500', description: 'Aluminum housing', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '4', name: 'Sensor Module', type: 'electronic', color: 'bg-purple-500', description: 'Temperature sensor', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '5', name: 'Motor Unit', type: 'mechanical', color: 'bg-red-500', description: 'Stepper motor', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '6', name: 'Power Supply', type: 'electronic', color: 'bg-yellow-500', description: '12V power supply', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '7', name: 'Heat Sink', type: 'thermal', color: 'bg-indigo-500', description: 'Aluminum heat sink', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '8', name: 'Bearing Set', type: 'mechanical', color: 'bg-pink-500', description: 'Precision bearings', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '9', name: 'Control Panel', type: 'interface', color: 'bg-cyan-500', description: 'User interface panel', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '10', name: 'Cable Harness', type: 'wiring', color: 'bg-orange-500', description: 'Multi-wire harness', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '11', name: 'Filter Unit', type: 'filtration', color: 'bg-teal-500', description: 'Air filter assembly', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '12', name: 'Valve Assembly', type: 'hydraulic', color: 'bg-rose-500', description: 'Pressure control valve', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '13', name: 'Display Screen', type: 'interface', color: 'bg-lime-500', description: 'LCD display unit', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '14', name: 'Pump Unit', type: 'hydraulic', color: 'bg-amber-500', description: 'Hydraulic pump', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '15', name: 'Cooling Fan', type: 'thermal', color: 'bg-emerald-500', description: 'Cooling system fan', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '16', name: 'Encoder Disk', type: 'mechanical', color: 'bg-violet-500', description: 'Position encoder', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '17', name: 'Junction Box', type: 'electrical', color: 'bg-sky-500', description: 'Electrical junction', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '18', name: 'Pressure Gauge', type: 'instrument', color: 'bg-fuchsia-500', description: 'Pressure measurement', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '19', name: 'Spring Assembly', type: 'mechanical', color: 'bg-slate-500', description: 'Compression springs', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '20', name: 'LED Strip', type: 'lighting', color: 'bg-red-400', description: 'RGB LED lighting', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
  { id: '21', name: 'Transformer', type: 'electrical', color: 'bg-blue-400', description: 'Step-down transformer', imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop' },
  { id: '22', name: 'Relay Module', type: 'electronic', color: 'bg-green-400', description: 'Control relay bank', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop' },
  { id: '23', name: 'Bracket Set', type: 'structural', color: 'bg-purple-400', description: 'Mounting brackets', imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop' },
  { id: '24', name: 'Gasket Kit', type: 'sealing', color: 'bg-orange-400', description: 'Rubber gasket set', imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop' },
];

export const INITIAL_STATIONS: Station[] = [
  { id: 'A', name: 'Station A', occupied: false, position: { x: 100, y: 150 } },
  { id: 'B', name: 'Station B', occupied: false, position: { x: 250, y: 150 } },
  { id: 'C', name: 'Station C', occupied: false, position: { x: 400, y: 150 } },
  { id: 'D', name: 'Station D', occupied: false, position: { x: 175, y: 300 } },
  { id: 'E', name: 'Station E', occupied: false, position: { x: 325, y: 300 } },
];

export const createInitialStorage = (): StorageLocation[] => {
  return INITIAL_PARTS.map(part => ({ id: part.id, part, available: true }));
};
