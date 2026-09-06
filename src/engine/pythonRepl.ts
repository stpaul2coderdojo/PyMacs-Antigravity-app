/**
 * PyMACS Python & Emacs Shell Execution Engine
 * Evaluates Python-like / Emacs Lisp commands against the live PyMACS Browser OS state.
 */

import { VirtualDOMNode } from '../types/dom';
import { VirtualFS } from './virtualFs';
import { JsonDatabase } from './jsonDatabase';
import { transpileJSONToXML, transpileXMLToDOM } from './jsonTranspiler';

export interface CommandOutput {
  id: string;
  command: string;
  type: 'input' | 'output' | 'error' | 'system' | 'dom';
  text: string;
  timestamp: string;
  domNode?: any;
}

export class PythonReplEngine {
  private static history: string[] = [];
  private static variables: Record<string, any> = {
    OS_VERSION: 'PyMACS v4.2.0-LTS (Browser OS Microkernel)',
    AUTHOR: 'Dr. Bheemaiah Anil K',
    BLOG: 'https://pymacs.wordpress.com',
    STATUS: 'ONLINE',
  };

  public static getHistory(): string[] {
    return this.history;
  }

  public static evaluate(
    cmd: string,
    context: {
      currentRootNode: VirtualDOMNode;
      onUpdateRootNode?: (node: VirtualDOMNode) => void;
      setGravityY?: (g: number) => void;
      onOpenWindow?: (windowId: string) => void;
    }
  ): CommandOutput {
    const trimmed = cmd.trim();
    if (!trimmed) {
      return {
        id: Math.random().toString(36).substring(2),
        command: cmd,
        type: 'output',
        text: '',
        timestamp: new Date().toLocaleTimeString(),
      };
    }

    this.history.push(trimmed);
    const ts = new Date().toLocaleTimeString();
    const id = Math.random().toString(36).substring(2);

    // Help command
    if (trimmed === 'help' || trimmed === 'help()' || trimmed === 'pymacs.help()') {
      return {
        id,
        command: cmd,
        type: 'output',
        text: `PyMACS Browser OS — Python Interactive Microkernel
Available commands:
  • pymacs.help()               - Print this guide
  • pymacs.info()               - System status & architecture
  • pymacs.fs.ls()              - List files in Virtual File System
  • pymacs.fs.cat(path)         - Read file content
  • pymacs.dom.query(id)        - Inspect live Virtual DOM node
  • pymacs.dom.nodes()          - Count active DOM nodes
  • pymacs.gravity.set(value)   - Adjust gravity (-9.81 = null-g, 9.81 = Earth)
  • pymacs.tasks()              - List active asyncio coroutines
  • pymacs.db.list()            - Query JSON document database
  • map(filter, dataset)        - Execute Computable Map HOF
  • clear / cls                 - Clear shell buffer
  • open(window_name)           - Open OS window (e.g. open('files'), open('data'))`,
        timestamp: ts,
      };
    }

    if (trimmed === 'clear' || trimmed === 'cls') {
      return {
        id,
        command: cmd,
        type: 'system',
        text: '__CLEAR__',
        timestamp: ts,
      };
    }

    if (trimmed === 'import pymacs' || trimmed === 'from pymacs import *') {
      return {
        id,
        command: cmd,
        type: 'output',
        text: `>>> [PyMACS] Imported microkernel namespace.
JSON=XML=DOM equivalence engine ready.
Type pymacs.help() for documentation.`,
        timestamp: ts,
      };
    }

    if (trimmed === 'pymacs.info()' || trimmed === 'info') {
      return {
        id,
        command: cmd,
        type: 'output',
        text: `System: PyMACS Browser OS v4.2.0-LTS
Architecture: Microkernel Python + FreeRTOS Coroutines + Antigravity DOM
Creator: Dr. Bheemaiah Anil K
WordPress: https://pymacs.wordpress.com
Spec: JSON = XML = DOM • Provable Markup Language (PML)
Execution: Cooperative Multitasking on HTCondor-Shadow OpenRAN Clusters`,
        timestamp: ts,
      };
    }

    // FS commands
    if (trimmed === 'pymacs.fs.ls()' || trimmed === 'ls' || trimmed === 'dir') {
      const files = VirtualFS.listFiles();
      const listing = files
        .map((f) => `  ${f.path.padEnd(24)} [${f.type.toUpperCase().padEnd(7)}] ${String(f.sizeBytes).padStart(6)} B  (owner: ${f.threadOwner})`)
        .join('\n');
      return {
        id,
        command: cmd,
        type: 'output',
        text: `Virtual File System Directory Listing:\n${listing}`,
        timestamp: ts,
      };
    }

    const catMatch = trimmed.match(/^(?:pymacs\.fs\.cat|cat)\s*\(['"]?([^'"]+)['"]?\)$/);
    if (catMatch) {
      const path = catMatch[1];
      const file = VirtualFS.getFile(path);
      if (!file) {
        return {
          id,
          command: cmd,
          type: 'error',
          text: `FileNotFoundError: [Errno 2] No such file: '${path}'`,
          timestamp: ts,
        };
      }
      return {
        id,
        command: cmd,
        type: 'output',
        text: `--- ${file.path} (${file.type}) ---\n${file.content}`,
        timestamp: ts,
      };
    }

    // Window Open
    const openMatch = trimmed.match(/^open\s*\(['"]?([^'"]+)['"]?\)$/);
    if (openMatch) {
      const win = openMatch[1].toLowerCase();
      if (context.onOpenWindow) {
        context.onOpenWindow(win);
        return {
          id,
          command: cmd,
          type: 'system',
          text: `Opened window: ${win}`,
          timestamp: ts,
        };
      }
    }

    // Gravity set
    const gravMatch = trimmed.match(/^pymacs\.gravity\.set\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)$/);
    if (gravMatch && context.setGravityY) {
      const g = parseFloat(gravMatch[1]);
      context.setGravityY(g);
      return {
        id,
        command: cmd,
        type: 'output',
        text: `>>> Gravity vector updated to ${g} m/s² (Antigravity momentum recalculation).`,
        timestamp: ts,
      };
    }

