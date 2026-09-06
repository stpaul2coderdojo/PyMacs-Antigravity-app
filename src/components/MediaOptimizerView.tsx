import React, { useState } from 'react';
import { OptimizedAsset, formatBytes } from '../engine/assetOptimizer';
import { Tv, Image as ImageIcon, Download, Gauge, Check, HardDrive } from 'lucide-react';

interface MediaOptimizerViewProps {
  assets: OptimizedAsset[];
  onTriggerOptimization: () => void;
}

export const MediaOptimizerView: React.FC<MediaOptimizerViewProps> = ({
  assets,
  onTriggerOptimization,
}) => {
  const [networkProfile, setNetworkProfile] = useState<'fiber' | '5g' | '4g' | 'satellite'>('5g');
  const [activeAsset, setActiveAsset] = useState<OptimizedAsset>(assets[0]);

  const totalRawBytes = assets.reduce((acc, a) => acc + a.originalSizeBytes, 0);
  const totalOptBytes = assets.reduce((acc, a) => acc + a.optimizedSizeBytes, 0);
  const totalSavedPercent = ((1 - totalOptBytes / totalRawBytes) * 100).toFixed(1);

  return (
    <div className="flex-1 w-full h-full bg-[#0A0A0B] text-[#D1D1D1] flex flex-col lg:flex-row overflow-hidden select-none">
      {/* Left: Asset List & Stream Pipeline */}
      <div className="flex-1 border-r border-[#222224] flex flex-col bg-[#0D0D0F] overflow-y-auto">
        <div className="h-12 border-b border-[#222224] px-6 flex items-center justify-between bg-[#121214] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Tv className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
              Image & Video Download Optimizer
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#161618] border border-[#2D2D30] rounded-md px-2 py-1 text-[10px] font-mono">
              <Gauge className="w-3 h-3 text-[#4ADE80]" />
              <select
                value={networkProfile}
                onChange={(e) => setNetworkProfile(e.target.value as any)}
                aria-label="Select Network Bandwidth Profile"
                className="bg-transparent text-white outline-none cursor-pointer"
              >
                <option value="fiber" className="bg-[#161618]">Fiber (1 Gbps)</option>
                <option value="5g" className="bg-[#161618]">5G Ultra (300 Mbps)</option>
                <option value="4g" className="bg-[#161618]">4G LTE (25 Mbps)</option>
                <option value="satellite" className="bg-[#161618]">Satellite (5 Mbps)</option>
              </select>
            </div>

            <button
              onClick={onTriggerOptimization}
              className="bg-[#4ADE80] text-black px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#3ec46f] transition-all cursor-pointer"
            >
              Re-Optimize Buffer
            </button>
          </div>
        </div>

        {/* Global Optimization Metrics Card */}
        <div className="p-6 border-b border-[#222224] grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0F0F11]">
          <div className="p-3 bg-[#141416] border border-[#222224] rounded-lg">
            <div className="text-[9px] uppercase tracking-widest text-[#71717A]">Raw Payload</div>
            <div className="text-lg font-mono font-semibold text-white mt-1">
              {formatBytes(totalRawBytes)}
            </div>
          </div>
          <div className="p-3 bg-[#141416] border border-[#222224] rounded-lg">
            <div className="text-[9px] uppercase tracking-widest text-[#71717A]">Optimized Stream</div>
            <div className="text-lg font-mono font-semibold text-[#4ADE80] mt-1">
              {formatBytes(totalOptBytes)}
            </div>
          </div>
          <div className="p-3 bg-[#141416] border border-[#222224] rounded-lg">
            <div className="text-[9px] uppercase tracking-widest text-[#71717A]">Bandwidth Saved</div>
            <div className="text-lg font-mono font-semibold text-white mt-1">
              {totalSavedPercent}%
            </div>
          </div>
          <div className="p-3 bg-[#141416] border border-[#222224] rounded-lg">
            <div className="text-[9px] uppercase tracking-widest text-[#71717A]">Ring Buffer Latency</div>
            <div className="text-lg font-mono font-semibold text-[#4ADE80] mt-1">
              1.2 ms
            </div>
          </div>
        </div>

        {/* Media Asset Cards */}
        <div className="p-6 space-y-3">
          {assets.map((asset) => {
            const isSelected = activeAsset.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => setActiveAsset(asset)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#161619] border-[#4ADE80]'
                    : 'bg-[#141416] border-[#222224] hover:border-[#2D2D30]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1C1C20] rounded-lg text-[#4ADE80]">
                    {asset.type === 'video' ? <Tv className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-mono text-[12px] font-semibold text-white">
                      {asset.name}
                    </div>
                    <div className="text-[10px] text-[#71717A] font-mono mt-0.5">
                      {asset.downscaleRatio} • {asset.codec}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-[11px] font-mono">
                  <div className="text-right">
                    <span className="text-[#71717A] line-through mr-2">
                      {formatBytes(asset.originalSizeBytes)}
                    </span>
                    <span className="text-[#4ADE80] font-semibold">
                      {formatBytes(asset.optimizedSizeBytes)}
                    </span>
                  </div>

                  <div className="w-24">
                    <div className="flex justify-between text-[9px] text-[#71717A] mb-1">
                      <span>Buffered</span>
                      <span className="text-white">{asset.bufferLoadedPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#222224] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4ADE80]"
                        style={{ width: `${asset.bufferLoadedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Active Stream Inspection & Preview */}
      <div className="w-full lg:w-[440px] flex flex-col bg-[#0D0D0F] overflow-y-auto">
        <div className="h-12 border-b border-[#222224] px-6 flex items-center justify-between bg-[#121214] flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
            Adaptive Stream Inspector
          </span>
          <span className="text-[9px] font-mono text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-0.5 rounded">
            CACHE HIT
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Visual Preview */}
          <div className="rounded-xl overflow-hidden border border-[#222224] bg-black aspect-video relative flex items-center justify-center">
            <img
              src={activeAsset.url}
              alt={activeAsset.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              <span>4K Downscaled • {activeAsset.downscaleRatio.split('->')[1]?.trim() || '1080p'}</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-[#4ADE80]">
              -{activeAsset.compressionRatio}% Bandwidth
            </div>
          </div>

          {/* Codec Specs */}
          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex justify-between p-3 bg-[#141416] rounded border border-[#222224]">
              <span className="text-[#71717A]">Downscaling Kernel:</span>
              <span className="text-white">Lanczos-3 Subsampled</span>
            </div>
            <div className="flex justify-between p-3 bg-[#141416] rounded border border-[#222224]">
              <span className="text-[#71717A]">Stream Container:</span>
              <span className="text-white">Chunked MediaSource ArrayBuffer</span>
            </div>
            <div className="flex justify-between p-3 bg-[#141416] rounded border border-[#222224]">
              <span className="text-[#71717A]">Thread Task:</span>
              <span className="text-[#4ADE80]">Worker.05 & Worker.06 Offloaded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
