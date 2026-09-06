/**
 * PyMACS Document Store: JSON Database Engine
 * Persistent local database with collection grouping, search, versioning, and import/export.
 */

export interface JsonDbRecord {
  id: string;
  title: string;
  collection: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
  sizeBytes: number;
  data: Record<string, any>;
  description?: string;
}

const STORAGE_KEY = 'pymacs_json_database_v2';

export const DEFAULT_DATABASE_RECORDS: JsonDbRecord[] = [
  {
    id: 'doc_bsi_printer_01',
    title: 'Brother Solutions Interface (BSI) Printer Dashboard',
    collection: 'dashboards',
    tags: ['BSI', 'Computable Maps', 'Hardware', 'UI Synthesis'],
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-06T12:00:00.000Z',
    version: 3,
    sizeBytes: 1420,
    description: 'Hardware dashboard state synthesized via Higher-Order Functions for embedded printing.',
    data: {
      id: 'dash_brother_runtime',
      tag: 'PrinterDashboard',
      attributes: {
        compliance: 'BSI-v3',
        status: 'READY',
        tonerLevel: '88%',
        queueLength: '2',
        firmware: 'PyMACS-v4.2',
      },
      textContent: 'Brother Solutions Interface Active Controller',
      physics: { x: 480, y: 260, mass: 1.6, charge: 0.8, pinned: false },
      children: [
        {
          id: 'widget_spooler',
          tag: 'SpoolQueue',
          attributes: { priority: 'HIGH', activeJobs: '1' },
          textContent: 'Job #4092: PML Specification Print (24 Pages)',
          physics: { x: 320, y: 180, mass: 1.0, charge: 0.4, pinned: false },
          children: [],
        },
        {
          id: 'widget_telemetry',
          tag: 'HardwareSensors',
          attributes: { tempCelsius: '42.5', paperTray: 'OK' },
          textContent: 'Sensor Array: Laser Drum Nominal',
          physics: { x: 640, y: 340, mass: 1.1, charge: 0.5, pinned: false },
          children: [],
        },
      ],
    },
  },
  {
    id: 'doc_pml_microkernel_02',
    title: 'PyMACS Microkernel PML Schema & Reactive Filters',
    collection: 'schemas',
    tags: ['PML', 'Microkernel', 'PlantUML', 'Filters'],
    createdAt: '2026-09-02T14:30:00.000Z',
    updatedAt: '2026-09-06T11:15:00.000Z',
    version: 2,
    sizeBytes: 1850,
    description: 'Formal microkernel document model compiled from PlantUML specification.',
    data: {
      id: 'kernel_core',
      tag: 'Microkernel',
      attributes: {
        arch: 'ARM64-FreeRTOS',
        threads: '8',
        scheduler: 'HTCondor-Shadow',
        mode: 'ASYNC_COOPERATIVE',
      },
      textContent: 'PyMACS Microkernel Root Instance',
      physics: { x: 260, y: 220, mass: 2.5, charge: 1.2, pinned: false },
      children: [
        {
          id: 'node_tty',
          tag: 'ConsoleTerminal',
          attributes: { baud: '115200', vt100: 'true' },
          textContent: 'TTY IO Channel /dev/tty0',
          physics: { x: 140, y: 360, mass: 1.2, charge: 0.6, pinned: false },
          children: [],
        },
        {
          id: 'node_lambda_pipe',
          tag: 'LambdaStream',
          attributes: { rate: '120eps', buffer: 'RING_128' },
          textContent: 'Reactive Pipe: Event Dispatcher',
          physics: { x: 420, y: 150, mass: 0.9, charge: 0.7, pinned: false },
          children: [],
        },
      ],
    },
  },
  {
    id: 'doc_openran_cluster_03',
    title: 'OpenRAN Edge Cluster & HTCondor Shadow Monitor',
    collection: 'telemetry',
    tags: ['OpenRAN', 'HTCondor', 'Robotics', 'Clustering'],
    createdAt: '2026-09-04T08:00:00.000Z',
    updatedAt: '2026-09-06T09:40:00.000Z',
    version: 1,
    sizeBytes: 1610,
    description: 'Distributed workload allocator balancing idle robotic CPU cycles.',
    data: {
      id: 'cluster_shadow_allocator',
      tag: 'ClusterManager',
      attributes: {
        nodes: '16',
        idleRoboticCpus: '11',
        shadowAffinity: 'OpenRAN-Cell-7',
        loadAverage: '0.34',
      },
      textContent: 'HTCondor Dynamic Process Scheduler',
      physics: { x: 500, y: 300, mass: 2.0, charge: 1.0, pinned: false },
      children: [
        {
          id: 'worker_robotic_arm_4',
          tag: 'WorkerNode',
          attributes: { status: 'SHADOW_BURST', mips: '450' },
          textContent: 'Robotic Controller Node #4 (Idle Thread)',
          physics: { x: 380, y: 440, mass: 1.0, charge: 0.5, pinned: false },
          children: [],
        },
      ],
    },
  },
  {
    id: 'doc_ravattt_rpa_04',
    title: 'RavaTTT Operator Algebra DOM Automator',
    collection: 'automation',
    tags: ['RavaTTT', 'RPA', 'Operator Algebra', 'Browser OS'],
    createdAt: '2026-09-05T16:00:00.000Z',
    updatedAt: '2026-09-06T10:20:00.000Z',
    version: 1,
    sizeBytes: 1280,
    description: 'Autonomous browser widget driving dynamic DOM mutations algebraically.',
    data: {
      id: 'ravattt_operator_widget',
      tag: 'AutomatedWidget',
      attributes: {
        algebra: 'Semiring-Compose',
        ruleCount: '8',
        mutationRate: '60hz',
      },
      textContent: 'RavaTTT Autonomous Agent Execution Loop',
      physics: { x: 600, y: 200, mass: 1.4, charge: 0.9, pinned: false },
      children: [],
    },
  },
];

