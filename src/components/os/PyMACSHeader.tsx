import React from 'react';
import { PRESETS, PresetData } from '../../data/presets';
import { ExternalLink, Terminal, AppWindow, Maximize2, Zap, RefreshCw, BookOpen } from 'lucide-react';

interface PyMACSHeaderProps {
  gravityY: number;
  setGravityY: (g: number) => void;
  selectedPreset: PresetData;
  onSelectPreset: (preset: PresetData) => void;
  onResetLayout: () => void;
  isDesktopWindowMode: boolean;
  onToggleWindowMode: () => void;
  onOpenDocs: () => void;
  onOpenShell: () => void;
}

export const PyMACSHeader: React.FC<PyMACSHeaderProps> = ({
  gravityY,
  setGravityY,
  selectedPreset,
  onSelectPreset,
  onResetLayout,
  isDesktopWindowMode,
  onToggleWindowMode,
  onOpenDocs,
  onOpenShell,
}) => {
  return (
    <header
      id="pymacs-browser-os-header"
      className="bg-[#0B0B0E] border-b border-[#1E1E24] px-4 py-2 flex items-center justify-between font-mono text-xs select-none shrink-0"
    >
      {/* Left: Branding & Blog Reference */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-bold text-white tracking-tight">PyMACS</span>
          <span className="text-[10px] bg-[#1E1E26] text-gray-400 px-1.5 py-0.5 rounded border border-[#2B2B36]">
            Browser OS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-500 border-l border-[#24242C] pl-3">
          <span>Dr. Bheemaiah Anil K</span>
          <span>•</span>
          <a
            href="https://pymacs.wordpress.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#60A5FA] hover:text-[#93C5FD] flex items-center gap-1 transition-colors"
          >
            <span>pymacs.wordpress.com</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Center: Preset Selector & Gravity Controller */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#121217] px-2.5 py-1 rounded border border-[#24242C]">
          <span className="text-gray-500 text-[10px] uppercase font-semibold">Preset:</span>
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const p = PRESETS.find((item) => item.id === e.target.value);
              if (p) onSelectPreset(p);
            }}
            className="bg-transparent text-gray-200 text-xs font-mono focus:outline-none cursor-pointer"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#181820] text-gray-200">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#121217] px-2.5 py-1 rounded border border-[#24242C]">
          <span className="text-gray-500 text-[10px] uppercase font-semibold">Gravity:</span>
          <input
            type="range"
            min="-18"
            max="18"
            step="0.5"
            value={gravityY}
            onChange={(e) => setGravityY(parseFloat(e.target.value))}
            className="w-16 h-1 accent-[#38BDF8] cursor-pointer"
          />
          <span className="text-[#38BDF8] font-mono text-[10.5px] w-12 text-right">
            {gravityY > 0 ? `+${gravityY}` : gravityY}
          </span>
        </div>
      </div>

      {/* Right: Mode & Status matching ASCII diagram */}
      <div className="flex items-center gap-3">
        {/* Toggle Window Desktop Mode vs Single Tab View */}
        <button
          onClick={onToggleWindowMode}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10.5px] cursor-pointer transition-colors border ${
            isDesktopWindowMode
              ? 'bg-[#2563EB]/20 border-[#2563EB]/40 text-[#60A5FA]'
              : 'bg-[#16161C] border-[#26262E] text-gray-400 hover:text-gray-200'
          }`}
          title="Toggle Desktop Multi-Window Mode"
        >
          <AppWindow className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isDesktopWindowMode ? 'Multi-Window' : 'Tiled Tab'}</span>
        </button>

        {/* Python Shell Quick Button */}
        <button
          onClick={onOpenShell}
          className="p-1 hover:bg-[#1E1E26] text-gray-400 hover:text-white rounded cursor-pointer transition-colors"
          title="Open Python REPL"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>

        {/* Status: ● ONLINE Python */}
        <div className="flex items-center gap-1.5 bg-[#121217] border border-[#24242C] px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
          <span className="text-[#4ADE80] font-semibold text-[11px]">ONLINE</span>
          <span className="text-gray-400 text-[10px] hidden sm:inline">Python 3.12</span>
        </div>
      </div>
    </header>
  );
};
