/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PyMacs Kernel Thread Architecture & Google Antigravity Agentic Engine
 * 
 * Core Components:
 * 1. PyMacs Cooperative/Preemptive Thread Kernel & TCB (Thread Control Block)
 * 2. Full Thread Dump Generator (memory, scope, stacks, registers, locks)
 * 3. Memory Usage Dump & Generational Garbage Collector Telemetry
 * 4. Single Screen in Round Robin DOM Rendering Engine
 * 5. Google Antigravity Agentic App Building Loop
 */

import { VirtualDOMNode } from '../types/dom';

export type ThreadState = 'RUNNING' | 'READY' | 'WAITING' | 'SLEEPING' | 'BLOCKED' | 'TERMINATED';
export type ThreadCategory = 'ANTIGRAVITY_AGENT' | 'KERNEL' | 'RENDERER' | 'TRANSPILER' | 'GC' | 'USER_APP';

export interface StackFrame {
  frame: number;
  functionName: string;
  source: string;
  line: number;
  localVariables?: Record<string, string | number | boolean>;
}

export interface AgentThoughtTrace {
  step: number;
  type: 'THOUGHT' | 'ACTION' | 'OBSERVATION' | 'DOM_MUTATION';
  content: string;
  timestamp: string;
}

export interface PyMacsThread {
  id: string; // e.g., 'TID-001'
  name: string;
  category: ThreadCategory;
  state: ThreadState;
  priority: number; // 1 to 10
  quantumMs: number; // Allocated execution time slice in Round Robin
  remainingQuantumMs: number;
  cpuPercent: number;
  memoryBytes: number;
  stackSizeKb: number;
  programCounter: string;
  instructionStep: number;
  callStack: StackFrame[];
  locksHeld: string[];
  locksWaiting: string[];
  lastActiveTimestamp: number;
  totalCycles: number;

  // Google Antigravity Agent context
  agentContext?: {
    model: string;
    goal: string;
    thoughtTrace: AgentThoughtTrace[];
    currentTool?: string;
    targetApp: string;
    iterationCount: number;
  };

  // Live DOM Tree to render in Round Robin display
  domRoot: VirtualDOMNode;
  domSliceMetadata: {
    title: string;
    componentType: string;
    nodeCount: number;
    depth: number;
    reactiveSignalsCount: number;
    accentColor: string;
  };
}

export interface MemorySegment {
  id: string;
  name: string;
  baseAddress: string;
  endAddress: string;
  sizeBytes: number;
  usedBytes: number;
  type: 'THREAD_STACKS' | 'DOM_POOL' | 'AST_BYTECODE' | 'VFS_BUFFERS' | 'AGENTIC_WORKSPACE' | 'KERNEL_HEAP';
  color: string;
}

export interface MemoryDump {
  timestamp: string;
  totalHeapBytes: number;
  usedHeapBytes: number;
  freeHeapBytes: number;
  peakHeapBytes: number;
  fragmentationPercent: number;

  threadStacks: {
    totalBytes: number;
    activeThreadCount: number;
    perThreadUsage: { tid: string; name: string; bytes: number }[];
  };

  domNodePool: {
    totalNodes: number;
    memoryBytes: number;
    retainedNodes: number;
    orphanedNodes: number;
    reactiveBindingsCount: number;
  };

  astBytecodeCache: {
    moduleCount: number;
    memoryBytes: number;
    cacheHitRatio: number;
    symbolTableEntries: number;
  };

  vfsBufferPool: {
    inodesCount: number;
    memoryBytes: number;
    dirtyBuffers: number;
  };

  gcTelemetry: {
    generation0Collections: number;
    generation1Collections: number;
    generation2Collections: number;
    totalSweeps: number;
    lastSweepDurationMs: number;
    totalFreedBytes: number;
    lastFreedBytes: number;
    isSweeping: boolean;
  };

  memorySegments: MemorySegment[];
}

export interface RoundRobinSchedulerState {
  activeThreadIndex: number;
  activeThreadId: string;
  defaultQuantumMs: number;
  quantumProgressPercent: number;
  elapsedQuantumMs: number;
  totalRoundRobinCycles: number;
  totalContextSwitches: number;
  isPaused: boolean;
  renderingMode: 'SINGLE_SCREEN_TIME_SLICED' | 'SINGLE_SCREEN_COMPOSITE' | 'THREAD_FOCUS';
  focusedThreadId: string | null;
  fps: number;
  lastSwitchTimestamp: number;
  switchLatencyMs: number;
}

// Initial default thread DOM builders
function createDefaultDOMNode(
  id: string,
  tagName: string,
  classes: string,
  text?: string,
  children: VirtualDOMNode[] = []
): VirtualDOMNode {
  return {
    id,
    nodeType: 'ELEMENT_NODE',
    tagName,
    attributes: { class: classes },
    children,
    textContent: text,
    physics: {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      mass: 1,
      charge: 0,
      pinned: false,
      radius: 20,
      rotation: 0,
      vRot: 0,
    },
    styles: {},
  };
}

// Helper to count nodes in a VirtualDOM tree
export function countDOMNodes(root: VirtualDOMNode): number {
  let count = 1;
  if (root.children && root.children.length > 0) {
    for (const child of root.children) {
      count += countDOMNodes(child);
    }
  }
  return count;
}

// Helper to calculate maximum depth of VirtualDOM tree
export function getDOMDepth(root: VirtualDOMNode): number {
  if (!root.children || root.children.length === 0) return 1;
  let maxChildDepth = 0;
  for (const child of root.children) {
    maxChildDepth = Math.max(maxChildDepth, getDOMDepth(child));
  }
  return 1 + maxChildDepth;
}

