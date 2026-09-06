import { VirtualDOMNode, JSCompilationOutput } from '../types/dom';

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

export function executeAntigravityScript(
  code: string,
  nodes: VirtualDOMNode[],
  setGravity: (g: number) => void,
  spawnNode: (tag: string, text: string, x?: number, y?: number, mass?: number) => void
): JSCompilationOutput {
  const startTime = performance.now();
  const tokens = tokenizeJS(code);
  const ast = buildSimpleAST(tokens);
  const bytecodeInstructions = generateBytecode(tokens);
  const logs: string[] = [];

  // Sandbox document proxy
  const sandboxDocument = {
    getElementById(id: string) {
      const found = nodes.find((n) => n.id === id);
      if (!found) return null;
      return {
        id: found.id,
        tagName: found.tagName,
        get mass() { return found.physics.mass; },
        set mass(m: number) { found.physics.mass = m; },
        applyForce(fx: number, fy: number) {
          found.physics.vx += fx;
          found.physics.vy += fy;
          logs.push(`[DOM] applyForce(${fx}, ${fy}) on #${found.id}`);
        },
        setPosition(x: number, y: number) {
          found.physics.x = x;
          found.physics.y = y;
        },
        setAttribute(k: string, v: string) {
          found.attributes[k] = v;
        },
      };
    },
    querySelectorAll(selector: string) {
      return nodes.map((n) => this.getElementById(n.id)!);
    },
    spawnNode(tag: string, text: string, x?: number, y?: number, mass?: number) {
      spawnNode(tag, text, x, y, mass);
      logs.push(`[DOM] spawnNode(<${tag}> "${text}")`);
    },
    setGravity(g: number) {
      setGravity(g);
      logs.push(`[Engine] setGravity(${g} m/s²)`);
    },
  };

  const sandboxConsole = {
    log: (...args: any[]) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
    warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' ')),
    error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
  };

  try {
    // Run inside controlled Function sandbox
    const sandboxRunner = new Function('document', 'console', 'nodes', code);
    sandboxRunner(sandboxDocument, sandboxConsole, nodes);

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
