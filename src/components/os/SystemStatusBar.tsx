import React, { useState } from 'react';
import { Terminal, Cpu, HardDrive, Layers, Globe, CheckCircle2, ChevronUp } from 'lucide-react';

interface SystemStatusBarProps {
  metrics: {
    cpuPercent: number;
    memoryMb: number;
    runningCount: number;
  };
  onOpenShell: () => void;
  onQuickCommand?: (cmd: string) => void;
  activeBuffer: string;
}

export const SystemStatusBar: React.FC<SystemStatusBarProps> = ({
  metrics,
  onOpenShell,
  onQuickCommand,
  activeBuffer,
}) => {
  const [quickCmd, setQuickCmd] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCmd.trim()) return;
    onQuickCommand?.(quickCmd.trim());
    setQuickCmd('');
    onOpenShell();
  };

  return (
    <footer
      id="pymacs-system-status-bar"
      className="bg-[#0C0C0F] border-t border-[#1C1C22] px-3 py-1.5 flex flex-wrap items-center justify-between font-mono text-[11px] text-gray-400 select-none shrink-0"
    >
      {/* Left: Shell Launcher / Quick Prompt */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenShell}
          className="flex items-center gap-1.5 bg-[#1C1C24] hover:bg-[#252532] text-gray-200 px-2.5 py-0.5 rounded cursor-pointer transition-colors font-semibold"
          title="Open interactive Python/Emacs REPL"
        >
          <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>PyMacs Shell</span>
        </button>

        <form onSubmit={handleQuickSubmit} className="hidden md:flex items-center gap-1.5 bg-[#121216] px-2 py-0.5 rounded border border-[#202028]">
          <span className="text-[#60A5FA] select-none">&gt;&gt;</span>
          <input
            type="text"
            value={quickCmd}
            onChange={(e) => setQuickCmd(e.target.value)}
            placeholder="Quick command (e.g. ls, help, map)..."
            className="w-48 bg-transparent text-gray-200 text-[10.5px] focus:outline-none placeholder-gray-600 font-mono"
          />
        </form>

        <span className="text-gray-600 hidden lg:inline">|</span>
        <span className="text-gray-400 hidden lg:inline">
          Buffer: <span className="text-white font-medium">{activeBuffer}</span>
        </span>
      </div>

      {/* Right: Telemetry & API Status Matching Proposed UI */}
      <div className="flex items-center gap-3 text-[10.5px]">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">CPU</span>
          <span className="text-[#38BDF8] font-bold font-mono">{metrics.cpuPercent}%</span>
        </div>

        <span className="text-gray-700">|</span>

        <div className="flex items-center gap-1">
          <span className="text-gray-500">MEM</span>
          <span className="text-[#A78BFA] font-bold font-mono">{metrics.memoryMb} MB</span>
        </div>

        <span className="text-gray-700">|</span>

        <div className="flex items-center gap-1">
          <span className="text-gray-500">Threads</span>
          <span className="text-[#4ADE80] font-bold font-mono">{metrics.runningCount}</span>
        </div>

        <span className="text-gray-700">|</span>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
          <span className="text-gray-300 font-semibold">API ● ONLINE</span>
        </div>
      </div>
    </footer>
  );
};