// Initial System Threads
export const INITIAL_PYMACS_THREADS: PyMacsThread[] = [
  {
    id: 'TID-001',
    name: 'Google Antigravity Agent: App Synthesizer',
    category: 'ANTIGRAVITY_AGENT',
    state: 'RUNNING',
    priority: 9,
    quantumMs: 40,
    remainingQuantumMs: 40,
    cpuPercent: 28.5,
    memoryBytes: 4194304, // 4 MB
    stackSizeKb: 256,
    programCounter: '0x7FFF_0A20: AGENT_AUTONOMOUS_SYNTHESIZE',
    instructionStep: 342,
    callStack: [
      { frame: 0, functionName: 'google_antigravity_agent.main()', source: 'kernel/agent/antigravity.ts', line: 42 },
      { frame: 1, functionName: 'synthesize_reactive_application()', source: 'kernel/agent/synthesizer.ts', line: 118 },
      { frame: 2, functionName: 'round_robin_dom_emit()', source: 'kernel/scheduler/round_robin.ts', line: 89 },
      { frame: 3, functionName: 'reconcile_virtual_tree()', source: 'kernel/dom/reconciler.ts', line: 204 },
    ],
    locksHeld: ['LOCK_DOM_TREE_ROOT', 'MUTEX_AGENTIC_BUS'],
    locksWaiting: [],
    lastActiveTimestamp: Date.now(),
    totalCycles: 1589,
    agentContext: {
      model: 'Google Antigravity Agent (DeepMind Antigravity Core)',
      goal: 'Autonomous continuous reactive UI synthesis, code transpilation, and self-healing layout verification.',
      iterationCount: 14,
      currentTool: 'synthesize_reactive_dom()',
      targetApp: 'Live Agentic Autonomous Studio',
      thoughtTrace: [
        {
          step: 1,
          type: 'THOUGHT',
          content: 'Decomposing autonomous app requirement into reactive Document Object Model tree with signal bindings.',
          timestamp: '11:14:02.120',
        },
        {
          step: 2,
          type: 'ACTION',
          content: 'Invoking tool: create_element("div", { class: "antigravity-studio-container" })',
          timestamp: '11:14:02.145',
        },
        {
          step: 3,
          type: 'OBSERVATION',
          content: 'DOM element created at 0x7FFF_28B0. Allocated 4 child elements and 8 reactive signals.',
          timestamp: '11:14:02.160',
        },
        {
          step: 4,
          type: 'DOM_MUTATION',
          content: 'Binding live round-robin quantum time-slice to single screen frame buffer.',
          timestamp: '11:14:02.185',
        },
      ],
    },
    domRoot: createDefaultDOMNode('root_agent_studio', 'div', 'p-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl space-y-3 font-mono text-white', undefined, [
      createDefaultDOMNode('hdr_agent', 'header', 'flex items-center justify-between pb-2 border-b border-[#1E293B]', undefined, [
        createDefaultDOMNode('title_agent', 'h3', 'text-sm font-bold text-[#38BDF8] flex items-center gap-2', '⚡ Google Antigravity Agent Studio'),
        createDefaultDOMNode('badge_agent', 'span', 'px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-semibold', 'Autonomous Loop Active'),
      ]),
      createDefaultDOMNode('body_agent', 'div', 'grid grid-cols-2 gap-2 text-xs', undefined, [
        createDefaultDOMNode('box1_agent', 'div', 'p-2.5 bg-[#101422] rounded border border-[#202945]', undefined, [
          createDefaultDOMNode('lbl1_agent', 'span', 'text-[10px] text-gray-400 block', 'Model Engine'),
          createDefaultDOMNode('val1_agent', 'strong', 'text-white text-xs', 'Google DeepMind Antigravity'),
        ]),
        createDefaultDOMNode('box2_agent', 'div', 'p-2.5 bg-[#101422] rounded border border-[#202945]', undefined, [
          createDefaultDOMNode('lbl2_agent', 'span', 'text-[10px] text-gray-400 block', 'Round-Robin Quantum'),
          createDefaultDOMNode('val2_agent', 'strong', 'text-[#4ADE80] text-xs', '40ms (High Priority)'),
        ]),
      ]),
      createDefaultDOMNode('action_agent', 'div', 'p-2 bg-[#0E1726] rounded border border-[#1E3A5F] text-[11px] text-[#93C5FD]', 'Agent Loop: Synthesizing real-time reactive signals for single-screen DOM renderer...'),
    ]),
    domSliceMetadata: {
      title: 'Google Antigravity Agent Studio',
      componentType: 'Agentic Autonomous App',
      nodeCount: 12,
      depth: 4,
      reactiveSignalsCount: 8,
      accentColor: '#38BDF8',
    },
  },
  {
    id: 'TID-002',
    name: 'Antigravity Agent: Cardculator 4.2 Pro',
    category: 'USER_APP',
    state: 'READY',
    priority: 8,
    quantumMs: 35,
    remainingQuantumMs: 35,
    cpuPercent: 18.2,
    memoryBytes: 3145728, // 3 MB
    stackSizeKb: 192,
    programCounter: '0x7FFF_1240: EVALUATE_REACTIVE_SPREADSHEET',
    instructionStep: 890,
    callStack: [
      { frame: 0, functionName: 'cardculator_engine.tick()', source: 'apps/cardculator/main.py', line: 78 },
      { frame: 1, functionName: 'recalculate_formula_matrix()', source: 'apps/cardculator/formulas.py', line: 156 },
      { frame: 2, functionName: 'emit_vdom_table()', source: 'apps/cardculator/vdom.py', line: 92 },
    ],
    locksHeld: ['MUTEX_CARDCULATOR_CACHE'],
    locksWaiting: [],
    lastActiveTimestamp: Date.now() - 25,
    totalCycles: 2310,
    agentContext: {
      model: 'Google Antigravity Agent (Code Specialist)',
      goal: 'Compile and maintain algebraic reactive spreadsheet with bi-directional JSON=XML=DOM state sync.',
      iterationCount: 28,
      currentTool: 'recalculate_reactive_grid()',
      targetApp: 'Cardculator 4.2 Pro',
      thoughtTrace: [
        {
          step: 1,
          type: 'THOUGHT',
          content: 'Spreadsheet formula matrix updated in cell C4: =SUM(A1:B3) * 1.05',
          timestamp: '11:14:01.890',
        },
        {
          step: 2,
          type: 'ACTION',
          content: 'Dispatching reactive mutation to Virtual DOM table row.',
          timestamp: '11:14:01.910',
        },
      ],
    },
    domRoot: createDefaultDOMNode('root_cardculator', 'div', 'p-4 bg-[#110E18] border border-[#3B1E4A] rounded-xl space-y-3 font-mono text-white', undefined, [
      createDefaultDOMNode('hdr_card', 'header', 'flex items-center justify-between pb-2 border-b border-[#3B1E4A]', undefined, [
        createDefaultDOMNode('title_card', 'h3', 'text-sm font-bold text-[#C084FC] flex items-center gap-2', '📊 Cardculator 4.2 Pro'),
        createDefaultDOMNode('badge_card', 'span', 'px-2 py-0.5 rounded bg-[#C084FC]/20 text-[#C084FC] text-[10px] font-semibold', 'Formulas: OK'),
      ]),
      createDefaultDOMNode('grid_card', 'div', 'space-y-1.5 text-xs', undefined, [
        createDefaultDOMNode('row1_card', 'div', 'flex items-center justify-between p-1.5 bg-[#1B1426] rounded border border-[#2D1D40]', undefined, [
          createDefaultDOMNode('c1_card', 'span', 'text-gray-400', 'Gross System Revenue'),
          createDefaultDOMNode('v1_card', 'strong', 'text-[#4ADE80]', '$284,920.00'),
        ]),
        createDefaultDOMNode('row2_card', 'div', 'flex items-center justify-between p-1.5 bg-[#1B1426] rounded border border-[#2D1D40]', undefined, [
          createDefaultDOMNode('c2_card', 'span', 'text-gray-400', 'Quantum Overhead Tax'),
          createDefaultDOMNode('v2_card', 'strong', 'text-[#F87171]', '-$12,450.00'),
        ]),
        createDefaultDOMNode('row3_card', 'div', 'flex items-center justify-between p-1.5 bg-[#25173B] rounded border border-[#4A266A]', undefined, [
          createDefaultDOMNode('c3_card', 'span', 'text-white font-bold', 'Net Computable Yield'),
          createDefaultDOMNode('v3_card', 'strong', 'text-[#38BDF8] font-bold', '$272,470.00'),
        ]),
      ]),
    ]),
    domSliceMetadata: {
      title: 'Cardculator 4.2 Pro',
      componentType: 'Reactive Spreadsheet',
      nodeCount: 14,
      depth: 4,
      reactiveSignalsCount: 12,
      accentColor: '#C084FC',
    },
  },
  {
    id: 'TID-003',
    name: 'Antigravity Agent: Sensor & Telemetry Station',
    category: 'ANTIGRAVITY_AGENT',
    state: 'READY',
    priority: 7,
    quantumMs: 30,
    remainingQuantumMs: 30,
    cpuPercent: 14.1,
    memoryBytes: 2621440, // 2.5 MB
    stackSizeKb: 128,
    programCounter: '0x7FFF_2100: STREAM_IOT_GAUGES',
    instructionStep: 512,
    callStack: [
      { frame: 0, functionName: 'telemetry_daemon.poll()', source: 'daemons/telemetry.ts', line: 34 },
      { frame: 1, functionName: 'stream_sensor_gauges()', source: 'daemons/gauges.ts', line: 98 },
    ],
    locksHeld: [],
    locksWaiting: [],
    lastActiveTimestamp: Date.now() - 50,
    totalCycles: 1890,
    agentContext: {
      model: 'Google Antigravity Agent (Real-time Specialist)',
      goal: 'Stream live robotic cell sensors and OpenRAN telemetry into reactive DOM gauges.',
      iterationCount: 19,
      currentTool: 'emit_sensor_gauges()',
      targetApp: 'Edge Telemetry Station',
      thoughtTrace: [
        {
          step: 1,
          type: 'THOUGHT',
          content: 'Receiving 120Hz OpenRAN packet stream from distributed shadow daemons.',
          timestamp: '11:14:01.540',
        },
      ],
    },
    domRoot: createDefaultDOMNode('root_sensors', 'div', 'p-4 bg-[#0A1211] border border-[#133A36] rounded-xl space-y-3 font-mono text-white', undefined, [
      createDefaultDOMNode('hdr_sens', 'header', 'flex items-center justify-between pb-2 border-b border-[#133A36]', undefined, [
        createDefaultDOMNode('title_sens', 'h3', 'text-sm font-bold text-[#2DD4BF] flex items-center gap-2', '🛰️ Edge Sensor Station'),
        createDefaultDOMNode('badge_sens', 'span', 'px-2 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] text-[10px] font-semibold', 'OpenRAN 5G Online'),
      ]),
      createDefaultDOMNode('body_sens', 'div', 'grid grid-cols-3 gap-2 text-center text-xs', undefined, [
        createDefaultDOMNode('g1_sens', 'div', 'p-2 bg-[#0E1E1C] rounded border border-[#19423D]', undefined, [
          createDefaultDOMNode('gl1', 'span', 'text-[10px] text-gray-400 block', 'Frequency'),
          createDefaultDOMNode('gv1', 'strong', 'text-white text-xs', '3.8 GHz'),
        ]),
        createDefaultDOMNode('g2_sens', 'div', 'p-2 bg-[#0E1E1C] rounded border border-[#19423D]', undefined, [
          createDefaultDOMNode('gl2', 'span', 'text-[10px] text-gray-400 block', 'Latency'),
          createDefaultDOMNode('gv2', 'strong', 'text-[#4ADE80] text-xs', '1.2 ms'),
        ]),
        createDefaultDOMNode('g3_sens', 'div', 'p-2 bg-[#0E1E1C] rounded border border-[#19423D]', undefined, [
          createDefaultDOMNode('gl3', 'span', 'text-[10px] text-gray-400 block', 'Jitter'),
          createDefaultDOMNode('gv3', 'strong', 'text-[#38BDF8] text-xs', '0.04 ms'),
        ]),
      ]),
    ]),
    domSliceMetadata: {
      title: 'Sensor & Telemetry Station',
      componentType: 'IoT Real-Time Dashboard',
      nodeCount: 13,
      depth: 4,
      reactiveSignalsCount: 6,
      accentColor: '#2DD4BF',
    },
  },
  {
    id: 'TID-004',
    name: 'Kernel: RoundRobin DOM Scheduler',
    category: 'KERNEL',
    state: 'READY',
    priority: 10,
    quantumMs: 25,
    remainingQuantumMs: 25,
    cpuPercent: 9.8,
    memoryBytes: 1572864, // 1.5 MB
    stackSizeKb: 64,
    programCounter: '0x7FFF_0010: DISPATCH_ROUND_ROBIN_QUANTUM',
    instructionStep: 4520,
    callStack: [
      { frame: 0, functionName: 'kernel_scheduler.step()', source: 'kernel/core/scheduler.ts', line: 12 },
      { frame: 1, functionName: 'dispatch_quantum_slice()', source: 'kernel/core/quantum.ts', line: 45 },
      { frame: 2, functionName: 'paint_single_screen()', source: 'kernel/dom/screen.ts', line: 88 },
    ],
    locksHeld: ['MUTEX_SCHEDULER_QUEUE'],
    locksWaiting: [],
    lastActiveTimestamp: Date.now() - 10,
    totalCycles: 5410,
    domRoot: createDefaultDOMNode('root_sched', 'div', 'p-4 bg-[#141208] border border-[#3E3410] rounded-xl space-y-3 font-mono text-white', undefined, [
      createDefaultDOMNode('hdr_sched', 'header', 'flex items-center justify-between pb-2 border-b border-[#3E3410]', undefined, [
        createDefaultDOMNode('title_sched', 'h3', 'text-sm font-bold text-[#FACC15] flex items-center gap-2', '⏱️ RoundRobin Kernel Scheduler'),
        createDefaultDOMNode('badge_sched', 'span', 'px-2 py-0.5 rounded bg-[#FACC15]/20 text-[#FACC15] text-[10px] font-semibold', 'Quantum: 25-40ms'),
      ]),
      createDefaultDOMNode('body_sched', 'div', 'p-2.5 bg-[#201C0D] rounded border border-[#403816] text-xs space-y-1', undefined, [
        createDefaultDOMNode('s1', 'div', 'flex justify-between text-[11px]', undefined, [
          createDefaultDOMNode('s1_lbl', 'span', 'text-gray-400', 'Scheduler Policy'),
          createDefaultDOMNode('s1_val', 'strong', 'text-white', 'Fair-Share Preemptive Round-Robin'),
        ]),
        createDefaultDOMNode('s2', 'div', 'flex justify-between text-[11px]', undefined, [
          createDefaultDOMNode('s2_lbl', 'span', 'text-gray-400', 'Single Screen Multiplexer'),
          createDefaultDOMNode('s2_val', 'strong', 'text-[#4ADE80]', '60 FPS Direct Memory Blit'),
        ]),
      ]),
    ]),
    domSliceMetadata: {
      title: 'Kernel RoundRobin Scheduler',
      componentType: 'Microkernel Service',
      nodeCount: 11,
      depth: 4,
      reactiveSignalsCount: 4,
      accentColor: '#FACC15',
    },
  },
  {
    id: 'TID-005',
    name: 'Antigravity Agent: Autonomous Task Planner',
    category: 'ANTIGRAVITY_AGENT',
    state: 'WAITING',
    priority: 6,
    quantumMs: 30,
    remainingQuantumMs: 30,
    cpuPercent: 6.4,
    memoryBytes: 2097152, // 2 MB
    stackSizeKb: 128,
    programCounter: '0x7FFF_3400: SOLVE_GANTT_CONSTRAINTS',
    instructionStep: 290,
    callStack: [
      { frame: 0, functionName: 'agent_planner.solve()', source: 'apps/planner/solver.ts', line: 62 },
      { frame: 1, functionName: 'evaluate_dependency_graph()', source: 'apps/planner/graph.ts', line: 112 },
    ],
    locksHeld: [],
    locksWaiting: ['LOCK_VFS_WRITE'],
    lastActiveTimestamp: Date.now() - 120,
    totalCycles: 1140,
    agentContext: {
      model: 'Google Antigravity Agent (Planner Core)',
      goal: 'Synthesize optimal project task dependencies and generate interactive DOM Gantt cards.',
      iterationCount: 8,
      currentTool: 'solve_constraint_matrix()',
      targetApp: 'Autonomous Gantt Planner',
      thoughtTrace: [
        {
          step: 1,
          type: 'THOUGHT',
          content: 'Waiting on VFS write lock to persist schedule matrix into /apps/schedule.json.',
          timestamp: '11:14:00.910',
        },
      ],
    },
    domRoot: createDefaultDOMNode('root_tasks', 'div', 'p-4 bg-[#140C12] border border-[#3C142B] rounded-xl space-y-3 font-mono text-white', undefined, [
      createDefaultDOMNode('hdr_tasks', 'header', 'flex items-center justify-between pb-2 border-b border-[#3C142B]', undefined, [
        createDefaultDOMNode('title_tasks', 'h3', 'text-sm font-bold text-[#F472B6] flex items-center gap-2', '📋 Autonomous Task Planner'),
        createDefaultDOMNode('badge_tasks', 'span', 'px-2 py-0.5 rounded bg-[#F472B6]/20 text-[#F472B6] text-[10px] font-semibold', '4 Active Epics'),
      ]),
      createDefaultDOMNode('body_tasks', 'div', 'space-y-1.5 text-xs', undefined, [
        createDefaultDOMNode('t1', 'div', 'p-1.5 bg-[#20101C] rounded flex justify-between items-center text-[11px]', undefined, [
          createDefaultDOMNode('t1_n', 'span', 'text-gray-200', '1. Transpile XML DOM to Kotlin Flow'),
          createDefaultDOMNode('t1_s', 'span', 'text-[#4ADE80] font-bold text-[10px]', 'DONE (100%)'),
        ]),
        createDefaultDOMNode('t2', 'div', 'p-1.5 bg-[#20101C] rounded flex justify-between items-center text-[11px]', undefined, [
          createDefaultDOMNode('t2_n', 'span', 'text-gray-200', '2. Round-Robin Single Screen Pipeline'),
          createDefaultDOMNode('t2_s', 'span', 'text-[#38BDF8] font-bold text-[10px]', 'IN PROGRESS'),
        ]),
      ]),
    ]),
    domSliceMetadata: {
      title: 'Autonomous Task Planner',
      componentType: 'Project Planning App',
      nodeCount: 11,
      depth: 4,
      reactiveSignalsCount: 5,
      accentColor: '#F472B6',
    },
  },
  {
    id: 'TID-006',
    name: 'Kernel: Memory & Generational GC Daemon',
    category: 'GC',
    state: 'SLEEPING',
    priority: 5,
    quantumMs: 20,
    remainingQuantumMs: 20,
    cpuPercent: 3.2,
    memoryBytes: 1048576, // 1 MB
    stackSizeKb: 64,
    programCounter: '0x7FFF_0080: SLEEP_UNTIL_ALLOCATION_THRESHOLD',
    instructionStep: 980,
    callStack: [
      { frame: 0, functionName: 'gc_daemon.monitor()', source: 'kernel/memory/gc.ts', line: 19 },
      { frame: 1, functionName: 'check_heap_watermark()', source: 'kernel/memory/watermark.ts', line: 44 },
    ],
    locksHeld: [],
    locksWaiting: [],
    lastActiveTimestamp: Date.now() - 400,
    totalCycles: 890,
    domRoot: createDefaultDOMNode('root_gc', 'div', 'p-4 bg-[#0F1316] border border-[#1A2E3B] rounded-xl space-y-3 font-mono text-white', undefined, [
      createDefaultDOMNode('hdr_gc', 'header', 'flex items-center justify-between pb-2 border-b border-[#1A2E3B]', undefined, [
        createDefaultDOMNode('title_gc', 'h3', 'text-sm font-bold text-[#38BDF8] flex items-center gap-2', '🧹 Generational GC Telemetry'),
        createDefaultDOMNode('badge_gc', 'span', 'px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-semibold', 'Heap: 24.3 MB'),
      ]),
      createDefaultDOMNode('body_gc', 'div', 'p-2 bg-[#141F28] rounded text-xs space-y-1 text-gray-300', undefined, [
        createDefaultDOMNode('gc1', 'div', 'flex justify-between text-[11px]', undefined, [
          createDefaultDOMNode('gcl1', 'span', 'text-gray-400', 'Generation 0 (Eden)'),
          createDefaultDOMNode('gcv1', 'strong', 'text-white', '2.4 MB / 4.0 MB'),
        ]),
        createDefaultDOMNode('gc2', 'div', 'flex justify-between text-[11px]', undefined, [
          createDefaultDOMNode('gcl2', 'span', 'text-gray-400', 'Generations 1 & 2 (Old)'),
          createDefaultDOMNode('gcv2', 'strong', 'text-[#4ADE80]', '18.2 MB Compacted'),
        ]),
      ]),
    ]),
    domSliceMetadata: {
      title: 'Memory & Generational GC',
      componentType: 'Memory Daemon',
      nodeCount: 11,
      depth: 4,
      reactiveSignalsCount: 3,
      accentColor: '#38BDF8',
    },
  },
];

