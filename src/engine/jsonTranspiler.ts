import { VirtualDOMNode, XMLFilterDef } from '../types/dom';
import { parseXMLToDOM, domToXML, domToJSON, jsonToDOM } from './w3parser';

/**
 * PyMACS JSON ⇄ XML Transpiler Engine
 * Supports both structured VirtualDOM/PML JSON format and arbitrary JSON objects.
 */

export interface TranspileResult {
  success: boolean;
  xml?: string;
  dom?: VirtualDOMNode;
  json?: Record<string, any>;
  filters?: XMLFilterDef[];
  error?: string;
}

/**
 * Transpiles arbitrary or structured JSON to valid PyMACS W3 XML
 */
export function transpileJSONToXML(jsonInput: string | Record<string, any>): TranspileResult {
  try {
    let parsed: Record<string, any>;
    if (typeof jsonInput === 'string') {
      parsed = JSON.parse(jsonInput);
    } else {
      parsed = jsonInput;
    }

    // Check if it's already a PyMACS VirtualDOMNode representation
    if (parsed.tagName || parsed.tag || (parsed.id && parsed.children)) {
      const dom = jsonToDOM(parsed);
      const xml = domToXML(dom);
      return {
        success: true,
        xml,
        dom,
        json: parsed,
      };
    }

    // If it's an arbitrary JSON object, convert it into semantically rich XML
    const xml = arbitraryJSONToXML(parsed);
    const domRes = parseXMLToDOM(xml);

    return {
      success: true,
      xml,
      dom: domRes.root,
      filters: domRes.filters,
      json: parsed,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to transpile JSON to XML',
    };
  }
}

/**
 * Transpiles edited XML to Live Virtual DOM
 */
export function transpileXMLToDOM(xmlInput: string): TranspileResult {
  try {
    const clean = xmlInput.trim();
    if (!clean) {
      throw new Error('XML input is empty');
    }
    const { root, filters } = parseXMLToDOM(clean);
    const json = domToJSON(root);

    return {
      success: true,
      dom: root,
      filters,
      json,
      xml: clean,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to transpile XML to DOM',
    };
  }
}

/**
 * Converts any arbitrary JSON structure into valid PML XML
 */
export function arbitraryJSONToXML(obj: Record<string, any>, rootTag = 'DOM_SCHEMA'): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<${rootTag} id="json_transpiled_root" compliance="W3C-DOM3" filter="gaussian">\n`;
  xml += `  <Filter type="gaussian" strength="2.0" target="all"/>\n`;
  xml += `  <Filter type="magnetic" strength="1.2" target="terminal"/>\n`;

  function serializeObject(val: any, tagName: string, indent: number): string {
    const pad = '  '.repeat(indent);
    const safeTag = sanitizeXmlTag(tagName);

    if (val === null || val === undefined) {
      return `${pad}<${safeTag} null="true"/>\n`;
    }

    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return `${pad}<${safeTag} type="${typeof val}">${escapeXml(String(val))}</${safeTag}>\n`;
    }

    if (Array.isArray(val)) {
      let str = `${pad}<${safeTag} isArray="true" length="${val.length}">\n`;
      val.forEach((item, index) => {
        const itemTag = isSingularTag(safeTag) ? 'Item' : `${safeTag.replace(/s$/i, '') || 'Item'}`;
        str += serializeObject(item, `${itemTag}_${index + 1}`, indent + 1);
      });
      str += `${pad}</${safeTag}>\n`;
      return str;
    }

    if (typeof val === 'object') {
      // Check if this object looks like an element with attributes
      const keys = Object.keys(val);
      const attributes: string[] = [];
      const childKeys: string[] = [];

      for (const k of keys) {
        if (typeof val[k] === 'string' || typeof val[k] === 'number' || typeof val[k] === 'boolean') {
          if (k.length <= 15 && !k.includes(' ')) {
            attributes.push(`${sanitizeXmlTag(k)}="${escapeXml(String(val[k]))}"`);
          } else {
            childKeys.push(k);
          }
        } else {
          childKeys.push(k);
        }
      }

      const attrStr = attributes.length > 0 ? ' ' + attributes.join(' ') : '';
      if (childKeys.length === 0) {
        return `${pad}<${safeTag}${attrStr}/>\n`;
      }

      let str = `${pad}<${safeTag}${attrStr}>\n`;
      for (const k of childKeys) {
        str += serializeObject(val[k], k, indent + 1);
      }
      str += `${pad}</${safeTag}>\n`;
      return str;
    }

    return `${pad}<${safeTag}>${escapeXml(String(val))}</${safeTag}>\n`;
  }

  const keys = Object.keys(obj);
  for (const key of keys) {
    xml += serializeObject(obj[key], key, 1);
  }

  xml += `</${rootTag}>\n`;
  return xml;
}

function sanitizeXmlTag(tag: string): string {
  const sanitized = tag.replace(/[^a-zA-Z0-9_-]/g, '_');
  if (/^[0-9]/.test(sanitized)) {
    return 'node_' + sanitized;
  }
  return sanitized || 'element';
}

function isSingularTag(tag: string): boolean {
  return !tag.endsWith('s') && !tag.endsWith('List') && !tag.endsWith('Array');
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
