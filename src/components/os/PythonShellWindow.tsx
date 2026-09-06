import React, { useState, useRef, useEffect } from 'react';
import { VirtualDOMNode } from '../../types/dom';
import { PythonReplEngine, CommandOutput } from '../../engine/pythonRepl';
import { Terminal, CornerDownLeft, Trash2, HelpCircle, Code, Play } from 'lucide-react';

interface PythonShellWindowProps {
  currentRootNode: VirtualDOMNode;
  onUpdateRootNode?: (node: VirtualDOMNode) => void;
  setGravityY?: (g: number) => void;
  onOpenWindow?: (windowId: string) => void;
}

export const PythonShellWindow: React.FC<PythonShellWindowProps> = ({
  currentRootNode,
  onUpdateRootNode,
  setGravityY,
  onOpenWindow,
}) => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'init_1',
      command: 'sys.boot()',
      type: 'system',
      text: `PyMACS Python 3.12 (Browser Microkernel, Emacs Mode)
[GCC 13.2 / WASM POSIX] on browser-os
Type "help", "copyright", or "pymacs.help()" for more information.`,
      timestamp: '12:00:00',
    },
    {
      id: 'init_2',
      command: 'import pymacs',
      type: 'input',
      text: 'import pymacs',
      timestamp: '12:00:01',
    },
    {
      id: 'init_3',
      command: 'import pymacs',
      type: 'output',
      text: `>>> [PyMACS] Imported microkernel namespace.
JSON=XML=DOM equivalence engine ready.
Type pymacs.help() for documentation.`,
      timestamp: '12:00:01',
    },
    {
      id: 'init_4',
      command: 'pymacs.help()',
      type: 'input',
      text: 'pymacs.help()',
      timestamp: '12:00:02',
    },
    {
      id: 'init_5',
      command: 'pymacs.help()',
      type: 'output',
      text: `PyMACS Browser OS — Python Interactive Microkernel
Available commands:
  • pymacs.help()               - Print this guide
  • pymacs.info()               - System status & architecture
  • pymacs.fs.ls()              - List files in Virtual File System
  • pymacs.dom.nodes()          - Count active DOM nodes
  • pymacs.dom.query('#node')   - Inspect live Virtual DOM node
  • pymacs.gravity.set(-9.81)   - Adjust gravity
  • pymacs.tasks()              - List active asyncio coroutines
  • pymacs.db.list()            - Query JSON document database
  • map(filter, dataset)        - Execute Computable Map HOF`,
      timestamp: '12:00:02',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleExecute = (cmdToRun?: string) => {
    const command = cmdToRun !== undefined ? cmdToRun : inputVal;
    if (!command.trim()) return;

    // Add input entry
    const inputEntry: CommandOutput = {
      id: Math.random().toString(36).substring(2),
      command,
      type: 'input',
      text: command,
      timestamp: new Date().toLocaleTimeString(),
    };

    const evaluated = PythonReplEngine.evaluate(command, {
      currentRootNode,
      onUpdateRootNode,
      setGravityY,
      onOpenWindow,
    });

    if (evaluated.text === '__CLEAR__') {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, inputEntry, evaluated]);
    }

    setInputVal('');
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      const pastCommands = history.filter((h) => h.type === 'input').map((h) => h.text);
      if (pastCommands.length === 0) return;
      const nextIdx = historyIndex === null ? pastCommands.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(pastCommands[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      const pastCommands = history.filter((h) => h.type === 'input').map((h) => h.text);
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= pastCommands.length) {
        setHistoryIndex(null);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(pastCommands[nextIdx]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden select-text">
      {/* Shell Sub-header */}
      <div className="bg-[#16161C] border-b border-[#2A2A32] px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-semibold text-gray-300">PyMACS Python REPL</span>
          <span className="text-[10px] text-gray-500 bg-[#202028] px-1.5 py-0.5 rounded">
            Interactive Emacs Mode
          </span>
        </div>

        {/* Quick Command Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleExecute('pymacs.fs.ls()')}
            className="px-2 py-0.5 bg-[#202028] hover:bg-[#282834] text-gray-300 rounded text-[10px] cursor-pointer transition-colors"
          >
            fs.ls()
          </button>
          <button
            onClick={() => handleExecute('pymacs.dom.nodes()')}
            className="px-2 py-0.5 bg-[#202028] hover:bg-[#282834] text-gray-300 rounded text-[10px] cursor-pointer transition-colors"
          >
            dom.nodes()
          </button>
          <button
            onClick={() => handleExecute('map(filter, dataset)')}
            className="px-2 py-0.5 bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#60A5FA] border border-[#3B82F6]/30 rounded text-[10px] cursor-pointer transition-colors"
          >
            map(filter, data)
          </button>
          <button
            onClick={() => setHistory([])}
            className="p-1 hover:bg-[#2A2A35] text-gray-400 hover:text-gray-200 rounded cursor-pointer transition-colors ml-1"
            title="Clear buffer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className="flex-1 p-3 overflow-y-auto space-y-2 font-mono leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry) => (
          <div key={entry.id} className="space-y-0.5">
            {entry.type === 'input' && (
              <div className="flex items-center gap-2 text-[#38BDF8]">
                <span className="font-bold text-[#60A5FA] select-none">&gt;&gt;&gt;</span>
                <span className="text-gray-100 font-medium">{entry.text}</span>
              </div>
            )}
            {entry.type === 'output' && (
              <pre className="text-gray-300 whitespace-pre-wrap pl-6 text-[11px] leading-relaxed">
                {entry.text}
              </pre>
            )}
            {entry.type === 'system' && (
              <pre className="text-gray-400 whitespace-pre-wrap text-[11px] leading-relaxed border-l-2 border-[#3B82F6] pl-2 my-1">
                {entry.text}
              </pre>
            )}
            {entry.type === 'error' && (
              <pre className="text-[#F87171] whitespace-pre-wrap pl-6 text-[11px] leading-relaxed bg-[#F87171]/10 p-2 rounded border border-[#F87171]/20">
                {entry.text}
              </pre>
            )}
            {entry.type === 'dom' && (
              <div className="pl-6 my-1 bg-[#10B981]/10 border border-[#10B981]/25 p-2 rounded text-[#34D399]">
                <div className="font-semibold text-xs mb-1 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>DOM Inspection Inspector</span>
                </div>
                <pre className="text-[10.5px] whitespace-pre-wrap font-mono text-gray-200">
                  {entry.text}
                </pre>
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="bg-[#141419] border-t border-[#26262E] p-2 flex items-center gap-2 shrink-0">
        <span className="text-[#60A5FA] font-bold text-sm pl-2 select-none">&gt;&gt;&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type Python / PyMACS command (e.g. pymacs.help(), ls, map(filter, dataset)...)"
          className="flex-1 bg-transparent text-gray-100 text-xs font-mono focus:outline-none placeholder-gray-600"
          autoFocus
        />
        <button
          onClick={() => handleExecute()}
          disabled={!inputVal.trim()}
          className="p-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-30 text-white rounded cursor-pointer transition-colors"
          title="Run command (Enter)"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
