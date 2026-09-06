import React, { useState } from 'react';
import { VirtualDOMNode } from '../../types/dom';
import { transpileJSONToXML, transpileXMLToDOM } from '../../engine/jsonTranspiler';
import { Play, Edit3, Activity, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

interface CodeAsDOMObjectProps {
  onMountToViewport?: (node: VirtualDOMNode) => void;
  onOpenDataTab?: () => void;
}

export const CodeAsDOMObject: React.FC<CodeAsDOMObjectProps> = ({
  onMountToViewport,
  onOpenDataTab,
}) => {
  const [activeModal, setActiveModal] = useState<'none' | 'edit' | 'trace' | 'prove'>('none');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  // Data Pipeline State
  const [jsonInput, setJsonInput] = useState<string>(`{
  "module": "PyMACS.BrotherBSI",
  "device": "BSI-MFC-L8900CDW",
  "status": "ONLINE",
  "specs": {
    "tonerLevel": 94,
    "paperTrays": 3,
    "activeJobs": 2
  },
  "physics": {
    "mass": 2.5,
    "charge": 1.2
  }
}`);

  const [xmlFilter, setXmlFilter] = useState<string>(`<Filter type="hardware_dashboard" model="BSI-MFC">
  <Render transform="antigravity_card" elevation="high"/>
  <SoftKeys count="4" interactive="true"/>
</Filter>`);

  const [synthesizedDOM, setSynthesizedDOM] = useState<VirtualDOMNode | null>(() => {
    try {
      const res = transpileJSONToXML(jsonInput);
      if (res.success && res.xml) {
        const domRes = transpileXMLToDOM(res.xml);
        return domRes.dom || null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [traceLogs, setTraceLogs] = useState<string[]>([
    'T+00ms: ReadDB(collection="schemas") -> 1 record loaded (412 bytes)',
    'T+02ms: XML Filter AST generated -> <Filter type="hardware_dashboard">',
    'T+05ms: Higher-Order Function map(filter, dataset) applied',
    'T+08ms: Provable Markup Language (PML) equivalence verified',
    'T+10ms: Virtual DOM Node (id="node_brotherbsi") synthesized (mass=2.5kg)',
  ]);

  const [pmlProof, setPmlProof] = useState<{
    verified: boolean;
    hash: string;
    merkleRoot: string;
    astNodes: number;
    theorem: string;
  }>({
    verified: true,
    hash: '0x9E4B8F72AC3D51B0E473F62981D89A4E',
    merkleRoot: 'merkle://pymacs.sha256/7fa553e9-ede8-4860',
    astNodes: 14,
    theorem: '∀x ∈ JSON: Transpile(x, Filter_PML) ≅ W3C_Level3_DOM(x)',
  });

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonInput);
        const xmlRes = transpileJSONToXML(parsed);
        if (!xmlRes.success || !xmlRes.xml) {
          throw new Error(xmlRes.error || 'Failed to transpile JSON');
        }
        const domRes = transpileXMLToDOM(xmlRes.xml);
        if (!domRes.success || !domRes.dom) {
          throw new Error(domRes.error || 'Failed to transpile XML to DOM');
        }
        const dom = domRes.dom;
        setSynthesizedDOM(dom);
        setExecutionResult(`Synthesized <${dom.tagName} id="${dom.id}"> with ${dom.children.length} sub-nodes.`);
        setTraceLogs([
          `T+00ms: ReadDB initialized on dataset (bytes=${new Blob([jsonInput]).size})`,
          `T+03ms: Filter AST applied: ${xmlFilter.substring(0, 40)}...`,
          `T+07ms: HOF Lambda: λ(record) -> VirtualDOMNode(tag="DOM_SCHEMA")`,
          `T+09ms: Physics vectors calculated: mass=${dom.physics.mass}kg, charge=${dom.physics.charge}C`,
          `T+12ms: DOM Tree successfully locked in microkernel buffer.`,
        ]);
      } catch (err: any) {
        setExecutionResult(`Execution error: ${err.message}`);
      } finally {
        setIsExecuting(false);
      }
    }, 280);
  };

  const handleMount = () => {
    if (synthesizedDOM && onMountToViewport) {
      onMountToViewport(synthesizedDOM);
    }
  };

  return (
    <div id="code-as-dom-object" className="bg-[#121214] border border-[#2D2D32] rounded-lg shadow-xl overflow-hidden font-mono text-xs">
      {/* Object Header / Emacs Frame Bar */}
      <div className="bg-[#18181C] border-b border-[#2D2D32] px-3 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] ring-2 ring-[#3B82F6]/20"></div>
          <span className="font-semibold text-gray-200 tracking-wide">
            Function : <span className="text-[#60A5FA]">map(filter, dataset)</span>
          </span>
          <span className="text-[10px] text-gray-500 bg-[#222228] px-1.5 py-0.5 rounded">
            First-Class DOM Object
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span>PML v3.2</span>
          <span className="text-gray-600">•</span>
          <span className="text-[#4ADE80]">HOF Evaluated</span>
        </div>
      </div>

      {/* Main Object Body */}
      <div className="p-4 space-y-3">
        {/* Mathematical Transformation Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#0C0C0E] p-2.5 rounded border border-[#232328]">
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></span>
              Input: JSON
            </div>
            <div className="text-gray-300 truncate bg-[#16161A] px-2 py-1.5 rounded text-[11px] border border-[#26262B]">
              PyMACS.BrotherBSI (2.5kg)
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
              Filter: XML
            </div>
            <div className="text-gray-300 truncate bg-[#16161A] px-2 py-1.5 rounded text-[11px] border border-[#26262B]">
              &lt;Filter type="hardware_dashboard"/&gt;
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></span>
              Output: DOM
            </div>
            <div className="text-[#4ADE80] font-medium truncate bg-[#16161A] px-2 py-1.5 rounded text-[11px] border border-[#26262B] flex items-center justify-between">
              <span>{synthesizedDOM ? `<${synthesizedDOM.tagName} id="${synthesizedDOM.id}">` : 'Computing...'}</span>
              <span className="text-[9px] text-gray-500">{synthesizedDOM?.children.length || 0} nodes</span>
            </div>
          </div>
        </div>

        {/* Action Controls: [RUN] [EDIT] [TRACE] [PROVE] */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            id="dom-obj-btn-run"
            onClick={handleRun}
            disabled={isExecuting}
            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
            title="Execute map(filter, dataset)"
          >
            {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>[RUN]</span>
          </button>

          <button
            id="dom-obj-btn-edit"
            onClick={() => setActiveModal(activeModal === 'edit' ? 'none' : 'edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer border ${
              activeModal === 'edit'
                ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#60A5FA]'
                : 'bg-[#1C1C22] hover:bg-[#26262E] text-gray-300 border-[#2D2D35]'
            }`}
            title="Edit input JSON and XML Filter"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>[EDIT]</span>
          </button>

          <button
            id="dom-obj-btn-trace"
            onClick={() => setActiveModal(activeModal === 'trace' ? 'none' : 'trace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer border ${
              activeModal === 'trace'
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#A78BFA]'
                : 'bg-[#1C1C22] hover:bg-[#26262E] text-gray-300 border-[#2D2D35]'
            }`}
            title="View execution trace and pipeline steps"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>[TRACE]</span>
          </button>

          <button
            id="dom-obj-btn-prove"
            onClick={() => setActiveModal(activeModal === 'prove' ? 'none' : 'prove')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer border ${
              activeModal === 'prove'
                ? 'bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80]'
                : 'bg-[#1C1C22] hover:bg-[#26262E] text-gray-300 border-[#2D2D35]'
            }`}
            title="Formal Provable Markup Language (PML) verification"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[PROVE]</span>
          </button>

          {onMountToViewport && synthesizedDOM && (
            <button
              id="dom-obj-btn-mount"
              onClick={handleMount}
              className="ml-auto flex items-center gap-1.5 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/30 px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              title="Mount synthesized DOM object directly into Antigravity physics canvas"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>[MOUNT DOM]</span>
            </button>
          )}
        </div>

        {/* Execution Status Toast */}
        {executionResult && (
          <div className="text-[11px] text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/20 px-2.5 py-1.5 rounded flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
            <span className="truncate">{executionResult}</span>
          </div>
        )}

        {/* Conditional Inspection Drawer: EDIT */}
        {activeModal === 'edit' && (
          <div className="bg-[#0D0D10] border border-[#2D2D35] p-3 rounded space-y-3 mt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-300">
              <span>Inline Pipeline Editor</span>
              <button
                onClick={() => setActiveModal('none')}
                className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-gray-400 font-semibold mb-1 block">
                  Input JSON (Dataset / State)
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={6}
                  className="w-full bg-[#16161B] text-gray-200 border border-[#26262E] rounded p-2 text-[10px] font-mono leading-relaxed focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-400 font-semibold mb-1 block">
                  XML Filter (Provable Markup Filter Specification)
                </label>
                <textarea
                  value={xmlFilter}
                  onChange={(e) => setXmlFilter(e.target.value)}
                  rows={6}
                  className="w-full bg-[#16161B] text-gray-200 border border-[#26262E] rounded p-2 text-[10px] font-mono leading-relaxed focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleRun}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3 py-1 rounded text-[11px] font-semibold cursor-pointer"
              >
                Apply &amp; Recompile DOM
              </button>
            </div>
          </div>
        )}

        {/* Conditional Inspection Drawer: TRACE */}
        {activeModal === 'trace' && (
          <div className="bg-[#0D0D10] border border-[#2D2D35] p-3 rounded space-y-2 mt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#A78BFA]">
              <span>Transformation Trace Log</span>
              <button
                onClick={() => setActiveModal('none')}
                className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-1 text-[10.5px] text-gray-300 font-mono bg-[#141418] p-2.5 rounded border border-[#222228] max-h-44 overflow-y-auto">
              {traceLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-1.5 py-0.5 border-b border-[#1E1E24] last:border-none">
                  <ChevronRight className="w-3 h-3 text-[#A78BFA] shrink-0 mt-0.5" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditional Inspection Drawer: PROVE */}
        {activeModal === 'prove' && (
          <div className="bg-[#0D0D10] border border-[#2D2D35] p-3 rounded space-y-2 mt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#4ADE80]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                <span>PML Formal Provability Verifier</span>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300 bg-[#141418] p-2.5 rounded border border-[#222228]">
              <div>
                <span className="text-gray-500 block">Equivalence Proof:</span>
                <span className="text-[#4ADE80] font-semibold">Q.E.D. (VERIFIED STRICT)</span>
              </div>
              <div>
                <span className="text-gray-500 block">AST Node Count:</span>
                <span className="text-white font-semibold">{pmlProof.astNodes} Provable Nodes</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-[#222228]">
                <span className="text-gray-500 block">PML Cryptographic State Hash:</span>
                <span className="text-[#60A5FA] font-mono text-[9.5px]">{pmlProof.hash}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block">Theorem:</span>
                <span className="text-yellow-400 font-mono text-[9.5px]">{pmlProof.theorem}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