export class JsonDatabase {
  private static loadRaw(): JsonDbRecord[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return DEFAULT_DATABASE_RECORDS;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATABASE_RECORDS));
        return DEFAULT_DATABASE_RECORDS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_DATABASE_RECORDS;
    } catch (err) {
      console.warn('Failed to read from localStorage:', err);
      return DEFAULT_DATABASE_RECORDS;
    }
  }

  private static saveRaw(records: JsonDbRecord[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      }
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }

  public static getAll(): JsonDbRecord[] {
    return this.loadRaw();
  }

  public static get(id: string): JsonDbRecord | undefined {
    const all = this.loadRaw();
    return all.find((r) => r.id === id);
  }

  public static save(
    record: Omit<JsonDbRecord, 'createdAt' | 'updatedAt' | 'sizeBytes' | 'version'> & {
      version?: number;
      createdAt?: string;
    }
  ): JsonDbRecord {
    const all = this.loadRaw();
    const existingIndex = all.findIndex((r) => r.id === record.id);
    const now = new Date().toISOString();
    const dataStr = JSON.stringify(record.data);
    const sizeBytes = new Blob([dataStr]).size;

    let savedRecord: JsonDbRecord;

    if (existingIndex >= 0) {
      const existing = all[existingIndex];
      savedRecord = {
        ...existing,
        ...record,
        updatedAt: now,
        version: (existing.version || 1) + 1,
        sizeBytes,
      };
      all[existingIndex] = savedRecord;
    } else {
      savedRecord = {
        ...record,
        createdAt: record.createdAt || now,
        updatedAt: now,
        version: record.version || 1,
        sizeBytes,
      };
      all.unshift(savedRecord);
    }

    this.saveRaw(all);
    return savedRecord;
  }

  public static delete(id: string): boolean {
    const all = this.loadRaw();
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length !== all.length) {
      this.saveRaw(filtered);
      return true;
    }
    return false;
  }

  public static query(search: string, collection = 'All'): JsonDbRecord[] {
    const all = this.loadRaw();
    const term = search.toLowerCase().trim();

    return all.filter((r) => {
      const matchesCol = collection === 'All' || r.collection === collection;
      if (!matchesCol) return false;
      if (!term) return true;

      return (
        r.id.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term) ||
        r.tags.some((t) => t.toLowerCase().includes(term)) ||
        (r.description && r.description.toLowerCase().includes(term))
      );
    });
  }

  public static exportJSON(): string {
    const all = this.loadRaw();
    return JSON.stringify(
      {
        meta: {
          app: 'PyMACS Antigravity DOM Engine',
          author: 'Dr. Bheemaiah Anil K',
          blog: 'pymacs.wordpress.com',
          exportedAt: new Date().toISOString(),
          recordCount: all.length,
        },
        records: all,
      },
      null,
      2
    );
  }

  public static importJSON(jsonStr: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      let recordsToImport: JsonDbRecord[] = [];

      if (Array.isArray(parsed)) {
        recordsToImport = parsed;
      } else if (parsed.records && Array.isArray(parsed.records)) {
        recordsToImport = parsed.records;
      } else {
        throw new Error('Import file does not contain a valid record array');
      }

      const all = this.loadRaw();
      let importedCount = 0;

      for (const rec of recordsToImport) {
        if (!rec.id || !rec.data) continue;
        const idx = all.findIndex((r) => r.id === rec.id);
        const validated: JsonDbRecord = {
          id: rec.id,
          title: rec.title || rec.id,
          collection: rec.collection || 'imported',
          tags: Array.isArray(rec.tags) ? rec.tags : ['imported'],
          createdAt: rec.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: rec.version || 1,
          sizeBytes: rec.sizeBytes || new Blob([JSON.stringify(rec.data)]).size,
          data: rec.data,
          description: rec.description || 'Imported document',
        };

        if (idx >= 0) {
          all[idx] = validated;
        } else {
          all.push(validated);
        }
        importedCount++;
      }

      this.saveRaw(all);
      return { success: true, count: importedCount };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message };
    }
  }

  public static resetToDefaults(): void {
    this.saveRaw(DEFAULT_DATABASE_RECORDS);
  }
}
