import React, { useState } from 'react';
import { VirtualDOMNode } from '../../types/dom';
import { transpileJSONToXML, transpileXMLToDOM } from '../../engine/jsonTranspiler';
import { Calculator, Printer, Bot, Play, Check, RefreshCw, Layers } from 'lucide-react';

interface AppsWindowProps {
  onMountToViewport?: (node: VirtualDOMNode) => void;
}

export const AppsWindow: React.FC<AppsWindowProps> = ({ onMountToViewport }) => {
  const [selectedApp, setSelectedApp] = useState<'cardculator' | 'bsi' | 'ravattt'>('cardculator');

  // Cardculator State
  const [formula, setFormula] = useState('2 * math.sin($x) + 4.5');
  const [variableX, setVariableX] = useState(1.57);
  const [computedResult, setComputedResult] = useState<number | null>(6.5);

  // Brother BSI State
  const [toner, setToner] = useState(94);
  const [spoolJobs, setSpoolJobs] = useState([
    { id: 'job_401', name: 'pml_formal_proof.pdf', pages: 12, status: 'PRINTING' },
    { id: 'job_402', name: 'openran_telemetry.csv', pages: 3, status: 'QUEUED' },
  ]);

  // RavaTTT RPA State
  const [rpaOperator, setRpaOperator] = useState('Boolean Semiring (∨, ∧)');
  const [rpaLog, setRpaLog] = useState<string[]>([
    'RPA Agent listening on DOM subtree #brother_bsi_root',
    'Applied operator: (SoftKey_Cancel ⊗ SoftKey_Reprint)',
    'Synthesized autonomous macro trigger for printer spooler.',
  ]);

  const handleComputeCardculator = () => {
    try {
      const expr = formula.replace(/\$x/g, String(variableX)).replace(/math\.sin/g, 'Math.sin').replace(/math\.cos/g, 'Math.cos');
      const res = eval(expr);
      setComputedResult(+Number(res).toFixed(4));
    } catch {
      setComputedResult(null);
    }
  };

  const handleMountCardculatorToDOM = () => {
    const cardNode: VirtualDOMNode = {
      id: 'app_cardculator_live',
      nodeType: 'ELEMENT_NODE',
      tagName: 'Cardculator',
      attributes: {
        formula,
        result: String(computedResult),
        x: String(variableX),
        mode: 'COMPUTABLE_MAP',
      },
      styles: {},
      textContent: `Cardculator Output = ${computedResult}`,
      children: [
        {
          id: 'card_formula_display',
          nodeType: 'ELEMENT_NODE',
          tagName: 'FormulaDisplay',
          attributes: { expr: formula },
          styles: {},
          textContent: `f(x) = ${formula}`,
          children: [],
          physics: { mass: 1.2, charge: 0.5, x: 200, y: 150, vx: 0, vy: 0, pinned: false, radius: 28, rotation: 0, vRot: 0 },
        },
      ],
      physics: { mass: 2.8, charge: 1.5, x: 400, y: 300, vx: 0, vy: 0, pinned: false, radius: 45, rotation: 0, vRot: 0 },
    };
    onMountToViewport?.(cardNode);
  };

  const handleMountBSIToDOM = () => {
    const bsiNode: VirtualDOMNode = {
      id: 'app_brother_bsi_live',
      nodeType: 'ELEMENT_NODE',
      tagName: 'BrotherBSI',
      attributes: {
        model: 'MFC-L8900CDW',
        toner: `${toner}%`,
        status: 'ONLINE',
      },
      styles: {},
      textContent: `Brother MFC BSI Controller (Toner: ${toner}%)`,
      children: [
        {
          id: 'bsi_spool_q',
          nodeType: 'ELEMENT_NODE',
          tagName: 'SpoolQueue',
          attributes: { jobs: String(spoolJobs.length) },
          styles: {},
          textContent: `${spoolJobs.length} Spooled Jobs Active`,
          children: [],
          physics: { mass: 1.5, charge: 0.8, x: 250, y: 200, vx: 0, vy: 0, pinned: false, radius: 32, rotation: 0, vRot: 0 },
        },
      ],
      physics: { mass: 3.5, charge: 2.0, x: 450, y: 320, vx: 0, vy: 0, pinned: false, radius: 50, rotation: 0, vRot: 0 },
    };
    onMountToViewport?.(bsiNode);
  };

  return (
    <div className="flex h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* App Selector Nav */}
      <div className="w-56 border-r border-[#26262E] bg-[#131317] p-3 space-y-1 shrink-0">
        <div className="text-[10px] uppercase text-gray-500 font-semibold mb-2 tracking-wider">
          PyMacs Native Apps
        </div>

        <button
          onClick={() => setSelectedApp('cardculator')}
          className={`w-full flex items-center gap-2.5 p-2 rounded text-left transition-colors cursor-pointer ${
            selectedApp === 'cardculator'
              ? 'bg-[#2563EB]/20 border border-[#2563EB]/40 text-white'
              : 'hover:bg-[#1A1A20] text-gray-300'
          }`}
        >
          <Calculator className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <div className="font-semibold text-xs">Cardculator</div>
            <div className="text-[9.5px] text-gray-500">Computable Map Calc</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedApp('bsi')}
          className={`w-full flex items-center gap-2.5 p-2 rounded text-left transition-colors cursor-pointer ${
            selectedApp === 'bsi'
              ? 'bg-[#2563EB]/20 border border-[#2563EB]/40 text-white'
              : 'hover:bg-[#1A1A20] text-gray-300'
          }`}
        >
          <Printer className="w-4 h-4 text-[#EAB308]" />
          <div>
            <div className="font-semibold text-xs">Brother BSI v3</div>
            <div className="text-[9.5px] text-gray-500">Hardware Printer UI</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedApp('ravattt')}
          className={`w-full flex items-center gap-2.5 p-2 rounded text-left transition-colors cursor-pointer ${
            selectedApp === 'ravattt'
              ? 'bg-[#2563EB]/20 border border-[#2563EB]/40 text-white'
              : 'hover:bg-[#1A1A20] text-gray-300'
          }`}
        >
          <Bot className="w-4 h-4 text-[#A78BFA]" />
          <div>
            <div className="font-semibold text-xs">RavaTTT RPA</div>
            <div className="text-[9.5px] text-gray-500">Operator Semiring</div>
          </div>
        </button>
      </div>

      {/* App Workspace */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#0E0E11]">
        {selectedApp === 'cardculator' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between border-b border-[#24242C] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#38BDF8]" />
                  Cardculator Microkernel Engine
                </h3>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Scales into PyMACS browser-OS with Higher-Order computable maps.
                </p>
              </div>

              {onMountToViewport && (
                <button
                  onClick={handleMountCardculatorToDOM}
                  className="flex items-center gap-1.5 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#4ADE80] border border-[#10B981]/40 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Mount to DOM</span>
                </button>
              )}
            </div>

            <div className="bg-[#141418] border border-[#24242C] p-3.5 rounded space-y-3">
              <div>
                <label className="text-[10px] uppercase text-gray-400 font-semibold block mb-1">
                  Cardculator Formula (HOF Expression)
                </label>
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="w-full bg-[#0E0E12] border border-[#2A2A34] px-3 py-1.5 rounded text-xs text-white font-mono focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-gray-400 font-semibold block mb-1">
                  Variable $x Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={variableX}
                  onChange={(e) => setVariableX(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0E0E12] border border-[#2A2A34] px-3 py-1.5 rounded text-xs text-white font-mono focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleComputeCardculator}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Evaluate Map</span>
                </button>

                <div className="text-right">
                  <span className="text-gray-500 text-[10px] uppercase block">Computed Output</span>
                  <span className="text-lg font-bold text-[#4ADE80] font-mono">
                    {computedResult !== null ? computedResult : 'ERR'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedApp === 'bsi' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between border-b border-[#24242C] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#EAB308]" />
                  Brother BSI v3 Hardware Dashboard
                </h3>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Direct XML-DOM soft-key touch control interface.
                </p>
              </div>

              {onMountToViewport && (
                <button
                  onClick={handleMountBSIToDOM}
                  className="flex items-center gap-1.5 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#4ADE80] border border-[#10B981]/40 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Mount to DOM</span>
                </button>
              )}
            </div>

            <div className="bg-[#141418] border border-[#24242C] p-3.5 rounded space-y-3">
              <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#282832]">
                <span className="text-gray-300">Toner Level</span>
                <span className="text-[#4ADE80] font-bold">{toner}% Available</span>
              </div>

              <div>
                <div className="text-[10px] uppercase text-gray-400 font-semibold mb-1.5">
                  Active Spool Queue ({spoolJobs.length} jobs)
                </div>
                <div className="space-y-1.5">
                  {spoolJobs.map((j) => (
                    <div key={j.id} className="p-2 bg-[#181820] rounded border border-[#24242C] flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-semibold text-white">{j.name}</span>
                        <span className="text-gray-500 text-[10px] ml-2">({j.pages} pages)</span>
                      </div>
                      <span className="text-[9.5px] bg-[#38BDF8]/15 text-[#38BDF8] px-1.5 py-0.5 rounded font-bold">
                        {j.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedApp === 'ravattt' && (
          <div className="space-y-4 max-w-xl">
            <div className="border-b border-[#24242C] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#A78BFA]" />
                RavaTTT Robotic Process Automation (RPA)
              </h3>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Semiring-based autonomous mutation engine over browser OS buffers.
              </p>
            </div>

            <div className="bg-[#141418] border border-[#24242C] p-3.5 rounded space-y-2">
              <div className="text-[10px] uppercase text-gray-400 font-semibold">Active Semiring Algebra</div>
              <div className="p-2 bg-[#1A1A22] rounded border border-[#282832] text-yellow-400 font-semibold">
                {rpaOperator}
              </div>

              <div className="text-[10px] uppercase text-gray-400 font-semibold pt-2">Agent Activity Log</div>
              <div className="space-y-1 bg-[#101014] p-2.5 rounded border border-[#202028] text-[10.5px]">
                {rpaLog.map((log, i) => (
                  <div key={i} className="text-gray-300">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
