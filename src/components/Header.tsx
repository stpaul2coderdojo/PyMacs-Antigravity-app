import React from 'react';
import { Play, RotateCcw, Zap, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

interface HeaderProps {
  gravityY: number;
  setGravityY: (g: number) => void;
  workerCount: number;
  bufferLoadMs: number;
  onTriggerPulse: () => void;
  onResetLayout: () => void;
  onOpenDocs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gravityY,
  setGravityY,
  workerCount,
  bufferLoadMs,
  onTriggerPulse,
  onResetLayout,
  onOpenDocs,
}) => {
  return (
    <header className="border-b border-[#222224] flex flex-col bg-[#0F0F11] text-[#D1D1D1] select-none flex-shrink-0">
      {/* WordPress Top Utility / Attribution Bar */}
      <div className="h-7 px-4 lg:px-8 bg-[#09090B] border-b border-[#1A1A1D] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#4ADE80] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
            <span>PYMACS.WORDPRESS.COM</span>
          </span>
          <span className="hidden sm:inline text-[#3F3F46]">|</span>
          <span className="hidden sm:inline text-[#A1A1AA]">
            Author: <strong className="text-white font-medium">Dr. Bheemaiah Anil K</strong>
          </span>
          <span className="hidden md:inline text-[#3F3F46]">|</span>
          <span className="hidden md:inline text-[#71717A]">
            JSON = XML = DOM • Provable Markup Language (PML)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="flex items-center gap-1 text-[#A1A1AA] hover:text-[#4ADE80] transition-colors cursor-pointer"
              title="Open PyMACS Documentation & Research Blog"
            >
              <BookOpen className="w-3 h-3" />
              <span>Read Documentation</span>
            </button>
          )}
          <a
            href="https://pymacs.wordpress.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#71717A] hover:text-white transition-colors"
            title="Open official PyMACS blog on WordPress.com"
          >
            <span>WordPress.com</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Blog & Engine Masthead */}
      <div className="h-16 sm:h-20 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h1
                className="text-2xl lg:text-3xl font-normal tracking-tight text-white"
                style={{ fontFamily: "'Lora', 'Georgia', serif" }}
              >
                PyMACS
              </h1>
              <span className="text-xs font-mono tracking-widest text-[#4ADE80] uppercase hidden sm:inline">
                ANTIGRAVITY DOM
              </span>
            </div>
            <span className="text-[11px] text-[#A1A1AA] font-light tracking-wide -mt-0.5 line-clamp-1">
              A Python-based Microkernel for Extensible Browser OS & Edge Computing
            </span>
          </div>

          {/* Quick Gravity Preset Buttons */}
          <div className="hidden lg:flex items-center bg-[#161618] border border-[#2D2D30] rounded-full p-1 gap-1 text-[11px]">
            <button
              onClick={() => setGravityY(-9.81)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
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
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
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
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
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
        <div className="flex items-center gap-4 lg:gap-8 text-[11px] uppercase tracking-widest font-medium">
          {/* Antigravity Pulse Action */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onTriggerPulse}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2D2D30] text-white rounded text-[10px] tracking-wider transition-all active:scale-95 cursor-pointer"
              title="Inject upward antigravity momentum pulse into DOM nodes"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span className="hidden sm:inline">Anti-G Pulse</span>
              <span className="sm:hidden">Pulse</span>
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
            <span className="text-[#71717A] text-[9px]">HTCondor Threads</span>
            <span className="text-[#4ADE80] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
              {workerCount} Active
            </span>
          </div>

          {/* Lambda Reactive State */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[#71717A] text-[9px]">Reactive Pipes</span>
            <span className="text-white font-mono flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#4ADE80]" />
              Active
            </span>
          </div>

          {/* Buffer Load */}
          <div className="flex flex-col items-end">
            <span className="text-[#71717A] text-[9px]">Buffer Load</span>
            <span className="text-white font-mono">{bufferLoadMs.toFixed(1)}ms</span>
          </div>
        </div>
      </div>
    </header>
  );
};
