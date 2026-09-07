import React, { useState } from 'react';
import { VirtualDOMNode } from '../../types/dom';
import { CodeAsDOMObject } from './CodeAsDOMObject';
import { VirtualFS } from '../../engine/virtualFs';
import { TaskManager } from '../../engine/taskManager';
import {
  Terminal,
  HardDrive,
  Activity,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  Code2,
  Globe,
  Download,
  Info,
  Container,
  Smartphone,
  Apple,
  Monitor,
  BookOpen,
} from 'lucide-react';

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-white font-normal">
                PyMacs
              </h1>
              <button
                onClick={() => onOpenWindow('describe')}
                className="text-[11px] bg-[#1A1A22] hover:bg-[#252532] text-gray-300 hover:text-white px-2 py-0.5 rounded border border-[#2B2B38] flex items-center gap-1 cursor-pointer transition-colors"
                title="Describe PyMacs: Architecture, Origins & Specs"
              >
                <Info className="w-3 h-3 text-[#38BDF8]" />
                <span>Describe</span>
              </button>
            </div>
            <span className="text-[11px] text-[#4ADE80] font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
              ONLINE • Python 3.12 Microkernel
            </span>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-[#3B82F6] via-[#24242C] to-transparent my-3"></div>
          <p className="text-gray-400 text-sm sm:text-base font-serif italic text-balance">
            An Operating System in Python — minimalist, academic, Emacs-inspired, browser-based with reactive DOM physics and JSON=XML=DOM architectural equivalence.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
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
            <span>•</span>
            <button
              onClick={() => onOpenWindow('paper')}
              className="text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <BookOpen className="w-3 h-3" />
              <span>arXiv Paper &amp; LaTeX</span>
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenWindow('downloads')}
              className="text-[#4ADE80] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Downloads &amp; Docker</span>
            </button>
          </div>
        </div>

        {/* arXiv Research Paper & GitHub Card */}
        <div className="bg-[#121217] border border-[#262630] rounded-lg p-4 shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202028] pb-2.5">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <BookOpen className="w-4 h-4 text-[#38BDF8]" />
              <span>Academic arXiv Preprint &amp; GitHub Repository</span>
              <span className="text-[10px] bg-[#1E1E28] text-[#38BDF8] px-1.5 py-0.2 rounded border border-[#38BDF8]/20">
                Preprint Ready
              </span>
            </div>
            <button
              onClick={() => onOpenWindow('paper')}
              className="text-[11px] text-[#60A5FA] hover:text-[#93C5FD] flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>Read Full Paper &amp; LaTeX</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => onOpenWindow('paper')}
              className="p-3 bg-[#171720] hover:bg-[#1E1E2A] border border-[#252534] hover:border-[#38BDF8]/40 rounded text-left transition-colors cursor-pointer group"
            >
              <div className="text-white text-xs font-semibold group-hover:text-[#38BDF8] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Formal Paper (arXiv)</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Full academic paper with theorem proofs, Lagrangian physics, and benchmarks.
              </p>
            </button>

            <a
              href="/downloads/pymacs_paper.tex"
              download="pymacs_paper.tex"
              className="p-3 bg-[#171720] hover:bg-[#1E1E2A] border border-[#252534] hover:border-[#F59E0B]/40 rounded text-left transition-colors cursor-pointer group"
            >
              <div className="text-white text-xs font-semibold group-hover:text-[#F59E0B] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>LaTeX Source</span>
                </div>
                <Download className="w-3 h-3 text-gray-500 group-hover:text-white" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Download <code className="text-gray-300 font-mono">pymacs_paper.tex</code> and <code className="text-gray-300 font-mono">references.bib</code>.
              </p>
            </a>

            <button
              onClick={() => onOpenWindow('paper')}
              className="p-3 bg-[#171720] hover:bg-[#1E1E2A] border border-[#252534] hover:border-[#4ADE80]/40 rounded text-left transition-colors cursor-pointer group"
            >
              <div className="text-white text-xs font-semibold group-hover:text-[#4ADE80] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>GitHub &amp; CI Workflow</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Automated LaTeX compilation to PDF via GitHub Actions (<code className="text-gray-300 font-mono">paper.yml</code>).
              </p>
            </button>
          </div>
        </div>

        {/* Docker Container & Downloadable Builds Feature Card */}
        <div className="bg-[#121217] border border-[#262630] rounded-lg p-4 shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202028] pb-2.5">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Container className="w-4 h-4 text-[#38BDF8]" />
              <span>Docker Container &amp; Multiplatform Builds</span>
              <span className="text-[10px] bg-[#1E1E28] text-[#4ADE80] px-1.5 py-0.2 rounded border border-[#4ADE80]/20">
                v4.2.0
              </span>
            </div>
            <button
              onClick={() => onOpenWindow('downloads')}
              className="text-[11px] text-[#60A5FA] hover:text-[#93C5FD] flex items-center gap-1 cursor-pointer"
            >
              <span>View All Releases &amp; Hashes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Docker Container button */}
            <button
              onClick={() => onOpenWindow('downloads')}
              className="p-2.5 bg-[#171720] hover:bg-[#1E1E2A] border border-[#252534] hover:border-[#38BDF8]/40 rounded text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-white text-xs font-semibold group-hover:text-[#38BDF8]">
                <Container className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Docker</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 font-mono">pymacs:v4.2.0</div>
              <div className="text-[9px] text-gray-500 mt-0.5">Alpine + Nginx 3000</div>
            </button>

            {/* Android APK download */}
            <a
              href="/downloads/pymacs-v4.2.0-android.apk"
              download="pymacs-v4.2.0-android.apk"
              className="p-2.5 bg-[#171720] hover:bg-[#1E1E2A] border border-[#252534] hover:border-[#10B981]/40 rounded text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white text-xs font-semibold group-hover:text-[#10B981]">
                  <Smartphone className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Android APK</span>
                </div>
                <Download className="w-3 h-3 text-gray-500 group-hover:text-white" />
              </div>
              <div className="text-[10px] text-gray-400 mt-1 font-mono">pymacs.apk</div>
              <div className="text-[9px] text-[#10B981] mt-0.5">Android 8.0 - 14</div>
            </a>

            {/* iOS profile download */}
            <a
              href="/downloads/pymacs-v4.2.0-ios.mobileconfig"
              download="pymacs-v4.2.0-ios.mobileconfig"
              className="p-2.5 bg-[#171720] hover:bg-[#1E1E2A] border border-[#252534] hover:border-[#F59E0B]/40 rounded text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white text-xs font-semibold group-hover:text-[#F59E0B]">
                  <Apple className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>iOS Profile</span>
                </div>
                <Download className="w-3 h-3 text-gray-500 group-hover:text-white" />
              </div>
              <div className="text-[10px] text-gray-400 mt-1 font-mono">.mobileconfig</div>
              <div className="text-[9px] text-[#F59E0B] mt-0.5">Safari WebClip</div>
            </a>

            {/* Windows 8, 10, 11 download */}
            <a
              href="/downloads/pymacs-v4.2.0-win8-win10-win11-setup.exe"
              download="pymacs-v4.2.0-win8-win10-win11-setup.exe"
              className="p-2.5 bg-[#171720] hover:bg-[#1E1E2A] border border-[#252534] hover:border-[#38BDF8]/40 rounded text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white text-xs font-semibold group-hover:text-[#38BDF8]">
                  <Monitor className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Win 8, 10, 11</span>
                </div>
                <Download className="w-3 h-3 text-gray-500 group-hover:text-white" />
              </div>
              <div className="text-[10px] text-gray-400 mt-1 font-mono">win8-10-11.exe</div>
              <div className="text-[9px] text-[#38BDF8] mt-0.5">Universal Setup &amp; Zip</div>
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
            className="p-3 bg-[#121216] hover:bg-[#191920] border border-[#22222A] hover:border-[#38BDF8]/40 rounded text-left transition-colors cursor-pointer group"
          >
            <div className="text-xs font-semibold text-white group-hover:text-[#38BDF8]">Google Antigravity</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Agentic App &amp; Thread Kernel</div>
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
