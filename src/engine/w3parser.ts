import { VirtualDOMNode, XMLFilterDef, DOMNodeType } from '../types/dom';

/**
 * PyMACS W3 DOM Level 3 Parser & Serializer
 * Implements the core paradigm: JSON = XML = DOM
 */

export function parseXMLToDOM(xmlString: string): { root: VirtualDOMNode; filters: XMLFilterDef[] } {
  const filters: XMLFilterDef[] = [];
  const cleanXml = xmlString.trim();

  // Extract <DOM_SCHEMA> or <Filters> if present
  const filterMatches = cleanXml.matchAll(/<Filter\s+([^>]+)\/>/gi);
  for (const match of filterMatches) {
    const attrString = match[1];
    const typeMatch = attrString.match(/type=["']([^"']+)["']/i);
    const strengthMatch = attrString.match(/strength=["']([^"']+)["']/i);
    const targetMatch = attrString.match(/target=["']([^"']+)["']/i);

    filters.push({
      id: 'filt_' + Math.random().toString(36).substring(2, 7),
      name: typeMatch ? typeMatch[1] : 'gaussian',
      type: (typeMatch ? typeMatch[1] : 'gaussian') as any,
      strength: strengthMatch ? parseFloat(strengthMatch[1]) : 1.0,
      frequency: 60,
      enabled: true,
      targetTag: targetMatch ? targetMatch[1] : undefined,
    });
  }

  // Safe parsing with native DOMParser and fallback
  let xmlDoc: Document | null = null;
  try {
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(cleanXml, 'application/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError && parserError.length > 0) {
        xmlDoc = null;
      }
    }
  } catch (err) {
    console.warn('DOMParser failed, falling back:', err);
    xmlDoc = null;
  }

  if (!xmlDoc || !xmlDoc.documentElement) {
    // Return fallback valid node
    return {
      root: createDefaultNode('DOM_SCHEMA', 'PyMACS Live DOM Stream', 400, 260),
      filters,
    };
  }

  const rootElement = xmlDoc.documentElement;
  let counter = 0;

  function convertW3Node(element: Element, parentId: string | null = null, depth = 0): VirtualDOMNode {
    counter++;
    const id = element.getAttribute('id') || `node_${counter}_${element.tagName.toLowerCase()}`;
    const massAttr = parseFloat(element.getAttribute('mass') || element.getAttribute('gravity-mass') || '1.0');
    const chargeAttr = parseFloat(element.getAttribute('charge') || '0.0');
    const pinnedAttr = element.getAttribute('pinned') === 'true';
    const xAttr = parseFloat(element.getAttribute('x') || `${200 + (counter % 5) * 110}`);
    const yAttr = parseFloat(element.getAttribute('y') || `${120 + Math.floor(counter / 5) * 90}`);
    const radiusAttr = parseFloat(element.getAttribute('radius') || '45');

    const attributes: Record<string, string> = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }

    const styles: Record<string, string> = {};
    const styleAttr = element.getAttribute('style');
    if (styleAttr) {
      styleAttr.split(';').forEach((pair) => {
        const [k, v] = pair.split(':').map((s) => s.trim());
        if (k && v) styles[k] = v;
      });
    }

    // Extract text content if it's a leaf
    let text = '';
    const children: VirtualDOMNode[] = [];

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      // 3 is Node.TEXT_NODE, 1 is Node.ELEMENT_NODE
      if (child.nodeType === 3) {
        const val = child.textContent?.trim() || '';
        if (val) text += (text ? ' ' : '') + val;
      } else if (child.nodeType === 1) {
        const childElem = child as Element;
        // Don't duplicate Filter nodes as elements if already handled
        if (childElem.tagName.toLowerCase() !== 'filter') {
          children.push(convertW3Node(childElem, id, depth + 1));
        }
      }
    }

    const node: VirtualDOMNode = {
      id,
      nodeType: 'ELEMENT_NODE',
      tagName: element.tagName,
      attributes,
      children,
      textContent: text || attributes['title'] || attributes['label'],
      parentId,
      physics: {
        x: isNaN(xAttr) ? 300 : xAttr,
        y: isNaN(yAttr) ? 200 : yAttr,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        mass: isNaN(massAttr) ? 1.0 : massAttr,
        charge: isNaN(chargeAttr) ? 0.0 : chargeAttr,
        pinned: pinnedAttr,
        radius: isNaN(radiusAttr) ? 45 : radiusAttr,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.02,
      },
      styles,
      reactiveBindings: [
        {
          property: 'physics.y',
          streamId: 'gravity_stream',
          transformLambda: 'val => val * mass',
        },
      ],
    };

    return node;
  }

  const root = convertW3Node(rootElement);
  return { root, filters };
}

