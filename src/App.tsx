/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VirtualDOMNode, XMLFilterDef, WorkerThread, LambdaStream } from './types/dom';
import { parseXMLToDOM, flattenDOMTree, domToXML } from './engine/w3parser';
import { stepPhysics, PhysicsWorldConfig } from './engine/physics';
import { INITIAL_WORKER_THREADS, updateWorkerMetrics } from './engine/workerPool';
import { INITIAL_LAMBDA_STREAMS, tickLambdaStreams } from './engine/reactiveStreams';
import { INITIAL_OPTIMIZED_ASSETS, OptimizedAsset } from './engine/assetOptimizer';
import { TaskManager } from './engine/taskManager';
import { PRESETS, PresetData } from './data/presets';

// PyMACS Browser-OS Components
import { PyMACSHeader } from './components/os/PyMACSHeader';
import { CommandRail, RailTab } from './components/os/CommandRail';
import { SystemStatusBar } from './components/os/SystemStatusBar';
import { DesktopHomeView } from './components/os/DesktopHomeView';
import { PythonShellWindow } from './components/os/PythonShellWindow';
import { FilesystemWindow } from './components/os/FilesystemWindow';
import { TasksWindow } from './components/os/TasksWindow';
import { SearchWindow } from './components/os/SearchWindow';
import { MessagesWindow } from './components/os/MessagesWindow';
import { CloudOnChainWindow } from './components/os/CloudOnChainWindow';
import { AppsWindow } from './components/os/AppsWindow';
import { ProfilerWindow } from './components/os/ProfilerWindow';
import { ApiExplorerWindow } from './components/os/ApiExplorerWindow';
import { Window, WindowState } from './components/os/WindowManager';

// Core Engines
import { AntigravityCanvas } from './components/AntigravityCanvas';
import { TranspilerPlaygroundView } from './components/TranspilerPlaygroundView';
import { XMLW3ParserView } from './components/XMLW3ParserView';
import { JSONPersistenceView } from './components/JSONPersistenceView';
import { DocumentationView } from './components/DocumentationView';
import { NodeInspectorModal } from './components/NodeInspectorModal';

import {
  Terminal,
  Folder,
  Activity,
  Database,
  Atom,
  LayoutGrid,
  Search,
  MessageSquare,
  Cloud,
  Link,
  BarChart2,
  Code2,
} from 'lucide-react';