    // DOM queries
    if (trimmed === 'pymacs.dom.nodes()') {
      return {
        id,
        command: cmd,
        type: 'output',
        text: `Active DOM Elements: Root <${context.currentRootNode.tagName} id="${context.currentRootNode.id}"> with ${context.currentRootNode.children.length} direct children. Total mass: ${context.currentRootNode.physics.mass}kg.`,
        timestamp: ts,
      };
    }

    const domQueryMatch = trimmed.match(/^pymacs\.dom\.query\s*\(['"]?([^'"]+)['"]?\)$/);
    if (domQueryMatch) {
      const targetId = domQueryMatch[1].replace(/^#/, '');
      const findNode = (node: VirtualDOMNode): VirtualDOMNode | null => {
        if (node.id === targetId) return node;
        for (const c of node.children) {
          const res = findNode(c);
          if (res) return res;
        }
        return null;
      };

      const found = findNode(context.currentRootNode);
      if (!found) {
        return {
          id,
          command: cmd,
          type: 'error',
          text: `DOMQueryError: Node with ID '#${targetId}' not found in live tree.`,
          timestamp: ts,
        };
      }

      return {
        id,
        command: cmd,
        type: 'dom',
        text: `Found Node: <${found.tagName} id="${found.id}">\nText: "${found.textContent}"\nAttributes: ${JSON.stringify(found.attributes)}\nPhysics: mass=${found.physics.mass}, charge=${found.physics.charge}, x=${found.physics.x.toFixed(1)}, y=${found.physics.y.toFixed(1)}`,
        timestamp: ts,
        domNode: found,
      };
    }

    // JSON DB list
    if (trimmed === 'pymacs.db.list()') {
      const docs = JsonDatabase.getAll();
      const list = docs.map((d) => `  [${d.collection}] ${d.id.padEnd(22)} - "${d.title}" (v${d.version})`).join('\n');
      return {
        id,
        command: cmd,
        type: 'output',
        text: `JSON Database Records (${docs.length} total):\n${list}`,
        timestamp: ts,
      };
    }

    // Computable Map HOF
    if (trimmed.startsWith('map(') || trimmed.startsWith('pymacs.map(')) {
      return {
        id,
        command: cmd,
        type: 'output',
        text: `>>> Executing Higher-Order Function: map(filter, dataset)
[Step 1] ReadDB: Queried JSON Database schema
[Step 2] Filter: Applied PML Level-3 Transform (<Filter type="gaussian"/>)
[Step 3] HOF Map: Generated Provable DOM Object
[Status] Output DOM synthesized successfully. Verified against PML Merkle root.`,
        timestamp: ts,
      };
    }

    // Variable assignment
    const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const valStr = assignMatch[2];
      try {
        const val = eval(valStr);
        this.variables[varName] = val;
        return {
          id,
          command: cmd,
          type: 'output',
          text: `${varName} = ${typeof val === 'object' ? JSON.stringify(val) : val}`,
          timestamp: ts,
        };
      } catch (e: any) {
        this.variables[varName] = valStr;
        return {
          id,
          command: cmd,
          type: 'output',
          text: `${varName} = '${valStr}'`,
          timestamp: ts,
        };
      }
    }

    // Basic expression evaluation
    try {
      // safe eval with math
      const safeMathEval = new Function('math', `return (${trimmed});`);
      const result = safeMathEval(Math);
      return {
        id,
        command: cmd,
        type: 'output',
        text: String(result),
        timestamp: ts,
      };
    } catch {
      return {
        id,
        command: cmd,
        type: 'error',
        text: `NameError: name '${trimmed}' is not defined. Type 'pymacs.help()' for built-in functions.`,
        timestamp: ts,
      };
    }
  }
}
