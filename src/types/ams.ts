
export interface Part {
  id: string;
  name: string;
  type: string;
  color: string;
  description: string;
  imageUrl: string;
}

export interface Station {
  id: string;
  name: string;
  occupied: boolean;
  part?: Part;
  position: { x: number; y: number };
}

export interface RobotOperation {
  id: string;
  type: 'retrieve' | 'release';
  part?: Part;
  station?: Station;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  timestamp: Date;
}

export interface StorageLocation {
  id: string;
  part: Part;
  available: boolean;
}

export interface QueuedPart {
  id: string;
  part: Part;
  timestamp: Date;
}
