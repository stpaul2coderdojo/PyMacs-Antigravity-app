import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Zap, Layers, RefreshCw, BarChart2 } from 'lucide-react';

export const ProfilerWindow: React.FC = () => {
  const [cpuHistory, setCpuHistory] = useState<number[]>([12, 14, 11, 16, 18, 14, 15, 12, 17, 13]);
  const [memoryMb, setMemoryMb] = useState(48.4);
  const [jitCompilations, setJitCompilations] = useState(1284);
  const [astCacheHits, setAstCacheHits] = useState(98.2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpuHistory((prev) => {
        const next = Math.floor(Math.random() * 12) + 10;
        return [...prev.slice(1), next];
      });
      setMemoryMb((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(2));
      setJitCompilations((prev) => prev + Math.floor(Math.random() * 3));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const currentCpu = cpuHistory[cpuHistory.length - 1] || 14;

  return (
    <div className="flex flex-col h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-[#16161C] border-b border-[#26262E] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-semibold text-gray-200">PyMACS Hardware &amp; Microkernel Profiler</span>
        </div>
        <span className="text-[10px] text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-0.5 rounded border border-[#4ADE80]/20 font-bold">
          LIVE TELEMETRY
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#14141A] border border-[#26262E] p-3 rounded">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Active CPU Load</div>
            <div className="text-xl font-bold text-[#38BDF8] mt-1">{currentCpu}%</div>
            <div className="text-[9.5px] text-gray-500 mt-0.5">8 Cores Online</div>
          </div>

          <div className="bg-[#14141A] border border-[#26262E] p-3 rounded">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Memory Heap</div>
            <div className="text-xl font-bold text-[#A78BFA] mt-1">{memoryMb} MB</div>
            <div className="text-[9.5px] text-gray-500 mt-0.5">128 KB VFS Buffer</div>
          </div>

          <div className="bg-[#14141A] border border-[#26262E] p-3 rounded">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">JIT AST Compiles</div>
            <div className="text-xl font-bold text-[#4ADE80] mt-1">{jitCompilations}</div>
            <div className="text-[9.5px] text-gray-500 mt-0.5">PML Equivalence</div>
          </div>

          <div className="bg-[#14141A] border border-[#26262E] p-3 rounded">
            <div className="text-[10px] text-gray-500 uppercase font-semibold">AST Cache Hit Rate</div>
            <div className="text-xl font-bold text-yellow-400 mt-1">{astCacheHits}%</div>
            <div className="text-[9.5px] text-gray-500 mt-0.5">Zero Miss Invalidation</div>
          </div>
        </div>

        {/* Live Sparkline CPU Graph */}
        <div className="bg-[#14141A] border border-[#26262E] p-3 rounded space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-300">
            <span>CPU History Trend (15s Window)</span>
            <span className="text-[#38BDF8] font-mono">{currentCpu}% utilization</span>
          </div>
          <div className="h-20 flex items-end gap-1.5 bg-[#0D0D10] p-2 rounded border border-[#222228]">
            {cpuHistory.map((val, idx) => (
              <div
                key={idx}
                style={{ height: `${Math.max(10, val * 3)}%` }}
                className="flex-1 bg-[#2563EB] hover:bg-[#3B82F6] rounded-t transition-all"
                title={`${val}%`}
              />
            ))}
          </div>
        </div>

        {/* Memory Subsystem Breakdown */}
        <div className="bg-[#14141A] border border-[#26262E] p-3 rounded space-y-2">
          <div className="text-[11px] font-semibold text-gray-300">Memory Allocation Breakdown</div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#24242C]">
              <span className="text-gray-300">Antigravity Physics Vectors (Float64 Buffers)</span>
              <span className="text-white font-mono">18.4 MB</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#24242C]">
              <span className="text-gray-300">JSON = XML = DOM Transpile AST Cache</span>
              <span className="text-white font-mono">14.2 MB</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#24242C]">
              <span className="text-gray-300">Virtual File System (VFS Inodes &amp; Scripts)</span>
              <span className="text-white font-mono">9.8 MB</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#24242C]">
              <span className="text-gray-300">FreeRTOS Cooperative Microkernel Stack</span>
              <span className="text-white font-mono">6.0 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
