# PyMacs: Microkernel, Computable Maps & Antigravity DOM Engine

> **Official Research & Reference:** [https://pymacs.wordpress.com](https://pymacs.wordpress.com)  
> **Author & Principal Architect:** Dr. Bheemaiah Anil K (`bheemaiah@alumni.iitm.ac.in`)  
> **Academic Paper:** [`paper/pymacs_paper.tex`](paper/pymacs_paper.tex) (arXiv Preprint Format)  
> **Architecture Paradigm:** `JSON = XML = DOM` Isomorphism • Provable Markup Language (PML) • W3C DOM Level-3  
> **License:** Apache-2.0

---

## 📜 arXiv Research Paper

The formal academic paper detailing the mathematical equivalence and physical architecture of PyMacs is located in [`paper/`](paper/):

- **Title:** *PyMacs: An Operating System in Python with Reactive Document Object Model, Antigravity Physics, and Bi-Directional JSON=XML=DOM Algebraic Equivalence*
- **LaTeX Source:** [`paper/pymacs_paper.tex`](paper/pymacs_paper.tex)
- **Bibliography:** [`paper/references.bib`](paper/references.bib) (Rigorous citations, no hallucinated URLs)
- **CI/CD Workflow:** [`.github/workflows/paper.yml`](.github/workflows/paper.yml) (Automated PDF compilation via GitHub Actions)

---

## 1. Executive Summary & Vision

**PyMACS** is a Python-based microkernel architecture conceptualized by Dr. Bheemaiah Anil K on [pymacs.wordpress.com](https://pymacs.wordpress.com). Initially conceived for an ultra-compact "cardculator" embedded device, PyMACS is designed to scale dynamically into a full-fledged, extensible **Browser Operating System** capable of edge computing, distributed workstation clustering, and automated robotic process orchestration.

While traditional embedded platforms like CircuitPython or MicroPython focus on running bare-metal Python scripts in a single loop, PyMACS couples:
1. **Deterministic Low-Level Execution**: Blending the predictable real-time execution guarantees of **FreeRTOS** at the hardware edge.
2. **Dynamic High-Level Microkernel Orchestration**: Leveraging Python's `async/await` cooperative multitasking, garbage-collected memory model, and dynamic scripting for high modularity.
3. **Browser OS Layer**: Exposing a browser-grade visual runtime running on modern web standards with provable document structures, reactive state machines, and floating DOM physics.

This repository provides the production-grade **TypeScript Reference Implementation** of the PyMACS DOM and Visual Runtime.

---

## 2. Theoretical Foundations (from pymacs.wordpress.com)

### 2.1 The Architectural Equivalence: `JSON = XML = DOM`
At the heart of the PyMACS engine is the structural equivalence theorem between data serialization, markup specification, and runtime document object models:
$$\text{JSON} \iff \text{XML} \iff \text{W3C DOM}$$

- **XML (Provable Markup Specification)**: Expresses hierarchical structure, attributes, and reactive filter definitions (Gaussian blur, magnetic charge fields, chromatic aberration, orbital tethers).
- **JSON (Computable Persistence Store)**: Serves as the high-speed data-interchange and state-machine persistence layer, supporting arbitrary database query transformations.
- **W3C Virtual DOM (Live Physics Graph)**: The runtime graph where every tag is instantiated as a physical body subject to gravity vectors, electrostatic repulsion, Hooke spring tethering, and event-driven impulses.

Mutations in any of the three representations instantly re-synthesize and synchronize across the other two without loss of fidelity.

```
       ┌───────────────────────────────┐
       │   XML Schema (PML / W3C)      │
       └──────────────┬────────────────┘
                      ▲
           parseXML   │   domToXML
                      ▼
       ┌───────────────────────────────┐
       │   Live Virtual DOM Engine     │
       │   (Antigravity Physics Graph) │
       └──────────────┬────────────────┘
                      ▲
           domToJSON  │   jsonToDOM
                      ▼
       ┌───────────────────────────────┐
       │   JSON Computable Store       │
       └───────────────────────────────┘
```

---

### 2.2 Computable Maps & Higher-Order Functions (H.O.F)
Documented in the research paper *"Computable Maps, H.O.F and Brother Solutions Interface (BSI)"*, PyMACS utilizes Computable Maps for:
- **Automatic Code Generation**: Synthesizing runtime logic directly from JSON document schemas.
- **XML Data Mining**: Querying and aggregating hierarchical attributes with declarative functional transforms.
- **Higher-Order Functions for UI Synthesis**: Passing functionoids and stream transformers to generate complex user interfaces (e.g. the **Printer Dashboard** case study) with mathematically verifiable layouts.
- **UI UML & Provable Document Structures**: Formalizing document layout and print constraints in UML before rendering.

---

### 2.3 Provable Markup Language (PML) & PlantUML Compilation
The blog introduces **PML (Provable Markup Language)**, which bridges formal software architecture modeling and runtime executable code:
- PML models can be authored using text-based **PlantUML** diagrams.
- The PyMACS toolchain compiles PML specifications directly into executable Python coroutines and W3C XML schemas.
- XML filter tags (`<Filter type="gaussian|magnetic|chromatic|orbital"/>`) define reactive state machines that modulate visual optics and physics charge distributions at runtime.

---

### 2.4 Hybrid Scheduling: FreeRTOS + HTCondor Shadow System
PyMACS explores cooperative multitasking across heterogeneous topologies:
- **Local Microkernel**: Uses Python `async/await` coroutines for non-blocking I/O and lightweight event dispatch.
- **FreeRTOS Integration**: Provides hard real-time guarantees for physical sensor and actuator loops on edge microcontrollers.
- **HTCondor Shadow System**: Schedules long-running batch jobs and dynamic processes across distributed OpenRAN workstation clusters and idle robotic CPUs, managing thread affinity and memory limits.
- **Cloud Foundry & Kubernetes Lambdas**: Scales serverless reactive pipes across cloud-hosted container runtimes.

---

### 2.5 RESTful APIs & RavaTTT RPA Integration
- **AWS API Gateway REST Services**: Hosted endpoints providing **Unified Text** services and **Summarized Search** powered by the Google Search API.
- **RavaTTT Language**: Merges Robotic Process Automation (RPA) with operator algebras, allowing automated widgets to run autonomously inside the PyMACS browser environment.

---

## 3. Web Application Implementation Highlights

This TypeScript web application models the complete PyMACS visual and computational architecture:

| Component | Research Foundation | Implementation Details |
| :--- | :--- | :--- |
| **Antigravity Viewport** | PyMACS Null-G Vector Fields | HTML5 Canvas 60 FPS physics loop with Euler integration, Hooke springs, Coulomb charges, and inverted vertical gravity ($g_y < 0$). |
| **W3 XML Parser & Filters** | PML & W3C DOM Level-3 | XML schema parser with reactive state machine filter definitions (`gaussian`, `magnetic`, `chromatic`, `orbital`). |
| **JSON Persistence** | Computable Maps & JSON DB | Live bi-directional JSON/XML/DOM state editor with import/export capabilities and structural verification. |
| **JIT JS Compiler** | Dynamic Python/JS Scripting | Sandboxed JavaScript execution engine exposing `document.setGravity()`, `document.spawnNode()`, `document.getElementById()`, and `applyForce()`. |
| **Worker Threads & Lambdas** | HTCondor & K8s Lambdas | 8-worker thread pool simulator with real-time utilization graphs, reactive pipes, and throughput telemetry. |
| **Media Optimizer** | Edge Video Pipeline | 4K/1080p asset downscaling engine tracking AV1/VP9 compression ratios, cache buffers, and latency. |
| **Blog & Documentation** | pymacs.wordpress.com | In-app research publication reader with categorized articles, UML diagrams, and academic citations. |

---

## 4. In-Engine JavaScript DOM API

When writing scripts in the **JS Compiler & AST** tab, the following sandbox APIs are exposed:

```javascript
// 1. Inspect DOM node hierarchy
const node = document.getElementById("kernel_core");
if (node) {
  // Apply instantaneous physical impulse vector (fx, fy)
  node.applyForce(0, -25);
}

// 2. Adjust antigravity environment vector (m/s²)
document.setGravity(-4.5); // Upward float
document.setGravity(0.0);  // Zero-gravity orbital drift
document.setGravity(9.81); // Earth gravity

// 3. Dynamically spawn floating reactive elements
document.spawnNode(
  "ReactiveTag",           // Element tag name
  "Lambda.EventSink",       // Text content
  380,                     // X coordinate
  240,                     // Y coordinate
  1.2                      // Mass (kg)
);

// 4. Query all active nodes and dispatch radial forces
const allNodes = document.querySelectorAll("*");
allNodes.forEach((n, idx) => {
  const angle = (idx / allNodes.length) * Math.PI * 2;
  n.applyForce(Math.cos(angle) * 20, Math.sin(angle) * 20);
});
```

---

## 5. Architectural Presets

The engine ships with three pre-configured archetypes:

1. **PyMACS Antigravity Microkernel (`pymacs_microkernel`)**
   - Negative vertical gravity ($g_y = -2.5\text{ m/s}^2$).
   - Hierarchical nodes: Microkernel Core, TTY Console, Printer Dashboard Functionoid, Lambda Map Stream, and Video 4K Downscaler.
2. **W3 Reactive Browser OS (`w3_browser_view`)**
   - Low orbital suspension ($g_y = +0.8\text{ m/s}^2$).
   - Layout nodes: Browser Viewport, URL Router, 4K Video Buffer, and ThreadPool Worker Dispatcher.
3. **Zero-G Quantum Reactive Matrix (`quantum_mesh`)**
   - Absolute zero gravity ($g_y = 0.0\text{ m/s}^2$).
   - Singularity core with 4 radial quantum pulse particles and maximum magnetic repulsion.

---

## 6. Project Structure

```
├── index.html                 # HTML entry point with Lora / Plus Jakarta Sans fonts
├── metadata.json              # Platform manifest and permissions
├── package.json               # Dependencies and scripts
├── src/
│   ├── App.tsx                # Master container, state sync, and physics loop
│   ├── main.tsx               # Root React entry point with ErrorBoundary
│   ├── index.css              # Tailwind CSS styles and full-height setup
│   ├── types/
│   │   └── dom.ts             # VirtualDOMNode, XMLFilterDef, WorkerThread types
│   ├── engine/
│   │   ├── w3parser.ts        # XML-to-DOM parser and DOM-to-XML serializer
│   │   ├── physics.ts         # 2D Euler integrator, spring tethering, and electrostatics
│   │   ├── compiler.ts        # Sandboxed JS script executor and DOM mock
│   │   ├── workerPool.ts      # ThreadPool metrics and simulated task dispatch
│   │   ├── reactiveStreams.ts # Lambda stream pipes and state machine transitions
│   │   └── assetOptimizer.ts  # Media chunk cache and downscaling simulator
│   ├── data/
│   │   ├── presets.ts         # Archetype definitions and startup XML
│   │   └── documentation.ts   # Research articles and papers from pymacs.wordpress.com
│   └── components/
│       ├── Header.tsx             # WordPress-styled masthead with gravity controls
│       ├── BrowserChrome.tsx      # URL bar, archetype selector, and navigation tabs
│       ├── DocumentationView.tsx  # In-app research blog and documentation reader
│       ├── AntigravityCanvas.tsx  # HTML5 Canvas rendering floating DOM elements
│       ├── XMLW3ParserView.tsx    # XML schema editor and filter visualizer
│       ├── JSONPersistenceView.tsx# JSON=XML=DOM persistence inspector
│       ├── JSCompilerView.tsx     # In-browser JS JIT compiler & AST console
│       ├── WorkerThreadPoolView.tsx# HTCondor worker thread pool visualizer
│       ├── MediaOptimizerView.tsx # 4K video downscaling and buffer telemetry
│       ├── NodeInspectorModal.tsx # Node physics inspector (mass, charge, pin)
│       ├── Footer.tsx             # WordPress-styled status bar and metadata
│       └── ErrorBoundary.tsx      # Microkernel recovery layer
```

---

## 7. Running the Application

### Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### Production Build
```bash
npm run build
```

### Code Validation
```bash
npm run lint
```

---

## 8. Academic References & Blog Citations

- **Blog Home**: [https://pymacs.wordpress.com](https://pymacs.wordpress.com)
- **Principal Author**: Dr. Bheemaiah Anil K
- **Primary Publications**:
  - *Computable Maps, H.O.F and Brother Solutions Interface (BSI)* — Dr. Bheemaiah Anil K
  - *Provable Markup Language (PML) in PlantUML & Python* — Dr. Bheemaiah Anil K
  - *PyMACS: A Microkernel for Cardculators and Browser Operating Systems* — Dr. Bheemaiah Anil K
  - *Dynamic Process Scheduling with HTCondor Shadows on OpenRAN Workstation Clusters* — Dr. Bheemaiah Anil K
  - *RavaTTT: Operator Algebras for Robotic Process Automation in Browser OS* — Dr. Bheemaiah Anil K
