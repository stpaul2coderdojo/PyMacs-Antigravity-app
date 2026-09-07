import React, { useState } from 'react';
import { Send, Globe, Code2, Copy, Check, ArrowRight } from 'lucide-react';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  defaultPayload?: string;
  response: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'ep_1',
    method: 'GET',
    path: '/api/v1/dom/tree',
    description: 'Fetch active W3C Level-3 Virtual DOM JSON hierarchy',
    response: JSON.stringify(
      {
        status: 'OK',
        compliance: 'W3C_DOM3',
        nodes: 14,
        gravityY: -9.81,
        root: { id: 'PyMACS_Desktop', tagName: 'DOM_SCHEMA' },
      },
      null,
      2
    ),
  },
  {
    id: 'ep_2',
    method: 'POST',
    path: '/api/v1/transpile',
    description: 'Transpile JSON dataset + XML Filter into Provable DOM Specification',
    defaultPayload: JSON.stringify(
      {
        dataset: { module: 'brother_bsi', status: 'READY' },
        filter: '<Filter type="hardware_dashboard"/>',
      },
      null,
      2
    ),
    response: JSON.stringify(
      {
        provable: true,
        pmlProof: '0x9E4B8F72AC3D51B0',
        synthesizedTag: 'BrotherBSI',
      },
      null,
      2
    ),
  },
  {
    id: 'ep_3',
    method: 'GET',
    path: '/api/v1/bsi/spool',
    description: 'Query Brother printer active spool queue and toner levels',
    response: JSON.stringify(
      {
        printer: 'MFC-L8900CDW',
        tonerLevel: 94,
        activeJobs: 2,
        queue: ['job_401', 'job_402'],
      },
      null,
      2
    ),
  },
  {
    id: 'ep_4',
    method: 'GET',
    path: '/api/v1/tasks/coroutines',
    description: 'Retrieve running FreeRTOS/asyncio coroutines and HTCondor shadow nodes',
    response: JSON.stringify(
      {
        eventLoop: 'NOMINAL',
        activeCoroutines: 5,
        totalMemoryKb: 48200,
        nodes: ['local_gpu_worker', 'openran_cell_7', 'brother_mfc_lan'],
      },
      null,
      2
    ),
  },
];

export const ApiExplorerWindow: React.FC = () => {
  const [selectedEp, setSelectedEp] = useState<Endpoint>(ENDPOINTS[0]);
  const [payload, setPayload] = useState<string>(selectedEp.defaultPayload || '');
  const [responseOutput, setResponseOutput] = useState<string>(selectedEp.response);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelect = (ep: Endpoint) => {
    setSelectedEp(ep);
    setPayload(ep.defaultPayload || '');
    setResponseOutput(ep.response);
  };

  const handleSend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResponseOutput(selectedEp.response);
    }, 220);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* Endpoints list */}
      <div className="w-64 border-r border-[#26262E] bg-[#131317] p-2.5 space-y-1 shrink-0 overflow-y-auto">
        <div className="text-[10px] uppercase text-gray-500 font-semibold mb-2 px-1">
          PyMacs REST API Explorer
        </div>

        {ENDPOINTS.map((ep) => (
          <button
            key={ep.id}
            onClick={() => handleSelect(ep)}
            className={`w-full text-left p-2 rounded transition-colors cursor-pointer ${
              selectedEp.id === ep.id
                ? 'bg-[#2563EB]/20 border border-[#2563EB]/40 text-white'
                : 'hover:bg-[#1C1C22] text-gray-400'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
                  ep.method === 'GET'
                    ? 'bg-[#10B981]/20 text-[#4ADE80]'
                    : 'bg-[#3B82F6]/20 text-[#60A5FA]'
                }`}
              >
                {ep.method}
              </span>
              <span className="text-[11px] text-gray-200 truncate">{ep.path}</span>
            </div>
            <div className="text-[9.5px] text-gray-500 truncate">{ep.description}</div>
          </button>
        ))}
      </div>

      {/* Main Request / Response Area */}
      <div className="flex-1 flex flex-col min-w-0 p-4 space-y-3 overflow-y-auto">
        {/* Request line */}
        <div className="flex items-center gap-2 bg-[#141418] p-2.5 rounded border border-[#26262E]">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              selectedEp.method === 'GET'
                ? 'bg-[#10B981]/20 text-[#4ADE80]'
                : 'bg-[#3B82F6]/20 text-[#60A5FA]'
            }`}
          >
            {selectedEp.method}
          </span>
          <span className="text-white font-semibold flex-1 truncate">{selectedEp.path}</span>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1 rounded text-[11px] font-semibold cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Payload if POST */}
        {selectedEp.method === 'POST' && (
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-gray-400 font-semibold block">
              Request Payload (JSON)
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={4}
              className="w-full bg-[#121216] border border-[#26262E] rounded p-2 text-[10.5px] font-mono text-gray-200 focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        )}

        {/* Response */}
        <div className="space-y-1 flex-1 flex flex-col">
          <div className="flex items-center justify-between text-[10px] uppercase text-gray-400 font-semibold">
            <span>Response Payload (200 OK)</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#4ADE80]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="flex-1 bg-[#121216] border border-[#26262E] rounded p-3 text-[11px] font-mono text-[#38BDF8] overflow-y-auto leading-relaxed">
            {responseOutput}
          </pre>
        </div>
      </div>
    </div>
  );
};
