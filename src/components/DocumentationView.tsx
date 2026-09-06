import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Tag,
  Clock,
  User,
  Copy,
  Check,
  FileCode,
  Layers,
  Sparkles,
  Bookmark,
  Share2,
  Cpu,
  Database,
  Terminal,
} from 'lucide-react';
import { DOCUMENTATION_ARTICLES, DocArticle } from '../data/documentation';

interface DocumentationViewProps {
  onOpenTab?: (tabName: any) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onOpenTab }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    DOCUMENTATION_ARTICLES[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Extract all unique categories
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    DOCUMENTATION_ARTICLES.forEach((art) => art.categories.forEach((cat) => set.add(cat)));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return DOCUMENTATION_ARTICLES.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All' || art.categories.includes(selectedCategory);

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const currentArticle = useMemo(() => {
    return (
      DOCUMENTATION_ARTICLES.find((a) => a.id === selectedArticleId) ||
      filteredArticles[0] ||
      DOCUMENTATION_ARTICLES[0]
    );
  }, [selectedArticleId, filteredArticles]);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#0A0A0B] text-[#D1D1D1]">
      {/* Left Sidebar: Articles List & Search */}
      <aside className="w-full md:w-80 lg:w-96 border-r border-[#222224] bg-[#0E0E10] flex flex-col flex-shrink-0 h-auto md:h-full overflow-hidden">
        {/* WordPress Blog Site Header Info */}
        <div className="p-4 border-b border-[#222224] bg-[#121215]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#4ADE80] font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              <span>PYMACS.WORDPRESS.COM</span>
            </span>
            <a
              href="https://pymacs.wordpress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#A1A1AA] hover:text-white flex items-center gap-1 font-mono transition-colors"
              title="Visit official WordPress blog"
            >
              <span>Visit Blog</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Documentation & Publications
          </h2>
          <p className="text-[11px] text-[#71717A] mt-0.5">
            Author: Dr. Bheemaiah Anil K • Microkernel & DOM Research
          </p>

          {/* Search Box */}
          <div className="mt-3 relative">
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research papers & docs..."
              className="w-full bg-[#18181B] border border-[#2D2D30] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71717A] outline-none focus:border-[#4ADE80] transition-colors"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-3 py-2 border-b border-[#222224] flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-[#0E0E10]">
          {allCategories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 font-medium'
                  : 'text-[#71717A] hover:text-[#D1D1D1] bg-[#161618]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Cards List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1A1A1D]">
          {filteredArticles.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#71717A]">
              No articles match "{searchQuery}"
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isSelected = article.id === currentArticle.id;
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticleId(article.id)}
                  className={`p-3.5 cursor-pointer transition-all border-l-2 ${
                    isSelected
                      ? 'bg-[#18181C] border-[#4ADE80] text-white'
                      : 'border-transparent hover:bg-[#141416] text-[#A1A1AA]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#71717A] mb-1">
                    <span className="text-[#4ADE80]">{article.readTime}</span>
                    <span>•</span>
                    <span>{article.categories[0]}</span>
                  </div>
                  <h3 className="text-xs font-medium leading-snug text-white line-clamp-2 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-[#71717A] line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Engine Jump Links */}
        <div className="p-3 border-t border-[#222224] bg-[#121215] flex items-center justify-between text-[11px]">
          <span className="text-[#71717A] text-[10px] uppercase font-mono">Live Modules:</span>
          <div className="flex items-center gap-1.5">
            {onOpenTab && (
              <>
                <button
                  onClick={() => onOpenTab('playground')}
                  className="px-2 py-0.5 bg-[#4ADE80]/20 hover:bg-[#4ADE80]/30 text-[#4ADE80] border border-[#4ADE80]/30 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Open Transpiler Playground"
                >
                  Playground
                </button>
                <button
                  onClick={() => onOpenTab('viewport')}
                  className="px-2 py-0.5 bg-[#1C1C20] hover:bg-[#28282E] text-white rounded text-[10px] transition-colors cursor-pointer"
                  title="Open Antigravity Viewport"
                >
                  Viewport
                </button>
                <button
                  onClick={() => onOpenTab('w3parser')}
                  className="px-2 py-0.5 bg-[#1C1C20] hover:bg-[#28282E] text-white rounded text-[10px] transition-colors"
                  title="Open W3 XML Parser"
                >
                  W3 XML
                </button>
                <button
                  onClick={() => onOpenTab('compiler')}
                  className="px-2 py-0.5 bg-[#1C1C20] hover:bg-[#28282E] text-white rounded text-[10px] transition-colors"
                  title="Open JS Compiler"
                >
                  Compiler
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Right Column: Article Reader styled like PyMACS WordPress Blog */}
      <main className="flex-1 h-full overflow-y-auto bg-[#0A0A0B] p-6 lg:p-10 max-w-5xl mx-auto flex flex-col">
        {/* WordPress Article Breadcrumb & Byline */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#222224] pb-4">
          <div className="flex items-center gap-2 text-xs text-[#71717A] font-mono">
            <span className="text-[#4ADE80] font-semibold">pymacs.wordpress.com</span>
            <span>/</span>
            <span>Research Publications</span>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">
              {currentArticle.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://pymacs.wordpress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1E] hover:bg-[#26262B] border border-[#2D2D30] text-[#D1D1D1] hover:text-white rounded-md text-xs font-mono transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-[#4ADE80]" />
              <span>Read on WordPress</span>
            </a>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {currentArticle.categories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#141416] border border-[#2A2A2E] text-[#A1A1AA] rounded"
              >
                #{cat}
              </span>
            ))}
          </div>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-tight mb-3"
            style={{ fontFamily: "'Lora', 'Georgia', serif" }}
          >
            {currentArticle.title}
          </h1>

          <p className="text-sm sm:text-base text-[#A1A1AA] font-light leading-relaxed mb-4">
            {currentArticle.subtitle}
          </p>

          {/* Byline and Date */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#71717A] pt-3 border-t border-[#1C1C20]">
            <div className="flex items-center gap-1.5 text-[#D1D1D1]">
              <User className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span className="font-medium">{currentArticle.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentArticle.readTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#71717A]">
              <span>Published in {currentArticle.date}</span>
            </div>
          </div>
        </header>

        {/* Article Executive Summary Box */}
        <div className="mb-8 p-4 bg-[#141418] border-l-4 border-[#4ADE80] rounded-r-lg">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#4ADE80] font-bold block mb-1">
            EXECUTIVE ABSTRACT
          </span>
          <p className="text-xs sm:text-sm text-[#D1D1D1] leading-relaxed">
            {currentArticle.summary}
          </p>
        </div>

        {/* Body Content */}
        <article className="space-y-4 text-sm sm:text-base text-[#D1D1D1] leading-relaxed font-sans mb-10">
          {currentArticle.content.map((paragraph, idx) => (
            <p key={idx} className="leading-7">
              {paragraph}
            </p>
          ))}
        </article>

        {/* PlantUML Diagram View (if present) */}
        {currentArticle.diagramPlantUML && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                <FileCode className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>PlantUML Architecture Model (PML)</span>
              </div>
              <span className="text-[10px] font-mono text-[#71717A]">PML Specification v2.4</span>
            </div>
            <div className="bg-[#121215] border border-[#2D2D30] rounded-lg p-4 font-mono text-xs text-[#4ADE80] overflow-x-auto leading-relaxed shadow-inner">
              <pre>{currentArticle.diagramPlantUML}</pre>
            </div>
          </section>
        )}

        {/* Interactive Code Snippets */}
        {currentArticle.codeSnippets && currentArticle.codeSnippets.length > 0 && (
          <section className="space-y-6 mb-12">
            {currentArticle.codeSnippets.map((snippet, idx) => (
              <div key={idx} className="border border-[#2D2D30] rounded-lg overflow-hidden bg-[#121215]">
                <div className="px-4 py-2.5 bg-[#18181C] border-b border-[#242428] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="text-xs font-mono font-medium text-white ml-2">
                      {snippet.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#71717A] bg-[#222226] px-2 py-0.5 rounded">
                      {snippet.language}
                    </span>
                    <button
                      onClick={() => handleCopyCode(snippet.code, idx)}
                      className="p-1 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                      title="Copy code"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <pre className="p-4 text-xs font-mono text-[#E4E4E7] overflow-x-auto leading-relaxed bg-[#0E0E10]">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </section>
        )}

        {/* Article Footer & Citations */}
        <footer className="mt-auto pt-6 border-t border-[#222224] text-xs text-[#71717A] font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Official Research:</span>
            <a
              href="https://pymacs.wordpress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4ADE80] hover:underline"
            >
              https://pymacs.wordpress.com
            </a>
          </div>
          <div>
            <span>Published by Dr. Bheemaiah Anil K &copy; 2024</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
