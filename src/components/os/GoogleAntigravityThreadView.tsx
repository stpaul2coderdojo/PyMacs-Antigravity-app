/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Google Antigravity Agentic App Building & PyMacs Thread Kernel View
 * 
 * Features:
 * 1. Single Screen in Round Robin DOM Rendering:
 *    - Time-Sliced, Multiplexed Composite, or Thread Focus modes
 *    - Animated Quantum Wheel with real-time countdown progress bar
 *    - Direct rendering of live Virtual DOM subtrees produced by threads
 * 2. PyMacs Kernel Thread Dump:
 *    - Full dump of all PyMacs threads currently in memory or in scope
 *    - TCB metrics: TID, Name, Category, State, Quantum, CPU%, Memory bytes, Program Counter, Locks
 *    - Thread Stack Trace & Agent Reasoning Trace Inspector
 *    - Lifecycle actions: Spawn, Pause, Resume, Kill, Priority Boost, Step Quantum, Export
 * 3. Memory Usage Dump & Generational GC:
 *    - Total Virtual Heap, Used, Free, Peak, Fragmentation
 *    - Thread Stacks, DOM Node Pool, AST Bytecode Cache, VFS Inodes
 *    - Interactive Memory Segments map (0x0000_1000 - 0x03FF_FFFF)
 *    - Generational GC Trigger & Live Telemetry
 * 4. Google Antigravity Agentic App Builder Studio:
 *    - Autonomous prompt input & template selector
 *    - Multi-step Thought-Action-Observation trace
 *    - Dynamic thread synthesis directly into the Round Robin scheduler
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PyMacsThread,
  MemoryDump,
  RoundRobinSchedulerState,
  INITIAL_PYMACS_THREADS,
  generateKernelMemoryDump,
  formatThreadDumpAsText,
  ANTIGRAVITY_APP_TEMPLATES,
  AntigravityAppTemplate,
  countDOMNodes,
  getDOMDepth,
} from '../../engine/threadKernel';
import { VirtualDOMNode } from '../../types/dom';
import {
  Cpu,
  Layers,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  Zap,
  Sparkles,
  Terminal,
  RefreshCw,
  FileText,
  Check,
  Copy,
  Grid,
  Monitor,
  HardDrive,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Flame,
  Clock,
  Code2,
} from 'lucide-react';

interface GoogleAntigravityThreadViewProps {
  onUpdateRootDOM?: (newRoot: VirtualDOMNode) => void;
}

