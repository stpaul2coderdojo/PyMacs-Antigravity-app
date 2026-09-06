import React from 'react';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Code2,
  FileCode2,
  Database,
  Cpu,
  Tv,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PRESETS, PresetData } from '../data/presets';

export type BrowserTab =
  | 'viewport'
  | 'w3parser'
  | 'jsonstore'
  | 'compiler'
  | 'workers'
  | 'optimizer';

interface BrowserChromeProps {
  activeTab: BrowserTab;
  setActiveTab: (tab: BrowserTab) => void;
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  selectedPreset: PresetData;
  onSelectPreset: (preset: PresetData) => void;
  onReload: () => void;
}

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  activeTab,
  setActiveTab,
  currentUrl,
  setCurrentUrl,
  selectedPreset,
  onSelectPreset,
  onReload,
}) => {
  const tabs = [
    { id: 'viewport', label: 'Antigravity Viewport', icon: Layers },
    { id: 'w3parser', label: 'W3 Parser & Filters', icon: FileCode2 },
    { id: 'jsonstore', label: 'JSON Persistence', icon: Database },
    { id: 'compiler', label: 'JS Compiler & AST', icon: Code2 },
    { id: 'workers', label: 'Worker Threads & Lambda', icon: Cpu },
    { id: 'optimizer', label: 'Media Optimizer', icon: Tv },
  ];

  const handleTabClick = (tabId: BrowserTab) => {
    setActiveTab(tabId);
    if (tabId === 'viewport') setCurrentUrl('pymacs://antigravity.sys/live-dom');
    else if (tabId === 'w3parser') setCurrentUrl('pymacs://w3.org/spec/dom-level-3/schema.xml');
    else if (tabId === 'jsonstore') setCurrentUrl('pymacs://persistence.local/state.json');
    else if (tabId === 'compiler') setCurrentUrl('pymacs://runtime/v8-jit/compiler.ts');
    else if (tabId === 'workers') setCurrentUrl('pymacs://system/threading/worker-pool.sys');
    else if (tabId === 'optimizer') setCurrentUrl('pymacs://cdn.media/stream/adaptive-downscale');
  };

  return (
    <div className="bg-[#0D0D0F] border-b border-[#222224] flex flex-col select-none flex-shrink-0">
      {/* Top URL & Navigation bar */}
      <div className="h-12 px-4 flex items-center justify-between gap-3 border-b border-[#1C1C1F]">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 text-[#71717A]">
          <button
            onClick={() => handleTabClick('viewport')}
            className="p-1.5 hover:bg-[#1A1A1E] hover:text-white rounded transition-colors"
            title="Back to Viewport"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleTabClick('w3parser')}
            className="p-1.5 hover:bg-[#1A1A1E] hover:text-white rounded transition-colors"
            title="Forward to Parser"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onReload}
            className="p-1.5 hover:bg-[#1A1A1E] hover:text-white rounded transition-colors"
            title="Reload DOM & Physics Engine"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 max-w-2xl flex items-center bg-[#161618] border border-[#2D2D30] rounded-md px-3 py-1 text-[12px] font-mono text-[#D1D1D1]">
          <Globe className="w-3.5 h-3.5 text-[#4ADE80] mr-2 flex-shrink-0" />
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-[11px] text-[#D1D1D1] placeholder-[#71717A]"
            placeholder="pymacs://address"
          />
          <span className="text-[9px] uppercase tracking-wider text-[#4ADE80] bg-[#4ADE80]/10 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
            SECURE DOM OS
          </span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#71717A] uppercase tracking-wider hidden sm:inline">
            Archetype:
          </span>
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const p = PRESETS.find((item) => item.id === e.target.value);
              if (p) onSelectPreset(p);
            }}
            aria-label="Select Archetype Preset"
            className="bg-[#161618] border border-[#2D2D30] text-[#D1D1D1] text-[11px] font-mono px-2.5 py-1 rounded outline-none cursor-pointer hover:border-[#4ADE80] transition-colors"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center px-4 overflow-x-auto gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as BrowserTab)}
              className={`flex items-center gap-2 px-3 py-2 text-[11px] font-medium tracking-wider uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#4ADE80] text-white bg-[#141416]'
                  : 'border-transparent text-[#71717A] hover:text-[#D1D1D1] hover:bg-[#121214]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4ADE80]' : 'text-[#71717A]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
