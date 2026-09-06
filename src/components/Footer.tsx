import React from 'react';

interface FooterProps {
  systemStatus: string;
  bufferHex: string;
  nodeCount: number;
}

export const Footer: React.FC<FooterProps> = ({ systemStatus, bufferHex, nodeCount }) => {
  return (
    <footer className="h-8 bg-[#161618] border-t border-[#222224] flex items-center px-4 justify-between text-[#71717A] text-[9px] uppercase tracking-tighter select-none flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
          <span>{systemStatus}</span>
        </div>
        <div className="h-3 w-[1px] bg-[#2D2D30]" />
        <span>Buffer: {bufferHex}</span>
        <div className="h-3 w-[1px] bg-[#2D2D30]" />
        <span>Active DOM Elements: {nodeCount}</span>
      </div>

      <span className="tracking-[0.2em] text-[#71717A]">
        pymacs.wordpress.com &copy; 2024 • Provable Computing PML
      </span>
    </footer>
  );
};
