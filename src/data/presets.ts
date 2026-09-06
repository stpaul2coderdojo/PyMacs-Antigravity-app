export interface PresetData {
  id: string;
  name: string;
  description: string;
  gravityY: number;
  gravityX: number;
  xml: string;
  defaultScript: string;
}

export const PRESETS: PresetData[] = [
  {
    id: 'pymacs_microkernel',
    name: 'PyMACS Antigravity Microkernel',
    description: 'Autonomous microkernel architecture from pymacs.wordpress.com with null gravity vector, reactive functionoids, and W3 DOM',
    gravityY: -2.5, // Null / upward antigravity float!
    gravityX: 0,
    xml: `<DOM_SCHEMA id="pymacs_kernel_schema" filter="gaussian" compliance="W3C-DOM3">
  <!-- XML Filter definitions for reactive state machines -->
  <Filter type="gaussian" strength="2.4" target="all"/>
  <Filter type="magnetic" strength="1.6" target="terminal"/>
  <Filter type="chromatic" strength="0.8" target="core"/>

  <Layer id="kernel_core" mass="2.5" radius="58" charge="1.2" x="220" y="240" style="color:#ffffff;border:#4ADE80">
    <Title>PyMACS Microkernel Core</Title>
    <Status>KERNEL_ONLINE</Status>
    <Vector field="[0, -9.81, 0]"/>
    <Thread pool="8" scheduler="HTCondor-Shadow"/>
    
    <Terminal id="term_01" mass="1.0" radius="46" charge="0.5" x="420" y="160">
      <Title>PyMACS TTY Console</Title>
      <Command>pymacs.boot --antigravity --w3</Command>
    </Terminal>

    <PrinterDashboard id="dash_brother" mass="1.4" radius="52" charge="0.8" x="520" y="320">
      <Title>Printer Dashboard Functionoid</Title>
      <State>STREAMING_DOM_MAPS</State>
    </PrinterDashboard>

    <ReactivePipe id="pipe_lambda" mass="0.8" radius="40" charge="0.2" x="180" y="410">
      <Title>Lambda Map Stream</Title>
      <Output>TERMINATING_STATE_MACHINE</Output>
    </ReactivePipe>
  </Layer>

  <OptimizerNode id="node_video_dl" mass="1.2" radius="48" charge="0.4" x="650" y="200">
    <Title>Video 4K Downscaler</Title>
    <Codec>AV1/VP9 Stream Cache</Codec>
  </OptimizerNode>
</DOM_SCHEMA>`,
    defaultScript: `// PyMACS DOM JavaScript Execution Engine
// Testing JSON = XML = DOM manipulation
console.log("Initializing PyMACS Antigravity DOM Script...");

// Adjust gravity vector dynamically
document.setGravity(-4.5);

// Apply impulse to floating DOM nodes
const core = document.getElementById("kernel_core");
if (core) {
  core.applyForce(0, -18);
  console.log("Lifting PyMACS Kernel Core into antigravity suspension");
}

// Spawn a new reactive W3 DOM node
document.spawnNode("ReactiveTag", "Lambda.EventSink", 380, 240, 0.9);
console.log("Spawned ReactiveTag node dynamically via JIT compiler!");
`,
  },
  {
    id: 'w3_browser_view',
    name: 'W3 Reactive Browser OS',
    description: 'Browser OS layout demonstrating DOM tree nesting, media download pipeline, and live W3 parser sync',
    gravityY: 0.8, // Low floating orbital gravity
    gravityX: 0,
    xml: `<DOM_SCHEMA id="browser_os_tree" filter="chromatic" compliance="W3C-DOM3">
  <Filter type="chromatic" strength="1.2" target="all"/>
  <Filter type="glow" strength="2.0" target="active"/>

  <BrowserWindow id="main_window" mass="3.0" radius="65" charge="1.0" x="280" y="200">
    <Title>PyMACS Browser Viewport</Title>
    <Protocol>pymacs://antigravity.sys</Protocol>
    
    <NavigationNode id="nav_bar" mass="1.1" radius="44" charge="0.3" x="480" y="140">
      <Title>URL Router & W3 Parser</Title>
    </NavigationNode>

    <ContentCard id="media_stream" mass="1.8" radius="52" charge="0.6" x="460" y="320">
      <Title>Optimized 4K Video Buffer</Title>
      <Status>CHUNKS_CACHED</Status>
    </ContentCard>
  </BrowserWindow>

  <WorkerNode id="worker_dispatcher" mass="1.2" radius="46" charge="0.9" x="680" y="250">
    <Title>ThreadPool Worker x8</Title>
    <Throughput>1200 ops/sec</Throughput>
  </WorkerNode>
</DOM_SCHEMA>`,
    defaultScript: `// Browser DOM Layout Controller
console.log("Evaluating Browser OS layout script...");
const nav = document.getElementById("nav_bar");
if (nav) {
  nav.applyForce(8, -12);
}
document.setGravity(0.2); // Near-zero G orbital suspension
console.log("Set orbital suspension G=0.2 m/s²");
`,
  },
  {
    id: 'quantum_mesh',
    name: 'Zero-G Quantum Reactive Matrix',
    description: 'Full zero-gravity constellation with high repulsive charges, continuous lambda pulse, and orbital suspension',
    gravityY: 0.0, // Perfect zero-G!
    gravityX: 0,
    xml: `<DOM_SCHEMA id="quantum_matrix" filter="magnetic" compliance="W3C-DOM3">
  <Filter type="magnetic" strength="2.5" target="all"/>
  <Filter type="orbital" strength="1.5" target="particles"/>

  <Singularity id="singularity_0" mass="4.0" radius="68" charge="2.0" x="380" y="260">
    <Title>Zero-G Singularity Core</Title>
    <Energy>QUANTUM_EQUILIBRIUM</Energy>
    
    <Particle id="p1" mass="0.6" radius="34" charge="1.0" x="240" y="160"><Title>Pulse α</Title></Particle>
    <Particle id="p2" mass="0.6" radius="34" charge="1.0" x="520" y="160"><Title>Pulse β</Title></Particle>
    <Particle id="p3" mass="0.6" radius="34" charge="1.0" x="240" y="360"><Title>Pulse γ</Title></Particle>
    <Particle id="p4" mass="0.6" radius="34" charge="1.0" x="520" y="360"><Title>Pulse δ</Title></Particle>
  </Singularity>
</DOM_SCHEMA>`,
    defaultScript: `// Quantum Matrix Pulse Dispatcher
console.log("Triggering quantum repulsion radial pulse...");
const allNodes = document.querySelectorAll("*");
allNodes.forEach((n, idx) => {
  const angle = (idx / allNodes.length) * Math.PI * 2;
  n.applyForce(Math.cos(angle) * 15, Math.sin(angle) * 15);
});
console.log("Applied radial momentum to " + allNodes.length + " DOM nodes.");
`,
  },
];
