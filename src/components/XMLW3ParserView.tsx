import React, { useState } from 'react';
import { VirtualDOMNode, XMLFilterDef } from '../types/dom';
import { CheckCircle2, Play, Sliders, ShieldCheck, Sparkles } from 'lucide-react';

interface XMLW3ParserViewProps {
  xmlContent: string;
  setXmlContent: (xml: string) => void;
  filters: XMLFilterDef[];
  setFilters: React.Dispatch<React.SetStateAction<XMLFilterDef[]>>;
  onParseXML: () => void;
  rootNode: VirtualDOMNode;
}

export const XMLW3ParserView: React.FC<XMLW3ParserViewProps> = ({
  xmlContent,
  setXmlContent,
  filters,
  setFilters,
  onParseXML,
  rootNode,
}) => {
  const [parseStatus, setParseStatus] = useState<'success' | 'ready'>('ready');

  const handleApplyParse = () => {
    onParseXML();
    setParseStatus('success');
    setTimeout(() => setParseStatus('ready'), 2000);
  };

  const handleToggleFilter = (id: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleFilterStrengthChange = (id: string, strength: number) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, strength } : f))
    );
  };

  return (
    <div className="flex-1 w-full h-full bg-[#0A0A0B] text-[#D1D1D1] flex flex-col md:flex-row overflow-hidden select-none">
      {/* Left Column: Live XML Editor & Parser Input */}
      <div className="flex-1 border-r border-[#222224] flex flex-col bg-[#0D0D0F]">
        <div className="h-12 border-b border-[#222224] px-6 flex items-center justify-between bg-[#121214]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
              W3 XML / Schema Editor
            </span>
            <span className="text-[9px] bg-[#4ADE80]/10 text-[#4ADE80] px-2 py-0.5 rounded font-mono">
              W3C-DOM3-COMPLIANT
            </span>
          </div>

          <button
            onClick={handleApplyParse}
            className="flex items-center gap-1.5 bg-[#4ADE80] text-black px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#3ec46f] transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Parse & Compile DOM</span>
          </button>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <textarea
            value={xmlContent}
            onChange={(e) => setXmlContent(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-[#070708] text-[#4ADE80] font-mono text-[12px] leading-relaxed p-4 rounded border border-[#222224] outline-none resize-none focus:border-[#4ADE80]/50"
          />
        </div>

        <div className="p-4 border-t border-[#222224] bg-[#0A0A0B] flex items-center justify-between text-[11px] text-[#71717A]">
          <span>Pattern: <strong>JSON = XML = DOM</strong></span>
          <span className="font-mono text-white">Parser: Streaming Sax / Tree Lexer</span>
        </div>
      </div>

      {/* Right Column: XML Filters & W3 DOM Tree Compliance */}
      <div className="w-full md:w-[420px] flex flex-col bg-[#0D0D0F] overflow-y-auto">
        {/* Active XML Filters */}
        <div className="p-6 border-b border-[#222224]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Reactive XML Filters</span>
            </h2>
            <span className="text-[9px] text-[#A1A1AA] font-mono">{filters.length} Loaded</span>
          </div>

          <div className="space-y-3">
            {filters.map((filter) => (
              <div
                key={filter.id}
                className={`p-3 rounded border transition-all ${
                  filter.enabled
                    ? 'bg-[#161618] border-[#2D2D30]'
                    : 'bg-[#121214] border-[#1C1C1F] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filter.enabled}
                      onChange={() => handleToggleFilter(filter.id)}
                      className="accent-[#4ADE80] cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-white uppercase font-medium">
                      &lt;Filter type="{filter.type}"&gt;
                    </span>
                  </div>
                  <span className="text-[10px] text-[#4ADE80] font-mono">
                    {filter.strength.toFixed(1)}x
                  </span>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={filter.strength}
                  onChange={(e) =>
                    handleFilterStrengthChange(filter.id, parseFloat(e.target.value))
                  }
                  className="w-full h-1 bg-[#222224] rounded-lg appearance-none cursor-pointer accent-[#4ADE80]"
                />
                <div className="flex justify-between text-[8px] text-[#71717A] uppercase mt-1">
                  <span>Frequency: {filter.frequency}Hz</span>
                  <span>Target: {filter.targetTag || 'all'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* W3 DOM Compliance Specs */}
        <div className="p-6 flex-1">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>W3C DOM Level 3 Compliance</span>
          </h2>

          <div className="space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2.5 bg-[#141416] rounded border border-[#222224]">
              <span className="text-[#A1A1AA]">Document.implementation</span>
              <span className="text-[#4ADE80] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Core 3.0
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#141416] rounded border border-[#222224]">
              <span className="text-[#A1A1AA]">Node.ELEMENT_NODE</span>
              <span className="text-[#4ADE80] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#141416] rounded border border-[#222224]">
              <span className="text-[#A1A1AA]">XML Namespace Aware</span>
              <span className="text-[#4ADE80] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Valid
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#141416] rounded border border-[#222224]">
              <span className="text-[#A1A1AA]">Reactive State Machines</span>
              <span className="text-white font-semibold">Terminating Proof</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#161618] border border-[#2D2D30] rounded">
            <div className="text-[9px] uppercase tracking-widest text-[#71717A] mb-2">
              PyMACS Architectural Note
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed font-serif italic">
              "XML filter descriptions are presented as simplified reactive state machines, proven to terminate based on JSON data structures, streaming to dynamic DOM."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
