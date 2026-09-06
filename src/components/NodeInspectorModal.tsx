import React from 'react';
import { VirtualDOMNode } from '../types/dom';
import { X, Pin, Sparkles, Sliders, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface NodeInspectorModalProps {
  node: VirtualDOMNode | null;
  onClose: () => void;
  onApplyImpulse: (fx: number, fy: number) => void;
  onTogglePin: () => void;
  onUpdateMass: (mass: number) => void;
  onUpdateCharge: (charge: number) => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  onClose,
  onApplyImpulse,
  onTogglePin,
  onUpdateMass,
  onUpdateCharge,
}) => {
  if (!node) return null;

  return (
    <div className="absolute top-20 right-6 z-40 w-80 bg-[#0E0E11]/95 backdrop-blur-xl border border-[#2D2D30] rounded-2xl shadow-2xl p-5 text-[#D1D1D1] select-none">
      <div className="flex items-center justify-between border-b border-[#222224] pb-3 mb-4">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-[#71717A] font-mono">
            W3 DOM Node Inspector
          </span>
          <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-1.5">
            <span className="text-[#4ADE80]">&lt;{node.tagName}&gt;</span>
            <span className="text-[#A1A1AA] text-xs">#{node.id}</span>
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#71717A] hover:text-white rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Physics State */}
      <div className="space-y-3 font-mono text-[11px] mb-5">
        <div className="flex justify-between text-[#A1A1AA]">
          <span>Position (X, Y):</span>
          <span className="text-white">
            {Math.round(node.physics.x)}, {Math.round(node.physics.y)}
          </span>
        </div>
        <div className="flex justify-between text-[#A1A1AA]">
          <span>Velocity (Vx, Vy):</span>
          <span className="text-[#4ADE80]">
            {node.physics.vx.toFixed(2)}, {node.physics.vy.toFixed(2)}
          </span>
        </div>

        {/* Mass Slider */}
        <div>
          <div className="flex justify-between text-[10px] text-[#71717A] uppercase mb-1">
            <span>Inertial Mass:</span>
            <span className="text-white">{node.physics.mass.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="5.0"
            step="0.1"
            value={node.physics.mass}
            onChange={(e) => onUpdateMass(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#222224] rounded appearance-none cursor-pointer accent-[#4ADE80]"
          />
        </div>

        {/* Charge Slider */}
        <div>
          <div className="flex justify-between text-[10px] text-[#71717A] uppercase mb-1">
            <span>Magnetic Charge:</span>
            <span className="text-white">{node.physics.charge.toFixed(1)} q</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="3.0"
            step="0.1"
            value={node.physics.charge}
            onChange={(e) => onUpdateCharge(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#222224] rounded appearance-none cursor-pointer accent-[#4ADE80]"
          />
        </div>
      </div>

      {/* Direct Impulse Controls */}
      <div className="border-t border-[#222224] pt-4 mb-4">
        <div className="text-[10px] uppercase tracking-widest text-[#71717A] mb-2 font-mono">
          Antigravity Impulse Vector
        </div>
        <div className="grid grid-cols-3 gap-1.5 max-w-[150px] mx-auto">
          <div />
          <button
            onClick={() => onApplyImpulse(0, -15)}
            className="p-2 bg-[#1A1A1E] hover:bg-[#282830] text-white rounded flex items-center justify-center transition-all active:scale-95"
            title="Upward antigravity lift"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <div />
          <button
            onClick={() => onApplyImpulse(-15, 0)}
            className="p-2 bg-[#1A1A1E] hover:bg-[#282830] text-white rounded flex items-center justify-center transition-all active:scale-95"
            title="Left impulse"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onTogglePin}
            className={`p-2 rounded flex items-center justify-center transition-all active:scale-95 ${
              node.physics.pinned ? 'bg-[#4ADE80] text-black font-bold' : 'bg-[#1A1A1E] text-white'
            }`}
            title="Toggle pin in space"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onApplyImpulse(15, 0)}
            className="p-2 bg-[#1A1A1E] hover:bg-[#282830] text-white rounded flex items-center justify-center transition-all active:scale-95"
            title="Right impulse"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div />
          <button
            onClick={() => onApplyImpulse(0, 15)}
            className="p-2 bg-[#1A1A1E] hover:bg-[#282830] text-white rounded flex items-center justify-center transition-all active:scale-95"
            title="Downward gravity impulse"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <div />
        </div>
      </div>

      {/* Node Content / Attributes */}
      <div className="border-t border-[#222224] pt-3 text-[10px] font-mono text-[#71717A] space-y-1">
        <div>Parent: {node.parentId ? `#${node.parentId}` : 'DocumentRoot'}</div>
        <div>Children: {node.children.length} sub-nodes</div>
      </div>
    </div>
  );
};
