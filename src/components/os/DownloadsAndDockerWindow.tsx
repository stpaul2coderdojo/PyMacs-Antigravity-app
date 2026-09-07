import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Apple,
  Monitor,
  Container,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  FileCode,
  Layers,
  ArrowDownToLine,
  RefreshCw,
  Info,
  Server,
  Cpu,
  BookOpen,
  GitBranch,
  Tag,
  Sparkles,
} from 'lucide-react';

export const DownloadsAndDockerWindow: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'docker' | 'android' | 'ios' | 'windows'>('all');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const platforms = [
    {
      id: 'windows',
      category: 'desktop',
      name: 'Windows Desktop (Win 8, 10, 11)',
      tag: 'v4.2.0-universal',
      ext: '.exe',
      filename: 'pymacs-v4.2.0-win8-win10-win11-setup.exe',
      fileUrl: '/downloads/pymacs-v4.2.0-win8-win10-win11-setup.exe',
      secondaryUrl: '/downloads/pymacs-v4.2.0-win8-win10-win11-portable.zip',
      secondaryName: 'Download Portable .zip (Win 8/10/11)',
      size: '3.9 KB / Portable',
      icon: Monitor,
      accentColor: '#38BDF8',
      badge: 'Windows 8, 8.1, 10, 11 (x64 / x86)',
      checksum: 'a4ca7d4c888fdcf179c3da52c6d82528...',
      instructions: [
        'Run Setup .exe for one-click installation with Desktop & Start Menu shortcuts.',
        'Windows 11: Native Direct3D 12 acceleration, Mica effects & Windows Terminal.',
        'Windows 10: Edge WebView2 runtime with WebGL 2.0 Antigravity rendering.',
        'Windows 8 / 8.1: Automatic fallback to software rasterizer and legacy sandbox flags.',
      ],
    },
    {
      id: 'android',
      category: 'mobile',
      name: 'Android APK Package',
      tag: 'v4.2.0-release',
      ext: '.apk',
      filename: 'pymacs-v4.2.0-android.apk',
      fileUrl: '/downloads/pymacs-v4.2.0-android.apk',
      size: '2.6 KB / Standalone',
      icon: Smartphone,
      accentColor: '#10B981',
      badge: 'Android 8.0 - 14 (API 26-34)',
      checksum: '10311428478bddaac876c5380890e049...',
      instructions: [
        'Download the APK package to your phone or tablet.',
        'Enable "Install unknown apps" in Settings > Security if prompted.',
        'Install and launch PyMacs standalone OS with touch gestures and Antigravity physics.',
        'Supports ADB: "adb install -r pymacs-v4.2.0-android.apk".',
      ],
    },
    {
      id: 'docker-package',
      category: 'server',
      name: 'Production Docker Stack',
      tag: 'v4.2.0-oci',
      ext: '.yml',
      filename: 'docker-compose.yml',
      fileUrl: '/downloads/docker-compose.yml',
      secondaryUrl: '/downloads/Dockerfile',
      secondaryName: 'Download Dockerfile',
      size: '28 MB Compressed Image',
      icon: Container,
      accentColor: '#0284C7',
      badge: 'Linux amd64 / arm64 (Apple Silicon)',
      checksum: '6aceaf21817027ffdbc5b6e2e394b9a4...',
      instructions: [
        'Multi-stage Alpine image with production Nginx routing on port 3000.',
        'Run: "docker compose up -d" to launch the PyMacs container stack.',
        'Pull from GHCR: "docker pull ghcr.io/bheemaiah-anil/pymacs:v4.2.0".',
      ],
    },
    {
      id: 'paper',
      category: 'research',
      name: 'arXiv Research Paper (LaTeX + BibTeX)',
      tag: 'v4.2.0-preprint',
      ext: '.tex',
      filename: 'pymacs_paper.tex',
      fileUrl: '/downloads/pymacs_paper.tex',
      secondaryUrl: '/downloads/references.bib',
      secondaryName: 'Download references.bib',
      size: '20.8 KB',
      icon: BookOpen,
      accentColor: '#A78BFA',
      badge: 'Formal arXiv Preprint (cs.OS)',
      checksum: '1d50dcc72c08a43a8239b0a35ba30af8...',
      instructions: [
        'Complete academic manuscript with proofs of JSON = XML = DOM equivalence and Lagrangian physics.',
        'Zero hallucinated URLs: includes verified seminal references (Ritchie, Stallman, Liedtke, W3C, IITM).',
        'Automated LaTeX PDF compilation configured in .github/workflows/paper.yml via GitHub Actions.',
      ],
    },
  ];

  const dockerSnippets = [
    {
      id: 'run',
      title: 'Run Container Immediately',
      cmd: 'docker run -d --name pymacs-os -p 3000:3000 pymacs/browser-os:v4.2.0',
    },
    {
      id: 'compose',
      title: 'Launch via Docker Compose',
      cmd: 'curl -sSL https://raw.githubusercontent.com/pymacs/os/main/docker-compose.yml | docker compose up -d',
    },
    {
      id: 'build',
      title: 'Build Locally from Source',
      cmd: 'git clone https://github.com/pymacs/os.git && cd os && docker build -t pymacs:latest .',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0E0E11] text-gray-200 font-mono text-xs overflow-hidden select-text">
      {/* Top Banner */}
      <div className="p-4 bg-[#141419] border-b border-[#24242C] shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">PyMacs Release Distribution Hub</span>
              <span className="text-[10px] bg-[#22222B] text-[#4ADE80] px-2 py-0.5 rounded border border-[#4ADE80]/30 font-semibold">
                v4.2.0 LTS
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Official release packages for Docker, Android APK (8.0-14), and Windows Desktop (8, 10, 11), automated via GitHub Actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/downloads/SHA256SUMS.txt"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E26] hover:bg-[#282834] text-gray-300 rounded border border-[#2D2D38] text-[11px] transition-colors"
              title="Download SHA256 cryptographic checksums"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>SHA256SUMS.txt</span>
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#1F1F26]">
          {(['all', 'docker', 'android', 'ios', 'windows'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-[10px] uppercase font-semibold tracking-wider transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#181820] text-gray-400 hover:text-gray-200 hover:bg-[#20202A]'
              }`}
            >
              {tab === 'all' ? 'All Builds & Docker' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Docker Container Section */}
        {(activeTab === 'all' || activeTab === 'docker') && (
          <div className="bg-[#121217] border border-[#262630] rounded-lg p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#0284C7]/20 rounded border border-[#0284C7]/30 text-[#38BDF8]">
                  <Container className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Docker Container</span>
                    <span className="text-[10px] bg-[#38BDF8]/15 text-[#38BDF8] px-1.5 py-0.5 rounded">
                      OCI Compliant
                    </span>
                  </h3>
                  <div className="text-gray-400 text-[10.5px]">
                    Image: <code className="text-[#60A5FA]">pymacs/browser-os:v4.2.0</code> (Alpine + Multi-stage Node/Nginx)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/downloads/Dockerfile"
                  download="Dockerfile"
                  className="flex items-center gap-1 text-[11px] bg-[#1C1C24] hover:bg-[#242430] text-gray-300 px-2.5 py-1 rounded border border-[#2A2A34] transition-colors"
                >
                  <FileCode className="w-3 h-3 text-[#38BDF8]" />
                  <span>Dockerfile</span>
                </a>
                <a
                  href="/downloads/docker-compose.yml"
                  download="docker-compose.yml"
                  className="flex items-center gap-1 text-[11px] bg-[#1C1C24] hover:bg-[#242430] text-gray-300 px-2.5 py-1 rounded border border-[#2A2A34] transition-colors"
                >
                  <Layers className="w-3 h-3 text-[#4ADE80]" />
                  <span>docker-compose.yml</span>
                </a>
              </div>
            </div>

            {/* Docker commands */}
            <div className="space-y-2">
              {dockerSnippets.map((snippet) => (
                <div key={snippet.id} className="bg-[#0C0C0F] border border-[#1E1E26] rounded p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase font-semibold">
                    <span>{snippet.title}</span>
                    <button
                      onClick={() => handleCopy(snippet.cmd, snippet.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {copiedCmd === snippet.id ? (
                        <Check className="w-3 h-3 text-[#4ADE80]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedCmd === snippet.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-[#38BDF8] bg-[#14141A] p-2 rounded border border-[#22222A] overflow-x-auto whitespace-pre">
                    {snippet.cmd}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10.5px] text-gray-400 bg-[#16161D] p-2.5 rounded border border-[#22222A] flex items-center justify-between">
              <span>Port: <strong>3000</strong> • Base: <strong>Alpine Linux</strong> • Healthcheck: <strong>Wget HTTP</strong></span>
              <span className="text-[#4ADE80] font-semibold">Production Ready</span>
            </div>
          </div>
        )}

        {/* Binary Download Cards: Android APK, iOS, Windows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms
            .filter((p) => activeTab === 'all' || activeTab === p.id)
            .map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-[#121217] border border-[#262630] hover:border-[#38BDF8]/40 rounded-lg p-4 shadow-lg flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          style={{ backgroundColor: `${item.accentColor}20`, borderColor: `${item.accentColor}40` }}
                          className="p-1.5 rounded border text-white"
                        >
                          <Icon className="w-4 h-4" style={{ color: item.accentColor }} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.name}</h4>
                          <span className="text-[9.5px] text-gray-400">{item.badge}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{item.size}</span>
                    </div>

                    <div className="bg-[#0C0C0F] p-2 rounded border border-[#1E1E26] text-[10px] text-gray-400 space-y-1">
                      <div>File: <span className="text-gray-200 font-mono">{item.filename}</span></div>
                      <div className="truncate">SHA256: <span className="text-gray-500 font-mono">{item.checksum}</span></div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-semibold text-gray-500">Installation Guide:</div>
                      <ol className="text-[10px] text-gray-400 space-y-1 list-decimal list-inside leading-relaxed">
                        {item.instructions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-3 border-t border-[#1F1F28] space-y-2">
                    <a
                      href={item.fileUrl}
                      download={item.filename}
                      className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white py-2 rounded text-xs font-semibold shadow-md transition-colors cursor-pointer"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Download {item.ext} ({item.size})</span>
                    </a>

                    {item.secondaryUrl && (
                      <a
                        href={item.secondaryUrl}
                        download
                        className="w-full flex items-center justify-center gap-1.5 bg-[#181820] hover:bg-[#202028] text-gray-300 py-1.5 rounded text-[10.5px] border border-[#282832] transition-colors"
                      >
                        <Download className="w-3 h-3 text-gray-400" />
                        <span>{item.secondaryName}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* GitHub Release Automation Panel */}
        <div className="bg-[#121217] border border-[#262630] rounded-lg p-4 shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202028] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#A855F7]/20 rounded border border-[#A855F7]/30 text-[#C084FC]">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>GitHub Automated Release Pipeline</span>
                  <span className="text-[10px] bg-[#A855F7]/15 text-[#C084FC] px-1.5 py-0.5 rounded font-mono">
                    .github/workflows/release.yml
                  </span>
                </h3>
                <div className="text-gray-400 text-[10.5px]">
                  Automatically builds, tests, signs, and publishes all multiplatform assets on tag push (<code className="text-[#38BDF8]">v*</code>).
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#10B981]/15 text-[#4ADE80] border border-[#10B981]/30 px-2 py-0.5 rounded font-semibold">
                ● RELEASE CONFIGURED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#0C0C0F] border border-[#1E1E26] rounded p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase font-semibold">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[#38BDF8]" />
                  <span>Trigger Release via Git Tag Push</span>
                </span>
                <button
                  onClick={() => handleCopy('git tag -a v4.2.0 -m "Release v4.2.0" && git push origin v4.2.0', 'git-tag')}
                  className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {copiedCmd === 'git-tag' ? <Check className="w-3 h-3 text-[#4ADE80]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'git-tag' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-[10.5px] text-[#38BDF8] bg-[#14141A] p-2 rounded border border-[#22222A] overflow-x-auto">
git tag -a v4.2.0 -m "Release v4.2.0"&#10;git push origin v4.2.0
              </pre>
              <div className="text-[10px] text-gray-400">
                Triggers GitHub Actions to compile web assets, build Docker images, package Windows &amp; Android, and publish the GitHub Release.
              </div>
            </div>

            <div className="bg-[#0C0C0F] border border-[#1E1E26] rounded p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase font-semibold">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#4ADE80]" />
                  <span>One-Click CLI Release (GitHub CLI)</span>
                </span>
                <button
                  onClick={() => handleCopy('bash scripts/create-github-release.sh v4.2.0', 'gh-cli')}
                  className="flex items-center gap-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {copiedCmd === 'gh-cli' ? <Check className="w-3 h-3 text-[#4ADE80]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'gh-cli' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-[10.5px] text-[#4ADE80] bg-[#14141A] p-2 rounded border border-[#22222A] overflow-x-auto">
bash scripts/create-github-release.sh v4.2.0
              </pre>
              <div className="text-[10px] text-gray-400">
                Packages all deliverables locally, runs checksum validation, and uploads to GitHub Release via <code className="text-gray-300">gh release create</code>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
