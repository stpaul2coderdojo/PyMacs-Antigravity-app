export type DOMNodeType =
  | 'ELEMENT_NODE'
  | 'TEXT_NODE'
  | 'ATTRIBUTE_NODE'
  | 'COMMENT_NODE'
  | 'DOCUMENT_NODE'
  | 'DOCUMENT_FRAGMENT_NODE';

export interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  charge: number; // For magnetic repulsion/attraction
  pinned: boolean;
  radius: number;
  rotation: number;
  vRot: number;
}

export interface VirtualDOMNode {
  id: string;
  nodeType: DOMNodeType;
  tagName: string;
  attributes: Record<string, string>;
  children: VirtualDOMNode[];
  textContent?: string;
  parentId?: string | null;
  physics: PhysicsState;
  styles: Record<string, string>;
  reactiveBindings?: {
    property: string;
    streamId: string;
    transformLambda?: string;
  }[];
}

export interface XMLFilterDef {
  id: string;
  name: string;
  type: 'gaussian' | 'magnetic' | 'chromatic' | 'orbital' | 'matrix' | 'glow';
  strength: number;
  frequency: number;
  enabled: boolean;
  targetTag?: string;
}

export interface WorkerThread {
  id: number;
  name: string;
  status: 'idle' | 'executing' | 'compiling' | 'optimizing';
  currentTask: string;
  loadPercentage: number;
  completedTasks: number;
  cycleCount: number;
}

export interface LambdaStream {
  id: string;
  name: string;
  sourceType: 'gravity_vector' | 'mouse_repulsion' | 'clock_pulse' | 'json_state';
  currentValue: number | string | { x: number; y: number };
  frequencyHz: number;
  pipeline: string[];
  history: number[];
}

export interface OptimizedAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  previewUrl?: string;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  codec: string;
  downscaleRatio: string;
  compressionRatio: number;
  bufferLoadedPercent: number;
  isCached: boolean;
}

export interface JSCompilationOutput {
  success: boolean;
  ast: any;
  tokens: { type: string; value: string }[];
  outputLogs: string[];
  executionTimeMs: number;
  bytecodeInstructions: string[];
  error?: string;
}

export interface PersistedDocumentState {
  id: string;
  title: string;
  version: string;
  gravityVector: { x: number; y: number; z: number };
  restitution: number;
  airResistance: number;
  jsonPersistence: Record<string, any>;
  xmlData: string;
  updatedAt: string;
}