// Initial Memory Dump
export function generateKernelMemoryDump(threads: PyMacsThread[]): MemoryDump {
  const totalThreadStackBytes = threads.reduce((acc, t) => acc + t.stackSizeKb * 1024, 0);
  const totalThreadAllocBytes = threads.reduce((acc, t) => acc + t.memoryBytes, 0);

  const domNodeCount = threads.reduce((acc, t) => acc + t.domSliceMetadata.nodeCount, 0) + 128;
  const domNodeBytes = domNodeCount * 1024; // 1 KB per virtual node frame

  const astBytecodeBytes = 6 * 1024 * 1024; // 6 MB
  const vfsBufferBytes = 3.5 * 1024 * 1024; // 3.5 MB
  const agentWorkspaceBytes = 12 * 1024 * 1024; // 12 MB for LLM & agent states
  const kernelHeapBytes = 8 * 1024 * 1024; // 8 MB

  const totalUsedBytes = totalThreadAllocBytes + domNodeBytes + astBytecodeBytes + vfsBufferBytes + agentWorkspaceBytes + kernelHeapBytes;
  const totalHeapBytes = 64 * 1024 * 1024; // 64 MB virtual microkernel space

  return {
    timestamp: new Date().toISOString(),
    totalHeapBytes,
    usedHeapBytes: Math.min(totalUsedBytes, totalHeapBytes),
    freeHeapBytes: Math.max(0, totalHeapBytes - totalUsedBytes),
    peakHeapBytes: totalUsedBytes * 1.15,
    fragmentationPercent: 4.8,
    threadStacks: {
      totalBytes: totalThreadStackBytes,
      activeThreadCount: threads.filter((t) => t.state !== 'TERMINATED').length,
      perThreadUsage: threads.map((t) => ({ tid: t.id, name: t.name, bytes: t.stackSizeKb * 1024 })),
    },
    domNodePool: {
      totalNodes: domNodeCount,
      memoryBytes: domNodeBytes,
      retainedNodes: domNodeCount - 14,
      orphanedNodes: 14,
      reactiveBindingsCount: threads.reduce((acc, t) => acc + t.domSliceMetadata.reactiveSignalsCount, 0),
    },
    astBytecodeCache: {
      moduleCount: 42,
      memoryBytes: astBytecodeBytes,
      cacheHitRatio: 98.4,
      symbolTableEntries: 1840,
    },
    vfsBufferPool: {
      inodesCount: 68,
      memoryBytes: vfsBufferBytes,
      dirtyBuffers: 3,
    },
    gcTelemetry: {
      generation0Collections: 142,
      generation1Collections: 38,
      generation2Collections: 6,
      totalSweeps: 186,
      lastSweepDurationMs: 2.4,
      totalFreedBytes: 42 * 1024 * 1024,
      lastFreedBytes: 1.2 * 1024 * 1024,
      isSweeping: false,
    },
    memorySegments: [
      {
        id: 'seg-stacks',
        name: 'Thread Stacks & Execution Frames',
        baseAddress: '0x0000_1000',
        endAddress: '0x003F_FFFF',
        sizeBytes: 4 * 1024 * 1024,
        usedBytes: totalThreadStackBytes,
        type: 'THREAD_STACKS',
        color: '#38BDF8',
      },
      {
        id: 'seg-dom-pool',
        name: 'W3C Virtual DOM Node Pool',
        baseAddress: '0x0040_0000',
        endAddress: '0x00BF_FFFF',
        sizeBytes: 8 * 1024 * 1024,
        usedBytes: domNodeBytes,
        type: 'DOM_POOL',
        color: '#4ADE80',
      },
      {
        id: 'seg-ast-cache',
        name: 'AST Bytecode & Transpile Symbols',
        baseAddress: '0x00C0_0000',
        endAddress: '0x013F_FFFF',
        sizeBytes: 8 * 1024 * 1024,
        usedBytes: astBytecodeBytes,
        type: 'AST_BYTECODE',
        color: '#FACC15',
      },
      {
        id: 'seg-vfs-buffers',
        name: 'Thread VFS Inodes & Storage RAM',
        baseAddress: '0x0140_0000',
        endAddress: '0x01BF_FFFF',
        sizeBytes: 8 * 1024 * 1024,
        usedBytes: vfsBufferBytes,
        type: 'VFS_BUFFERS',
        color: '#C084FC',
      },
      {
        id: 'seg-agentic-space',
        name: 'Google Antigravity Agent Workspace',
        baseAddress: '0x01C0_0000',
        endAddress: '0x02FF_FFFF',
        sizeBytes: 20 * 1024 * 1024,
        usedBytes: agentWorkspaceBytes,
        type: 'AGENTIC_WORKSPACE',
        color: '#F472B6',
      },
      {
        id: 'seg-kernel-heap',
        name: 'PyMacs Microkernel Core Heap',
        baseAddress: '0x0300_0000',
        endAddress: '0x03FF_FFFF',
        sizeBytes: 16 * 1024 * 1024,
        usedBytes: kernelHeapBytes,
        type: 'KERNEL_HEAP',
        color: '#FB923C',
      },
    ],
  };
}

