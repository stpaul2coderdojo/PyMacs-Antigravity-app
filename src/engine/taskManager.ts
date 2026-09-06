/**
 * PyMACS Task & Coroutine Scheduler
 * Simulates FreeRTOS + asyncio cooperative multitasking with HTCondor-shadow distributed processes.
 */

export interface CoroutineTask {
  id: string;
  name: string;
  category: 'kernel' | 'render' | 'network' | 'agent' | 'user';
  state: 'RUNNING' | 'SLEEPING' | 'WAIT_IO' | 'SUSPENDED';
  cpuPercent: number;
  memoryKb: number;
  priority: 'REALTIME' | 'HIGH' | 'NORMAL' | 'LOW';
  coroutineFunction: string;
  runtimeSeconds: number;
  shadowHost?: string;
}

export const INITIAL_TASKS: CoroutineTask[] = [
  {
    id: 'task_001',
    name: 'dom.render_loop_60fps',
    category: 'render',
    state: 'RUNNING',
    cpuPercent: 4.8,
    memoryKb: 14200,
    priority: 'REALTIME',
    coroutineFunction: 'async def render_physics_step(dt=0.016)',
    runtimeSeconds: 248,
    shadowHost: 'local_gpu_worker',
  },
  {
    id: 'task_002',
    name: 'bsi.brother_printer_spooler',
    category: 'agent',
    state: 'RUNNING',
    cpuPercent: 1.2,
    memoryKb: 6800,
    priority: 'NORMAL',
    coroutineFunction: 'async def bsi_poll_queue(port=8080)',
    runtimeSeconds: 195,
    shadowHost: 'brother_mfc_lan',
  },
  {
    id: 'task_003',
    name: 'pml.merkle_proof_verifier',
    category: 'kernel',
    state: 'SLEEPING',
    cpuPercent: 0.3,
    memoryKb: 8900,
    priority: 'HIGH',
    coroutineFunction: 'async def verify_pml_signatures()',
    runtimeSeconds: 98,
    shadowHost: 'onchain_cluster',
  },
  {
    id: 'task_004',
    name: 'htcondor.openran_shadow_allocator',
    category: 'network',
    state: 'RUNNING',
    cpuPercent: 2.1,
    memoryKb: 11400,
    priority: 'HIGH',
    coroutineFunction: 'async def balance_robotic_cpus(nodes=16)',
    runtimeSeconds: 154,
    shadowHost: 'openran_cell_7',
  },
  {
    id: 'task_005',
    name: 'ravattt.rpa_algebra_agent',
    category: 'agent',
    state: 'WAIT_IO',
    cpuPercent: 0.5,
    memoryKb: 5400,
    priority: 'LOW',
    coroutineFunction: 'async def observe_dom_mutations()',
    runtimeSeconds: 72,
    shadowHost: 'edge_rpa_pod',
  },
];

export class TaskManager {
  private static tasks: CoroutineTask[] = [...INITIAL_TASKS];

  public static getTasks(): CoroutineTask[] {
    return this.tasks;
  }

  public static toggleTask(id: string): CoroutineTask | undefined {
    const t = this.tasks.find((task) => task.id === id);
    if (t) {
      t.state = t.state === 'RUNNING' ? 'SUSPENDED' : 'RUNNING';
      t.cpuPercent = t.state === 'RUNNING' ? +(Math.random() * 3 + 1).toFixed(1) : 0;
    }
    return t;
  }

  public static killTask(id: string): boolean {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx >= 0) {
      this.tasks.splice(idx, 1);
      return true;
    }
    return false;
  }

  public static spawnTask(name: string, category: CoroutineTask['category'] = 'user'): CoroutineTask {
    const newTask: CoroutineTask = {
      id: `task_${Date.now().toString(36)}`,
      name,
      category,
      state: 'RUNNING',
      cpuPercent: +(Math.random() * 2 + 0.5).toFixed(1),
      memoryKb: Math.floor(Math.random() * 4000 + 2000),
      priority: 'NORMAL',
      coroutineFunction: `async def ${name.replace(/[^a-zA-Z0-9_]/g, '_')}()`,
      runtimeSeconds: 0,
      shadowHost: 'htcondor_worker_pool',
    };
    this.tasks.push(newTask);
    return newTask;
  }

  public static getSystemMetrics() {
    const running = this.tasks.filter((t) => t.state === 'RUNNING');
    const totalCpu = running.reduce((sum, t) => sum + t.cpuPercent, 0) + 3.5;
    const totalMem = this.tasks.reduce((sum, t) => sum + t.memoryKb, 0) / 1024;
    return {
      runningCount: running.length,
      totalCount: this.tasks.length,
      cpuPercent: +Math.min(99, totalCpu).toFixed(1),
      memoryMb: +totalMem.toFixed(1),
    };
  }
}
