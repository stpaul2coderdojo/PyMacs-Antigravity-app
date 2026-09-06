import React, { useState } from 'react';
import { Cloud, Link, ShieldCheck, Server, Globe, Cpu, Hash, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const CloudOnChainWindow: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'cloud' | 'onchain'>('cloud');

  const [ledgerBlocks, setLedgerBlocks] = useState([
    {
      index: 1042,
      hash: '0x7F2A...91BC',
      previousHash: '0x1C8E...44FD',
      pmlSchema: 'brother_bsi_root',
      validator: 'openran_validator_3',
      timestamp: '12:00:10',
    },
    {
      index: 1041,
      hash: '0x1C8E...44FD',
      previousHash: '0x99AA...1234',
      pmlSchema: 'cardculator_map',
      validator: 'htcondor_shadow_7',
      timestamp: '11:58:32',
    },
    {
      index: 1040,
      hash: '0x99AA...1234',
      previousHash: '0x0000...0000',
      pmlSchema: 'genesis_dom_tree',
      validator: 'genesis_kernel',
      timestamp: '11:55:00',
    },
  ]);

  return (
    <div className="flex flex-col h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden">
      {/* Sub Header */}
      <div className="p-3 bg-[#16161C] border-b border-[#26262E] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {activeSubTab === 'cloud' ? (
            <Cloud className="w-4 h-4 text-[#38BDF8]" />
          ) : (
            <Link className="w-4 h-4 text-[#A78BFA]" />
          )}
          <span className="font-semibold text-gray-200">
            {activeSubTab === 'cloud' ? 'Cloud & OpenRAN Edge Infrastructure' : 'On-Chain PML Provability Ledger'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('cloud')}
            className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider cursor-pointer ${
              activeSubTab === 'cloud' ? 'bg-[#2563EB] text-white' : 'bg-[#1D1D24] text-gray-400 hover:text-gray-200'
            }`}
          >
            ☁ Cloud / OpenRAN
          </button>
          <button
            onClick={() => setActiveSubTab('onchain')}
            className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider cursor-pointer ${
              activeSubTab === 'onchain' ? 'bg-[#8B5CF6] text-white' : 'bg-[#1D1D24] text-gray-400 hover:text-gray-200'
            }`}
          >
            ⛓ On-Chain Proofs
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSubTab === 'cloud' ? (
          <div className="space-y-3">
            <div className="bg-[#131317] border border-[#24242C] p-3 rounded">
              <div className="text-[10px] uppercase text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>AWS API Gateway &amp; Microservices</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#262630]">
                  <span className="text-gray-300">GET https://api.pymacs.edge.internal/v1/schemas</span>
                  <span className="text-[#4ADE80] font-semibold">200 OK (14ms)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#262630]">
                  <span className="text-gray-300">POST https://api.pymacs.edge.internal/v1/pml/verify</span>
                  <span className="text-[#4ADE80] font-semibold">200 OK (22ms)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#1A1A22] rounded border border-[#262630]">
                  <span className="text-gray-300">WS wss://bsi.mfc.local:8080/dom-stream</span>
                  <span className="text-[#38BDF8] font-semibold">CONNECTED</span>
                </div>
              </div>
            </div>

            <div className="bg-[#131317] border border-[#24242C] p-3 rounded">
              <div className="text-[10px] uppercase text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>OpenRAN Robotic Cell Shadow Allocation</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed mb-2">
                HTCondor shadow daemon dynamically migrates PyMACS Python coroutines across OpenRAN edge clusters for ultra-low latency compute.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-[#181820] p-2 rounded border border-[#22222A]">
                  <div className="text-gray-500">Node Cluster</div>
                  <div className="text-[#4ADE80] font-bold text-xs mt-0.5">Cell_Cluster_7</div>
                </div>
                <div className="bg-[#181820] p-2 rounded border border-[#22222A]">
                  <div className="text-gray-500">Latency</div>
                  <div className="text-[#38BDF8] font-bold text-xs mt-0.5">1.8 ms</div>
                </div>
                <div className="bg-[#181820] p-2 rounded border border-[#22222A]">
                  <div className="text-gray-500">Replication</div>
                  <div className="text-yellow-400 font-bold text-xs mt-0.5">4x Shadow</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#131317] border border-[#24242C] p-3 rounded">
              <div className="text-[10px] uppercase text-gray-400 font-semibold mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>Provable Markup Language (PML) Cryptographic Ledger</span>
                </div>
                <span className="text-[#4ADE80] text-[9.5px] font-bold">MERKLE ANCHORED</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed mb-3">
                Every JSON-to-DOM compilation produces a verifiable Merkle proof, confirming that the client rendered strictly what the schema specified without tampered state.
              </p>

              <div className="space-y-2">
                {ledgerBlocks.map((blk) => (
                  <div key={blk.index} className="bg-[#181820] p-2.5 rounded border border-[#24242E] flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">Block #{blk.index}</span>
                        <span className="text-[#A78BFA] bg-[#A78BFA]/10 px-1 py-0.5 rounded text-[9.5px]">
                          {blk.pmlSchema}
                        </span>
                      </div>
                      <div className="text-gray-500 text-[10px] font-mono">
                        Hash: <span className="text-gray-300">{blk.hash}</span> • Prev: {blk.previousHash}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-gray-500">
                      <div>{blk.timestamp}</div>
                      <div className="text-[#4ADE80] flex items-center gap-1 justify-end mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Validated
                      </div>
                    </div>
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