export function domToXML(node: VirtualDOMNode, indent = 0): string {
  const pad = '  '.repeat(indent);
  const attrs = Object.entries(node.attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  const attrStr = attrs ? ' ' + attrs : '';

  if (node.children.length === 0 && !node.textContent) {
    return `${pad}<${node.tagName}${attrStr}/>\n`;
  }

  let xml = `${pad}<${node.tagName}${attrStr}>`;
  if (node.textContent && node.children.length === 0) {
    xml += `${node.textContent}</${node.tagName}>\n`;
    return xml;
  }

  xml += '\n';
  if (node.textContent) {
    xml += `${pad}  <Text>${node.textContent}</Text>\n`;
  }

  for (const child of node.children) {
    xml += domToXML(child, indent + 1);
  }

  xml += `${pad}</${node.tagName}>\n`;
  return xml;
}

export function domToJSON(node: VirtualDOMNode): Record<string, any> {
  return {
    id: node.id,
    tag: node.tagName,
    attributes: node.attributes,
    physics: {
      x: Math.round(node.physics.x),
      y: Math.round(node.physics.y),
      mass: node.physics.mass,
      charge: node.physics.charge,
      pinned: node.physics.pinned,
    },
    textContent: node.textContent,
    children: node.children.map(domToJSON),
  };
}

export function jsonToDOM(json: Record<string, any>, parentId: string | null = null): VirtualDOMNode {
  const id = json.id || `node_${Math.random().toString(36).substring(2, 8)}`;
  const tag = json.tag || json.tagName || 'Node';
  const phys = json.physics || {};

  const children: VirtualDOMNode[] = Array.isArray(json.children)
    ? json.children.map((child: any) => jsonToDOM(child, id))
    : [];

  return {
    id,
    nodeType: 'ELEMENT_NODE',
    tagName: tag,
    attributes: json.attributes || {},
    children,
    textContent: json.textContent || json.text || '',
    parentId,
    physics: {
      x: phys.x ?? 300,
      y: phys.y ?? 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      mass: phys.mass ?? 1.0,
      charge: phys.charge ?? 0.0,
      pinned: phys.pinned ?? false,
      radius: phys.radius ?? 45,
      rotation: 0,
      vRot: 0,
    },
    styles: json.styles || {},
    reactiveBindings: json.reactiveBindings || [],
  };
}

export function flattenDOMTree(root: VirtualDOMNode): VirtualDOMNode[] {
  const list: VirtualDOMNode[] = [];
  function traverse(n: VirtualDOMNode) {
    list.push(n);
    for (const c of n.children) {
      traverse(c);
    }
  }
  traverse(root);
  return list;
}

function createDefaultNode(tag: string, text: string, x: number, y: number): VirtualDOMNode {
  return {
    id: 'default_root',
    nodeType: 'ELEMENT_NODE',
    tagName: tag,
    attributes: { class: 'schema-root' },
    children: [],
    textContent: text,
    physics: {
      x,
      y,
      vx: 0,
      vy: 0,
      mass: 1.0,
      charge: 0,
      pinned: false,
      radius: 50,
      rotation: 0,
      vRot: 0,
    },
    styles: {},
  };
}
