import React, { useState } from 'react';
import { VirtualDOMNode, JSCompilationOutput } from '../types/dom';
import { executeAntigravityScript } from '../engine/compiler';
import { Code2, Play, Terminal, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';

interface JSCompilerViewProps {
  nodes: VirtualDOMNode[];
  setGravity: (g: number) => void;
  onSpawnNode: (tag: string, text: string, x?: number, y?: number, mass?: number) => void;
  defaultCode: string;
}

export const JSCompilerView: React.FC<JSCompilerViewProps> = ({
  nodes,
  setGravity,
  onSpawnNode,
  defaultCode,
}) => {
  const [code, setCode] = useState(defaultCode);
  const [compilationResult, setCompilationResult] = useState<JSCompilationOutput | null>(null);

  const handleRunCompiler = () => {
    const result = executeAntigravityScript(code, nodes, setGravity, onSpawnNode);
    setCompilationResult(result);
  };

  return (
    <div className="flex-1 w-full h-full bg-[#0A0A0B] text-[#D1D1D1] flex flex-col md:flex-row overflow-hidden select-none">
      {/* Left Column: Script Editor */}
      <div className="flex-1 border-r border-[#222224] flex flex-col bg-[#0D0D0F]">
        <div className="h-12 border-b border-[#222224] px-6 flex items-center justify-between bg-[#121214]">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A]">
              TypeScript / JS Compiler
            </span>
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
          </div>

          <button
            onClick={handleRunCompiler}
            className="flex items-center gap-1.5 bg-[#4ADE80] text-black px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#3ec46f] transition-all cursor-pointer shadow-[0_0_12px_rgba(74,222,128,0.2)]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Compile & Execute</span>
          </button>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-[#070708] text-white font-mono text-[12px] leading-relaxed p-4 rounded border border-[#222224] outline-none resize-none focus:border-[#4ADE80]/50"
          />
        </div>

        {/* Compiler Status Bar */}
        <div className="h-10 px-4 border-t border-[#222224] bg-[#0A0A0B] flex items-center justify-between text-[11px] text-[#71717A]">
          <div className="flex items-center gap-3">
            <span>Lexer: <strong>Active</strong></span>
            <span className="h-3 w-[1px] bg-[#222224]" />
            <span>JIT Sandbox: <strong>Strict Mode</strong></span>
          </div>
          {compilationResult && (
            <span className="font-mono text-[#4ADE80]">
              Exec: {compilationResult.executionTimeMs}ms • {compilationResult.tokens.length} Tokens
            </span>
          )}
        </div>
      </div>

      {/* Right Column: AST & Bytecode & Execution Console */}
      <div className="w-full md:w-[440px] flex flex-col bg-[#0D0D0F] overflow-y-auto">
        {/* Execution Output Console */}
        <div className="p-6 border-b border-[#222224]">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] mb-3 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Virtual Console & DOM Output</span>
          </h2>

          <div className="bg-[#070708] rounded p-3 border border-[#222224] font-mono text-[11px] max-h-48 overflow-y-auto space-y-1">
            {compilationResult ? (
              compilationResult.outputLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('[ERROR]')
                      ? 'text-red-400'
                      : log.includes('[DOM]')
                      ? 'text-[#4ADE80]'
                      : log.includes('[Engine]')
                      ? 'text-amber-300'
                      : 'text-[#A1A1AA]'
                  }
                >
                  &gt; {log}
                </div>
              ))
            ) : (
              <div className="text-[#71717A] italic">Ready. Click "Compile & Execute" to evaluate code.</div>
            )}
          </div>
        </div>

        {/* Bytecode Emitter View */}
        <div className="p-6 border-b border-[#222224]">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] mb-3 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Emitted Bytecode Instructions</span>
          </h2>

          <div className="bg-[#141416] p-3 rounded border border-[#222224] font-mono text-[10px] text-[#A1A1AA] max-h-40 overflow-y-auto space-y-0.5">
            {compilationResult?.bytecodeInstructions ? (
              compilationResult.bytecodeInstructions.map((instr, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-[#71717A]">0x{idx.toString(16).padStart(2, '0')}</span>
                  <span className="text-white">{instr}</span>
                </div>
              ))
            ) : (
              <div className="text-[#71717A] italic">No bytecode compiled yet.</div>
            )}
          </div>
        </div>

        {/* AST Inspector */}
        <div className="p-6 flex-1">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] mb-3">
            Abstract Syntax Tree (AST)
          </h2>
          <pre className="bg-[#070708] p-3 rounded border border-[#222224] font-mono text-[10px] text-[#4ADE80] max-h-48 overflow-y-auto">
            {compilationResult?.ast
              ? JSON.stringify(compilationResult.ast, null, 2)
              : '/* AST will appear here after compilation */'}
          </pre>
        </div>
      </div>
    </div>
  );
};
