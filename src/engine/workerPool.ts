import { WorkerThread } from '../types/dom';

export const INITIAL_WORKER_THREADS: WorkerThread[] = [
  {
    id: 1,
    name: 'Worker.01-Physics',
    status: 'executing',
    currentTask: 'Verlet Integrator & Antigravity Vectors',
    loadPercentage: 68,
    completedTasks: 1420,
    cycleCount: 88402,
  },
  {
    id: 2,
    name: 'Worker.02-Filters',
    status: 'executing',
    currentTask: 'XML Gaussian & Magnetic Convolution',
    loadPercentage: 42,
    completedTasks: 980,
    cycleCount: 62110,
  },
  {
    id: 3,
    name: 'Worker.03-Lambda',
    status: 'executing',
    currentTask: 'Reactive Stream Topology Mapping',
    loadPercentage: 81,
    completedTasks: 2130,
    cycleCount: 110480,
  },
  {
    id: 4,
    name: 'Worker.04-Compiler',
    status: 'idle',
    currentTask: 'JIT Lexer & AST Bytecode Ready',
    loadPercentage: 12,
    completedTasks: 440,
    cycleCount: 31050,
  },
  {
    id: 5,
    name: 'Worker.05-ImageOpt',
    status: 'optimizing',
    currentTask: 'WebP/AVIF Adaptive Subsampling',
    loadPercentage: 74,
    completedTasks: 312,
    cycleCount: 45890,
  },
  {
    id: 6,
    name: 'Worker.06-VideoDL',
    status: 'optimizing',
    currentTask: '4K H.265 Chunks Stream Buffering',
    loadPercentage: 89,
    completedTasks: 185,
    cycleCount: 78920,
  },
  {
    id: 7,
    name: 'Worker.07-W3Parser',
    status: 'idle',
    currentTask: 'DOM Level 3 Spec Verification',
    loadPercentage: 24,
    completedTasks: 840,
    cycleCount: 52400,
  },
  {
    id: 8,
    name: 'Worker.08-JSONStore',
    status: 'executing',
    currentTask: 'State Sync: JSON = XML = DOM',
    loadPercentage: 55,
    completedTasks: 1950,
    cycleCount: 94100,
  },
];

export function updateWorkerMetrics(workers: WorkerThread[]): WorkerThread[] {
  return workers.map((w) => {
    // Add realistic subtle jitter to load
    const delta = (Math.random() - 0.5) * 8;
    let newLoad = Math.max(8, Math.min(98, Math.round(w.loadPercentage + delta)));

    let status = w.status;
    if (newLoad < 20 && Math.random() > 0.7) status = 'idle';
    else if (w.id === 4 && newLoad > 50) status = 'compiling';
    else if (w.id === 5 || w.id === 6) status = 'optimizing';
    else status = 'executing';

    return {
      ...w,
      loadPercentage: newLoad,
      status,
      completedTasks: w.completedTasks + (Math.random() > 0.7 ? 1 : 0),
      cycleCount: w.cycleCount + Math.floor(Math.random() * 40 + 10),
    };
  });
}