export const GoogleAntigravityThreadView: React.FC<GoogleAntigravityThreadViewProps> = ({
  onUpdateRootDOM,
}) => {
  // Navigation tabs within the Thread Kernel view
  const [activeSubTab, setActiveSubTab] = useState<'screen' | 'threads' | 'memory' | 'agent'>('screen');

  // Kernel Threads state
  const [threads, setThreads] = useState<PyMacsThread[]>(INITIAL_PYMACS_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('TID-001');

  // Filter state for Thread Dump
  const [threadFilterCategory, setThreadFilterCategory] = useState<string>('ALL');
  const [threadFilterState, setThreadFilterState] = useState<string>('ALL');

  // Round-Robin Scheduler state
  const [scheduler, setScheduler] = useState<RoundRobinSchedulerState>({
    activeThreadIndex: 0,
    activeThreadId: 'TID-001',
    defaultQuantumMs: 35,
    quantumProgressPercent: 0,
    elapsedQuantumMs: 0,
    totalRoundRobinCycles: 142,
    totalContextSwitches: 852,
    isPaused: false,
    renderingMode: 'SINGLE_SCREEN_TIME_SLICED',
    focusedThreadId: null,
    fps: 60,
    lastSwitchTimestamp: Date.now(),
    switchLatencyMs: 0.35,
  });

  // Memory Dump state
  const [memoryDump, setMemoryDump] = useState<MemoryDump>(() => generateKernelMemoryDump(INITIAL_PYMACS_THREADS));
  const [isGcRunning, setIsGcRunning] = useState(false);
  const [gcNotice, setGcNotice] = useState<string | null>(null);

  // Copy status
  const [copiedDump, setCopiedDump] = useState(false);

  // Google Antigravity Agent Studio state
  const [agentPrompt, setAgentPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<AntigravityAppTemplate>(ANTIGRAVITY_APP_TEMPLATES[0]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeThoughtLogs, setActiveThoughtLogs] = useState<string[]>([]);

  // Telemetry loop for live CPU / instructions / memory jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread.state === 'TERMINATED') return thread;
          const cpuDelta = (Math.random() - 0.5) * 2;
          const newCpu = Math.max(0.5, Math.min(99, +(thread.cpuPercent + cpuDelta).toFixed(1)));
          const instructionIncrement = thread.state === 'RUNNING' ? Math.floor(Math.random() * 24) + 12 : 0;
          return {
            ...thread,
            cpuPercent: newCpu,
            instructionStep: thread.instructionStep + instructionIncrement,
            totalCycles: thread.totalCycles + (thread.state === 'RUNNING' ? 1 : 0),
          };
        })
      );
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  // Round-Robin DOM Rendering loop
  useEffect(() => {
    if (scheduler.isPaused) return;

    const intervalMs = 50; // Engine tick
    const timer = setInterval(() => {
      setScheduler((prev) => {
        const runnableThreads = threads.filter((t) => t.state === 'RUNNING' || t.state === 'READY');
        if (runnableThreads.length === 0) return prev;

        const currentActive = runnableThreads[prev.activeThreadIndex % runnableThreads.length] || runnableThreads[0];
        const newElapsed = prev.elapsedQuantumMs + intervalMs;
        const currentQuantum = currentActive.quantumMs || prev.defaultQuantumMs;

        if (newElapsed >= currentQuantum) {
          // Quantum expired -> Context switch to next thread in Round-Robin order!
          const nextIndex = (prev.activeThreadIndex + 1) % runnableThreads.length;
          const nextActive = runnableThreads[nextIndex];
          const newCycles = nextIndex === 0 ? prev.totalRoundRobinCycles + 1 : prev.totalRoundRobinCycles;

          // Update active thread state in thread list
          setThreads((all) =>
            all.map((t) => {
              if (t.id === nextActive.id) {
                return { ...t, state: 'RUNNING', remainingQuantumMs: t.quantumMs };
              }
              if (t.id === currentActive.id && t.state === 'RUNNING') {
                return { ...t, state: 'READY', remainingQuantumMs: t.quantumMs };
              }
              return t;
            })
          );

          return {
            ...prev,
            activeThreadIndex: nextIndex,
            activeThreadId: nextActive.id,
            elapsedQuantumMs: 0,
            quantumProgressPercent: 0,
            totalRoundRobinCycles: newCycles,
            totalContextSwitches: prev.totalContextSwitches + 1,
            lastSwitchTimestamp: Date.now(),
            switchLatencyMs: +(Math.random() * 0.3 + 0.2).toFixed(2),
          };
        } else {
          // Advance quantum progress bar
          const pct = Math.min(100, Math.round((newElapsed / currentQuantum) * 100));
          return {
            ...prev,
            elapsedQuantumMs: newElapsed,
            quantumProgressPercent: pct,
          };
        }
      });
    }, 50);

    return () => clearInterval(timer);
  }, [scheduler.isPaused, threads]);

  // Update memory dump periodically
  useEffect(() => {
    setMemoryDump(generateKernelMemoryDump(threads));
  }, [threads]);

  // Active thread currently scheduled for rendering
  const currentRenderThread =
    scheduler.renderingMode === 'THREAD_FOCUS' && scheduler.focusedThreadId
      ? threads.find((t) => t.id === scheduler.focusedThreadId) || threads[0]
      : threads.find((t) => t.id === scheduler.activeThreadId) || threads[0];

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  // Pause / Resume Round-Robin Scheduler
  const handleToggleSchedulerPause = () => {
    setScheduler((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  // Step Quantum manually
  const handleStepQuantum = () => {
    const runnableThreads = threads.filter((t) => t.state === 'RUNNING' || t.state === 'READY');
    if (runnableThreads.length === 0) return;
    const nextIndex = (scheduler.activeThreadIndex + 1) % runnableThreads.length;
    const nextActive = runnableThreads[nextIndex];

    setThreads((all) =>
      all.map((t) => {
        if (t.id === nextActive.id) return { ...t, state: 'RUNNING', remainingQuantumMs: t.quantumMs };
        if (t.id === scheduler.activeThreadId && t.state === 'RUNNING') return { ...t, state: 'READY' };
        return t;
      })
    );

    setScheduler((prev) => ({
      ...prev,
      activeThreadIndex: nextIndex,
      activeThreadId: nextActive.id,
      elapsedQuantumMs: 0,
      quantumProgressPercent: 0,
      totalContextSwitches: prev.totalContextSwitches + 1,
    }));
  };

  // Thread controls
  const handlePauseResumeThread = (tid: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== tid) return t;
        const newState = t.state === 'SLEEPING' || t.state === 'WAITING' ? 'READY' : 'SLEEPING';
        return { ...t, state: newState };
      })
    );
  };

  const handleKillThread = (tid: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== tid) return t;
        return { ...t, state: 'TERMINATED', cpuPercent: 0 };
      })
    );
  };

  const handleBoostPriority = (tid: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== tid) return t;
        const newPri = Math.min(10, t.priority + 1);
        const newQuantum = Math.min(100, t.quantumMs + 10);
        return { ...t, priority: newPri, quantumMs: newQuantum };
      })
    );
  };

  // Trigger Generational GC
  const handleTriggerGC = () => {
    setIsGcRunning(true);
    setGcNotice('Executing Generational Garbage Collector sweep across G0 (Eden) & G1 pools...');
    setTimeout(() => {
      setMemoryDump((prev) => {
        const freed = 1.4 * 1024 * 1024; // 1.4 MB freed
        return {
          ...prev,
          usedHeapBytes: Math.max(12 * 1024 * 1024, prev.usedHeapBytes - freed),
          freeHeapBytes: prev.freeHeapBytes + freed,
          gcTelemetry: {
            ...prev.gcTelemetry,
            generation0Collections: prev.gcTelemetry.generation0Collections + 1,
            totalSweeps: prev.gcTelemetry.totalSweeps + 1,
            totalFreedBytes: prev.gcTelemetry.totalFreedBytes + freed,
            lastFreedBytes: freed,
          },
        };
      });
      setIsGcRunning(false);
      setGcNotice('GC Sweep Completed: Reclaimed 1.4 MB orphaned DOM nodes and AST symbols.');
      setTimeout(() => setGcNotice(null), 3500);
    }, 900);
  };

  // Export Thread Dump
  const handleExportThreadDump = () => {
    const textDump = formatThreadDumpAsText(threads, memoryDump);
    const blob = new Blob([textDump], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pymacs-kernel-thread-dump-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy Thread Dump
  const handleCopyThreadDump = () => {
    const textDump = formatThreadDumpAsText(threads, memoryDump);
    navigator.clipboard.writeText(textDump);
    setCopiedDump(true);
    setTimeout(() => setCopiedDump(false), 2000);
  };

  // Google Antigravity Agent App Synthesis
  const handleSynthesizeApp = () => {
    const promptToUse = agentPrompt.trim() || selectedTemplate.initialPrompt;
    setIsSynthesizing(true);
    setActiveThoughtLogs([]);

    const steps = [
      `[STEP 1: THOUGHT] Decomposing prompt: "${promptToUse}" into reactive W3C Document Object Model specifications.`,
      `[STEP 2: THOUGHT] Allocating thread memory block (2.5 MB) & calculating round-robin quantum time-slice (35ms).`,
      `[STEP 3: ACTION] Invoking compiler: generate_reactive_vdom_tree() with bi-directional signal bindings.`,
      `[STEP 4: OBSERVATION] Synthesized 16 DOM nodes, 8 reactive state variables, and registered in PyMacs Kernel Scheduler.`,
      `[STEP 5: DOM_MUTATION] Mounting live DOM root into new PyMacs thread (TID-${String(threads.length + 1).padStart(3, '0')}).`,
    ];

    steps.forEach((msg, idx) => {
      setTimeout(() => {
        setActiveThoughtLogs((prev) => [...prev, msg]);
        if (idx === steps.length - 1) {
          // Finalize thread creation
          const newTid = `TID-${String(threads.length + 1).padStart(3, '0')}`;
          const newThread: PyMacsThread = {
            id: newTid,
            name: `Antigravity Agent: ${selectedTemplate.name}`,
            category: 'ANTIGRAVITY_AGENT',
            state: 'READY',
            priority: 8,
            quantumMs: 35,
            remainingQuantumMs: 35,
            cpuPercent: 12.5,
            memoryBytes: 2621440,
            stackSizeKb: 128,
            programCounter: '0x7FFF_5100: EXECUTE_AGENTIC_APP',
            instructionStep: 1,
            callStack: [
              { frame: 0, functionName: 'agent_synthesizer.run()', source: 'kernel/agent/app.ts', line: 1 },
              { frame: 1, functionName: 'mount_to_round_robin()', source: 'kernel/scheduler/vdom.ts', line: 44 },
            ],
            locksHeld: [],
            locksWaiting: [],
            lastActiveTimestamp: Date.now(),
            totalCycles: 1,
            agentContext: {
              model: 'Google Antigravity Agent (DeepMind Antigravity Core)',
              goal: promptToUse,
              iterationCount: 1,
              currentTool: 'synthesize_reactive_vdom()',
              targetApp: selectedTemplate.name,
              thoughtTrace: [
                {
                  step: 1,
                  type: 'THOUGHT',
                  content: promptToUse,
                  timestamp: new Date().toLocaleTimeString(),
                },
              ],
            },
            domRoot: selectedTemplate.sampleDOM(selectedTemplate.name),
            domSliceMetadata: {
              title: selectedTemplate.name,
              componentType: 'Agentic App',
              nodeCount: 14,
              depth: 4,
              reactiveSignalsCount: 8,
              accentColor: '#38BDF8',
            },
          };

          setThreads((prev) => [...prev, newThread]);
          setIsSynthesizing(false);
          setSelectedThreadId(newTid);
          setActiveSubTab('screen');
        }
      }, (idx + 1) * 350);
    });
  };

  // Filtered threads for thread dump view
  const filteredThreads = threads.filter((t) => {
    if (threadFilterCategory !== 'ALL' && t.category !== threadFilterCategory) return false;
    if (threadFilterState !== 'ALL' && t.state !== threadFilterState) return false;
    return true;
  });

  // Recursive renderer for Virtual DOM nodes on Single Screen
  const renderDOMTree = (node: VirtualDOMNode) => {
    const Tag = (node.tagName.toLowerCase() as any) || 'div';
    return (
      <Tag
        key={node.id}
        id={node.id}
        className={node.attributes?.class || ''}
      >
        {node.textContent && <span>{node.textContent}</span>}
        {node.children && node.children.map((child) => renderDOMTree(child))}
      </Tag>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#08090C] text-[#E2E8F0] font-mono select-none overflow-hidden">
      {/* Top Engine Control Bar */}
      <header className="px-4 py-2.5 bg-[#0D0F15] border-b border-[#1A1F2C] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Google Antigravity Agentic Engine</span>
              <span className="text-gray-500 font-normal">/</span>
              <span className="text-[#38BDF8]">PyMacs Thread Kernel</span>
            </h1>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] font-semibold hidden md:inline">
            Round-Robin Scheduler Active
          </span>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#131620] p-1 rounded-lg border border-[#22283A]">
          <button
            onClick={() => setActiveSubTab('screen')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer ${
              activeSubTab === 'screen'
                ? 'bg-[#38BDF8] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Single Screen in Round-Robin DOM Rendering"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Single Screen (Round-Robin)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('threads')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer ${
              activeSubTab === 'threads'
                ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Full Thread Dump in memory or scope"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Kernel Thread Dump</span>
            <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-blue-200">
              {threads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('memory')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer ${
              activeSubTab === 'memory'
                ? 'bg-[#A855F7] text-white font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Memory Usage Dump & Generational GC"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Memory Dump &amp; GC</span>
            <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-purple-200">
              {(memoryDump.usedHeapBytes / 1024 / 1024).toFixed(1)}MB
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('agent')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all cursor-pointer ${
              activeSubTab === 'agent'
                ? 'bg-[#4ADE80] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Google Antigravity Agent App Builder Studio"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Antigravity App Studio</span>
          </button>
        </div>

        {/* Global Scheduler Control buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSchedulerPause}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer border ${
              scheduler.isPaused
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/30'
                : 'bg-[#1E2333] text-gray-300 border-[#2A3147] hover:text-white'
            }`}
            title={scheduler.isPaused ? 'Resume Round-Robin loop' : 'Pause Round-Robin loop'}
          >
            {scheduler.isPaused ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepQuantum}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#1E2333] hover:bg-[#2A3147] text-gray-200 rounded text-xs font-semibold border border-[#2A3147] transition-all cursor-pointer"
            title="Force Step to Next Round-Robin Thread Quantum"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Step Quantum</span>
          </button>
        </div>
      </header>

      {/* Main Body Area */}
      <div className="flex-1 overflow-hidden relative flex">
        {/* ======================= TAB 1: SINGLE SCREEN IN ROUND ROBIN DOM RENDERING ======================= */}
        {activeSubTab === 'screen' && (
          <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden">
            {/* Round-Robin Telemetry Ribbon & Quantum Wheel */}
            <div className="px-4 py-2 bg-[#0E1118] border-b border-[#1A1F2C] flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Left: Active Quantum progress */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Active Quantum:</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#161B26] border border-[#252D3F]">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
                    <span className="font-bold text-white text-[11px]">{currentRenderThread.id}</span>
                    <span className="text-gray-400 text-[10px]">({currentRenderThread.name})</span>
                  </div>
                </div>

                {/* Live Quantum Progress Bar */}
                <div className="w-32 bg-[#1A1F2C] rounded-full h-2 overflow-hidden border border-[#283147] hidden sm:block">
                  <div
                    className="bg-[#38BDF8] h-full transition-all duration-75"
                    style={{ width: `${scheduler.quantumProgressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#38BDF8] font-mono hidden sm:inline">
                  {scheduler.elapsedQuantumMs}ms / {currentRenderThread.quantumMs}ms ({scheduler.quantumProgressPercent}%)
                </span>
              </div>

              {/* Center: Scheduling Metrics */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                <span>Cycle: <strong className="text-white">#{scheduler.totalRoundRobinCycles}</strong></span>
                <span>•</span>
                <span>Switches: <strong className="text-white">{scheduler.totalContextSwitches}</strong></span>
                <span>•</span>
                <span>Latency: <strong className="text-[#4ADE80]">{scheduler.switchLatencyMs}ms</strong></span>
              </div>

              {/* Right: Screen View Modes */}
              <div className="flex items-center gap-1.5 bg-[#131622] p-0.5 rounded border border-[#22283A]">
                <button
                  onClick={() => setScheduler((prev) => ({ ...prev, renderingMode: 'SINGLE_SCREEN_TIME_SLICED', focusedThreadId: null }))}
                  className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                    scheduler.renderingMode === 'SINGLE_SCREEN_TIME_SLICED'
                      ? 'bg-[#38BDF8] text-black font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Interleaved Time-Sliced View on Single Screen"
                >
                  Time-Sliced
                </button>
                <button
                  onClick={() => setScheduler((prev) => ({ ...prev, renderingMode: 'SINGLE_SCREEN_COMPOSITE', focusedThreadId: null }))}
                  className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                    scheduler.renderingMode === 'SINGLE_SCREEN_COMPOSITE'
                      ? 'bg-[#38BDF8] text-black font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Multiplexed Composite Bento Grid"
                >
                  Composite
                </button>
                <button
                  onClick={() => setScheduler((prev) => ({ ...prev, renderingMode: 'THREAD_FOCUS', focusedThreadId: currentRenderThread.id }))}
                  className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                    scheduler.renderingMode === 'THREAD_FOCUS'
                      ? 'bg-[#38BDF8] text-black font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Lock single screen to current thread"
                >
                  Thread Focus
                </button>
              </div>
            </div>

            {/* Round-Robin Interactive Ring / Thread Switcher Queue */}
            <div className="px-4 py-2 bg-[#0A0C10] border-b border-[#161B26] overflow-x-auto flex items-center gap-2 shrink-0">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider shrink-0 mr-1">
                Queue:
              </span>
              {threads.map((thread, idx) => {
                const isActive = thread.id === scheduler.activeThreadId;
                const isSelected = thread.id === selectedThreadId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      setSelectedThreadId(thread.id);
                      setScheduler((prev) => ({
                        ...prev,
                        focusedThreadId: thread.id,
                        renderingMode: 'THREAD_FOCUS',
                      }));
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all shrink-0 cursor-pointer border ${
                      isActive
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/60 font-bold shadow-[0_0_8px_rgba(56,189,248,0.25)]'
                        : isSelected
                        ? 'bg-[#1A2234] text-white border-[#2A3955]'
                        : 'bg-[#10131B] text-gray-400 border-[#1B2130] hover:text-gray-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        thread.state === 'RUNNING'
                          ? 'bg-[#4ADE80] animate-pulse'
                          : thread.state === 'READY'
                          ? 'bg-[#38BDF8]'
                          : thread.state === 'WAITING'
                          ? 'bg-yellow-400'
                          : 'bg-gray-500'
                      }`}
                    />
                    <span>{thread.id}</span>
                    <span className="text-[10px] opacity-75">({thread.quantumMs}ms)</span>
                  </button>
                );
              })}
            </div>

            {/* THE SINGLE SCREEN DISPLAY CANVAS */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#060709] flex flex-col justify-center items-center">
              <div className="w-full max-w-4xl bg-[#0C0F17] rounded-2xl border border-[#1E2638] shadow-2xl overflow-hidden flex flex-col">
                {/* Single Screen Bezel Header */}
                <div className="px-4 py-2.5 bg-[#121622] border-b border-[#20293D] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                    </div>
                    <span className="text-xs font-bold text-gray-200 ml-2">
                      PyMacs Single Screen Viewport
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      [1920x1080 Native Buffer • 60 FPS]
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-gray-400">Rendering Slice:</span>
                    <span className="px-2 py-0.5 bg-[#38BDF8]/15 border border-[#38BDF8]/30 rounded text-[#38BDF8] font-bold">
                      {currentRenderThread.id}: {currentRenderThread.domSliceMetadata.title}
                    </span>
                  </div>
                </div>

                {/* Screen Content Render */}
                <div className="p-6 bg-[#090B10] min-h-[380px] flex flex-col justify-center">
                  {scheduler.renderingMode === 'SINGLE_SCREEN_COMPOSITE' ? (
                    // Composite Bento Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {threads
                        .filter((t) => t.state !== 'TERMINATED')
                        .map((t) => (
                          <div
                            key={t.id}
                            className={`rounded-xl transition-all ${
                              t.id === scheduler.activeThreadId
                                ? 'ring-2 ring-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                                : 'opacity-85'
                            }`}
                          >
                            {renderDOMTree(t.domRoot)}
                          </div>
                        ))}
                    </div>
                  ) : (
                    // Time-Sliced Single Screen Live View
                    <div className="space-y-4">
                      {renderDOMTree(currentRenderThread.domRoot)}

                      {/* Screen HUD Overlay */}
                      <div className="p-3 bg-[#111520]/80 backdrop-blur rounded-xl border border-[#1F273D] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">W3C DOM Nodes:</span>
                          <strong className="text-white">{currentRenderThread.domSliceMetadata.nodeCount}</strong>
                          <span className="text-gray-400">Depth:</span>
                          <strong className="text-white">{currentRenderThread.domSliceMetadata.depth}</strong>
                          <span className="text-gray-400">Signals:</span>
                          <strong className="text-[#38BDF8]">{currentRenderThread.domSliceMetadata.reactiveSignalsCount}</strong>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span>Thread Priority: {currentRenderThread.priority}/10</span>
                          <span>•</span>
                          <span>CPU: {currentRenderThread.cpuPercent}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Single Screen Footer Status */}
                <div className="px-4 py-2 bg-[#121622] border-t border-[#20293D] flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                    <span>Mode: {scheduler.renderingMode.replace('SINGLE_SCREEN_', '')}</span>
                  </div>
                  <span>Transpiled &amp; Rendered via PyMacs Cooperative Quantum Slicing</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: KERNEL THREAD DUMP VIEW ======================= */}
        {activeSubTab === 'threads' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1A1F2C] h-full overflow-hidden bg-[#08090C]">
            {/* Left Column: Thread List & Filters (7 cols) */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[#0A0C11]">
              {/* Filter and Action Header */}
              <div className="p-3 bg-[#0F121A] border-b border-[#1A202E] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 uppercase font-semibold text-[11px]">Filter:</span>
                  <select
                    value={threadFilterCategory}
                    onChange={(e) => setThreadFilterCategory(e.target.value)}
                    className="bg-[#151924] border border-[#232B3E] rounded px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="ANTIGRAVITY_AGENT">Antigravity Agent</option>
                    <option value="KERNEL">Kernel Service</option>
                    <option value="USER_APP">User App</option>
                    <option value="GC">Garbage Collector</option>
                  </select>

                  <select
                    value={threadFilterState}
                    onChange={(e) => setThreadFilterState(e.target.value)}
                    className="bg-[#151924] border border-[#232B3E] rounded px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All States</option>
                    <option value="RUNNING">RUNNING</option>
                    <option value="READY">READY</option>
                    <option value="WAITING">WAITING</option>
                    <option value="SLEEPING">SLEEPING</option>
                    <option value="TERMINATED">TERMINATED</option>
                  </select>
                </div>

                {/* Dump Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyThreadDump}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#181D2A] hover:bg-[#232A3C] text-gray-200 border border-[#273044] rounded text-xs font-semibold cursor-pointer transition-all"
                    title="Copy full kernel thread dump to clipboard"
                  >
                    {copiedDump ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDump ? 'Copied!' : 'Copy Dump'}</span>
                  </button>

                  <button
                    onClick={handleExportThreadDump}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#38BDF8]/20 hover:bg-[#38BDF8]/30 text-[#38BDF8] border border-[#38BDF8]/40 rounded text-xs font-semibold cursor-pointer transition-all"
                    title="Download thread dump as .txt file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Dump</span>
                  </button>
                </div>
              </div>

              {/* Thread Table */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredThreads.map((thread) => {
                  const isSelected = thread.id === selectedThreadId;
                  const isScheduled = thread.id === scheduler.activeThreadId;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer font-mono ${
                        isSelected
                          ? 'bg-[#151C2C] border-[#38BDF8]/60 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                          : 'bg-[#0E1118] border-[#1C2232] hover:border-[#2C3650]'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#1A2030] text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              thread.state === 'RUNNING'
                                ? 'bg-[#4ADE80] animate-pulse'
                                : thread.state === 'READY'
                                ? 'bg-[#38BDF8]'
                                : thread.state === 'WAITING'
                                ? 'bg-yellow-400'
                                : 'bg-gray-500'
                            }`}
                          />
                          <strong className="text-white text-xs">{thread.id}</strong>
                          <span className="text-[#38BDF8] font-bold text-xs">{thread.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isScheduled && (
                            <span className="px-1.5 py-0.2 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 text-[9.5px] font-bold animate-pulse">
                              RUNNING QUANTUM
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              thread.state === 'RUNNING'
                                ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                                : thread.state === 'READY'
                                ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                                : thread.state === 'WAITING'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-700/40 text-gray-400'
                            }`}
                          >
                            {thread.state}
                          </span>
                        </div>
                      </div>

                      {/* Thread Metrics Grid */}
                      <div className="grid grid-cols-4 gap-2 pt-2 text-[11px] text-gray-400">
                        <div>
                          <span className="text-gray-500 block text-[9.5px]">PRIORITY</span>
                          <span className="text-white font-bold">{thread.priority}/10</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[9.5px]">QUANTUM</span>
                          <span className="text-white font-bold">{thread.quantumMs}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[9.5px]">CPU LOAD</span>
                          <span className="text-[#38BDF8] font-bold">{thread.cpuPercent}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[9.5px]">MEMORY</span>
                          <span className="text-[#4ADE80] font-bold">
                            {(thread.memoryBytes / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>

                      {/* Instruction & Locks Preview */}
                      <div className="pt-2 mt-2 border-t border-[#161B28] flex items-center justify-between text-[10px] text-gray-400">
                        <span className="truncate max-w-[280px]">PC: {thread.programCounter}</span>
                        <span>Locks Held: {thread.locksHeld.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Thread Inspector & Stack Trace (5 cols) */}
            <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto p-4 bg-[#0D0F16] space-y-4">
              {/* Thread Inspector Header */}
              <div className="p-3.5 bg-[#121520] border border-[#20273A] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#38BDF8]" />
                    <span>Thread Control Block (TCB): {selectedThread.id}</span>
                  </span>
                  <span className="text-[10px] text-gray-400">Cycles: #{selectedThread.totalCycles}</span>
                </div>
                <div className="text-xs text-[#38BDF8] font-semibold">{selectedThread.name}</div>
                <div className="text-[11px] text-gray-400 leading-relaxed">
                  {selectedThread.agentContext?.goal || 'Core PyMacs microkernel operating thread.'}
                </div>

                {/* Lifecycle action buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#1C2232]">
                  <button
                    onClick={() => handlePauseResumeThread(selectedThread.id)}
                    className="px-2.5 py-1 bg-[#1A2132] hover:bg-[#253046] text-gray-200 border border-[#29354D] rounded text-xs font-semibold cursor-pointer"
                  >
                    {selectedThread.state === 'SLEEPING' || selectedThread.state === 'WAITING' ? 'Wake Thread' : 'Sleep Thread'}
                  </button>

                  <button
                    onClick={() => handleBoostPriority(selectedThread.id)}
                    className="px-2.5 py-1 bg-[#1A2132] hover:bg-[#253046] text-gray-200 border border-[#29354D] rounded text-xs font-semibold cursor-pointer"
                  >
                    Boost Priority (+1)
                  </button>

                  <button
                    onClick={() => handleKillThread(selectedThread.id)}
                    className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded text-xs font-semibold cursor-pointer"
                  >
                    Kill Thread
                  </button>
                </div>
              </div>

              {/* Call Stack Trace */}
              <div className="p-3.5 bg-[#121520] border border-[#20273A] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white pb-1 border-b border-[#1E2536]">
                  <span>Stack Frame Trace ({selectedThread.callStack.length} frames)</span>
                  <span className="text-[10px] text-gray-500 font-mono">Stack Size: {selectedThread.stackSizeKb} KB</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {selectedThread.callStack.map((frame) => (
                    <div key={frame.frame} className="p-2 bg-[#0A0C11] rounded border border-[#191E2D] space-y-0.5">
                      <div className="text-[#4ADE80] font-bold">
                        #{frame.frame} {frame.functionName}
                      </div>
                      <div className="text-gray-400 text-[10px]">
                        at {frame.source}:{frame.line}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agentic Reasoning Trace (if Google Antigravity Agent thread) */}
              {selectedThread.agentContext && (
                <div className="p-3.5 bg-[#121520] border border-[#20273A] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white pb-1 border-b border-[#1E2536]">
                    <span className="flex items-center gap-1 text-[#F59E0B]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Antigravity Agentic Reasoning Trace</span>
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Tool: {selectedThread.agentContext.currentTool || 'idle'}
                    </span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    {selectedThread.agentContext.thoughtTrace.map((item, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded border leading-relaxed ${
                          item.type === 'THOUGHT'
                            ? 'bg-[#1E190E] border-[#3D3015] text-[#FDE047]'
                            : item.type === 'ACTION'
                            ? 'bg-[#0E1A24] border-[#1D354A] text-[#93C5FD]'
                            : item.type === 'DOM_MUTATION'
                            ? 'bg-[#0E2016] border-[#1B402B] text-[#86EFAC]'
                            : 'bg-[#181524] border-[#302746] text-[#D8B4FE]'
                        }`}
                      >
                        <span className="font-bold opacity-80 block text-[9px] mb-0.5">
                          [{item.type}] • {item.timestamp}
                        </span>
                        <span>{item.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 3: MEMORY USAGE DUMP & GENERATIONAL GC ======================= */}
        {activeSubTab === 'memory' && (
          <div className="flex-1 p-4 overflow-y-auto bg-[#08090C] space-y-4">
            {/* Memory Header Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#0E1118] border border-[#1E2434] rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Total Virtual Heap</span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">
                  {(memoryDump.totalHeapBytes / 1024 / 1024).toFixed(1)} MB
                </span>
                <span className="text-[10px] text-gray-400">Virtual Microkernel Address Space</span>
              </div>

              <div className="p-3.5 bg-[#0E1118] border border-[#1E2434] rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Used Memory</span>
                <span className="text-xl font-bold text-[#38BDF8] font-mono mt-1 block">
                  {(memoryDump.usedHeapBytes / 1024 / 1024).toFixed(1)} MB
                </span>
                <span className="text-[10px] text-[#38BDF8]">
                  {((memoryDump.usedHeapBytes / memoryDump.totalHeapBytes) * 100).toFixed(1)}% Capacity
                </span>
              </div>

              <div className="p-3.5 bg-[#0E1118] border border-[#1E2434] rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Free Heap</span>
                <span className="text-xl font-bold text-[#4ADE80] font-mono mt-1 block">
                  {(memoryDump.freeHeapBytes / 1024 / 1024).toFixed(1)} MB
                </span>
                <span className="text-[10px] text-gray-400">Fragmentation: {memoryDump.fragmentationPercent}%</span>
              </div>

              <div className="p-3.5 bg-[#0E1118] border border-[#1E2434] rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">DOM Node Pool</span>
                <span className="text-xl font-bold text-[#FACC15] font-mono mt-1 block">
                  {memoryDump.domNodePool.totalNodes} Nodes
                </span>
                <span className="text-[10px] text-gray-400">
                  {(memoryDump.domNodePool.memoryBytes / 1024).toFixed(1)} KB Pool
                </span>
              </div>
            </div>

            {/* GC Trigger and Telemetry Banner */}
            <div className="p-4 bg-[#121622] border border-[#20283C] rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-xs font-bold text-white">Generational Garbage Collector (G0, G1, G2)</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Total sweeps: <strong className="text-white">{memoryDump.gcTelemetry.totalSweeps}</strong> • Reclaimed:{' '}
                  <strong className="text-[#4ADE80]">{(memoryDump.gcTelemetry.totalFreedBytes / 1024 / 1024).toFixed(1)} MB</strong> • Last sweep duration:{' '}
                  <strong className="text-white">{memoryDump.gcTelemetry.lastSweepDurationMs}ms</strong>
                </p>
                {gcNotice && (
                  <div className="text-xs text-[#4ADE80] font-semibold animate-fade-in">{gcNotice}</div>
                )}
              </div>

              <button
                onClick={handleTriggerGC}
                disabled={isGcRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ADE80] hover:bg-[#22c55e] text-black font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGcRunning ? 'animate-spin' : ''}`} />
                <span>{isGcRunning ? 'Sweeping Heap...' : 'Run PyMacs GC Sweep'}</span>
              </button>
            </div>

            {/* Visual Memory Segments Map */}
            <div className="p-4 bg-[#0E1118] border border-[#1E2434] rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Microkernel Memory Segments Map [0x0000_1000 - 0x03FF_FFFF]</span>
                <span className="text-gray-400 font-normal text-[11px]">Linear Address Space</span>
              </div>

              {/* Segment Bars */}
              <div className="h-6 w-full rounded-lg overflow-hidden flex bg-[#161A26] border border-[#262F44]">
                {memoryDump.memorySegments.map((seg) => {
                  const widthPct = (seg.sizeBytes / memoryDump.totalHeapBytes) * 100;
                  return (
                    <div
                      key={seg.id}
                      style={{ width: `${widthPct}%`, backgroundColor: seg.color }}
                      className="h-full opacity-85 hover:opacity-100 transition-opacity relative group cursor-pointer"
                      title={`${seg.name}: ${(seg.usedBytes / 1024 / 1024).toFixed(1)}MB / ${(seg.sizeBytes / 1024 / 1024).toFixed(1)}MB`}
                    />
                  );
                })}
              </div>

              {/* Segment Legend & Table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                {memoryDump.memorySegments.map((seg) => (
                  <div key={seg.id} className="p-2.5 bg-[#121520] rounded border border-[#1E2536] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: seg.color }} />
                        <span className="font-bold text-white text-[11px] truncate max-w-[150px]">{seg.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {((seg.usedBytes / seg.sizeBytes) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>{seg.baseAddress}</span>
                      <span>{(seg.usedBytes / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: GOOGLE ANTIGRAVITY AGENT STUDIO ======================= */}
        {activeSubTab === 'agent' && (
          <div className="flex-1 p-6 overflow-y-auto bg-[#08090C] space-y-5 flex flex-col justify-start items-center">
            <div className="w-full max-w-3xl space-y-4">
              {/* Studio Banner */}
              <div className="p-5 bg-gradient-to-r from-[#0C121E] to-[#12101F] border border-[#222B42] rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#38BDF8]" />
                  <h2 className="text-base font-bold text-white">Google Antigravity Agentic App Builder</h2>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Leverage Google DeepMind&apos;s Antigravity agent architecture to synthesize reactive Document Object Model applications. The autonomous agent orchestrates tool calls, compiles reactive signal trees, and deploys the app as an isolated PyMacs thread into the Round-Robin DOM scheduler.
                </p>
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Select Autonomous App Template:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ANTIGRAVITY_APP_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplate.id === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => {
                          setSelectedTemplate(tmpl);
                          setAgentPrompt(tmpl.initialPrompt);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer font-mono ${
                          isSelected
                            ? 'bg-[#151D2E] border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                            : 'bg-[#0E1118] border-[#1C2232] hover:border-[#2C3650]'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{tmpl.name}</div>
                        <div className="text-[10px] text-gray-400 mt-1 leading-normal">{tmpl.description}</div>
                        <div className="text-[9.5px] text-[#38BDF8] mt-2 font-semibold">Category: {tmpl.category}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Agentic Synthesis Prompt:
                </span>
                <div className="relative">
                  <textarea
                    value={agentPrompt || selectedTemplate.initialPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    rows={3}
                    className="w-full p-3.5 bg-[#0D1017] border border-[#202738] rounded-xl text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono leading-relaxed resize-none"
                    placeholder="Describe the application you want the Google Antigravity Agent to synthesize..."
                  />
                  <button
                    onClick={handleSynthesizeApp}
                    disabled={isSynthesizing}
                    className="absolute right-3 bottom-3.5 flex items-center gap-1.5 px-3 py-1.5 bg-[#38BDF8] hover:bg-[#0284c7] text-black font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSynthesizing ? 'Synthesizing App...' : 'Launch Agentic Build'}</span>
                  </button>
                </div>
              </div>

              {/* Agentic Thought Log Output */}
              {activeThoughtLogs.length > 0 && (
                <div className="p-4 bg-[#0A0C11] border border-[#1A2030] rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#161B28]">
                    <span className="text-gray-300 font-bold flex items-center gap-1.5 text-xs">
                      <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Live Antigravity Agent Execution Trace</span>
                    </span>
                    {isSynthesizing && <span className="text-[#38BDF8] text-[10px] animate-pulse">Running...</span>}
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {activeThoughtLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded ${
                          log.includes('THOUGHT')
                            ? 'bg-[#1C180E] text-[#FDE047]'
                            : log.includes('ACTION')
                            ? 'bg-[#0E1824] text-[#93C5FD]'
                            : log.includes('DOM_MUTATION')
                            ? 'bg-[#0E2015] text-[#86EFAC]'
                            : 'bg-[#141722] text-gray-300'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
