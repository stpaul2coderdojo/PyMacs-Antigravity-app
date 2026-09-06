import React from 'react';
import { WorkerThread, LambdaStream } from '../types/dom';
import { Cpu, Zap, Activity, Radio, Workflow } from 'lucide-react';

interface WorkerThreadPoolViewProps {
  workers: WorkerThread[];
  lambdaStreams: LambdaStream[];
}

export const WorkerThreadPoolView: React.FC<WorkerThreadPoolViewProps> = ({
  workers,
  lambdaStreams,
}) => {
  return (
    <div className="flex-1 w-full h-full bg-[#0A0A0B] text-[#D1D1D1] flex flex-col lg:flex-row overflow-hidden select-none">
      {/* Left: 8-Core Worker Thread Pool */}
      <div className="flex-1 border-r border-[#222224] flex flex-col bg-[#0D0D0F] overflow-y-auto">
        <div className="h-12 border-b border-[#222224] px-6 flex items-center justify-between bg-[#121214] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
              Worker Thread Pool (8 Active Cores)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-0.5 rounded">
            HTCondor Shadow System
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="p-4 bg-[#141416] border border-[#222224] rounded-xl flex flex-col justify-between hover:border-[#2D2D30] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[12px] font-semibold text-white">
                  {worker.name}
                </span>
                <span
                  className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                    worker.status === 'executing'
                      ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                      : worker.status === 'optimizing'
                      ? 'bg-amber-400/10 text-amber-400'
                      : worker.status === 'compiling'
                      ? 'bg-blue-400/10 text-blue-400'
                      : 'bg-white/5 text-[#71717A]'
                  }`}
                >
                  {worker.status}
                </span>
              </div>

              <div className="text-[11px] text-[#A1A1AA] mb-3 truncate font-mono">
                {worker.currentTask}
              </div>

              {/* Load Meter */}
              <div>
                <div className="flex justify-between text-[10px] text-[#71717A] uppercase font-mono mb-1">
                  <span>CPU Load</span>
                  <span className="text-white">{worker.loadPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#222224] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      worker.loadPercentage > 80
                        ? 'bg-amber-400'
                        : worker.loadPercentage > 50
                        ? 'bg-[#4ADE80]'
                        : 'bg-white/60'
                    }`}
                    style={{ width: `${worker.loadPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[9px] text-[#71717A] font-mono mt-3 pt-2 border-t border-[#1C1C1F]">
                <span>Tasks: {worker.completedTasks}</span>
                <span>Cycles: {(worker.cycleCount / 1000).toFixed(1)}k</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Lambda & Reactive 3 Pipeline */}
      <div className="w-full lg:w-[460px] flex flex-col bg-[#0D0D0F] overflow-y-auto">
        <div className="h-12 border-b border-[#222224] px-6 flex items-center justify-between bg-[#121214] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
              Lambda & Reactive Pipeline
            </span>
          </div>
          <span className="text-[10px] font-mono text-white">REACTIVE 3.0</span>
        </div>

        <div className="p-6 space-y-4">
          {lambdaStreams.map((stream) => (
            <div
              key={stream.id}
              className="p-4 bg-[#141416] border border-[#222224] rounded-xl flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span className="font-mono text-[12px] text-white font-medium">
                    {stream.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">
                  {stream.frequencyHz} Hz
                </span>
              </div>

              {/* Current Value Display & Mini Sparkline */}
              <div className="flex items-center justify-between bg-[#0A0A0B] p-2.5 rounded border border-[#1C1C1F]">
                <div className="text-[11px] font-mono text-[#4ADE80]">
                  {typeof stream.currentValue === 'object'
                    ? JSON.stringify(stream.currentValue)
                    : String(stream.currentValue)}
                </div>

                {/* Sparkline */}
                <div className="flex items-end gap-1 h-5">
                  {stream.history.map((val, idx) => {
                    const norm = Math.min(100, Math.max(15, (Math.abs(val) / 10) * 100));
                    return (
                      <div
                        key={idx}
                        className="w-1.5 bg-[#4ADE80]/80 rounded-t"
                        style={{ height: `${norm}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-widest text-[#71717A]">
                  Operator Flow
                </div>
                <div className="flex flex-wrap gap-1">
                  {stream.pipeline.map((stage, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono bg-[#1E1E22] text-[#A1A1AA] px-2 py-0.5 rounded border border-[#2A2A2F]"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