// Formats a standard Java/Python kernel thread dump as human-readable text
export function formatThreadDumpAsText(threads: PyMacsThread[], memory: MemoryDump): string {
  const timestamp = new Date().toISOString();
  let dump = `================================================================================\n`;
  dump += `PYMACS MICROKERNEL FULL THREAD DUMP (COOPERATIVE & PREEMPTIVE RUNTIME)\n`;
  dump += `Kernel Version: 4.2.0-ANTIGRAVITY-AGENTIC | Timestamp: ${timestamp}\n`;
  dump += `Total Threads in Scope: ${threads.length} | Runnable: ${threads.filter((t) => t.state === 'RUNNING' || t.state === 'READY').length}\n`;
  dump += `Single Screen DOM Round-Robin Slices: active | Default Quantum: 25-40ms\n`;
  dump += `Virtual Heap: ${(memory.totalHeapBytes / 1024 / 1024).toFixed(1)} MB | Used: ${(memory.usedHeapBytes / 1024 / 1024).toFixed(1)} MB | Free: ${(memory.freeHeapBytes / 1024 / 1024).toFixed(1)} MB\n`;
  dump += `================================================================================\n\n`;

  for (const thread of threads) {
    dump += `"${thread.name}" #${thread.id} [${thread.category}]\n`;
    dump += `   java.lang.Thread.State / PyMacsState: ${thread.state}\n`;
    dump += `   Priority: ${thread.priority}/10 | Quantum: ${thread.quantumMs}ms | CPU: ${thread.cpuPercent}% | Memory: ${(thread.memoryBytes / 1024 / 1024).toFixed(2)} MB (Stack: ${thread.stackSizeKb} KB)\n`;
    dump += `   Program Counter: ${thread.programCounter} | Instructions: #${thread.instructionStep} | Cycles: ${thread.totalCycles}\n`;

    if (thread.locksHeld.length > 0) {
      dump += `   - locked <0x${thread.id.replace('-', '')}> (held: ${thread.locksHeld.join(', ')})\n`;
    }
    if (thread.locksWaiting.length > 0) {
      dump += `   - waiting to lock <0x${thread.id.replace('-', '')}> (waiting: ${thread.locksWaiting.join(', ')})\n`;
    }

    if (thread.agentContext) {
      dump += `   Google Antigravity Agent Spec:\n`;
      dump += `     Model: ${thread.agentContext.model}\n`;
      dump += `     Goal: ${thread.agentContext.goal}\n`;
      dump += `     Current Tool: ${thread.agentContext.currentTool || 'idle'}\n`;
      dump += `     Recent Thought: "${thread.agentContext.thoughtTrace[thread.agentContext.thoughtTrace.length - 1]?.content || 'N/A'}"\n`;
    }

    dump += `   DOM Slice: <${thread.domRoot.tagName}> nodeCount=${thread.domSliceMetadata.nodeCount} depth=${thread.domSliceMetadata.depth} signals=${thread.domSliceMetadata.reactiveSignalsCount}\n`;
    dump += `   Call Stack Trace:\n`;
    for (const frame of thread.callStack) {
      dump += `        at ${frame.functionName} (${frame.source}:${frame.line})\n`;
    }
    dump += `\n`;
  }

  dump += `================================================================================\n`;
  dump += `MEMORY USAGE DUMP BY SEGMENT\n`;
  for (const seg of memory.memorySegments) {
    const usedMb = (seg.usedBytes / 1024 / 1024).toFixed(2);
    const sizeMb = (seg.sizeBytes / 1024 / 1024).toFixed(2);
    const pct = ((seg.usedBytes / seg.sizeBytes) * 100).toFixed(1);
    dump += `[${seg.baseAddress} - ${seg.endAddress}] ${seg.name.padEnd(36)} ${usedMb}/${sizeMb} MB (${pct}%)\n`;
  }
  dump += `================================================================================\n`;
  dump += `GC Telemetry: G0=${memory.gcTelemetry.generation0Collections}, G1=${memory.gcTelemetry.generation1Collections}, G2=${memory.gcTelemetry.generation2Collections} | Total Freed: ${(memory.gcTelemetry.totalFreedBytes / 1024 / 1024).toFixed(1)} MB\n`;
  dump += `END OF THREAD DUMP\n`;

  return dump;
}

