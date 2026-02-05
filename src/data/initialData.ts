import { Part, Station, StorageLocation } from '@/types/ams';

// Import local part images
import gearAssembly from '@/assets/parts/gear-assembly.jpg';
import circuitBoard from '@/assets/parts/circuit-board.jpg';
import housingUnit from '@/assets/parts/housing-unit.jpg';
import sensorModule from '@/assets/parts/sensor-module.jpg';

export const INITIAL_PARTS: Part[] = [
  { id: '1', name: 'Gear Assembly', type: 'mechanical', color: 'bg-blue-500', description: 'Small precision gear', imageUrl: gearAssembly },
  { id: '2', name: 'Circuit Board', type: 'electronic', color: 'bg-green-500', description: 'Main control board', imageUrl: circuitBoard },
  { id: '3', name: 'Housing Unit', type: 'structural', color: 'bg-gray-500', description: 'Aluminum housing', imageUrl: housingUnit },
  { id: '4', name: 'Sensor Module', type: 'electronic', color: 'bg-purple-500', description: 'Temperature sensor', imageUrl: sensorModule },
  { id: '5', name: 'Motor Unit', type: 'mechanical', color: 'bg-red-500', description: 'Stepper motor', imageUrl: gearAssembly },
  { id: '6', name: 'Power Supply', type: 'electronic', color: 'bg-yellow-500', description: '12V power supply', imageUrl: circuitBoard },
  { id: '7', name: 'Heat Sink', type: 'thermal', color: 'bg-indigo-500', description: 'Aluminum heat sink', imageUrl: housingUnit },
  { id: '8', name: 'Bearing Set', type: 'mechanical', color: 'bg-pink-500', description: 'Precision bearings', imageUrl: sensorModule },
  { id: '9', name: 'Control Panel', type: 'interface', color: 'bg-cyan-500', description: 'User interface panel', imageUrl: gearAssembly },
  { id: '10', name: 'Cable Harness', type: 'wiring', color: 'bg-orange-500', description: 'Multi-wire harness', imageUrl: circuitBoard },
  { id: '11', name: 'Filter Unit', type: 'filtration', color: 'bg-teal-500', description: 'Air filter assembly', imageUrl: housingUnit },
  { id: '12', name: 'Valve Assembly', type: 'hydraulic', color: 'bg-rose-500', description: 'Pressure control valve', imageUrl: sensorModule },
  { id: '13', name: 'Display Screen', type: 'interface', color: 'bg-lime-500', description: 'LCD display unit', imageUrl: gearAssembly },
  { id: '14', name: 'Pump Unit', type: 'hydraulic', color: 'bg-amber-500', description: 'Hydraulic pump', imageUrl: circuitBoard },
  { id: '15', name: 'Cooling Fan', type: 'thermal', color: 'bg-emerald-500', description: 'Cooling system fan', imageUrl: housingUnit },
  { id: '16', name: 'Encoder Disk', type: 'mechanical', color: 'bg-violet-500', description: 'Position encoder', imageUrl: sensorModule },
  { id: '17', name: 'Junction Box', type: 'electrical', color: 'bg-sky-500', description: 'Electrical junction', imageUrl: gearAssembly },
  { id: '18', name: 'Pressure Gauge', type: 'instrument', color: 'bg-fuchsia-500', description: 'Pressure measurement', imageUrl: circuitBoard },
  { id: '19', name: 'Spring Assembly', type: 'mechanical', color: 'bg-slate-500', description: 'Compression springs', imageUrl: housingUnit },
  { id: '20', name: 'LED Strip', type: 'lighting', color: 'bg-red-400', description: 'RGB LED lighting', imageUrl: sensorModule },
  { id: '21', name: 'Transformer', type: 'electrical', color: 'bg-blue-400', description: 'Step-down transformer', imageUrl: gearAssembly },
  { id: '22', name: 'Relay Module', type: 'electronic', color: 'bg-green-400', description: 'Control relay bank', imageUrl: circuitBoard },
  { id: '23', name: 'Bracket Set', type: 'structural', color: 'bg-purple-400', description: 'Mounting brackets', imageUrl: housingUnit },
  { id: '24', name: 'Gasket Kit', type: 'sealing', color: 'bg-orange-400', description: 'Rubber gasket set', imageUrl: sensorModule },
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
