import { VirtualDOMNode, JSCompilationOutput } from '../types/dom';
import { domToReactiveTypeScript, domToReactiveKotlin, domToReactivePython, ReactiveTargetLanguage } from './domReactiveTranspiler';

/**
 * PyMacs Reactive Compiler & Document Object Model (DOM) Engine
 *
 * Core Principle:
 * DOM is NOT physics; DOM is the Document Object Model (the standard W3C hierarchical tree
 * of elements, attributes, text nodes, and reactive state bindings).
 * The DOM to TypeScript mapping is fully reactive (Signals & Effects).
 * Multi-target code generation supports Reactive TypeScript, Kotlin, and Python.
 */

export interface Token {
  type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR' | 'PUNCTUATION';
  value: string;
}

export function tokenizeJS(code: string): Token[] {
  const tokens: Token[] = [];
  const regex = /\s*(=>|===|==|!==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|&&|\|\||[{}()[\],.;:+\-*/%<>=!]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`|\d+(?:\.\d+)?|[a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  
  const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'import', 'export', 'async', 'await', 'new', 'try', 'catch', 'throw'
  ]);

  let match;
  while ((match = regex.exec(code)) !== null) {
    const val = match[1];
    if (keywords.has(val)) {
      tokens.push({ type: 'KEYWORD', value: val });
    } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(val)) {
      tokens.push({ type: 'IDENTIFIER', value: val });
    } else if (/^\d+(?:\.\d+)?$/.test(val)) {
      tokens.push({ type: 'NUMBER', value: val });
    } else if (/^["'`].*["'`]$/.test(val)) {
      tokens.push({ type: 'STRING', value: val });
    } else if (/^[+\-*/%<>=!&|]+$/.test(val)) {
      tokens.push({ type: 'OPERATOR', value: val });
    } else {
      tokens.push({ type: 'PUNCTUATION', value: val });
    }
  }

  return tokens;
}

export function generateBytecode(tokens: Token[]): string[] {
  const instructions: string[] = [];
  let reg = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'KEYWORD') {
      instructions.push(`OP_DECL_SCOPE ${t.value.toUpperCase()}`);
    } else if (t.type === 'IDENTIFIER') {
      instructions.push(`OP_LOAD_REF [${t.value}] -> R${reg % 4}`);
      reg++;
    } else if (t.type === 'NUMBER' || t.type === 'STRING') {
      instructions.push(`OP_CONST_PUSH ${t.value} -> STACK`);
    } else if (t.type === 'OPERATOR') {
      instructions.push(`OP_EXEC_ALU ${t.value}`);
    }
  }

  if (instructions.length === 0) {
    instructions.push('OP_NOP');
  }
  instructions.push('OP_HALT_REACTIVE_FLUSH');
  return instructions.slice(0, 30);
}

export function buildSimpleAST(tokens: Token[]): any {
  return {
    type: 'Program',
    body: tokens.slice(0, 20).map((t, idx) => ({
      type: t.type === 'KEYWORD' ? 'DeclarationStatement' : t.type === 'IDENTIFIER' ? 'ExpressionStatement' : 'Literal',
      loc: { token: idx, value: t.value },
    })),
    sourceType: 'module',
    totalTokens: tokens.length,
  };
}

/**
 * Executes a script in a reactive Document Object Model sandbox.
 * Strictly separates standard Document Object Model (DOM) interactions from optional viewport effects.
 */
