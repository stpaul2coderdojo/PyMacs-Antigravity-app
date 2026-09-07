import React from 'react';
import {
  Home,
  Terminal,
  Folder,
  Database,
  LayoutGrid,
  Search,
  MessageSquare,
  Cloud,
  Link,
  Cpu,
  BarChart2,
  Atom,
  BookOpen,
  Download,
  Info,
} from 'lucide-react';

export type RailTab =
  | 'home'
  | 'describe'
  | 'paper'
  | 'downloads'
  | 'shell'
  | 'files'
  | 'tasks'
  | 'data'
  | 'physics'
  | 'apps'
  | 'search'
  | 'messages'
  | 'cloud'
  | 'onchain'
  | 'profiler'
  | 'docs';

interface CommandRailProps {
  activeTab: RailTab;
  onSelectTab: (tab: RailTab) => void;
  metrics: {
    cpuPercent: number;
    memoryMb: number;
    runningCount: number;
  };
}

export const CommandRail: React.FC<CommandRailProps> = ({
  activeTab,
  onSelectTab,
  metrics,
}) => {
  const topNavItems: { id: RailTab; label: string; icon: any; hotkey?: string }[] = [
    { id: 'home', label: 'HOME', icon: Home, hotkey: 'M-h' },
    { id: 'describe', label: 'DESCRIBE', icon: Info, hotkey: 'M-i' },
    { id: 'paper', label: 'ARXIV', icon: BookOpen, hotkey: 'M-r' },
    { id: 'downloads', label: 'DOWNLOADS', icon: Download, hotkey: 'M-d' },
    { id: 'shell', label: 'PYTHON', icon: Terminal, hotkey: 'M-p' },
    { id: 'files', label: 'FILES', icon: Folder, hotkey: 'M-f' },
    { id: 'tasks', label: 'TASKS', icon: Cpu, hotkey: 'M-t' },
    { id: 'data', label: 'DATA', icon: Database },
    { id: 'physics', label: 'PHYSICS', icon: Atom, hotkey: 'M-g' },
    { id: 'apps', label: 'APPS', icon: LayoutGrid, hotkey: 'M-a' },
    { id: 'search', label: 'SEARCH', icon: Search, hotkey: 'M-s' },
    { id: 'messages', label: 'MESSAGES', icon: MessageSquare, hotkey: 'M-m' },
    { id: 'cloud', label: 'CLOUD', icon: Cloud, hotkey: 'M-c' },
    { id: 'onchain', label: 'ONCHAIN', icon: Link, hotkey: 'M-o' },
  ];

  return (
    <aside
      id="pymacs-command-rail"
      className="w-44 bg-[#0A0A0D] border-r border-[#1E1E24] flex flex-col justify-between font-mono text-xs select-none shrink-0"
    >
      {/* OS Branding / Top Header */}
      <div>
        <div className="p-3 border-b border-[#1A1A20] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4ADE80]"></div>
            <span className="font-bold tracking-wider text-white">PyMacs</span>
          </div>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest">OS v4.2</span>
        </div>

        {/* Command Rail Items */}
        <nav className="p-2 space-y-0.5">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`rail-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left cursor-pointer group ${
                  isActive
                    ? 'bg-[#1E1E26] text-white font-semibold border-l-2 border-[#38BDF8]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#131318]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#38BDF8]' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                  <span className="text-[11px] tracking-wide">{item.label}</span>
                </div>
                {item.hotkey && (
                  <span className="text-[8.5px] text-gray-600 font-mono hidden sm:inline">
                    {item.hotkey}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry & Profiler Section matching ASCII diagram */}
      <div className="p-2 border-t border-[#1A1A20] space-y-1">
        <div className="text-[9px] uppercase tracking-widest text-gray-600 px-2 py-0.5">
          SYSTEM PROFILER
        </div>

        <button
          onClick={() => onSelectTab('profiler')}
          className={`w-full px-2 py-1.5 rounded text-left transition-colors cursor-pointer ${
            activeTab === 'profiler'
              ? 'bg-[#1E1E26] text-white border-l-2 border-yellow-400'
              : 'hover:bg-[#131318] text-gray-400'
          }`}
        >
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500">CPU</span>
            <span className="text-[#38BDF8] font-mono">{metrics.cpuPercent}%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] mt-0.5">
            <span className="text-gray-500">MEMORY</span>
            <span className="text-[#A78BFA] font-mono">{metrics.memoryMb} MB</span>
          </div>
          <div className="flex items-center justify-between text-[10px] mt-0.5">
            <span className="text-gray-500">THREADS</span>
            <span className="text-[#4ADE80] font-mono">{metrics.runningCount} alive</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('docs')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition-colors text-left cursor-pointer text-gray-400 hover:text-gray-200 hover:bg-[#131318] text-[10.5px] ${
            activeTab === 'docs' ? 'bg-[#1E1E26] text-white font-semibold' : ''
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-gray-500" />
          <span>DOCS / BLOG</span>
        </button>
      </div>
    </aside>
  );
};
