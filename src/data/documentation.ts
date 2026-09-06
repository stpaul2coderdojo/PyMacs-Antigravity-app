export interface DocArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  categories: string[];
  readTime: string;
  summary: string;
  content: string[];
  codeSnippets?: {
    language: string;
    title: string;
    code: string;
  }[];
  diagramPlantUML?: string;
}

export const DOCUMENTATION_ARTICLES: DocArticle[] = [
  {
    id: 'computable-maps-hof',
    title: 'Computable Maps, Higher-Order Functions (H.O.F) and Brother Solutions Interface (BSI)',
    subtitle: 'Code generation from JSON databases, XML data mining, and provable UI synthesis for printer dashboards',
    author: 'Dr. Bheemaiah Anil K',
    date: 'Research Paper • PyMACS Series',
    categories: ['Computable Maps', 'Higher-Order Functions', 'BSI', 'UI Synthesis'],
    readTime: '6 min read',
    summary:
      'Exploration of Computable Maps as a mathematical and computational abstraction for generating verifiable user interfaces, data-mining XML streams, and integrating with the Brother Solutions Interface (BSI) using functional code synthesis.',
    content: [
      'In traditional embedded and enterprise user interface design, UI layouts are statically hardcoded into templates or procedural render trees. When dynamic business rules or hardware interface definitions change, synchronization between data schemas, business logic, and visual presentation breaks down.',
      'Computable Maps solve this dilemma by treating every UI component as a first-class mathematical mapping from a JSON database state to a provable document layout. By applying Higher-Order Functions (HOF) to XML data streams, PyMACS enables automated code generation where user interfaces are synthesized deterministically at runtime.',
      'The Brother Solutions Interface (BSI) serves as a prime case study: embedded printer dashboards require verifiable document structures where input fields, queue telemetry, and print job queues can be proven consistent before dispatching to physical hardware actuators.',
      'Through Computable Maps, XML filter specifications define reactive state machines. These state machines map sensory and network events into Higher-Order Function pipelines that emit updated DOM representations without procedural UI boilerplate.'
    ],
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Computable Map Pipeline Definition',
        code: `// Computable Map: Transforming JSON State Store into Verifiable DOM Tree
type ComputableMap<T, R> = (state: T, hofs: HigherOrderFilter[]) => R;

const printerDashboardMap: ComputableMap<PrinterState, VirtualDOMNode> = (state, filters) => {
  // Higher-Order Function pipeline data mining XML
  const verifiedStreams = filters.reduce(
    (stream, filter) => filter.apply(stream),
    state.rawDocumentQueue
  );

  return {
    id: 'dash_brother_runtime',
    nodeType: 'ELEMENT_NODE',
    tagName: 'PrinterDashboard',
    attributes: { compliance: 'BSI-v3', status: state.hardwareReady ? 'IDLE' : 'BUSY' },
    children: verifiedStreams.map(mapJobToFloatingNode),
    physics: { x: 520, y: 320, mass: 1.4, charge: 0.8, pinned: false }
  };
};`
      }
    ],
    diagramPlantUML: `@startuml
skinparam backgroundColor #161618
skinparam classFontColor #D1D1D1
skinparam classFontSize 12
skinparam classBorderColor #4ADE80

class "JSON Database" as JSON {
  +documentState: Object
  +jobQueue: Array
}

class "XML Data Mining Filter" as XML {
  +schema: DOM_SCHEMA
  +applyHOF(): Stream
}

class "Brother Solutions Interface (BSI)" as BSI {
  +printerDashboard: Functionoid
  +provablePrintStructure(): UML
}

class "PyMACS Virtual DOM" as DOM {
  +antigravityNodes: Array
  +renderPhysicsGraph(): Void
}

JSON --> XML : "Serialization Equivalence"
XML --> BSI : "Higher-Order Function Transformation"
BSI --> DOM : "Synthesized Antigravity Layout"
@enduml`
  },
  {
    id: 'provable-markup-language',
    title: 'Provable Markup Language (PML) & PlantUML Integration',
    subtitle: 'Bridging formal specification in UML to executable Python and W3C DOM Level-3 reactive schemas',
    author: 'Dr. Bheemaiah Anil K',
    date: 'Architecture Specification • PyMACS Series',
    categories: ['PML', 'PlantUML', 'Provable Computing', 'W3C DOM'],
    readTime: '7 min read',
    summary:
      'Provable Markup Language (PML) unifies software architecture modeling and runtime code execution. By converting text-based PlantUML specifications into executable Python coroutines and W3C XML schemas, software models become provably correct.',
    content: [
      'Provable computing in modern software engineering is frequently divorced from actual runtime execution. Architectural diagrams drawn in modeling suites become obsolete the moment code is written.',
      'Provable Markup Language (PML) bridges this chasm. In PML, the architectural model is authored directly in plain text using an extended PlantUML dialect. The PyMACS compiler parses this specification, verifies invariants mathematically, and compiles directly to executable Python microkernel routines and reactive XML DOM schemas.',
      'Within the XML schema layer, PML introduces reactive filter definitions: `<Filter type="gaussian|magnetic|chromatic|orbital" strength="..." target="..."/>`. These filters are not merely decorative CSS effects; they represent formal state machines that govern how physical forces (charges, spring coefficients, blur thresholds) propagate through the running document graph.',
      'Because the representation is bi-directionally isomorphic (JSON = XML = DOM), changes to the PML specification propagate with mathematical certainty to the live physics engine and the persistent state database.'
    ],
    codeSnippets: [
      {
        language: 'xml',
        title: 'PML XML Schema with Reactive State Machine Filters',
        code: `<!-- Provable Markup Language (PML) Schema Definition -->
<DOM_SCHEMA id="pymacs_kernel_schema" filter="gaussian" compliance="W3C-DOM3">
  <!-- Formal Reactive State Machine Filter Declarations -->
  <Filter type="gaussian" strength="2.4" target="all"/>
  <Filter type="magnetic" strength="1.6" target="terminal"/>
  <Filter type="chromatic" strength="0.8" target="core"/>
  <Filter type="orbital" strength="1.5" target="particles"/>

  <!-- Provable Hardware & UI Layer Nodes -->
  <Layer id="kernel_core" mass="2.5" radius="58" charge="1.2" x="220" y="240">
    <Title>PyMACS Microkernel Core</Title>
    <Status>KERNEL_ONLINE</Status>
    <Vector field="[0, -9.81, 0]"/>
    <Thread pool="8" scheduler="HTCondor-Shadow"/>
  </Layer>
</DOM_SCHEMA>`
      }
    ]
  },
  {
    id: 'pymacs-microkernel-freertos',
    title: 'PyMACS: A Python Microkernel for Cardculators and Browser Operating Systems',
    subtitle: 'Cooperative async/await coroutines blended with FreeRTOS deterministic edge guarantees',
    author: 'Dr. Bheemaiah Anil K',
    date: 'System Architecture • PyMACS Series',
    categories: ['Microkernel', 'Python', 'FreeRTOS', 'Browser OS', 'Edge Computing'],
    readTime: '9 min read',
    summary:
      'Conceptual origins of PyMACS as an ultra-compact microkernel for cardculator hardware, designed to scale to a full-fledged browser OS. Comparing PyMACS with CircuitPython and MicroPython while blending with FreeRTOS.',
    content: [
      'Microcontrollers and edge devices have historically been bifurcated into two extremes: bare-metal C/C++ running real-time operating systems like FreeRTOS, or high-level scripting runtimes like MicroPython and CircuitPython.',
      'While MicroPython and CircuitPython provide pleasant developer ergonomics, their monolithic runtime loop struggles with complex asynchronous concurrency, dynamic process isolation, and multi-tenant scheduling.',
      'PyMACS was born from a vision for a "cardculator"—an ultra-low-power, pocket-sized computing instrument that could dynamically reconfigure its operating model. Rather than being restricted to a simple calculator firmware, PyMACS was engineered as a modular microkernel capable of scaling into a browser-grade operating system.',
      'The key architectural breakthrough is the hybridization of FreeRTOS with Python cooperative multitasking: FreeRTOS handles hard real-time interrupt servicing, deterministic timer ticks, and hardware peripheral drivers; meanwhile, PyMACS runs as a high-priority FreeRTOS task, executing Python coroutines via async/await with automatic garbage collection.',
      'This hybrid architecture allows edge devices to host lightweight browser-like applications, complete with reactive markup parsing, network lambdas, and dynamic code updates without flashing firmware.'
    ],
    codeSnippets: [
      {
        language: 'python',
        title: 'PyMACS Cooperative Microkernel Coroutine Loop',
        code: `# PyMACS Hybrid Microkernel Task Scheduler
import asyncio
from freertos import Task, Queue

class PyMACSKernel:
    def __init__(self):
        self.msg_queue = Queue(maxsize=128)
        self.active_functionoids = []

    async def event_dispatch_loop(self):
        """Cooperative event pump running on top of FreeRTOS tick"""
        while True:
            event = await self.msg_queue.get_async()
            # Dispatch to Computable Map handlers
            for functionoid in self.active_functionoids:
                await functionoid.handle_event(event)
            await asyncio.sleep(0.001)  # Yield cooperative slice

    def register_functionoid(self, func):
        self.active_functionoids.append(func)
        print(f"[PyMACS] Functionoid registered: {func.name}")`
      }
    ]
  },
  {
    id: 'openran-htcondor-scheduling',
    title: 'Dynamic Process Scheduling on OpenRAN Clusters with HTCondor Shadows',
    subtitle: 'Harnessing idle robotic CPUs, Cloud Foundry architectures, and Kubernetes Lambda execution',
    author: 'Dr. Bheemaiah Anil K',
    date: 'Distributed Systems • PyMACS Series',
    categories: ['OpenRAN', 'HTCondor', 'Kubernetes', 'Cloud Foundry', 'Robotics'],
    readTime: '8 min read',
    summary:
      'Implementing high-throughput distributed process scheduling across OpenRAN-based clusters of workstations, pairing Cloud Foundry / Kubernetes micro-lambdas with the HTCondor shadow architecture on idle robotic CPUs.',
    content: [
      'In edge deployments such as automated robotic workcells and OpenRAN telecom clusters, substantial compute capacity remains idle between burst transmissions and physical motion cycles.',
      'PyMACS implements a dynamic process scheduling architecture inspired by the HTCondor shadow system. Whenever a local edge microkernel encounters compute-intensive operations (such as media transcoding or neural inference), the task is packetized into a serialized lambda stream.',
      'The HTCondor shadow daemon discovers available compute cycles on adjacent OpenRAN workstations or idle robotic microprocessors, dynamically offloading execution without interrupting hard real-time physical control loops.',
      'When scaled to cloud infrastructure, this model maps directly to Cloud Foundry buildpacks and Kubernetes serverless lambdas, presenting a uniform thread-pool abstraction to the PyMACS Browser OS regardless of whether compute runs locally or across a distributed cluster.'
    ],
    codeSnippets: [
      {
        language: 'typescript',
        title: 'HTCondor-Shadow Thread Pool Telemetry Dispatch',
        code: `// Worker Thread Pool with HTCondor Shadow Dispatch
export function dispatchDynamicTask(pool: WorkerThread[], task: LambdaTask) {
  // Find worker with lowest load or lowest cycle contention
  const targetWorker = pool.reduce((prev, curr) => 
    curr.load < prev.load ? curr : prev
  );

  targetWorker.status = 'BUSY';
  targetWorker.currentTask = task.name;
  targetWorker.load = Math.min(100, targetWorker.load + task.cost);
  
  // Telemetry stream broadcast to PyMACS Browser OS
  return {
    dispatchedTo: targetWorker.id,
    shadowAffinity: 'OpenRAN-Node-04',
    cycleYieldLatencyUs: 14.2
  };
}`
      }
    ]
  },
  {
    id: 'restful-apis-ravattt-rpa',
    title: 'RESTful APIs on AWS API Gateway & RavaTTT Robotic Automation',
    subtitle: 'Unified Text services, Google Search API summarization, and operator algebras for browser widgets',
    author: 'Dr. Bheemaiah Anil K',
    date: 'Cloud & Automation • PyMACS Series',
    categories: ['AWS Gateway', 'Google Search API', 'RavaTTT', 'RPA', 'Operator Algebra'],
    readTime: '6 min read',
    summary:
      'Integration of cloud RESTful APIs on AWS API Gateway for Unified Text and summarized search, coupled with the RavaTTT language which brings algebraic operator logic to Robotic Process Automation widgets inside the PyMACS browser OS.',
    content: [
      'An operating system is only as capable as its communications and automation layer. PyMACS specifies two key cloud RESTful API suites implemented on AWS API Gateway:',
      '1. Unified Text API: A normalized text processing and canonical serialization interface allowing heterogeneous IoT and browser devices to exchange state with minimal footprint.',
      '2. Summarized Search API: Integrates with the Google Search API to summarize knowledge graphs directly into PML markup, enabling edge devices with constrained memory to render summarized intelligence.',
      'Complementing these cloud APIs is RavaTTT—a domain-specific language that merges Robotic Process Automation (RPA) with mathematical operator algebras.',
      'Within the PyMACS Browser OS, RavaTTT scripts execute autonomous widgets that monitor DOM state mutations, compose functional transformations, and automate user interaction flows with algebraic rigor.'
    ],
    codeSnippets: [
      {
        language: 'typescript',
        title: 'RavaTTT Operator Algebra Widget Pipeline',
        code: `// RavaTTT Operator Algebra: Composing Autonomous Browser Widgets
import { composeOperators, filterStream } from './ravatttEngine';

// Define algebraic transformation over DOM mutation events
const domWidgetPipeline = composeOperators(
  filterStream((event) => event.type === 'FORCE_APPLIED'),
  (event) => ({
    targetId: event.targetNode.id,
    algebraicMomentum: event.vector.x * event.vector.y,
    synthesizedAction: 'TELEMETRY_EMIT'
  })
);

console.log("[RavaTTT] Algebraic widget running on PyMACS Browser OS");`
      }
    ]
  },
  {
    id: 'ts-antigravity-dom-engine',
    title: 'The TypeScript Antigravity DOM Engine: JSON = XML = DOM in Action',
    subtitle: 'Interactive implementation guide for 2D Euler physics, spring tethering, and live W3 parsing',
    author: 'Dr. Bheemaiah Anil K & AI Studio Engineering',
    date: 'Engine Implementation • PyMACS Series',
    categories: ['TypeScript', 'Physics Engine', 'W3C DOM Level-3', 'Vite'],
    readTime: '10 min read',
    summary:
      'Complete architectural walkthrough of this web application: how Virtual DOM nodes are mapped to physical particles, simulated with negative vertical gravity vectors, and synchronized across XML schemas and JSON persistence stores in real time.',
    content: [
      'This application serves as the production TypeScript reference implementation of the PyMACS visual runtime.',
      'Every tag in the W3C XML schema is parsed into a VirtualDOMNode. In addition to standard DOM attributes (tagName, attributes, children, textContent), each node holds a physical state structure (x, y, vx, vy, mass, charge, radius, pinned).',
      'The physics engine executes an explicit Euler integration loop at 60 frames per second:',
      '• Gravity Field: Configurable vertical vector (typically negative, e.g. gy = -2.5 m/s² for null-G levitation).',
      '• Coulomb Repulsion: When nodes drift too close, electrostatic forces repel them inversely proportional to squared distance, preventing cluster collapse.',
      '• Hooke Spring Tethering: Child nodes maintain dynamic spring tethers to their parent container elements, preserving visual hierarchy while allowing floating articulation.',
      '• Pointer Interaction: The user cursor acts as an active repulsive field with controllable radius and impulse dissipation.',
      'Through this interactive canvas, developers can witness the living reality of Dr. Bheemaiah Anil K\'s vision: a browser operating system where data, markup, and visual physics are three expressions of the same unified reality.'
    ],
    codeSnippets: [
      {
        language: 'typescript',
        title: 'Euler Integration & Antigravity Physics Step',
        code: `// Physics Step Function from src/engine/physics.ts
export function stepPhysics(nodes: VirtualDOMNode[], config: PhysicsWorldConfig, dt: number) {
  // 1. Accumulate gravitational and electrostatic forces
  for (const node of nodes) {
    if (node.physics.pinned) continue;
    
    // Inverted vertical gravity vector (Antigravity float)
    node.physics.vy += config.gravityY * dt * 20;
    node.physics.vx += config.gravityX * dt * 20;
    
    // 2. Electrostatic particle repulsion
    // 3. Hooke's Law spring tethering to parent nodes
    // 4. Velocity damping & boundary restitution bounce
    node.physics.vx *= config.damping;
    node.physics.vy *= config.damping;
    
    node.physics.x += node.physics.vx * dt * 60;
    node.physics.y += node.physics.vy * dt * 60;
  }
}`
      }
    ]
  }
];