export default function App() {
  const [selectedPreset, setSelectedPreset] = useState<PresetData>(PRESETS[0]);
  const [activeTab, setActiveTab] = useState<RailTab>('home');
  const [isDesktopWindowMode, setIsDesktopWindowMode] = useState<boolean>(false);

  // Core state: XML & Virtual DOM
  const [xmlContent, setXmlContent] = useState<string>(selectedPreset.xml);
  const [rootNode, setRootNode] = useState<VirtualDOMNode>(() => parseXMLToDOM(selectedPreset.xml).root);
  const [nodes, setNodes] = useState<VirtualDOMNode[]>(() => flattenDOMTree(rootNode));
  const [filters, setFilters] = useState<XMLFilterDef[]>(() => parseXMLToDOM(selectedPreset.xml).filters);

  // Physics config
  const [gravityY, setGravityY] = useState<number>(selectedPreset.gravityY);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Engines state
  const [workers, setWorkers] = useState<WorkerThread[]>(INITIAL_WORKER_THREADS);
  const [lambdaStreams, setLambdaStreams] = useState<LambdaStream[]>(INITIAL_LAMBDA_STREAMS);
  const [assets, setAssets] = useState<OptimizedAsset[]>(INITIAL_OPTIMIZED_ASSETS);
  const [metrics, setMetrics] = useState(TaskManager.getSystemMetrics());

  // Multi-window State for Desktop Mode
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'shell',
      title: 'PyMACS Python Shell (Emacs Mode)',
      icon: Terminal,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 60,
      y: 40,
      width: 580,
      height: 380,
      zIndex: 10,
    },
    {
      id: 'files',
      title: 'Thread VFS Browser',
      icon: Folder,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 140,
      y: 80,
      width: 620,
      height: 400,
      zIndex: 11,
    },
    {
      id: 'tasks',
      title: 'Asyncio & HTCondor Coroutine Scheduler',
      icon: Activity,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 200,
      y: 120,
      width: 600,
      height: 380,
      zIndex: 12,
    },
    {
      id: 'apps',
      title: 'PyMACS Applications (Cardculator / BSI / RPA)',
      icon: LayoutGrid,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 240,
      y: 100,
      width: 640,
      height: 420,
      zIndex: 13,
    },
  ]);

  // Mouse repulsion reference
  const pointerRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    radius: number;
    strength: number;
  }>({
    x: 0,
    y: 0,
    active: false,
    radius: 160,
    strength: 1.8,
  });

  // Handle Preset Switching
  const handleSelectPreset = (preset: PresetData) => {
    setSelectedPreset(preset);
    setXmlContent(preset.xml);
    setGravityY(preset.gravityY);
    const parsed = parseXMLToDOM(preset.xml);
    setRootNode(parsed.root);
    setNodes(flattenDOMTree(parsed.root));
    setFilters(parsed.filters);
    setSelectedNodeId(null);
  };

  // Handle Parse XML action
  const handleParseXML = useCallback(() => {
    const parsed = parseXMLToDOM(xmlContent);
    setRootNode(parsed.root);
    setNodes(flattenDOMTree(parsed.root));
    if (parsed.filters.length > 0) {
      setFilters(parsed.filters);
    }
  }, [xmlContent]);

  // Handle Synchronized JSON updates
  const handleUpdateFromJSON = useCallback((newRoot: VirtualDOMNode) => {
    setRootNode(newRoot);
    setNodes(flattenDOMTree(newRoot));
    setXmlContent(domToXML(newRoot));
  }, []);

  // Spawn dynamic floating DOM node
  const handleSpawnNode = (tag: string, text: string, x = 320, y = 200, mass = 1.0) => {
    const newNode: VirtualDOMNode = {
      id: `node_${tag.toLowerCase()}_${Math.random().toString(36).substring(2, 6)}`,
      nodeType: 'ELEMENT_NODE',
      tagName: tag,
      attributes: { class: 'dynamic-spawn' },
      children: [],
      textContent: text,
      physics: {
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 3,
        vy: -4 - Math.random() * 4,
        mass,
        charge: 0.8,
        pinned: false,
        radius: 46,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.05,
      },
      styles: {},
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // Mount an entire DOM tree into the active physics canvas
  const handleMountDOMTree = (newRoot: VirtualDOMNode) => {
    setRootNode(newRoot);
    setNodes(flattenDOMTree(newRoot));
    setXmlContent(domToXML(newRoot));
    setActiveTab('physics');
  };

  // Reset node positions
  const handleResetLayout = () => {
    const parsed = parseXMLToDOM(xmlContent);
    setRootNode(parsed.root);
    setNodes(flattenDOMTree(parsed.root));
  };

  // Physics animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const physicsLoop = (time: number) => {
      const dt = Math.min(0.032, (time - lastTime) / 1000 || 0.016);
      lastTime = time;

      const config: PhysicsWorldConfig = {
        gravityY,
        gravityX: 0,
        damping: 0.98,
        restitution: 0.75,
        enableRepulsion: true,
        springTethering: true,
        bounds: {
          width: typeof window !== 'undefined' ? Math.max(800, window.innerWidth - 200) : 1000,
          height: typeof window !== 'undefined' ? Math.max(500, window.innerHeight - 100) : 650,
        },
      };

      setNodes((currentNodes) => {
        const nextNodes = currentNodes.map((n) => ({
          ...n,
          physics: { ...n.physics },
        }));
        stepPhysics(nextNodes, config, dt, pointerRef.current);
        return nextNodes;
      });

      animationFrameId = requestAnimationFrame(physicsLoop);
    };

    animationFrameId = requestAnimationFrame(physicsLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gravityY]);

  // Periodic Telemetry Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setWorkers((prev) => updateWorkerMetrics(prev));
      setLambdaStreams((prev) => tickLambdaStreams(prev, gravityY));
      setMetrics(TaskManager.getSystemMetrics());
    }, 1200);

    return () => clearInterval(timer);
  }, [gravityY]);

  // Window Management Actions
  const handleOpenWindow = (winId: string) => {
    if (isDesktopWindowMode) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === winId
            ? { ...w, isOpen: true, isMinimized: false, zIndex: Math.max(...prev.map((p) => p.zIndex)) + 1 }
            : w
        )
      );
    } else {
      // In single tab mode, map winId to rail tab
      const tabMap: Record<string, RailTab> = {
        home: 'home',
        shell: 'shell',
        files: 'files',
        tasks: 'tasks',
        data: 'data',
        physics: 'physics',
        apps: 'apps',
        search: 'search',
        messages: 'messages',
        cloud: 'cloud',
        onchain: 'onchain',
        api: 'api' as any,
        profiler: 'profiler',
        docs: 'docs',
      };
      if (tabMap[winId]) {
        setActiveTab(tabMap[winId]);
      }
    }
  };

  const handleFocusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
  };

  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  };

  const handleToggleMaximizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  };

  const handleMoveWindow = (id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  };

  const handleResizeWindow = (id: string, width: number, height: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)));
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="h-full w-full min-h-screen bg-[#09090C] text-[#D1D1D1] font-mono flex flex-col overflow-hidden select-none">
      {/* PyMACS Browser-OS Top Header */}
      <PyMACSHeader
        gravityY={gravityY}
        setGravityY={setGravityY}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        onResetLayout={handleResetLayout}
        isDesktopWindowMode={isDesktopWindowMode}
        onToggleWindowMode={() => setIsDesktopWindowMode(!isDesktopWindowMode)}
        onOpenDocs={() => setActiveTab('docs')}
        onOpenShell={() => {
          if (isDesktopWindowMode) {
            handleOpenWindow('shell');
          } else {
            setActiveTab('shell');
          }
        }}
      />

      {/* Main Command Rail & Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Command Rail */}
        <CommandRail
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
          metrics={metrics}
        />

        {/* Central Workspace Area */}
        <main className="flex-1 flex overflow-hidden relative bg-[#0C0C0F]">
          {/* Main View rendering based on activeTab */}
          {activeTab === 'home' && (
            <DesktopHomeView
              onOpenWindow={handleOpenWindow}
              onMountToViewport={handleMountDOMTree}
              currentRootNode={rootNode}
            />
          )}

          {activeTab === 'shell' && (
            <PythonShellWindow
              currentRootNode={rootNode}
              onUpdateRootNode={(newRoot) => {
                setRootNode(newRoot);
                setNodes(flattenDOMTree(newRoot));
              }}
              setGravityY={setGravityY}
              onOpenWindow={handleOpenWindow}
            />
          )}

          {activeTab === 'files' && <FilesystemWindow />}

          {activeTab === 'tasks' && <TasksWindow />}

          {activeTab === 'data' && (
            <TranspilerPlaygroundView
              currentRootNode={rootNode}
              onUpdateRootNode={(newNode) => {
                setRootNode(newNode);
                setNodes(flattenDOMTree(newNode));
              }}
              onMountToViewport={() => {
                setActiveTab('physics');
              }}
            />
          )}

          {activeTab === 'physics' && (
            <AntigravityCanvas
              nodes={nodes}
              filters={filters}
              gravityY={gravityY}
              setGravityY={setGravityY}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onSpawnNode={handleSpawnNode}
              pointerRef={pointerRef}
            />
          )}

          {activeTab === 'apps' && (
            <AppsWindow onMountToViewport={handleMountDOMTree} />
          )}

          {activeTab === 'search' && <SearchWindow />}

          {activeTab === 'messages' && <MessagesWindow />}

          {(activeTab === 'cloud' || activeTab === 'onchain') && (
            <CloudOnChainWindow />
          )}

          {(activeTab as string) === 'api' && <ApiExplorerWindow />}

          {activeTab === 'profiler' && <ProfilerWindow />}

          {activeTab === 'docs' && (
            <DocumentationView
              onOpenTab={(tab) => {
                if (tab === 'viewport') setActiveTab('physics');
                else if (tab === 'playground') setActiveTab('data');
                else if (tab === 'w3parser') setActiveTab('data');
                else setActiveTab('home');
              }}
            />
          )}

          {/* Floating Desktop Windows when Window Mode is Enabled */}
          {isDesktopWindowMode && (
            <div className="absolute inset-0 pointer-events-none z-30">
              {windows.map((win) => {
                if (!win.isOpen || win.isMinimized) return null;
                return (
                  <div key={win.id} className="pointer-events-auto">
                    <Window
                      window={win}
                      onFocus={handleFocusWindow}
                      onClose={handleCloseWindow}
                      onMinimize={handleMinimizeWindow}
                      onToggleMaximize={handleToggleMaximizeWindow}
                      onMove={handleMoveWindow}
                      onResize={handleResizeWindow}
                    >
                      {win.id === 'shell' && (
                        <PythonShellWindow
                          currentRootNode={rootNode}
                          onUpdateRootNode={(newRoot) => {
                            setRootNode(newRoot);
                            setNodes(flattenDOMTree(newRoot));
                          }}
                          setGravityY={setGravityY}
                          onOpenWindow={handleOpenWindow}
                        />
                      )}
                      {win.id === 'files' && <FilesystemWindow />}
                      {win.id === 'tasks' && <TasksWindow />}
                      {win.id === 'apps' && (
                        <AppsWindow onMountToViewport={handleMountDOMTree} />
                      )}
                    </Window>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Node Inspector Drawer / Modal */}
          <NodeInspectorModal
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onApplyImpulse={(fx, fy) => {
              if (selectedNode) {
                selectedNode.physics.vx += fx;
                selectedNode.physics.vy += fy;
              }
            }}
            onTogglePin={() => {
              if (selectedNode) {
                selectedNode.physics.pinned = !selectedNode.physics.pinned;
              }
            }}
            onUpdateMass={(m) => {
              if (selectedNode) {
                selectedNode.physics.mass = m;
              }
            }}
            onUpdateCharge={(q) => {
              if (selectedNode) {
                selectedNode.physics.charge = q;
              }
            }}
          />
        </main>
      </div>

      {/* PyMACS System Status Bar matching ASCII diagram */}
      <SystemStatusBar
        metrics={metrics}
        onOpenShell={() => {
          if (isDesktopWindowMode) {
            handleOpenWindow('shell');
          } else {
            setActiveTab('shell');
          }
        }}
        onQuickCommand={(cmd) => {
          setActiveTab('shell');
        }}
        activeBuffer={`Buffer[${activeTab.toUpperCase()}] 0x7FFA`}
      />
    </div>
  );
}
