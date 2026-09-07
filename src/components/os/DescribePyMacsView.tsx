import React from 'react';
import {
  BookOpen,
  Atom,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Container,
  Smartphone,
  Monitor,
  ExternalLink,
  Code2,
  Database,
  Workflow,
  Sparkles,
  Download,
} from 'lucide-react';

interface DescribePyMacsViewProps {
  onOpenDownloads?: () => void;
  onOpenPlayground?: () => void;
  onOpenShell?: () => void;
}

export const DescribePyMacsView: React.FC<DescribePyMacsViewProps> = ({
  onOpenDownloads,
  onOpenPlayground,
  onOpenShell,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#0B0B0E] text-gray-200 font-mono select-text">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="border-b border-[#24242C] pb-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
                PyMacs
              </h1>
              <div className="text-sm font-serif italic text-[#38BDF8] mt-1">
                An Operating System in Python
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#10B981]/15 text-[#4ADE80] border border-[#10B981]/30 px-2.5 py-1 rounded font-semibold">
                ● KERNEL ACTIVE • v4.2.0
              </span>
            </div>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-[#3B82F6] via-[#24242C] to-transparent my-3"></div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span>Author: <strong>Dr. Bheemaiah Anil K</strong></span>
            <span>•</span>
            <span>Contact: <code className="text-gray-300">bheemaiah@alumni.iitm.ac.in</code></span>
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

        {/* Executive Summary / Description */}
        <div className="bg-[#121217] border border-[#24242C] p-5 rounded-lg shadow-lg space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#38BDF8]" />
            <span>What is PyMacs?</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans text-balance">
            <strong>PyMacs</strong> is a browser-based operating system and microkernel architecture implemented in Python, originally conceived by <strong>Dr. Bheemaiah Anil K</strong> on <em>pymacs.wordpress.com</em>. Evolving from the foundational <em>Cardculator</em> into a comprehensive distributed OS, PyMacs unifies an Emacs-inspired environment with a reactive W3C Document Object Model (DOM), POSIX thread virtual filesystem, FreeRTOS/asyncio cooperative multitasking, and cloud / on-chain provability.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Unlike conventional SaaS dashboards or standard operating systems, PyMacs treats <strong>code itself as a first-class DOM object</strong> and enforces mathematical equivalence between JSON datasets, Provable Markup Language (PML) XML filters, and real-time reactive DOM nodes.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1: JSON=XML=DOM Pipeline */}
          <div className="bg-[#121217] border border-[#24242C] p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase">
              <Workflow className="w-4 h-4" />
              <span>1. JSON ⇄ XML ⇄ DOM Equivalence</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Every system object in PyMacs is bi-directionally transpileable. Datasets stored in the JSON document database pass through Higher-Order Functions (HOF):
            </p>
            <div className="bg-[#0A0A0D] p-2.5 rounded border border-[#1E1E26] text-[11px] text-[#4ADE80] font-mono">
              map(filter_xml, dataset_json) ➔ reactive_dom_tree
            </div>
            <p className="text-[11px] text-gray-400">
              State mutations are mathematically verifiable through the Provable Markup Language (PML) compiler.
            </p>
          </div>

          {/* Pillar 2: Antigravity Physics Engine */}
          <div className="bg-[#121217] border border-[#24242C] p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-[#4ADE80] text-xs font-bold uppercase">
              <Atom className="w-4 h-4" />
              <span>2. Antigravity Physics Engine</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              PyMacs renders DOM elements as dynamic physical entities subjected to gravitational vectors (<code className="text-[#38BDF8]">-9.81 m/s²</code>), electrostatic Coulomb repulsion, spring tethering, and inertial momentum at 60 FPS.
            </p>
            <div className="bg-[#0A0A0D] p-2.5 rounded border border-[#1E1E26] text-[11px] text-yellow-300 font-mono">
              F_total = F_gravity + F_coulomb + F_spring - μ · v
            </div>
            <p className="text-[11px] text-gray-400">
              Cursor interactions exert real-time repulsion forces, enabling tactile manipulation of interface buffers.
            </p>
          </div>

          {/* Pillar 3: Microkernel & Virtual File System */}
          <div className="bg-[#121217] border border-[#24242C] p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-[#EAB308] text-xs font-bold uppercase">
              <Cpu className="w-4 h-4" />
              <span>3. Python / Emacs Shell &amp; VFS</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Includes an interactive Python 3.12 REPL supporting Emacs keybindings, system introspection (<code className="text-[#60A5FA]">pymacs.help()</code>, <code className="text-[#60A5FA]">pymacs.dom.nodes()</code>), and an in-memory Thread Virtual File System (VFS) with ownership isolation.
            </p>
            <div className="bg-[#0A0A0D] p-2.5 rounded border border-[#1E1E26] text-[11px] text-gray-300 font-mono">
              /sys/kernel • /dom/schemas • /apps/cardculator.py
            </div>
          </div>

          {/* Pillar 4: Cloud & On-Chain Proofs */}
          <div className="bg-[#121217] border border-[#24242C] p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-[#A78BFA] text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>4. Cloud, OpenRAN &amp; On-Chain Ledger</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              HTCondor shadow daemons orchestrate distributed workloads across OpenRAN robotic cell clusters. Every DOM compilation generates an immutable SHA-256 Merkle proof anchored to the on-chain PML ledger.
            </p>
            <div className="bg-[#0A0A0D] p-2.5 rounded border border-[#1E1E26] text-[11px] text-[#A78BFA] font-mono">
              Merkle Root: 0x9E4B8F72AC3D51B0E473F62981D89A4E
            </div>
          </div>
        </div>

        {/* Multiplatform Deployment & Docker Container */}
        <div className="bg-[#121217] border border-[#24242C] p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#202028] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Container className="w-4 h-4 text-[#38BDF8]" />
                <span>Docker Container &amp; Multiplatform Downloads</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                PyMacs ships as a containerized image and cross-platform native builds.
              </p>
            </div>
            {onOpenDownloads && (
              <button
                onClick={onOpenDownloads}
                className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Downloads Hub</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {/* Docker */}
            <div className="bg-[#16161D] p-3 rounded border border-[#242430] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Container className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Docker</span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">pymacs:v4.2.0</div>
              <p className="text-[10px] text-gray-500">Multi-stage Alpine image with Nginx SPA reverse proxy on port 3000.</p>
            </div>

            {/* Android APK */}
            <div className="bg-[#16161D] p-3 rounded border border-[#242430] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Smartphone className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Android APK</span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">pymacs.apk (28MB)</div>
              <p className="text-[10px] text-gray-500">Standalone APK package targeting Android 14 with touch physics.</p>
            </div>

            {/* iOS */}
            <div className="bg-[#16161D] p-3 rounded border border-[#242430] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Smartphone className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>iOS Profile</span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">.mobileconfig</div>
              <p className="text-[10px] text-gray-500">Managed WebClip profile for Safari fullscreen offline installation.</p>
            </div>

            {/* Windows */}
            <div className="bg-[#16161D] p-3 rounded border border-[#242430] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Monitor className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Windows x64</span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">pymacs-x64.exe</div>
              <p className="text-[10px] text-gray-500">Portable Windows desktop binary with embedded Python environment.</p>
            </div>
          </div>
        </div>

        {/* Interactive Quick Launchers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            {onOpenShell && (
              <button
                onClick={onOpenShell}
                className="flex items-center gap-1.5 bg-[#1A1A22] hover:bg-[#22222E] text-white px-3 py-1.5 rounded text-xs font-semibold border border-[#2A2A36] cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Launch Python REPL</span>
              </button>
            )}
            {onOpenPlayground && (
              <button
                onClick={onOpenPlayground}
                className="flex items-center gap-1.5 bg-[#1A1A22] hover:bg-[#22222E] text-white px-3 py-1.5 rounded text-xs font-semibold border border-[#2A2A36] cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Open Transpiler Playground</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-gray-500">
            PyMacs Operating System • Copyright © Dr. Bheemaiah Anil K
          </div>
        </div>
      </div>
    </div>
  );
};