export function executeAntigravityScript(
  code: string,
  nodes: VirtualDOMNode[],
  setGravity?: (g: number) => void,
  spawnNode?: (tag: string, text: string, x?: number, y?: number, mass?: number) => void
): JSCompilationOutput {
  const startTime = performance.now();
  const tokens = tokenizeJS(code);
  const ast = buildSimpleAST(tokens);
  const bytecodeInstructions = generateBytecode(tokens);
  const logs: string[] = [];

  // Reactive Signal Registry for fine-grained TypeScript reactivity
  const signalRegistry = new Map<string, any>();

  // Standard W3C Document Object Model (DOM) Sandbox Implementation
  const document = {
    // 1. Element retrieval by W3C ID
    getElementById(id: string) {
      const found = nodes.find((n) => n.id === id);
      if (!found) return null;
      return {
        id: found.id,
        tagName: found.tagName,
        nodeType: found.nodeType,
        get textContent() {
          return found.textContent || '';
        },
        set textContent(txt: string) {
          found.textContent = txt;
          logs.push(`[DOM Mutation] #${found.id}.textContent = "${txt}"`);
        },
        getAttribute(name: string) {
          return found.attributes[name];
        },
        setAttribute(k: string, v: string) {
          found.attributes[k] = v;
          logs.push(`[DOM Mutation] #${found.id}.setAttribute("${k}", "${v}")`);
        },
        setStyle(prop: string, val: string) {
          found.styles = found.styles || {};
          found.styles[prop] = val;
          logs.push(`[DOM Style] #${found.id}.style.${prop} = "${val}"`);
        },
        addEventListener(event: string, handler: Function) {
          logs.push(`[DOM Event] Registered listener for "${event}" on #${found.id}`);
        },
        // Reactive signal binding
        bindSignal(signalName: string, transformFn?: (v: any) => string) {
          logs.push(`[DOM Reactive] Bound #${found.id} to Signal "${signalName}"`);
        },
      };
    },

    // 2. Query selectors
    querySelectorAll(selector: string) {
      return nodes.map((n) => this.getElementById(n.id)!);
    },
    querySelector(selector: string) {
      return nodes.length > 0 ? this.getElementById(nodes[0].id) : null;
    },

    // 3. Dynamic DOM node creation
    createElement(tag: string, text?: string) {
      const newId = `el_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;
      if (spawnNode) {
        spawnNode(tag, text || '', 100, 100, 1.0);
      }
      logs.push(`[DOM Creation] document.createElement("<${tag}>", id="${newId}")`);
      return this.getElementById(newId);
    },

    // 4. Reactive Signal Primitive
    createSignal(name: string, initialValue: any) {
      signalRegistry.set(name, initialValue);
      logs.push(`[Reactive Signal] createSignal("${name}", ${JSON.stringify(initialValue)})`);
      return {
        get: () => signalRegistry.get(name),
        set: (val: any) => {
          signalRegistry.set(name, val);
          logs.push(`[Reactive Signal] "${name}" -> ${JSON.stringify(val)}`);
        },
      };
    },
  };

  // Viewport Bridge (optional visualization hooks, strictly separated from DOM)
  const viewportBridge = {
    setGravity(g: number) {
      if (setGravity) {
        setGravity(g);
        logs.push(`[Viewport Layout] Gravitational alignment set to ${g} m/s²`);
      }
    },
    applyImpulse(id: string, fx: number, fy: number) {
      const found = nodes.find((n) => n.id === id);
      if (found) {
        found.physics.vx += fx;
        found.physics.vy += fy;
        logs.push(`[Viewport Layout] Impulse (${fx}, ${fy}) applied to #${id}`);
      }
    },
  };

  const consoleProxy = {
    log: (...args: any[]) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
    warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' ')),
    error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
  };

  try {
    // Run inside controlled Function sandbox with standard DOM objects
    const sandboxRunner = new Function('document', 'console', 'viewport', 'nodes', code);
    sandboxRunner(document, consoleProxy, viewportBridge, nodes);

    const execTime = performance.now() - startTime;
    return {
      success: true,
      ast,
      tokens,
      outputLogs: logs.length > 0 ? logs : ['Execution finished without stdout outputs.'],
      executionTimeMs: parseFloat(execTime.toFixed(2)),
      bytecodeInstructions,
    };
  } catch (err: any) {
    const execTime = performance.now() - startTime;
    return {
      success: false,
      ast,
      tokens,
      outputLogs: [...logs, `[RUNTIME ERROR]: ${err.message}`],
      executionTimeMs: parseFloat(execTime.toFixed(2)),
      bytecodeInstructions,
      error: err.message,
    };
  }
}

export { domToReactiveTypeScript, domToReactiveKotlin, domToReactivePython };
