import React, { useState } from 'react';
import { VirtualDOMNode } from '../../types/dom';
import { CodeAsDOMObject } from './CodeAsDOMObject';
import { VirtualFS } from '../../engine/virtualFs';
import { TaskManager } from '../../engine/taskManager';
import { Terminal, HardDrive, Activity, ArrowRight, ExternalLink, Sparkles, Layers, Cpu, Code2, Globe } from 'lucide-react';

interface DesktopHomeViewProps {
  onOpenWindow: (windowId: string) => void;
  onMountToViewport: (node: VirtualDOMNode) => void;
  currentRootNode: VirtualDOMNode;
}

export const DesktopHomeView: React.FC<DesktopHomeViewProps> = ({
  onOpenWindow,
  onMountToViewport,
  currentRootNode,
}) => {
  const [shellInput, setShellInput] = useState('');
  const filesCount = VirtualFS.listFiles().length;
  const metrics = TaskManager.getSystemMetrics();

  const handleQuickShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenWindow('shell');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#0B0B0E] text-gray-200 font-mono select-text">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Section Matching Proposed UI */}
        <div className="border-b border-[#24242C] pb-5">
          <div className="flex items-baseline justify-between">
            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-white font-normal">
              PyMACS
            </h1>
            <span className="text-[11px] text-[#4ADE80] font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
              ONLINE • Python 3.12 Microkernel
            </span>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-[#3B82F6] via-[#24242C] to-transparent my-3"></div>
          <p className="text-gray-400 text-sm sm:text-base font-serif italic text-balance">
            An Operating System in Python — minimalist, academic, Emacs-inspired, browser-based with reactive DOM physics and JSON=XML=DOM architectural equivalence.
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <span>Author: Dr. Bheemaiah Anil K</span>
            <span>•</span>
            <a
              href="https://pymacs.wordpress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#60A5FA] hover:underline flex items-center gap-1"
            >
              <span>pymacs.wordpress.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Embedded Interactive Quick Shell Card */}
        <div className="bg-[#121217] border border-[#24242C] rounded-lg p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 border-b border-[#1E1E26] pb-2">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-200">&gt; python shell</span>
            </div>
            <button
              onClick={() => onOpenWindow('shell')}
              className="text-[11px] text-[#60A5FA] hover:text-[#93C5FD] flex items-center gap-1 cursor-pointer"
            >
              <span>Open Full REPL</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="font-mono text-xs text-gray-300 space-y-1 py-1">
            <div className="text-gray-500">&gt;&gt;&gt;</div>
            <div className="text-[#38BDF8]">&gt;&gt;&gt; import pymacs</div>
            <div className="text-[#38BDF8]">&gt;&gt;&gt; pymacs.help()</div>
            <div className="text-gray-400 pl-4 text-[11px]">
              &gt;&gt; JSON=XML=DOM equivalence pipeline ready. Active DOM root: &lt;{currentRootNode.tagName} id="{currentRootNode.id}"&gt;
            </div>
          </div>

          <form onSubmit={handleQuickShellSubmit} className="flex items-center gap-2 pt-2 border-t border-[#1C1C24]">
            <span className="text-[#60A5FA] font-bold select-none">&gt;&gt;&gt;</span>
            <input
              type="text"
              value={shellInput}
              onChange={(e) => setShellInput(e.target.value)}
              placeholder="Run command or press Enter to launch REPL..."
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-[11px] font-semibold cursor-pointer"
            >
              Exec
            </button>
          </form>
        </div>

        {/* Quick System Cards: FILE SYSTEM & TASKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* File System Card */}
          <div
            onClick={() => onOpenWindow('files')}
            className="bg-[#121217] border border-[#24242C] hover:border-[#38BDF8]/40 p-4 rounded-lg cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <HardDrive className="w-4 h-4 text-[#38BDF8]" />
                <span>FILE SYSTEM</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono group-hover:text-[#38BDF8] transition-colors">
                Inspect VFS →
              </span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {filesCount} files
            </div>
            <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
              <span>JSON / XML / PML / Python</span>
              <span className="text-[10px] text-[#4ADE80]">Thread-Isolated</span>
            </div>
          </div>

          {/* Tasks Card */}
          <div
            onClick={() => onOpenWindow('tasks')}
            className="bg-[#121217] border border-[#24242C] hover:border-[#4ADE80]/40 p-4 rounded-lg cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Activity className="w-4 h-4 text-[#4ADE80]" />
                <span>TASKS</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono group-hover:text-[#4ADE80] transition-colors">
                Scheduler →
              </span>
            </div>
            <div className="text-xl font-bold text-[#4ADE80] font-mono">
              {metrics.runningCount} running
            </div>
            <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
              <span>asyncio • FreeRTOS microkernel</span>
              <span className="text-[10px] text-yellow-400">HTCondor Shadow</span>
            </div>
          </div>
        </div>

        {/* The Key Differentiator: First-Class Code as DOM Object */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Computational Model: Code as First-Class DOM Object</span>
            </h3>
            <button
              onClick={() => onOpenWindow('data')}
              className="text-[11px] text-[#60A5FA] hover:underline cursor-pointer"
            >
              Open Full Transpiler Playground →
            </button>
          </div>

          <CodeAsDOMObject
            onMountToViewport={onMountToViewport}
            onOpenDataTab={() => onOpenWindow('data')}
          />
        </div>

        {/* Quick Launchers Bar for Apps & Workspaces */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => onOpenWindow('apps')}
            className="p-3 bg-[#121216] hover:bg-[#191920] border border-[#22222A] hover:border-[#38BDF8]/40 rounded text-left transition-colors cursor-pointer group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-[#38BDF8]">Cardculator &amp; BSI</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Native PyMACS Apps</div>
          </button>

          <button
            onClick={() => onOpenWindow('physics')}
            className="p-3 bg-[#121216] hover:bg-[#191920] border border-[#22222A] hover:border-[#4ADE80]/40 rounded text-left transition-colors cursor-pointer group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-[#4ADE80]">Antigravity Viewport</div>
            <div className="text-[10px] text-gray-500 mt-0.5">60 FPS DOM Physics</div>
          </button>

          <button
            onClick={() => onOpenWindow('cloud')}
            className="p-3 bg-[#121216] hover:bg-[#191920] border border-[#22222A] hover:border-[#8B5CF6]/40 rounded text-left transition-colors cursor-pointer group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-[#A78BFA]">Cloud &amp; On-Chain</div>
            <div className="text-[10px] text-gray-500 mt-0.5">AWS &amp; PML Merkle</div>
          </button>

          <button
            onClick={() => onOpenWindow('profiler')}
            className="p-3 bg-[#121216] hover:bg-[#191920] border border-[#22222A] hover:border-yellow-500/40 rounded text-left transition-colors cursor-pointer group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-yellow-400">System Profiler</div>
            <div className="text-[10px] text-gray-500 mt-0.5">CPU, Heap &amp; Threads</div>
          </button>
        </div>
      </div>
    </div>
  );
};
