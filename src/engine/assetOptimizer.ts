import { OptimizedAsset } from '../types/dom';
export type { OptimizedAsset };

export const INITIAL_OPTIMIZED_ASSETS: OptimizedAsset[] = [
  {
    id: 'asset_vid_1',
    name: 'Cosmic_Antigravity_Orbital.mp4',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    originalSizeBytes: 42800000, // 42.8 MB
    optimizedSizeBytes: 7420000,  // 7.4 MB (82.7% saved)
    codec: 'AV1 / VP9 Opus Stream',
    downscaleRatio: '3840x2160 (4K) -> 1920x1080 (60fps)',
    compressionRatio: 82.7,
    bufferLoadedPercent: 94,
    isCached: true,
  },
  {
    id: 'asset_img_1',
    name: 'PyMACS_Microkernel_Blueprint.png',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    originalSizeBytes: 18400000, // 18.4 MB
    optimizedSizeBytes: 1240000,  // 1.2 MB (93.3% saved)
    codec: 'AVIF Lossless Chroma Subsampled',
    downscaleRatio: '4096x4096 -> 1440x1440 (q=92)',
    compressionRatio: 93.3,
    bufferLoadedPercent: 100,
    isCached: true,
  },
  {
    id: 'asset_vid_2',
    name: 'Quantum_Sensor_Telemetry_Stream.webm',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
    originalSizeBytes: 28900000, // 28.9 MB
    optimizedSizeBytes: 4100000,  // 4.1 MB
    codec: 'H.265 CRF=23 Chunked Ring-Buffer',
    downscaleRatio: '2560x1440 -> 1280x720 (120fps)',
    compressionRatio: 85.8,
    bufferLoadedPercent: 88,
    isCached: true,
  },
  {
    id: 'asset_img_2',
    name: 'W3_DOM_Ast_Topology_Map.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    originalSizeBytes: 9800000,  // 9.8 MB
    optimizedSizeBytes: 890000,   // 890 KB
    codec: 'WebP Progressive Scanline',
    downscaleRatio: '2800x1800 -> 1080x720',
    compressionRatio: 90.9,
    bufferLoadedPercent: 100,
    isCached: true,
  },
];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
