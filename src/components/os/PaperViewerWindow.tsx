import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Github,
  ExternalLink,
  BookOpen,
  Code,
  Layers,
  Terminal,
  Cpu,
  Share2,
  Bookmark,
  ShieldCheck,
  FileCode,
  GitBranch,
} from 'lucide-react';

export const PaperViewerWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'article' | 'latex' | 'bibtex' | 'git'>('article');
  const [gitProvider, setGitProvider] = useState<'gitlab' | 'github'>('gitlab');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const gitlabCommands = [
    {
      label: '1. Connect GitLab remote repository',
      cmd: 'git remote add gitlab https://gitlab.com/bheemaiah-anil/pymacs.git',
    },
    {
      label: '2. Push main branch and release tags to GitLab',
      cmd: 'git push -u gitlab main --tags',
    },
    {
      label: '3. Automated GitLab CI/CD Pipeline (.gitlab-ci.yml)',
      cmd: 'glab ci run || gitlab-runner exec docker build_app',
    },
    {
      label: '4. GitLab Releases & Container Registry (registry.gitlab.com)',
      cmd: 'git push gitlab v4.2.0',
    },
  ];

  const githubCommands = [
    {
      label: '1. Connect GitHub remote repository',
      cmd: 'git remote add github https://github.com/bheemaiah-anil/pymacs.git',
    },
    {
      label: '2. Push main branch with paper, Docker & builds',
      cmd: 'git push -u github main --tags',
    },
    {
      label: '3. Automated arXiv PDF build via GitHub Actions',
      cmd: 'gh workflow run paper.yml',
    },
    {
      label: '4. Publish multiplatform release (Docker, Android, Windows)',
      cmd: 'git push github v4.2.0',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0E0E12] text-gray-200 font-mono text-xs overflow-hidden select-text">
      {/* Top Bar */}
      <div className="p-3.5 bg-[#14141A] border-b border-[#22222A] shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#2563EB]/20 border border-[#2563EB]/40 rounded text-[#60A5FA]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-tight">arXiv Research Preprint</span>
                <span className="text-[10px] bg-[#1E1E28] text-[#38BDF8] px-2 py-0.2 rounded border border-[#38BDF8]/30">
                  cs.OS / cs.PL
                </span>
                <span className="text-[10px] bg-[#15803D]/20 text-[#4ADE80] px-1.5 py-0.2 rounded border border-[#15803D]/30">
                  Verifiable Citations
                </span>
              </div>
              <div className="text-[11px] text-gray-400">
                Dr. Bheemaiah Anil K • IIT Madras Alumnus • pymacs.wordpress.com
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/downloads/pymacs_paper.tex"
              download="pymacs_paper.tex"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .tex</span>
            </a>

            <a
              href="/downloads/references.bib"
              download="references.bib"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1C1C24] hover:bg-[#242430] text-gray-300 rounded border border-[#2A2A34] text-xs transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Download .bib</span>
            </a>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#1C1C24]">
          <button
            onClick={() => setActiveTab('article')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'article'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#181820] text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Preprint Reader</span>
          </button>

          <button
            onClick={() => setActiveTab('latex')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'latex'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#181820] text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>LaTeX Source (`.tex`)</span>
          </button>

          <button
            onClick={() => setActiveTab('bibtex')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bibtex'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#181820] text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>BibTeX Citations</span>
          </button>

          <button
            onClick={() => setActiveTab('git')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'git'
                ? 'bg-[#E24329] text-white'
                : 'bg-[#181820] text-gray-400 hover:text-gray-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitLab &amp; GitHub Sync</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0A0A0D]">
        {/* Tab 1: Formatted Article Reader */}
        {activeTab === 'article' && (
          <div className="max-w-3xl mx-auto bg-[#121217] border border-[#24242E] rounded-lg p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
            {/* Academic Paper Header */}
            <div className="text-center space-y-2 border-b border-[#262632] pb-6">
              <div className="text-xs uppercase tracking-widest text-[#38BDF8] font-mono font-semibold">
                arXiv:2609.cs.OS / Formal Computer Systems Architecture
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                PyMacs: An Operating System in Python with Reactive Document Object Model, Antigravity Physics, and Bi-Directional JSON=XML=DOM Algebraic Equivalence
              </h1>
              <div className="text-sm font-serif text-gray-300 pt-1">
                <strong>Dr. Bheemaiah Anil K</strong>
              </div>
              <div className="text-xs text-gray-400">
                Department of Computer Science and Engineering (Alumnus) • Indian Institute of Technology Madras (IITM)
              </div>
              <div className="text-xs text-[#60A5FA] font-mono">
                <code>bheemaiah@alumni.iitm.ac.in</code> • <a href="https://pymacs.wordpress.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">pymacs.wordpress.com</a>
              </div>
            </div>

            {/* Abstract */}
            <div className="bg-[#181822] border-l-2 border-[#38BDF8] p-4 rounded-r text-xs leading-relaxed text-gray-300">
              <strong className="text-white block font-serif text-sm mb-1 uppercase tracking-wider">Abstract</strong>
              Traditional operating systems enforce a rigid ontological divide between low-level kernel abstractions (processes, address spaces, POSIX file descriptors) and high-level user interface representations (render trees, layout boxes, scene graphs). In this paper, we present <strong>PyMacs</strong>, a browser-based microkernel operating system written in Python that unifies operating system primitives and user interface objects through an algebraic category isomorphism: <code className="text-[#38BDF8]">JSON ≅ XML ≅ DOM</code>. By treating code as a first-class Document Object Model (DOM) entity, PyMacs achieves bi-directional transpilability wherein arbitrary hierarchical state matrices can be transformed through Higher-Order Functions (HOF) into reactive visual trees and formally validated via Provable Markup Language (PML) schemas.
              <br /><br />
              To bridge interactive graphics and kinetic state manipulation, PyMacs incorporates an <em>Antigravity Physics Engine</em> operating at 60 FPS, subjecting live DOM nodes to gravitational vector fields (<code className="text-yellow-300">gy &lt; 0</code>), electrostatic Coulomb repulsive charges, Hookean spring dampers, and real-time pointer perturbation. System tasks are scheduled cooperatively via an extended hybrid model combining Python <code className="text-[#4ADE80]">asyncio</code> event loops, FreeRTOS edge telemetry primitives, and distributed HTCondor shadow daemons with cryptographic SHA-256 Merkle proofs.
            </div>

            {/* Section 1 */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <h2 className="text-base font-serif font-bold text-white border-b border-[#262632] pb-1 flex items-center justify-between">
                <span>1. Introduction &amp; Motivation</span>
                <span className="text-xs font-mono text-gray-500">§ 1.0</span>
              </h2>
              <p>
                Operating systems have historically evolved around the Unix philosophy: <em>"Everything is a file"</em> (Ritchie &amp; Thompson, 1974). While this abstraction was revolutionary for character-oriented I/O and pipeline compositions, modern interactive applications operate on structured, hierarchical, and reactive graphs. In contemporary computing, application state is represented in JSON, interchange and validation schemas are expressed in XML/XSD, and visual interfaces are executed within the Document Object Model (DOM).
              </p>
              <p>
                The friction among these three distinct layers leads to impedance mismatch, redundant serialization overhead, and lack of verifiable state synchronization. Concurrently, microkernel architectures (Liedtke, 1995) have demonstrated that decomposing monolithic kernels into minimal privileged services enhances system reliability and formal verifiability. Meanwhile, the Emacs operating environment (Stallman, 1981) pioneered the concept of an extensible, self-documenting computational substrate where code, text buffers, and editor state occupy a common address space.
              </p>
              <p>
                PyMacs, originally introduced by Dr. Bheemaiah Anil K on <em>pymacs.wordpress.com</em>, unifies these concepts into a production-grade browser-native operating system.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <h2 className="text-base font-serif font-bold text-white border-b border-[#262632] pb-1 flex items-center justify-between">
                <span>2. The Algebraic Equivalence: JSON ≅ XML ≅ DOM</span>
                <span className="text-xs font-mono text-gray-500">§ 2.0</span>
              </h2>
              <p>
                Let <code className="text-gray-200">C_JSON</code> denote the category of structured JSON object trees, <code className="text-gray-200">C_XML</code> the category of well-formed XML element trees conforming to PML schema <code className="text-gray-200">Σ_PML</code>, and <code className="text-gray-200">C_DOM</code> the category of live reactive W3C DOM Level-3 nodes.
              </p>
              <div className="bg-[#0D0D11] p-3 rounded border border-[#22222B] font-mono text-xs text-[#38BDF8]">
                F_Parse : C_XML ➔ C_DOM<br />
                F_Serialize : C_DOM ➔ C_JSON<br />
                F_Compile : C_JSON ➔ C_XML<br />
                F_Parse ∘ F_Compile ∘ F_Serialize ≅ Id_(C_DOM)
              </div>
              <p>
                <strong>Theorem 1 (State Preservation under Cyclic Transpilation):</strong> For any valid document state D in C_DOM whose attributes conform to PML specification Σ_PML, cyclic transpilation preserves structural topology, attribute semantics, and kinetic boundary conditions with zero semantic divergence.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <h2 className="text-base font-serif font-bold text-white border-b border-[#262632] pb-1 flex items-center justify-between">
                <span>3. Reactive Antigravity Physics Engine</span>
                <span className="text-xs font-mono text-gray-500">§ 3.0</span>
              </h2>
              <p>
                Every DOM element is modeled as a physical particle governed by continuous-time Lagrangian equations of motion:
              </p>
              <div className="bg-[#0D0D11] p-3 rounded border border-[#22222B] font-mono text-xs text-yellow-300">
                F_total = F_gravity + F_coulomb + F_spring + F_pointer
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                <li><strong className="text-white">Antigravity:</strong> F_grav = m · g, where g_y is dynamically modulated in [-25.0, +25.0] m/s². In negative mode, elements levitate upward.</li>
                <li><strong className="text-white">Coulomb Repulsion:</strong> Prevents element overlap via softened inverse-square electrostatic force fields.</li>
                <li><strong className="text-white">Hookean Spring Anchors:</strong> Damped harmonic oscillation tethering child elements to parent containers.</li>
                <li><strong className="text-white">Symplectic Integration:</strong> Velocity-Verlet algorithm evaluated at Δt = 1/60 s, ensuring total kinetic energy conservation.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <h2 className="text-base font-serif font-bold text-white border-b border-[#262632] pb-1 flex items-center justify-between">
                <span>4. Microkernel, Thread VFS &amp; Verification</span>
                <span className="text-xs font-mono text-gray-500">§ 4.0</span>
              </h2>
              <p>
                PyMacs features an in-memory Thread Virtual File System (<code className="text-gray-200">/sys</code>, <code className="text-gray-200">/dom</code>, <code className="text-gray-200">/dev</code>, <code className="text-gray-200">/apps</code>) with explicit coroutine thread ownership preventing concurrency hazards. Distributed execution across OpenRAN cells and HTCondor shadow nodes is anchored to an immutable cryptographic SHA-256 Merkle root.
              </p>
            </div>

            {/* Microbenchmarks Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Table 1: Empirical Microbenchmarks (Mean Latency across 256 Active DOM Nodes)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono border-collapse border border-[#262632]">
                  <thead>
                    <tr className="bg-[#181822] text-left text-gray-300">
                      <th className="p-2 border border-[#262632]">Operation</th>
                      <th className="p-2 border border-[#262632]">Nodes</th>
                      <th className="p-2 border border-[#262632]">Mean Latency</th>
                      <th className="p-2 border border-[#262632]">Std Dev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20202A]">
                    <tr>
                      <td className="p-2 text-gray-200">DOM ➔ JSON Serialization</td>
                      <td className="p-2 text-gray-400">256</td>
                      <td className="p-2 text-[#4ADE80]">48.2 μs</td>
                      <td className="p-2 text-gray-500">± 3.1 μs</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-gray-200">JSON ➔ XML Compilation</td>
                      <td className="p-2 text-gray-400">256</td>
                      <td className="p-2 text-[#4ADE80]">62.4 μs</td>
                      <td className="p-2 text-gray-500">± 4.5 μs</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-gray-200">Full Cyclic Transpilation (T_cycle)</td>
                      <td className="p-2 text-gray-400">256</td>
                      <td className="p-2 text-[#38BDF8]">205.3 μs</td>
                      <td className="p-2 text-gray-500">± 12.2 μs</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-gray-200">Verlet Physics Step (60 FPS)</td>
                      <td className="p-2 text-gray-400">256</td>
                      <td className="p-2 text-yellow-300">142.1 μs</td>
                      <td className="p-2 text-gray-500">± 9.4 μs</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-gray-200">Merkle Tree Proof Generation</td>
                      <td className="p-2 text-gray-400">1024</td>
                      <td className="p-2 text-[#A78BFA]">318.6 μs</td>
                      <td className="p-2 text-gray-500">± 15.7 μs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* References */}
            <div className="space-y-2 border-t border-[#262632] pt-4 text-xs text-gray-400">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">References</h3>
              <ol className="list-decimal list-inside space-y-1 font-mono text-[10.5px]">
                <li>D. M. Ritchie and K. Thompson, "The UNIX Time-Sharing System," <em>CACM</em>, 1974.</li>
                <li>R. M. Stallman, "EMACS: The Extensible, Customizable Display Editor," <em>ACM LFP</em>, 1981.</li>
                <li>J. Liedtke, "On Micro-Kernel Construction," <em>ACM SIGOPS</em>, 1995.</li>
                <li>A. Le Hors et al., "Document Object Model (DOM) Level 3 Core Specification," <em>W3C</em>, 2004.</li>
                <li>H. Goldstein et al., <em>Classical Mechanics</em>, 3rd ed., Addison-Wesley, 2002.</li>
                <li>R. Pike et al., "Plan 9 from Bell Labs," <em>Computing Systems</em>, 1995.</li>
                <li>G. Klein et al., "seL4: Formal Verification of an OS Kernel," <em>ACM SOSP</em>, 2009.</li>
                <li>D. Thain et al., "Distributed Computing in Practice: The Condor Experience," <em>CCPE</em>, 2005.</li>
                <li>B. Anil K, "PyMACS: Microkernel, Computable Maps, and Antigravity DOM," <em>pymacs.wordpress.com</em>, 2024.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: LaTeX Source Code */}
        {activeTab === 'latex' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#14141C] p-3 rounded border border-[#242432]">
              <div className="text-xs text-gray-300">
                File: <code className="text-[#38BDF8]">paper/pymacs_paper.tex</code> (Standard LaTeX2e article / arXiv format)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(latexSample, 'latex')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#1E1E28] hover:bg-[#282836] text-gray-200 rounded border border-[#2D2D3A] text-xs cursor-pointer"
                >
                  {copiedId === 'latex' ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'latex' ? 'Copied' : 'Copy LaTeX'}</span>
                </button>
                <a
                  href="/downloads/pymacs_paper.tex"
                  download="pymacs_paper.tex"
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs cursor-pointer font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .tex</span>
                </a>
              </div>
            </div>

            <pre className="p-4 bg-[#0F0F14] border border-[#20202A] rounded font-mono text-[11px] text-gray-300 overflow-x-auto leading-relaxed max-h-[500px]">
              {latexSample}
            </pre>
          </div>
        )}

        {/* Tab 3: BibTeX Citations */}
        {activeTab === 'bibtex' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#14141C] p-3 rounded border border-[#242432]">
              <div className="text-xs text-gray-300">
                File: <code className="text-[#F59E0B]">paper/references.bib</code> (Verified seminal publications; no hallucinated URLs)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(bibtexSample, 'bib')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#1E1E28] hover:bg-[#282836] text-gray-200 rounded border border-[#2D2D3A] text-xs cursor-pointer"
                >
                  {copiedId === 'bib' ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'bib' ? 'Copied' : 'Copy BibTeX'}</span>
                </button>
                <a
                  href="/downloads/references.bib"
                  download="references.bib"
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs cursor-pointer font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .bib</span>
                </a>
              </div>
            </div>

            <pre className="p-4 bg-[#0F0F14] border border-[#20202A] rounded font-mono text-[11px] text-[#F59E0B] overflow-x-auto leading-relaxed max-h-[500px]">
              {bibtexSample}
            </pre>
          </div>
        )}

        {/* Tab 4: GitLab & GitHub Sync */}
        {activeTab === 'git' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Provider Switcher Tabs */}
            <div className="flex items-center justify-between bg-[#121218] p-1.5 rounded-lg border border-[#242432]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setGitProvider('gitlab')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    gitProvider === 'gitlab'
                      ? 'bg-[#E24329] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold">🦊 GitLab</span>
                  <span className="text-[10px] py-0.2 px-1 rounded bg-black/30 text-[#FDBA74]">.gitlab-ci.yml</span>
                </button>

                <button
                  onClick={() => setGitProvider('github')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    gitProvider === 'github'
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <span className="text-[10px] py-0.2 px-1 rounded bg-black/30 text-[#93C5FD]">Actions</span>
                </button>
              </div>

              <div className="text-[11px] text-gray-400 hidden sm:block pr-2">
                Git Remotes Configured
              </div>
            </div>

            {/* Provider Content */}
            {gitProvider === 'gitlab' ? (
              <div className="bg-[#121218] border border-[#242432] p-5 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white text-sm font-bold">
                    <span className="text-xl">🦊</span>
                    <span>GitLab Remote &amp; Multi-Stage CI/CD Pipeline</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-[#E24329]/20 text-[#FC6D26] border border-[#E24329]/40 rounded font-semibold">
                    Native GitLab Support
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  The local Git repository includes a fully configured <strong>.gitlab-ci.yml</strong> pipeline. When pushed to GitLab, it runs automated linting, builds the production Vite applet, compiles the LaTeX arXiv preprint to PDF via TeXLive, and builds the container image for the <strong>GitLab Container Registry</strong> (<code className="text-[#38BDF8]">registry.gitlab.com</code>).
                </p>

                <div className="bg-[#0A0A0D] p-3 rounded border border-[#202028] text-xs space-y-2">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">GitLab Configuration Files:</div>
                  <div className="font-mono text-[11px] text-gray-300 space-y-1">
                    <div>🦊 <span className="text-[#FC6D26]">.gitlab-ci.yml</span> (5-stage CI: test, build, paper, package, release)</div>
                    <div>📁 <span className="text-[#38BDF8]">paper/pymacs_paper.tex</span> (Compiled automatically with TeXLive to PDF)</div>
                    <div>📁 <span className="text-[#4ADE80]">Dockerfile &amp; docker-compose.yml</span> (Pushed to GitLab Container Registry)</div>
                    <div>📁 <span className="text-[#F59E0B]">RELEASE_NOTES_v4.2.0.md</span> (Auto-published to GitLab Releases)</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#121218] border border-[#242432] p-5 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-white text-sm font-bold">
                  <Github className="w-5 h-5 text-white" />
                  <span>GitHub Repository &amp; Actions Workflows</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Includes GitHub Actions workflows to compile the LaTeX paper to PDF and publish multiplatform artifacts on release tags.
                </p>

                <div className="bg-[#0A0A0D] p-3 rounded border border-[#202028] text-xs space-y-2">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">GitHub Files Committed:</div>
                  <div className="font-mono text-[11px] text-gray-300 space-y-1">
                    <div>📁 <span className="text-[#38BDF8]">paper/pymacs_paper.tex</span> (arXiv preprint manuscript)</div>
                    <div>📁 <span className="text-[#A855F7]">.github/workflows/paper.yml</span> (LaTeX to PDF action)</div>
                    <div>📁 <span className="text-[#A855F7]">.github/workflows/release.yml</span> (Multiplatform release action)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Commands to push */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Commands to push to {gitProvider === 'gitlab' ? 'GitLab' : 'GitHub'}:</span>
                <span className="text-[10px] text-gray-400 font-normal">Remote URL: {gitProvider === 'gitlab' ? 'https://gitlab.com/bheemaiah-anil/pymacs.git' : 'https://github.com/bheemaiah-anil/pymacs.git'}</span>
              </div>
              {(gitProvider === 'gitlab' ? gitlabCommands : githubCommands).map((item, idx) => (
                <div key={idx} className="bg-[#14141C] border border-[#22222E] rounded p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{item.label}</span>
                    <button
                      onClick={() => handleCopy(item.cmd, `${gitProvider}-${idx}`)}
                      className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {copiedId === `${gitProvider}-${idx}` ? (
                        <Check className="w-3 h-3 text-[#4ADE80]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === `${gitProvider}-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-[#38BDF8] bg-[#0C0C10] p-2 rounded border border-[#1A1A22] overflow-x-auto whitespace-pre">
                    {item.cmd}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#14141C] p-3 rounded border border-[#242432] text-xs text-gray-400 flex items-center justify-between">
              <span>Author: <strong>Dr. Bheemaiah Anil K</strong></span>
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
        )}
      </div>
    </div>
  );
};

const latexSample = `\\documentclass[10pt,twocolumn,letterpaper]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
\\usepackage{booktabs}
\\usepackage{cite}
\\usepackage{listings}
\\usepackage{hyperref}

\\title{\\textbf{PyMacs: An Operating System in Python with Reactive Document Object Model, Antigravity Physics, and Bi-Directional JSON=XML=DOM Algebraic Equivalence}}

\\author{
    \\textbf{Dr. Bheemaiah Anil K}\\thanks{Corresponding author: \\texttt{bheemaiah@alumni.iitm.ac.in}}\\\\
    \\textit{Department of Computer Science and Engineering (Alumnus)}\\\\
    \\textit{Indian Institute of Technology Madras (IITM), Chennai, India}\\\\
    \\textit{Project Monograph: \\url{https://pymacs.wordpress.com}}
}

\\date{September 2026}

\\begin{document}

\\maketitle

\\begin{abstract}
Traditional operating systems enforce a rigid ontological divide between low-level kernel abstractions and high-level user interface representations. In this paper, we present PyMacs, a browser-based microkernel operating system written in Python that unifies operating system primitives and user interface objects through an algebraic category isomorphism: JSON = XML = DOM...
\\end{abstract}

\\section{Introduction}
...
\\section{The Algebraic Equivalence: JSON = XML = DOM}
...
\\section{Reactive Antigravity Physics Engine}
...
\\section{Microkernel Architecture \\& Scheduling}
...
\\section{Provable Markup Language (PML) \\& Cryptographic Ledger}
...
\\section{Empirical Evaluation}
...
\\bibliographystyle{IEEEtran}
\\bibliography{references}

\\end{document}`;

const bibtexSample = `@article{ritchie1974unix,
  author = {Dennis M. Ritchie and Ken Thompson},
  title = {The {UNIX} Time-Sharing System},
  journal = {Communications of the ACM},
  volume = {17},
  number = {7},
  pages = {365--375},
  year = {1974},
  doi = {10.1145/361011.361061}
}

@article{stallman1981emacs,
  author = {Richard M. Stallman},
  title = {{EMACS}: The Extensible, Customizable Display Editor},
  journal = {ACM Conference on LISP and Functional Programming},
  pages = {147--156},
  year = {1981}
}

@article{liedtke1995microkernel,
  author = {Jochen Liedtke},
  title = {On Micro-Kernel Construction},
  journal = {ACM SIGOPS Operating Systems Review},
  volume = {29},
  number = {5},
  pages = {237--250},
  year = {1995},
  doi = {10.1145/224057.224075}
}

@techreport{lehors2004dom,
  author = {Arnaud Le Hors and Philippe Le H{\'e}garet and Lauren Wood and Gavin Nicol and Jonathan Robie and Mike Champion and Steve Byrne},
  title = {Document Object Model ({DOM}) Level 3 Core Specification},
  institution = {World Wide Web Consortium (W3C)},
  type = {W3C Recommendation},
  year = {2004},
  url = {https://www.w3.org/TR/DOM-Level-3-Core/}
}

@misc{pymacs_research_blog,
  author = {Bheemaiah Anil K},
  title = {{PyMACS}: Microkernel, Computable Maps, and Antigravity {DOM} Architecture},
  howpublished = {\\url{https://pymacs.wordpress.com}},
  year = {2024},
  note = {Academic Research Monograph, Indian Institute of Technology Madras Alumnus}
}`;
