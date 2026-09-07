import React, { useState } from 'react';
import { Search, BookOpen, FileText, Code2, Globe, ArrowRight, ExternalLink } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  category: 'academic' | 'vfs' | 'kernel' | 'pml';
  snippet: string;
  source: string;
}

const SEARCH_INDEX: SearchResult[] = [
  {
    id: 'res_1',
    title: 'An Operating System in Python: PyMacs Architecture',
    category: 'academic',
    snippet: 'PyMacs evolves from the Cardculator into a browser OS with cloud, on-chain and API functionality. JSON=XML=DOM architectural equivalence with reactive Antigravity rendering.',
    source: 'pymacs.wordpress.com',
  },
  {
    id: 'res_2',
    title: 'Provable Markup Language (PML) Specification',
    category: 'pml',
    snippet: 'PML provides mathematical provability over DOM generation. AST transformations prove JSON-to-DOM equivalence under W3C Level-3 standards.',
    source: '/proofs/pml_schema.pml',
  },
  {
    id: 'res_3',
    title: 'Brother BSI Custom Hardware Dashboard',
    category: 'kernel',
    snippet: 'Custom DOM engine for Brother Multi-Function Copiers via Brother Solutions Interface (BSI v3). Computes soft-key interactions directly from XML filters.',
    source: '/dom/bsi_printer.xml',
  },
  {
    id: 'res_4',
    title: 'RavaTTT Robotic Process Automation (RPA)',
    category: 'kernel',
    snippet: 'Operator algebra semiring over live Virtual DOM mutations. Allows autonomous software agents to inspect, manipulate, and synchronize browser OS buffers.',
    source: '/apps/ravattt.py',
  },
  {
    id: 'res_5',
    title: 'Cardculator Microkernel Engine',
    category: 'vfs',
    snippet: 'Ultra-compact computable map evaluating Higher-Order Functions over live physical data streams with zero client-side latency.',
    source: '/apps/cardculator.py',
  },
];

export const SearchWindow: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(SEARCH_INDEX);
  const [filter, setFilter] = useState<string>('all');

  const handleSearch = (text: string) => {
    setQuery(text);
    const q = text.toLowerCase();
    const matched = SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
    );
    setResults(matched);
  };

  const filtered = filter === 'all'
    ? results
    : results.filter((r) => r.category === filter);

  return (
    <div className="flex flex-col h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* Search Input Bar */}
      <div className="p-3 bg-[#16161C] border-b border-[#26262E] space-y-2 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search PyMacs documentation, VFS files, PML proofs, and synopsis..."
            className="w-full bg-[#101014] text-gray-100 pl-9 pr-3 py-2 rounded border border-[#2D2D35] focus:outline-none focus:border-[#38BDF8] text-xs font-mono"
            autoFocus
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 pt-1">
          {['all', 'academic', 'pml', 'kernel', 'vfs'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider cursor-pointer ${
                filter === cat
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#1D1D24] text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-[10px] text-gray-500 ml-auto font-mono">
            {filtered.length} synopsis items found
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#131317] border border-[#24242C] hover:border-[#38BDF8]/40 p-3 rounded transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/20">
                {item.category}
              </span>
              <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                {item.source}
                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
            <h4 className="text-sm font-semibold text-gray-100 group-hover:text-[#60A5FA] transition-colors">
              {item.title}
            </h4>
            <p className="text-gray-400 text-[11px] mt-1 leading-relaxed">
              {item.snippet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
