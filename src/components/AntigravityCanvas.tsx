import React, { useRef, useState, useEffect } from 'react';
import { VirtualDOMNode, XMLFilterDef } from '../types/dom';
import { Plus, Move, Sparkles, Pin, Eye, Sliders } from 'lucide-react';

interface AntigravityCanvasProps {
  nodes: VirtualDOMNode[];
  filters: XMLFilterDef[];
  gravityY: number;
  setGravityY: (g: number) => void;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onSpawnNode: (tag: string, text: string) => void;
  pointerRef: React.MutableRefObject<{
    x: number;
    y: number;
    active: boolean;
    radius: number;
    strength: number;
  }>;
}

export const AntigravityCanvas: React.FC<AntigravityCanvasProps> = ({
  nodes,
  filters,
  gravityY,
  setGravityY,
  selectedNodeId,
  onSelectNode,
  onSpawnNode,
  pointerRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showParticleGrid, setShowParticleGrid] = useState(true);

  // XML filters applied to the canvas
  const gaussianFilter = filters.find((f) => f.type === 'gaussian' && f.enabled);
  const chromaticFilter = filters.find((f) => f.type === 'chromatic' && f.enabled);
  const magneticFilter = filters.find((f) => f.type === 'magnetic' && f.enabled);

  // Mouse interaction for dragging and repulsion
  const handlePointerDown = (e: React.PointerEvent, node: VirtualDOMNode) => {
    e.stopPropagation();
    setDraggedNodeId(node.id);
    onSelectNode(node.id);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setDragOffset({
        x: mouseX - node.physics.x,
        y: mouseY - node.physics.y,
      });
      node.physics.pinned = true;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    pointerRef.current.x = mouseX;
    pointerRef.current.y = mouseY;
    pointerRef.current.active = true;

    if (draggedNodeId) {
      const draggedNode = nodes.find((n) => n.id === draggedNodeId);
      if (draggedNode) {
        const prevX = draggedNode.physics.x;
        const prevY = draggedNode.physics.y;
        const newX = mouseX - dragOffset.x;
        const newY = mouseY - dragOffset.y;

        draggedNode.physics.x = newX;
        draggedNode.physics.y = newY;
        draggedNode.physics.vx = (newX - prevX) * 0.8;
        draggedNode.physics.vy = (newY - prevY) * 0.8;
      }
    }
  };

  const handlePointerUp = () => {
    if (draggedNodeId) {
      const node = nodes.find((n) => n.id === draggedNodeId);
      if (node) {
        node.physics.pinned = false;
      }
      setDraggedNodeId(null);
    }
    pointerRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative flex-1 w-full h-full bg-[#050505] overflow-hidden select-none"
    >
      {/* Editorial Decorative Watermark Number "001" and Rotated Label (from design) */}
      <div className="absolute top-0 right-0 p-8 flex flex-col items-end z-0 pointer-events-none">
        <div
          className="text-[90px] font-light leading-none italic opacity-5 mix-blend-screen text-white select-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          001
        </div>
        <div className="text-[11px] uppercase tracking-[0.4em] text-[#71717A] rotate-90 origin-right translate-y-10">
          Reactive Render
        </div>
      </div>

      {/* Center Antigravity Orbital HUD Guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-80 h-80 flex flex-col items-center justify-center">
          <div className="absolute inset-0 border border-white/5 rounded-full animate-pulse" />
          <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#4ADE80] rounded-full shadow-[0_0_8px_#4ADE80]" />
            <div className="text-center">
              <div className="text-white text-3xl font-light tracking-tighter font-mono">
                {Math.abs(gravityY).toFixed(2)}
                <span className="text-xs opacity-40 ml-1">m/s²</span>
              </div>
              <div className="text-[8px] uppercase tracking-[0.25em] text-[#71717A] mt-1">
                {gravityY < 0 ? 'Antigravity Vector' : gravityY === 0 ? 'Zero-G Inertia' : 'Gravitational Field'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Spring Connectors between Parent-Child DOM Nodes & Particle field */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <filter id="svg-gaussian" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={gaussianFilter ? gaussianFilter.strength : 0} />
          </filter>
        </defs>

        {/* Render spring lines between parent and child */}
        {nodes.map((node) => {
          if (!node.parentId) return null;
          const parent = nodes.find((p) => p.id === node.parentId);
          if (!parent) return null;

          return (
            <g key={`spring_${parent.id}_${node.id}`}>
              <line
                x1={parent.physics.x}
                y1={parent.physics.y}
                x2={node.physics.x}
                y2={node.physics.y}
                stroke="#4ADE80"
                strokeOpacity={0.25}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
              <circle
                cx={(parent.physics.x + node.physics.x) / 2}
                cy={(parent.physics.y + node.physics.y) / 2}
                r={2}
                fill="#4ADE80"
                fillOpacity={0.4}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Virtual DOM Nodes */}
      <div className="relative w-full h-full z-20 pointer-events-auto">
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isDragged = draggedNodeId === node.id;
          const r = node.physics.radius || 45;

          // Apply chromatic filter border if enabled
          const chromaticStyle = chromaticFilter
            ? 'shadow-[0_0_15px_rgba(74,222,128,0.3),-2px_0_6px_rgba(255,0,100,0.2),2px_0_6px_rgba(0,180,255,0.2)]'
            : '';

          return (
            <div
              key={node.id}
              onPointerDown={(e) => handlePointerDown(e, node)}
              style={{
                transform: `translate(${node.physics.x - r}px, ${node.physics.y - r}px) rotate(${node.physics.rotation}rad)`,
                width: `${r * 2}px`,
                height: `${r * 2}px`,
              }}
              className={`absolute rounded-2xl flex flex-col items-center justify-center p-2.5 transition-shadow cursor-grab active:cursor-grabbing backdrop-blur-md ${
                isSelected
                  ? 'border-2 border-[#4ADE80] bg-[#121215]/90 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                  : 'border border-[#2D2D30] bg-[#0E0E11]/85 hover:border-[#4ADE80]/50'
              } ${chromaticStyle}`}
            >
              {/* Tag header */}
              <div className="w-full flex items-center justify-between text-[9px] font-mono text-[#71717A] mb-1 pointer-events-none">
                <span className="text-[#4ADE80] truncate max-w-[80px]">
                  &lt;{node.tagName}&gt;
                </span>
                <span className="opacity-60">{node.physics.mass.toFixed(1)}kg</span>
              </div>

              {/* Node Title / Content */}
              <div className="text-center font-sans text-[11px] font-medium text-white truncate max-w-[90%] pointer-events-none">
                {node.textContent || node.attributes['title'] || node.id}
              </div>

              {/* Attributes badge or subtext */}
              {node.attributes['filter'] && (
                <span className="text-[8px] tracking-wider text-[#A1A1AA] bg-white/5 px-1.5 py-0.5 rounded-full mt-1 pointer-events-none">
                  fx: {node.attributes['filter']}
                </span>
              )}

              {/* Pinned / Floating Indicator */}
              {node.physics.pinned && (
                <div className="absolute top-1.5 right-1.5 text-[#4ADE80]">
                  <Pin className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Action Overlay */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3">
        <button
          onClick={() => {
            const tags = ['Functionoid', 'ReactiveLayer', 'SensorDOM', 'TerminalFrame', 'ParticleAnchor'];
            const randomTag = tags[Math.floor(Math.random() * tags.length)];
            onSpawnNode(randomTag, `${randomTag}_${Math.floor(Math.random() * 99)}`);
          }}
          className="flex items-center gap-1.5 bg-white text-black hover:bg-[#D1D1D1] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Spawn DOM Node</span>
        </button>

        <div className="bg-[#121214] border border-[#222224] rounded-full px-4 py-1.5 flex items-center gap-4 text-[11px] text-[#A1A1AA]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span>Nodes: <strong className="text-white">{nodes.length}</strong></span>
          </span>
          <span className="h-3 w-[1px] bg-[#2D2D30]" />
          <span>Drag node to throw • Double-click to pin</span>
        </div>
      </div>
    </div>
  );
};
