import React from 'react';
import { Play, RotateCcw, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  gravityY: number;
  setGravityY: (g: number) => void;
  workerCount: number;
  bufferLoadMs: number;
  onTriggerPulse: () => void;
  onResetLayout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gravityY,
  setGravityY,
  workerCount,
  bufferLoadMs,
  onTriggerPulse,
  onResetLayout,
}) => {
  return (
    <header className="h-20 border-b border-[#222224] flex items-center justify-between px-6 lg:px-8 bg-[#0F0F11] text-[#D1D1D1] select-none flex-shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1
            className="text-2xl lg:text-3xl font-light tracking-[-0.05em] text-white"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            PYMACS <span className="italic text-[#A1A1AA]">ANTIGRAVITY</span>
          </h1>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#71717A] -mt-1 font-mono">
            TS DOM Engine v4.0.2 • JSON=XML=DOM
          </span>
        </div>

        {/* Quick Gravity Preset Buttons */}
        <div className="hidden md:flex items-center bg-[#161618] border border-[#2D2D30] rounded-full p-1 gap-1 text-[11px]">
          <button
            onClick={() => setGravityY(-9.81)}
            className={`px-3 py-1 rounded-full transition-all ${
              gravityY === -9.81
                ? 'bg-[#4ADE80] text-black font-semibold shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
            title="Full Antigravity (-9.81 m/s²)"
          >
            Null-G (-9.81)
          </button>
          <button
            onClick={() => setGravityY(0)}
            className={`px-3 py-1 rounded-full transition-all ${
              gravityY === 0
                ? 'bg-[#4ADE80] text-black font-semibold shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
            title="Zero-Gravity Orbital Drift"
          >
            Zero-G (0.0)
          </button>
          <button
            onClick={() => setGravityY(9.81)}
            className={`px-3 py-1 rounded-full transition-all ${
              gravityY === 9.81
                ? 'bg-[#4ADE80] text-black font-semibold shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
            title="Standard Gravity (+9.81 m/s²)"
          >
            Earth (+9.81)
          </button>
        </div>
      </div>

      {/* Interactive Controls & Telemetry */}
      <div className="flex items-center gap-6 lg:gap-10 text-[11px] uppercase tracking-widest font-medium">
        {/* Antigravity Pulse Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerPulse}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D30] text-white rounded text-[10px] tracking-wider transition-all active:scale-95 cursor-pointer"
            title="Inject upward antigravity momentum pulse into DOM nodes"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Anti-G Pulse</span>
          </button>
          <button
            onClick={onResetLayout}
            className="p-1.5 bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D30] text-[#A1A1AA] hover:text-white rounded transition-all active:scale-95 cursor-pointer"
            title="Reset node positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Worker Threads Monitor */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[#71717A] text-[9px]">Worker Threads</span>
          <span className="text-[#4ADE80] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
            {workerCount} Active
          </span>
        </div>

        {/* Lambda Reactive State */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[#71717A] text-[9px]">Lambda Reactive</span>
          <span className="text-white font-mono flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#4ADE80]" />
            Pipe Enabled
          </span>
        </div>

        {/* Buffer Load */}
        <div className="flex flex-col items-end">
          <span className="text-[#71717A] text-[9px]">Buffer Load</span>
          <span className="text-white font-mono">{bufferLoadMs.toFixed(1)}ms</span>
        </div>
      </div>
    </header>
  );
};
