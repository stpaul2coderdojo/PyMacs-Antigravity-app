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
import { PRESETS, PresetData } from './data/presets';

import { Header } from './components/Header';
import { BrowserChrome, BrowserTab } from './components/BrowserChrome';
import { AntigravityCanvas } from './components/AntigravityCanvas';
import { XMLW3ParserView } from './components/XMLW3ParserView';
import { JSONPersistenceView } from './components/JSONPersistenceView';
import { JSCompilerView } from './components/JSCompilerView';
import { WorkerThreadPoolView } from './components/WorkerThreadPoolView';
import { MediaOptimizerView } from './components/MediaOptimizerView';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedPreset, setSelectedPreset] = useState<PresetData>(PRESETS[0]);
  const [activeTab, setActiveTab] = useState<BrowserTab>('viewport');
  const [currentUrl, setCurrentUrl] = useState('pymacs://antigravity.sys/live-dom');

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
  const [bufferLoadMs, setBufferLoadMs] = useState(1.2);

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
        vy: -4 - Math.random() * 4, // spawn with upward antigravity drift
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

  // Trigger Antigravity Impulse Pulse across all nodes
  const handleTriggerPulse = () => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        physics: {
          ...n.physics,
          vy: n.physics.vy - 12 - Math.random() * 8, // upward thrust
          vx: n.physics.vx + (Math.random() - 0.5) * 6,
        },
      }))
    );
  };

  // Reset node positions
  const handleResetLayout = () => {
    const parsed = parseXMLToDOM(xmlContent);
    setRootNode(parsed.root);
    setNodes(flattenDOMTree(parsed.root));
  };

  // Trigger re-optimization of media assets
  const handleTriggerOptimization = () => {
    setAssets((prev) =>
      prev.map((a) => ({
        ...a,
        bufferLoadedPercent: 100,
        isCached: true,
      }))
    );
    setBufferLoadMs(0.8);
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
          width: typeof window !== 'undefined' ? Math.max(800, window.innerWidth) : 1200,
          height: typeof window !== 'undefined' ? Math.max(500, window.innerHeight - 150) : 650,
        },
      };

      setNodes((currentNodes) => {
        // Deep clone physics state for thread-safe mutation
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

  // Periodic Telemetry Loop: Worker Threads & Lambda Streams
  useEffect(() => {
    const timer = setInterval(() => {
      setWorkers((prev) => updateWorkerMetrics(prev));
      setLambdaStreams((prev) => tickLambdaStreams(prev, gravityY));
      setBufferLoadMs((prev) => Math.max(0.7, Math.min(2.8, prev + (Math.random() - 0.5) * 0.3)));
    }, 450);

    return () => clearInterval(timer);
  }, [gravityY]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="h-full w-full min-h-screen bg-[#0A0A0B] text-[#D1D1D1] font-sans flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <Header
        gravityY={gravityY}
        setGravityY={setGravityY}
        workerCount={workers.length}
        bufferLoadMs={bufferLoadMs}
        onTriggerPulse={handleTriggerPulse}
        onResetLayout={handleResetLayout}
      />

      {/* Browser Chrome & Navigation Bar */}
      <BrowserChrome
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUrl={currentUrl}
        setCurrentUrl={setCurrentUrl}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        onReload={handleResetLayout}
      />

      {/* Main Tab Views */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'viewport' && (
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

        {activeTab === 'w3parser' && (
          <XMLW3ParserView
            xmlContent={xmlContent}
            setXmlContent={setXmlContent}
            filters={filters}
            setFilters={setFilters}
            onParseXML={handleParseXML}
            rootNode={rootNode}
          />
        )}

        {activeTab === 'jsonstore' && (
          <JSONPersistenceView
            rootNode={rootNode}
            onUpdateRootNode={handleUpdateFromJSON}
          />
        )}

        {activeTab === 'compiler' && (
          <JSCompilerView
            nodes={nodes}
            setGravity={setGravityY}
            onSpawnNode={handleSpawnNode}
            defaultCode={selectedPreset.defaultScript}
          />
        )}

        {activeTab === 'workers' && (
          <WorkerThreadPoolView
            workers={workers}
            lambdaStreams={lambdaStreams}
          />
        )}

        {activeTab === 'optimizer' && (
          <MediaOptimizerView
            assets={assets}
            onTriggerOptimization={handleTriggerOptimization}
          />
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

      {/* Bottom Footer */}
      <Footer
        systemStatus="System Stable • Microkernel Active"
        bufferHex="0x2A3F9"
        nodeCount={nodes.length}
      />
    </div>
  );
}