// Agentic App Templates for user synthesis
export interface AntigravityAppTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  initialPrompt: string;
  sampleDOM: (title: string) => VirtualDOMNode;
}

export const ANTIGRAVITY_APP_TEMPLATES: AntigravityAppTemplate[] = [
  {
    id: 'crypto_analytics',
    name: 'Real-Time Crypto & Market Matrix',
    description: 'Autonomous financial analytics dashboard with order books, tick streams, and reactive spread calculations.',
    category: 'Finance',
    initialPrompt: 'Synthesize a high-throughput crypto market matrix with live candlestick streams and reactive DOM orderbooks.',
    sampleDOM: (title) =>
      createDefaultDOMNode('root_market', 'div', 'p-4 bg-[#0B1015] border border-[#162736] rounded-xl space-y-3 font-mono text-white', undefined, [
        createDefaultDOMNode('hdr_mkt', 'header', 'flex items-center justify-between pb-2 border-b border-[#162736]', undefined, [
          createDefaultDOMNode('t_mkt', 'h3', 'text-sm font-bold text-[#38BDF8] flex items-center gap-2', `📈 ${title}`),
          createDefaultDOMNode('b_mkt', 'span', 'px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-semibold', 'BTC/USDT $96,420'),
        ]),
        createDefaultDOMNode('grid_mkt', 'div', 'grid grid-cols-3 gap-2 text-xs', undefined, [
          createDefaultDOMNode('c1', 'div', 'p-2 bg-[#101A24] rounded border border-[#1E3144]', undefined, [
            createDefaultDOMNode('cl1', 'span', 'text-[10px] text-gray-400 block', '24h High'),
            createDefaultDOMNode('cv1', 'strong', 'text-[#4ADE80] text-xs', '$98,120.00'),
          ]),
          createDefaultDOMNode('c2', 'div', 'p-2 bg-[#101A24] rounded border border-[#1E3144]', undefined, [
            createDefaultDOMNode('cl2', 'span', 'text-[10px] text-gray-400 block', '24h Volume'),
            createDefaultDOMNode('cv2', 'strong', 'text-white text-xs', '$4.2B'),
          ]),
          createDefaultDOMNode('c3', 'div', 'p-2 bg-[#101A24] rounded border border-[#1E3144]', undefined, [
            createDefaultDOMNode('cl3', 'span', 'text-[10px] text-gray-400 block', 'RSI (14)'),
            createDefaultDOMNode('cv3', 'strong', 'text-[#FACC15] text-xs', '64.2 Bullish'),
          ]),
        ]),
        createDefaultDOMNode('footer_mkt', 'div', 'p-2 bg-[#0C151F] rounded text-[11px] text-gray-400', 'Live Antigravity Agent thread updating reactive DOM tree at 40ms round-robin slice.'),
      ]),
  },
  {
    id: 'scientific_calculator',
    name: 'Scientific Graphing & Matrix Cardculator',
    description: 'Autonomous scientific evaluation suite with differential calculus, complex roots, and matrix determinants.',
    category: 'Mathematics',
    initialPrompt: 'Synthesize a scientific cardculator with live trigonometric curves and matrix determinant solvers.',
    sampleDOM: (title) =>
      createDefaultDOMNode('root_sci', 'div', 'p-4 bg-[#140F0A] border border-[#3E2812] rounded-xl space-y-3 font-mono text-white', undefined, [
        createDefaultDOMNode('hdr_sci', 'header', 'flex items-center justify-between pb-2 border-b border-[#3E2812]', undefined, [
          createDefaultDOMNode('t_sci', 'h3', 'text-sm font-bold text-[#FB923C] flex items-center gap-2', `📐 ${title}`),
          createDefaultDOMNode('b_sci', 'span', 'px-2 py-0.5 rounded bg-[#FB923C]/20 text-[#FB923C] text-[10px] font-semibold', 'f(x) = sin(ωt) · e^(-λt)'),
        ]),
        createDefaultDOMNode('body_sci', 'div', 'space-y-2 text-xs', undefined, [
          createDefaultDOMNode('row_sci1', 'div', 'p-2 bg-[#1E150C] rounded border border-[#382110] flex justify-between', undefined, [
            createDefaultDOMNode('l1', 'span', 'text-gray-300', 'Definite Integral ∫[0→π] sin(x) dx'),
            createDefaultDOMNode('v1', 'strong', 'text-[#4ADE80]', '2.00000000'),
          ]),
          createDefaultDOMNode('row_sci2', 'div', 'p-2 bg-[#1E150C] rounded border border-[#382110] flex justify-between', undefined, [
            createDefaultDOMNode('l2', 'span', 'text-gray-300', 'Eigenvalue λ_max (3x3 Matrix)'),
            createDefaultDOMNode('v2', 'strong', 'text-[#38BDF8]', '8.41421356'),
          ]),
        ]),
      ]),
  },
  {
    id: 'serverless_telemetry',
    name: 'Distributed Cloud & Kubernetes Pod Monitor',
    description: 'Autonomous cluster health monitor inspecting container runtimes, node affinity, and ingress error budgets.',
    category: 'Infrastructure',
    initialPrompt: 'Synthesize a cloud pod telemetry monitor with memory heatmaps and round-robin health checks.',
    sampleDOM: (title) =>
      createDefaultDOMNode('root_k8s', 'div', 'p-4 bg-[#0D0E18] border border-[#232742] rounded-xl space-y-3 font-mono text-white', undefined, [
        createDefaultDOMNode('hdr_k8s', 'header', 'flex items-center justify-between pb-2 border-b border-[#232742]', undefined, [
          createDefaultDOMNode('t_k8s', 'h3', 'text-sm font-bold text-[#818CF8] flex items-center gap-2', `☸️ ${title}`),
          createDefaultDOMNode('b_k8s', 'span', 'px-2 py-0.5 rounded bg-[#818CF8]/20 text-[#818CF8] text-[10px] font-semibold', '32 Pods Running'),
        ]),
        createDefaultDOMNode('pods_k8s', 'div', 'grid grid-cols-4 gap-1.5 text-center text-xs', undefined, [
          createDefaultDOMNode('p1', 'div', 'p-1.5 bg-[#15172A] rounded border border-[#2B2E54] text-[#4ADE80] font-bold', 'api-v1-0 (OK)'),
          createDefaultDOMNode('p2', 'div', 'p-1.5 bg-[#15172A] rounded border border-[#2B2E54] text-[#4ADE80] font-bold', 'auth-v2 (OK)'),
          createDefaultDOMNode('p3', 'div', 'p-1.5 bg-[#15172A] rounded border border-[#2B2E54] text-[#38BDF8] font-bold', 'dom-sync (OK)'),
          createDefaultDOMNode('p4', 'div', 'p-1.5 bg-[#15172A] rounded border border-[#2B2E54] text-[#FACC15] font-bold', 'gc-worker (85%)'),
        ]),
      ]),
  },
];
