import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  FileCode,
  Layers,
  Database,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
  Save,
  Trash2,
  Download,
  Upload,
  Search,
  ExternalLink,
  Plus,
  RefreshCw,
  FolderOpen,
  Tag,
  Clock,
  ChevronRight,
  Maximize2,
  Sliders,
  Eye,
} from 'lucide-react';
import { VirtualDOMNode, XMLFilterDef } from '../types/dom';
import { transpileJSONToXML, transpileXMLToDOM } from '../engine/jsonTranspiler';
import { domToJSON, domToXML, flattenDOMTree } from '../engine/w3parser';
import { JsonDatabase, JsonDbRecord, DEFAULT_DATABASE_RECORDS } from '../engine/jsonDatabase';

interface TranspilerPlaygroundViewProps {
  currentRootNode: VirtualDOMNode;
  onUpdateRootNode: (newNode: VirtualDOMNode) => void;
  onMountToViewport?: () => void;
}

export const TranspilerPlaygroundView: React.FC<TranspilerPlaygroundViewProps> = ({
  currentRootNode,
  onUpdateRootNode,
  onMountToViewport,
}) => {
  // Step 1: JSON State
  const initialJSON = useMemo(() => {
    return JSON.stringify(domToJSON(currentRootNode), null, 2);
  }, []);

  const [jsonInput, setJsonInput] = useState<string>(initialJSON);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonValid, setJsonValid] = useState<boolean>(true);

  // Step 2 & 3: XML State
  const [xmlInput, setXmlInput] = useState<string>(() => domToXML(currentRootNode));
  const [xmlError, setXmlError] = useState<string | null>(null);
  const [xmlValid, setXmlValid] = useState<boolean>(true);

  // Step 4: Rendered DOM State
  const [renderedDOM, setRenderedDOM] = useState<VirtualDOMNode>(currentRootNode);
  const [activeFilters, setActiveFilters] = useState<XMLFilterDef[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [domViewMode, setDomViewMode] = useState<'visual' | 'tree'>('visual');

  // Step 5: JSON Database State
  const [dbRecords, setDbRecords] = useState<JsonDbRecord[]>([]);
  const [dbSearch, setDbSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [docTitle, setDocTitle] = useState('My PyMACS Schema');
  const [docId, setDocId] = useState(`doc_${Date.now().toString(36)}`);
  const [docCollection, setDocCollection] = useState('schemas');
  const [docTags, setDocTags] = useState('PML, Transpiled, JSON-DB');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // View Layout Modes
  const [activeStepTab, setActiveStepTab] = useState<'pipeline' | 'json' | 'xml' | 'dom' | 'database'>('pipeline');

  // Load database records on mount
  useEffect(() => {
    refreshDatabase();
  }, []);

  const refreshDatabase = () => {
    const records = JsonDatabase.getAll();
    setDbRecords(records);
  };

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Validate JSON on change
  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    try {
      JSON.parse(val);
      setJsonValid(true);
      setJsonError(null);
    } catch (err: any) {
      setJsonValid(false);
      setJsonError(err.message);
    }
  };

  // Validate XML on change
  const handleXmlChange = (val: string) => {
    setXmlInput(val);
    try {
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(val, 'application/xml');
        const err = doc.getElementsByTagName('parsererror');
        if (err && err.length > 0) {
          setXmlValid(false);
          setXmlError('XML syntax error');
          return;
        }
      }
      setXmlValid(true);
      setXmlError(null);
    } catch (err: any) {
      setXmlValid(false);
      setXmlError(err.message);
    }
  };

  // 1 ➔ 2: Transpile JSON to XML
  const handleTranspileJSONToXML = () => {
    const res = transpileJSONToXML(jsonInput);
    if (res.success && res.xml) {
      setXmlInput(res.xml);
      setXmlValid(true);
      setXmlError(null);
      showNotification('Transpiled JSON to XML successfully!', 'success');
    } else {
      setJsonError(res.error || 'Transpilation failed');
      showNotification(res.error || 'JSON to XML transpilation failed', 'error');
    }
  };

  // 3 ➔ 4: Transpile XML to DOM
  const handleTranspileXMLToDOM = (syncToEngine = true) => {
    const res = transpileXMLToDOM(xmlInput);
    if (res.success && res.dom) {
      setRenderedDOM(res.dom);
      setActiveFilters(res.filters || []);
      if (syncToEngine) {
        onUpdateRootNode(res.dom);
      }
      showNotification('Transpiled XML & rendered to Live DOM!', 'success');
    } else {
      setXmlError(res.error || 'Transpile to DOM failed');
      showNotification(res.error || 'XML to DOM failed', 'error');
    }
  };

  // Run full pipeline: JSON ➔ XML ➔ DOM
  const handleRunFullPipeline = () => {
    const jsonRes = transpileJSONToXML(jsonInput);
    if (!jsonRes.success || !jsonRes.xml) {
      setJsonError(jsonRes.error || 'Invalid JSON');
      showNotification(jsonRes.error || 'Pipeline halted at JSON step', 'error');
      return;
    }
    setXmlInput(jsonRes.xml);

    const xmlRes = transpileXMLToDOM(jsonRes.xml);
    if (!xmlRes.success || !xmlRes.dom) {
      setXmlError(xmlRes.error || 'Invalid XML generated');
      showNotification(xmlRes.error || 'Pipeline halted at XML step', 'error');
      return;
    }
    setRenderedDOM(xmlRes.dom);
    setActiveFilters(xmlRes.filters || []);
    onUpdateRootNode(xmlRes.dom);
    showNotification('Full Pipeline Executed: JSON ➔ XML ➔ Live DOM rendered!', 'success');
  };

  // 5: Persist Live DOM to JSON Database
  const handlePersistToDatabase = () => {
    const currentJson = domToJSON(renderedDOM);
    const tagsArray = docTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    JsonDatabase.save({
      id: docId || `doc_${Date.now().toString(36)}`,
      title: docTitle || 'Untitled Schema',
      collection: docCollection || 'schemas',
      tags: tagsArray.length > 0 ? tagsArray : ['pml', 'dom'],
      data: currentJson,
      description: `Persisted from Transpiler Playground at ${new Date().toLocaleTimeString()}`,
    });

    refreshDatabase();
    setShowSaveModal(false);
    showNotification(`Persisted record "${docTitle}" to JSON Database!`, 'success');
  };

  // Load record from database into Playground
  const handleLoadRecord = (record: JsonDbRecord) => {
    const jsonStr = JSON.stringify(record.data, null, 2);
    setJsonInput(jsonStr);
    setJsonValid(true);
    setJsonError(null);
    setDocTitle(record.title);
    setDocId(record.id);
    setDocCollection(record.collection);
    setDocTags(record.tags.join(', '));

    // Auto transpile to XML and DOM
    const jsonRes = transpileJSONToXML(jsonStr);
    if (jsonRes.success && jsonRes.xml) {
      setXmlInput(jsonRes.xml);
      const xmlRes = transpileXMLToDOM(jsonRes.xml);
      if (xmlRes.success && xmlRes.dom) {
        setRenderedDOM(xmlRes.dom);
        setActiveFilters(xmlRes.filters || []);
        onUpdateRootNode(xmlRes.dom);
      }
    }

    showNotification(`Loaded "${record.title}" from JSON Database!`, 'info');
  };

  // Delete record from database
  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete record "${id}" from database?`)) {
      JsonDatabase.delete(id);
      refreshDatabase();
      showNotification(`Deleted record "${id}"`, 'info');
    }
  };

  // Format / Beautify JSON
  const handleFormatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setJsonValid(true);
      setJsonError(null);
      showNotification('JSON formatted', 'info');
    } catch (err: any) {
      setJsonError('Cannot format: ' + err.message);
    }
  };

  // Insert XML snippets
  const handleInsertXmlFilter = (type: string, strength: number) => {
    const snippet = `  <Filter type="${type}" strength="${strength}" target="all"/>\n`;
    if (xmlInput.includes('<DOM_SCHEMA')) {
      const updated = xmlInput.replace(/(<DOM_SCHEMA[^>]*>)/i, `$1\n${snippet}`);
      setXmlInput(updated);
    } else {
      setXmlInput(snippet + xmlInput);
    }
    showNotification(`Inserted PML <Filter type="${type}"/>`, 'info');
  };

  // Export full database as file
  const handleExportDatabaseFile = () => {
    const raw = JsonDatabase.exportJSON();
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pymacs_database_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported JSON Database backup file', 'success');
  };

  // Import database file
  const handleImportDatabaseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        const res = JsonDatabase.importJSON(content);
        if (res.success) {
          refreshDatabase();
          showNotification(`Imported ${res.count} records into JSON Database!`, 'success');
        } else {
          showNotification(`Import error: ${res.error}`, 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  // Database filtered records
  const filteredRecords = useMemo(() => {
    return JsonDatabase.query(dbSearch, selectedCollection);
  }, [dbRecords, dbSearch, selectedCollection]);

  // Flatten nodes for inspector count
  const allRenderedNodes = useMemo(() => {
    return flattenDOMTree(renderedDOM);
  }, [renderedDOM]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0B] text-[#D1D1D1] overflow-hidden select-none">
      {/* Top Banner: Workflow Stepper Header */}
      <div className="px-4 lg:px-6 py-2.5 bg-[#0F0F12] border-b border-[#222225] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        {/* Left: Workflow Steps */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs font-mono overflow-x-auto scrollbar-none py-1">
          {/* Step 1 */}
          <button
            onClick={() => setActiveStepTab('json')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeStepTab === 'json' || activeStepTab === 'pipeline'
                ? 'bg-[#1C1C20] text-white border border-[#2F2F35]'
                : 'text-[#71717A] hover:text-[#D1D1D1]'
            }`}
            title="Step 1: Enter & Validate JSON"
          >
            <span className="w-4 h-4 rounded-full bg-[#2A2A30] text-[10px] flex items-center justify-center font-bold text-[#4ADE80]">
              1
            </span>
            <span>Enter JSON</span>
            {jsonValid ? (
              <Check className="w-3 h-3 text-[#4ADE80]" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-400" />
            )}
          </button>

          <ArrowRight className="w-3 h-3 text-[#4ADE80]/60 hidden sm:block flex-shrink-0" />

          {/* Step 2 & 3 */}
          <button
            onClick={() => setActiveStepTab('xml')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeStepTab === 'xml' || activeStepTab === 'pipeline'
                ? 'bg-[#1C1C20] text-white border border-[#2F2F35]'
                : 'text-[#71717A] hover:text-[#D1D1D1]'
            }`}
            title="Step 2 & 3: Transpile & Edit XML"
          >
            <span className="w-4 h-4 rounded-full bg-[#2A2A30] text-[10px] flex items-center justify-center font-bold text-[#4ADE80]">
              2
            </span>
            <span>Edit XML</span>
            {xmlValid ? (
              <Check className="w-3 h-3 text-[#4ADE80]" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-400" />
            )}
          </button>

          <ArrowRight className="w-3 h-3 text-[#4ADE80]/60 hidden sm:block flex-shrink-0" />

          {/* Step 4 */}
          <button
            onClick={() => setActiveStepTab('dom')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeStepTab === 'dom' || activeStepTab === 'pipeline'
                ? 'bg-[#1C1C20] text-white border border-[#2F2F35]'
                : 'text-[#71717A] hover:text-[#D1D1D1]'
            }`}
            title="Step 4: Live Rendered DOM"
          >
            <span className="w-4 h-4 rounded-full bg-[#2A2A30] text-[10px] flex items-center justify-center font-bold text-[#4ADE80]">
              3
            </span>
            <span>Render DOM</span>
            <span className="text-[10px] text-[#A1A1AA]">({allRenderedNodes.length})</span>
          </button>

          <ArrowRight className="w-3 h-3 text-[#4ADE80]/60 hidden sm:block flex-shrink-0" />

          {/* Step 5 */}
          <button
            onClick={() => setActiveStepTab('database')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeStepTab === 'database'
                ? 'bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 font-medium'
                : 'text-[#71717A] hover:text-[#D1D1D1]'
            }`}
            title="Step 5: Persist to JSON Database"
          >
            <span className="w-4 h-4 rounded-full bg-[#2A2A30] text-[10px] flex items-center justify-center font-bold text-[#4ADE80]">
              4
            </span>
            <span>JSON Database</span>
            <span className="px-1.5 py-0.2 bg-[#202025] rounded text-[9px] text-[#A1A1AA]">
              {dbRecords.length}
            </span>
          </button>
        </div>

        {/* Right: Master Pipeline Action & View Toggle */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center bg-[#16161A] border border-[#29292F] rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setActiveStepTab('pipeline')}
              className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
                activeStepTab === 'pipeline' ? 'bg-[#2D2D35] text-white' : 'text-[#71717A] hover:text-[#D1D1D1]'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveStepTab('database')}
              className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                activeStepTab === 'database' ? 'bg-[#2D2D35] text-white' : 'text-[#71717A] hover:text-[#D1D1D1]'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>Database</span>
            </button>
          </div>

          {/* Execute Full Pipeline Button */}
          <button
            onClick={handleRunFullPipeline}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ADE80] hover:bg-[#3ec470] text-black font-semibold rounded text-xs transition-all active:scale-95 shadow-[0_0_12px_rgba(74,222,128,0.25)] cursor-pointer"
            title="Execute pipeline: Transpile JSON to XML, render to live DOM, and update state"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">Transpile & Render All</span>
            <span className="sm:hidden">Run</span>
          </button>

          {/* Save to DB Button */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E24] hover:bg-[#282830] border border-[#32323A] text-white rounded text-xs transition-all active:scale-95 cursor-pointer"
            title="Persist live DOM to JSON Database"
          >
            <Save className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="hidden sm:inline">Persist to DB</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div
          className={`px-4 py-1.5 text-xs font-mono flex items-center justify-between transition-all ${
            statusMessage.type === 'error'
              ? 'bg-red-500/15 border-b border-red-500/30 text-red-300'
              : statusMessage.type === 'info'
              ? 'bg-blue-500/15 border-b border-blue-500/30 text-blue-300'
              : 'bg-[#4ADE80]/15 border-b border-[#4ADE80]/30 text-[#4ADE80]'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{statusMessage.text}</span>
          </span>
          <button onClick={() => setStatusMessage(null)} className="text-[10px] underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* ======================= PIPELINE SPLIT VIEW ======================= */}
        {(activeStepTab === 'pipeline' || activeStepTab === 'json' || activeStepTab === 'xml' || activeStepTab === 'dom') && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#222226] h-full overflow-hidden">
            {/* PANE 1: JSON INPUT & EDITOR */}
            {(activeStepTab === 'pipeline' || activeStepTab === 'json') && (
              <div className="flex flex-col h-full bg-[#0D0D10] overflow-hidden">
                {/* Pane Header */}
                <div className="px-3.5 py-2 bg-[#121216] border-b border-[#222226] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                    <span className="font-semibold text-white">Step 1: Enter JSON</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleFormatJSON}
                      className="px-2 py-0.5 bg-[#1C1C22] hover:bg-[#282830] text-[#D1D1D1] rounded text-[10px] transition-colors cursor-pointer"
                      title="Format & Prettify JSON"
                    >
                      Prettify
                    </button>
                    <button
                      onClick={handleTranspileJSONToXML}
                      className="px-2.5 py-0.5 bg-[#4ADE80]/20 hover:bg-[#4ADE80]/30 text-[#4ADE80] border border-[#4ADE80]/40 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Transpile JSON to XML"
                    >
                      <span>Transpile XML</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-bar: JSON Status & Byte count */}
                <div className="px-3 py-1 bg-[#101013] border-b border-[#1A1A1E] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                  <span className="flex items-center gap-1.5">
                    {jsonValid ? (
                      <span className="text-[#4ADE80] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Valid JSON
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Syntax Error
                      </span>
                    )}
                  </span>
                  <span>{new Blob([jsonInput]).size} bytes</span>
                </div>

                {/* JSON Editor Textarea */}
                <div className="flex-1 p-3 overflow-hidden relative">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    className="w-full h-full bg-[#08080A] text-[#E4E4E7] font-mono text-xs leading-relaxed p-3 rounded border border-[#202026] outline-none focus:border-[#4ADE80] resize-none overflow-y-auto selection:bg-[#4ADE80]/30"
                    spellCheck={false}
                    placeholder="Enter JSON structure (PML document or arbitrary object)..."
                  />
                </div>

                {/* JSON Error Display (if any) */}
                {jsonError && (
                  <div className="p-2 bg-red-500/10 border-t border-red-500/30 text-red-300 text-[11px] font-mono">
                    {jsonError}
                  </div>
                )}
              </div>
            )}

            {/* PANE 2: XML EDITOR & TRANSPILER */}
            {(activeStepTab === 'pipeline' || activeStepTab === 'xml') && (
              <div className="flex flex-col h-full bg-[#0D0D10] overflow-hidden">
                {/* Pane Header */}
                <div className="px-3.5 py-2 bg-[#121216] border-b border-[#222226] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-[#60A5FA]" />
                    <span className="font-semibold text-white">Step 2: Edit XML (PML)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTranspileXMLToDOM(true)}
                      className="px-2.5 py-0.5 bg-[#60A5FA]/20 hover:bg-[#60A5FA]/30 text-[#60A5FA] border border-[#60A5FA]/40 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Transpile XML to Live DOM"
                    >
                      <span>Render DOM</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-bar: Snippet Quick Inserts */}
                <div className="px-3 py-1 bg-[#101013] border-b border-[#1A1A1E] flex items-center gap-2 overflow-x-auto scrollbar-none text-[10px] font-mono text-[#71717A]">
                  <span>Insert PML:</span>
                  <button
                    onClick={() => handleInsertXmlFilter('gaussian', 2.0)}
                    className="px-1.5 py-0.5 bg-[#1C1C22] hover:bg-[#282830] text-[#A1A1AA] hover:text-white rounded cursor-pointer transition-colors"
                  >
                    + Gaussian
                  </button>
                  <button
                    onClick={() => handleInsertXmlFilter('magnetic', 1.5)}
                    className="px-1.5 py-0.5 bg-[#1C1C22] hover:bg-[#282830] text-[#A1A1AA] hover:text-white rounded cursor-pointer transition-colors"
                  >
                    + Magnetic
                  </button>
                  <button
                    onClick={() => handleInsertXmlFilter('chromatic', 0.8)}
                    className="px-1.5 py-0.5 bg-[#1C1C22] hover:bg-[#282830] text-[#A1A1AA] hover:text-white rounded cursor-pointer transition-colors"
                  >
                    + Chromatic
                  </button>
                </div>

                {/* XML Editor Textarea */}
                <div className="flex-1 p-3 overflow-hidden relative">
                  <textarea
                    value={xmlInput}
                    onChange={(e) => handleXmlChange(e.target.value)}
                    className="w-full h-full bg-[#08080A] text-[#93C5FD] font-mono text-xs leading-relaxed p-3 rounded border border-[#202026] outline-none focus:border-[#60A5FA] resize-none overflow-y-auto selection:bg-[#60A5FA]/30"
                    spellCheck={false}
                    placeholder="XML markup (PML format with <DOM_SCHEMA> or <Filter> tags)..."
                  />
                </div>

                {/* XML Error Display (if any) */}
                {xmlError && (
                  <div className="p-2 bg-red-500/10 border-t border-red-500/30 text-red-300 text-[11px] font-mono">
                    {xmlError}
                  </div>
                )}
              </div>
            )}

            {/* PANE 3: LIVE RENDERED DOM & INSPECTOR */}
            {(activeStepTab === 'pipeline' || activeStepTab === 'dom') && (
              <div className="flex flex-col h-full bg-[#0E0E12] overflow-hidden">
                {/* Pane Header */}
                <div className="px-3.5 py-2 bg-[#121216] border-b border-[#222226] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="font-semibold text-white">Step 3: Rendered DOM</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDomViewMode('visual')}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                        domViewMode === 'visual'
                          ? 'bg-[#282832] text-white font-medium'
                          : 'text-[#71717A] hover:text-[#D1D1D1]'
                      }`}
                    >
                      Visual UI
                    </button>
                    <button
                      onClick={() => setDomViewMode('tree')}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                        domViewMode === 'tree'
                          ? 'bg-[#282832] text-white font-medium'
                          : 'text-[#71717A] hover:text-[#D1D1D1]'
                      }`}
                    >
                      Tree Inspector
                    </button>
                  </div>
                </div>

                {/* Telemetry Bar */}
                <div className="px-3 py-1 bg-[#101013] border-b border-[#1A1A1E] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                  <span>Elements: {allRenderedNodes.length}</span>
                  <span>Filters: {activeFilters.length}</span>
                  {onMountToViewport && (
                    <button
                      onClick={() => {
                        onUpdateRootNode(renderedDOM);
                        onMountToViewport();
                      }}
                      className="text-[#4ADE80] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Mount directly to 60 FPS Antigravity Viewport"
                    >
                      <span>Open in Viewport</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                {/* Rendered Content Area */}
                <div className="flex-1 p-3 overflow-y-auto">
                  {domViewMode === 'visual' ? (
                    /* Visual Card Representation */
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-lg bg-[#141418] border border-[#26262E] shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ADE80] font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                            {renderedDOM.tagName}
                          </span>
                          <span className="text-[10px] font-mono text-[#71717A]">
                            id: {renderedDOM.id}
                          </span>
                        </div>

                        {renderedDOM.textContent && (
                          <h4 className="text-sm font-medium text-white mb-2">
                            {renderedDOM.textContent}
                          </h4>
                        )}

                        {/* Node Attributes Chip Grid */}
                        {Object.keys(renderedDOM.attributes).length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {Object.entries(renderedDOM.attributes).map(([k, v]) => (
                              <span
                                key={k}
                                className="text-[9px] font-mono px-1.5 py-0.5 bg-[#1C1C22] border border-[#292930] text-[#A1A1AA] rounded"
                              >
                                {k}: <strong className="text-[#E4E4E7]">{v}</strong>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Physics Specs */}
                        <div className="pt-2 border-t border-[#1F1F24] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                          <span>
                            Mass: <span className="text-white">{renderedDOM.physics.mass}kg</span>
                          </span>
                          <span>
                            Charge: <span className="text-white">{renderedDOM.physics.charge}C</span>
                          </span>
                          <span>
                            Pos: ({Math.round(renderedDOM.physics.x)}, {Math.round(renderedDOM.physics.y)})
                          </span>
                        </div>
                      </div>

                      {/* Render Child Nodes */}
                      {renderedDOM.children.length > 0 && (
                        <div className="space-y-2 pl-3 border-l-2 border-[#26262E]">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
                            Child Elements ({renderedDOM.children.length}):
                          </span>
                          {renderedDOM.children.map((child) => (
                            <div
                              key={child.id}
                              onClick={() => setSelectedNodeId(child.id)}
                              className={`p-2.5 rounded bg-[#121216] border transition-all cursor-pointer ${
                                selectedNodeId === child.id
                                  ? 'border-[#4ADE80] bg-[#17171D]'
                                  : 'border-[#222228] hover:border-[#33333C]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-mono text-[#60A5FA] font-medium">
                                  &lt;{child.tagName}&gt;
                                </span>
                                <span className="text-[9px] font-mono text-[#71717A]">
                                  {child.id}
                                </span>
                              </div>
                              {child.textContent && (
                                <p className="text-xs text-[#D1D1D1] mb-1.5">
                                  {child.textContent}
                                </p>
                              )}
                              {Object.keys(child.attributes).length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(child.attributes).map(([k, v]) => (
                                    <span
                                      key={k}
                                      className="text-[9px] font-mono px-1 py-0.2 bg-[#1A1A20] text-[#A1A1AA] rounded"
                                    >
                                      {k}={v}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Interactive Tree View */
                    <div className="font-mono text-xs space-y-1">
                      <DOMTreeNodeView node={renderedDOM} depth={0} />
                    </div>
                  )}
                </div>

                {/* Bottom Action: Persist Button */}
                <div className="p-3 bg-[#121216] border-t border-[#222226] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#71717A]">
                    Step 4: Persist as JSON
                  </span>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#4ADE80]/20 hover:bg-[#4ADE80]/30 text-[#4ADE80] border border-[#4ADE80]/40 rounded text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to JSON DB</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= DATABASE EXPLORER VIEW ======================= */}
        {activeStepTab === 'database' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#0A0A0B]">
            {/* Database Left Sidebar: Collections & Controls */}
            <div className="w-full md:w-64 border-r border-[#222226] bg-[#0E0E12] p-4 flex flex-col flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>PyMACS Document DB</span>
                </span>
                <span className="text-[10px] font-mono text-[#71717A]">
                  {dbRecords.length} records
                </span>
              </div>

              {/* Collections Navigation */}
              <div className="space-y-1 mb-6">
                {['All', 'schemas', 'dashboards', 'telemetry', 'automation', 'imported'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono capitalize transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCollection === col
                        ? 'bg-[#1E1E24] text-[#4ADE80] font-semibold border border-[#2D2D35]'
                        : 'text-[#71717A] hover:text-[#D1D1D1]'
                    }`}
                  >
                    <span>{col}</span>
                    <span className="text-[10px] text-[#555]">
                      {col === 'All'
                        ? dbRecords.length
                        : dbRecords.filter((r) => r.collection === col).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Database File Actions */}
              <div className="mt-auto space-y-2 pt-4 border-t border-[#1C1C20] text-xs font-mono">
                <button
                  onClick={handleExportDatabaseFile}
                  className="w-full py-1.5 px-2.5 bg-[#18181E] hover:bg-[#22222A] text-[#D1D1D1] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#292930]"
                >
                  <Download className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Backup DB (.json)</span>
                </button>

                <label className="w-full py-1.5 px-2.5 bg-[#18181E] hover:bg-[#22222A] text-[#D1D1D1] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#292930]">
                  <Upload className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>Restore Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportDatabaseFile}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => {
                    if (confirm('Reset JSON Database to initial PyMACS records?')) {
                      JsonDatabase.resetToDefaults();
                      refreshDatabase();
                      showNotification('Database reset to defaults', 'info');
                    }
                  }}
                  className="w-full py-1 text-[10px] text-[#71717A] hover:text-red-400 text-center transition-colors cursor-pointer"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>

            {/* Database Main Content: Search & Records List */}
            <div className="flex-1 flex flex-col h-full bg-[#0B0B0E] p-4 lg:p-6 overflow-hidden">
              {/* Search Bar */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                    placeholder="Search documents by title, ID, or tag..."
                    className="w-full bg-[#121216] border border-[#24242A] rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#71717A] outline-none focus:border-[#4ADE80] transition-colors"
                  />
                </div>

                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ADE80] hover:bg-[#3ec470] text-black font-semibold rounded text-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Document</span>
                </button>
              </div>

              {/* Records Grid */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
                {filteredRecords.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-xs text-[#71717A] font-mono">
                    No documents found in collection "{selectedCollection}".
                  </div>
                ) : (
                  filteredRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-lg bg-[#121216] border border-[#202026] hover:border-[#30303A] flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                          <span className="px-1.5 py-0.2 bg-[#1C1C22] text-[#4ADE80] rounded uppercase tracking-wider">
                            {rec.collection}
                          </span>
                          <span className="text-[#71717A]">v{rec.version} • {rec.sizeBytes} B</span>
                        </div>

                        <h4 className="text-sm font-medium text-white mb-1 line-clamp-1">
                          {rec.title}
                        </h4>

                        <p className="text-xs text-[#71717A] font-mono mb-3 line-clamp-2">
                          {rec.description || `ID: ${rec.id}`}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {rec.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-mono px-1.5 py-0.2 bg-[#18181E] text-[#A1A1AA] rounded"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-[#1C1C20] flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-[#555]">
                          {new Date(rec.updatedAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteRecord(rec.id, e)}
                            className="p-1 text-[#71717A] hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              handleLoadRecord(rec);
                              setActiveStepTab('pipeline');
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-[#1E1E24] hover:bg-[#2B2B33] text-white rounded text-xs font-mono transition-colors cursor-pointer"
                          >
                            <span>Load to Playground</span>
                            <ArrowRight className="w-3 h-3 text-[#4ADE80]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save to JSON Database Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121216] border border-[#2B2B33] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4ADE80]" />
                <span>Persist DOM to JSON Database</span>
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-[#71717A] hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-[#18181F] border border-[#2A2A33] rounded px-3 py-1.5 text-white outline-none focus:border-[#4ADE80]"
                  placeholder="e.g. Printer Dashboard Schema"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                    Document ID
                  </label>
                  <input
                    type="text"
                    value={docId}
                    onChange={(e) => setDocId(e.target.value)}
                    className="w-full bg-[#18181F] border border-[#2A2A33] rounded px-3 py-1.5 text-white font-mono outline-none focus:border-[#4ADE80]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                    Collection
                  </label>
                  <select
                    value={docCollection}
                    onChange={(e) => setDocCollection(e.target.value)}
                    className="w-full bg-[#18181F] border border-[#2A2A33] rounded px-3 py-1.5 text-white outline-none focus:border-[#4ADE80]"
                  >
                    <option value="schemas">schemas</option>
                    <option value="dashboards">dashboards</option>
                    <option value="telemetry">telemetry</option>
                    <option value="automation">automation</option>
                    <option value="custom">custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={docTags}
                  onChange={(e) => setDocTags(e.target.value)}
                  className="w-full bg-[#18181F] border border-[#2A2A33] rounded px-3 py-1.5 text-white outline-none focus:border-[#4ADE80]"
                  placeholder="PML, BSI, DOM, React"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#222228] flex items-center justify-end gap-2 text-xs font-mono">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-3 py-1.5 bg-[#1A1A20] hover:bg-[#25252C] text-[#A1A1AA] rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePersistToDatabase}
                className="px-4 py-1.5 bg-[#4ADE80] hover:bg-[#3ec470] text-black font-semibold rounded cursor-pointer transition-all"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Recursive DOM Tree Node Component
 */
const DOMTreeNodeView: React.FC<{ node: VirtualDOMNode; depth: number }> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="leading-tight">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-[#16161D] cursor-pointer"
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        {hasChildren ? (
          <span className="text-[10px] text-[#71717A]">{expanded ? '▼' : '▶'}</span>
        ) : (
          <span className="w-2.5" />
        )}
        <span className="text-[#60A5FA]">&lt;{node.tagName}</span>
        {node.id && <span className="text-[#F59E0B] text-[10px]">id="{node.id}"</span>}
        {Object.keys(node.attributes).length > 0 && (
          <span className="text-[#A1A1AA] text-[10px]">
            {Object.keys(node.attributes).length} attrs
          </span>
        )}
        <span className="text-[#60A5FA]">&gt;</span>
        {node.textContent && (
          <span className="text-[#D1D1D1] text-[11px] truncate max-w-xs">
            "{node.textContent}"
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <DOMTreeNodeView key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
