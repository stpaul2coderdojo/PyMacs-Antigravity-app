import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  systemStatus: string;
  bufferHex: string;
  nodeCount: number;
}

export const Footer: React.FC<FooterProps> = ({ systemStatus, bufferHex, nodeCount }) => {
  return (
    <footer className="h-9 bg-[#121215] border-t border-[#222224] flex items-center px-4 sm:px-6 justify-between text-[#71717A] text-[10px] font-mono select-none flex-shrink-0">
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
          <span className="text-[#A1A1AA]">{systemStatus}</span>
        </div>
        <div className="h-3 w-[1px] bg-[#2D2D30] hidden sm:block" />
        <span className="hidden sm:inline text-[#71717A]">Buffer: {bufferHex}</span>
        <div className="h-3 w-[1px] bg-[#2D2D30]" />
        <span className="text-[#A1A1AA]">DOM Nodes: {nodeCount}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[#71717A] hidden md:inline">
          Research by Dr. Bheemaiah Anil K
        </span>
        <div className="h-3 w-[1px] bg-[#2D2D30] hidden md:block" />
        <a
          href="https://pymacs.wordpress.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4ADE80] hover:underline flex items-center gap-1 font-medium"
        >
          <span>pymacs.wordpress.com</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </footer>
  );
};
