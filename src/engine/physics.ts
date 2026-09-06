import { VirtualDOMNode } from '../types/dom';

export interface PhysicsWorldConfig {
  gravityY: number; // e.g. -9.81 (antigravity lift), 0 (zero-G), 9.81 (standard)
  gravityX: number;
  damping: number; // air resistance (e.g. 0.96)
  restitution: number; // bounce elasticity (e.g. 0.7)
  enableRepulsion: boolean; // nodes gently repel to create orbital spacing
  springTethering: boolean; // parent-child springs
  bounds: { width: number; height: number };
}

export function stepPhysics(
  nodes: VirtualDOMNode[],
  config: PhysicsWorldConfig,
  dt: number = 0.016,
  pointer?: { x: number; y: number; active: boolean; radius: number; strength: number }
): void {
  const nodeMap = new Map<string, VirtualDOMNode>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // 1. Apply gravity, damping, and pointer forces
  for (const node of nodes) {
    if (node.physics.pinned) continue;

    // Gravity force (scaled for screen units)
    // Positive gravityY pulls downward; negative pulls upward (antigravity)
    const effectiveGravity = (config.gravityY * 18) / Math.max(0.2, node.physics.mass);
    const effectiveGravityX = (config.gravityX * 18) / Math.max(0.2, node.physics.mass);

    node.physics.vy += effectiveGravity * dt;
    node.physics.vx += effectiveGravityX * dt;

    // Pointer repulsion / attraction (interactive Antigravity Field)
    if (pointer && pointer.active) {
      const dx = node.physics.x - pointer.x;
      const dy = node.physics.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < pointer.radius) {
        const force = (1 - dist / pointer.radius) * pointer.strength * 40;
        node.physics.vx += (dx / dist) * force * dt;
        node.physics.vy += (dy / dist) * force * dt;
      }
    }

    // Velocity rotation
    node.physics.rotation += node.physics.vRot;
    node.physics.vRot *= 0.98;
  }

  // 2. Mutual node repulsion (Coulomb-like antigravity float)
  if (config.enableRepulsion && nodes.length > 1) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const dx = b.physics.x - a.physics.x;
        const dy = b.physics.y - a.physics.y;
        const distSq = dx * dx + dy * dy || 1;
        const minDist = (a.physics.radius + b.physics.radius) * 1.2;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          const overlap = minDist - dist;
          const force = (overlap / minDist) * 120;
          const nx = dx / dist;
          const ny = dy / dist;

          if (!a.physics.pinned) {
            a.physics.vx -= nx * force * dt * 0.5;
            a.physics.vy -= ny * force * dt * 0.5;
          }
          if (!b.physics.pinned) {
            b.physics.vx += nx * force * dt * 0.5;
            b.physics.vy += ny * force * dt * 0.5;
          }
        }
      }
    }
  }

  // 3. Parent-child spring tethering
  if (config.springTethering) {
    const springLength = 110;
    const stiffness = 2.5;

    for (const node of nodes) {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parent = nodeMap.get(node.parentId)!;
        const dx = node.physics.x - parent.physics.x;
        const dy = node.physics.y - parent.physics.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const delta = dist - springLength;

        const force = delta * stiffness;
        const fx = (dx / dist) * force * dt;
        const fy = (dy / dist) * force * dt;

        if (!node.physics.pinned) {
          node.physics.vx -= fx;
          node.physics.vy -= fy;
        }
        if (!parent.physics.pinned) {
          parent.physics.vx += fx * 0.5;
          parent.physics.vy += fy * 0.5;
        }
      }
    }
  }

  // 4. Integrate positions and enforce boundaries
  const { width, height } = config.bounds;
  const padding = 20;

  for (const node of nodes) {
    if (node.physics.pinned) {
      node.physics.vx = 0;
      node.physics.vy = 0;
      continue;
    }

    // Apply damping
    node.physics.vx *= config.damping;
    node.physics.vy *= config.damping;

    // Limit max velocity
    const speed = Math.sqrt(node.physics.vx * node.physics.vx + node.physics.vy * node.physics.vy);
    const maxSpeed = 25;
    if (speed > maxSpeed) {
      node.physics.vx = (node.physics.vx / speed) * maxSpeed;
      node.physics.vy = (node.physics.vy / speed) * maxSpeed;
    }

    node.physics.x += node.physics.vx;
    node.physics.y += node.physics.vy;

    // Viewport boundaries
    const r = node.physics.radius || 40;
    const safeWidth = Math.max(700, width);
    const safeHeight = Math.max(450, height);

    const minX = padding + r;
    const maxX = Math.max(minX + 40, safeWidth - padding - r);
    if (node.physics.x < minX) {
      node.physics.x = minX;
      node.physics.vx = Math.abs(node.physics.vx) * config.restitution;
    } else if (node.physics.x > maxX) {
      node.physics.x = maxX;
      node.physics.vx = -Math.abs(node.physics.vx) * config.restitution;
    }

    const minY = padding + r;
    const maxY = Math.max(minY + 40, safeHeight - padding - r);
    if (node.physics.y < minY) {
      node.physics.y = minY;
      node.physics.vy = Math.abs(node.physics.vy) * config.restitution;
    } else if (node.physics.y > maxY) {
      node.physics.y = maxY;
      node.physics.vy = -Math.abs(node.physics.vy) * config.restitution;
    }

    // Safety check for NaN or infinite coordinates
    if (!isFinite(node.physics.x)) node.physics.x = 400;
    if (!isFinite(node.physics.y)) node.physics.y = 300;
    if (!isFinite(node.physics.vx)) node.physics.vx = 0;
    if (!isFinite(node.physics.vy)) node.physics.vy = 0;
  }
}
