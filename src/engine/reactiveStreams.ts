import { LambdaStream } from '../types/dom';

export const INITIAL_LAMBDA_STREAMS: LambdaStream[] = [
  {
    id: 'stream_gravity',
    name: 'Lambda.GravityFlux',
    sourceType: 'gravity_vector',
    currentValue: -9.81,
    frequencyHz: 60,
    pipeline: ['Source: G-Sensor', 'filter(v => abs(v) > 0.01)', 'map(v => v * mass_offset)', 'sink(DOM.physics.vy)'],
    history: [-9.81, -9.8, -9.82, -9.81, -9.79, -9.81, -9.83, -9.81],
  },
  {
    id: 'stream_repulsion',
    name: 'Lambda.CoulombMesh',
    sourceType: 'mouse_repulsion',
    currentValue: { x: 0, y: 0 },
    frequencyHz: 120,
    pipeline: ['Source: PointerField', 'throttle(8ms)', 'map((dx,dy) => invSqrt(dist)*k)', 'dispatch(Worker.01)'],
    history: [0.2, 0.4, 0.9, 1.2, 0.8, 0.5, 0.2, 0.1],
  },
  {
    id: 'stream_json_sync',
    name: 'Lambda.JsonXmlDiff',
    sourceType: 'json_state',
    currentValue: 'SYNC_STEADY',
    frequencyHz: 10,
    pipeline: ['Source: JSON Store', 'distinctUntilChanged()', 'xmlSerialize()', 'w3DomPatch()'],
    history: [1, 1, 0, 0, 1, 0, 0, 1],
  },
  {
    id: 'stream_quantum_clock',
    name: 'Lambda.QuantumClock',
    sourceType: 'clock_pulse',
    currentValue: 1.0,
    frequencyHz: 1000,
    pipeline: ['Source: HighResTimer', 'scan((acc, dt) => (acc + dt) % 360)', 'map(sin)', 'sink(Node.orbit)'],
    history: [0.0, 0.38, 0.71, 0.92, 1.0, 0.92, 0.71, 0.38],
  },
];

export function tickLambdaStreams(streams: LambdaStream[], gravityVal: number): LambdaStream[] {
  return streams.map((s) => {
    let nextVal = s.currentValue;
    let historyVal = 0;

    if (s.id === 'stream_gravity') {
      const jitter = (Math.random() - 0.5) * 0.05;
      nextVal = parseFloat((gravityVal + jitter).toFixed(2));
      historyVal = nextVal;
    } else if (s.id === 'stream_repulsion') {
      historyVal = Math.random() * 1.5;
      nextVal = {
        x: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        y: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      };
    } else if (s.id === 'stream_quantum_clock') {
      const t = Date.now() / 800;
      historyVal = parseFloat(Math.sin(t).toFixed(3));
      nextVal = historyVal;
    } else {
      historyVal = Math.random() > 0.8 ? 1 : 0;
    }

    const nextHistory = [...s.history.slice(1), historyVal];
    return {
      ...s,
      currentValue: nextVal,
      history: nextHistory,
    };
  });
}
