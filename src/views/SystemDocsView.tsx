import React, { useState } from 'react';

interface SystemDocsViewProps {
  showToast: (msg: string) => void;
}

interface DocItem {
  id: string;
  title: string;
  badge: string;
  icon: string;
  category: string;
  summary: string;
  content: string;
}

const DOCS_DATABASE: DocItem[] = [
  {
    id: 'architecture',
    title: 'System Architecture & Engineering Manual',
    badge: 'Core Specs',
    icon: 'account_tree',
    category: 'Architecture',
    summary: 'Embedded SQLite 3 WAL engine, Zero-Trace hardware keyring protocol, and UI rendering pipeline.',
    content: `# DevPulse — Complete System Architecture & Engineering Manual

## 1. System Overview
DevPulse is a cross-platform developer cockpit, task engine, and Git/Jira intelligence companion built for ultra-low memory footprints (<20MB resident RAM target).

## 2. Core Architectural Pillars
- **Embedded SQLite 3 WAL Engine**: PRAGMA journal_mode=WAL with asynchronous background checkpointing.
- **Zero-Trace Security Vault**: AES-256-GCM encryption with OS Hardware Keyrings (Apple Secure Enclave / Windows TPM & DPAPI).
- **Sub-16ms Liquid Glassmorphism**: Tailored for Apple macOS Sonoma and Windows 11 Fluent Acrylic / Mica.
- **Bi-Directional Telemetry**: Low-overhead GitHub GraphQL and Atlassian Jira Cloud REST API v3 sync.`
  },
  {
    id: 'docker-build',
    title: 'Docker & CI/CD Windows .exe Build Guide',
    badge: 'Build Pipeline',
    icon: 'token',
    category: 'Windows Build',
    summary: 'Multi-stage Dockerfile and GitHub Actions workflow for building Windows 11 binaries.',
    content: `# DevPulse — Docker & CI/CD Windows 11 Build Manual

## 1. Multi-Stage Dockerfile (Dockerfile.windows)
Uses Node 20, Rust 1.80, MinGW-w64, and NSIS to cross-compile the Windows .exe in any Docker container.

\`\`\`bash
# Build and extract Windows binary using Docker Compose:
docker compose up build-windows-exe
\`\`\`

## 2. GitHub Actions CI/CD (.github/workflows/build-windows.yml)
Compiles true native MSVC binaries on Windows-latest runners with every Git push.`
  },
  {
    id: 'tauri-windows',
    title: 'Windows 11 Native Desktop (Tauri & Rust)',
    badge: 'Native App',
    icon: 'desktop_windows',
    category: 'Windows Build',
    summary: 'Tauri v1.5 / v2 Rust application, Mica translucency, and Windows Data Protection API (DPAPI).',
    content: `# DevPulse — Windows 11 Native Desktop Application (Tauri & Rust)

## 1. Native Windows 11 Capabilities
- **Fluent Mica & Acrylic Translucency**: Native hardware-accelerated Windows 11 backdrop material.
- **Zero-Footprint Runtime**: Targets <15 MB Resident RAM and <0.3% idle CPU.
- **Windows DPAPI Integration**: Secure hardware-backed token encryption.
- **System Tray Daemon**: Docks to Windows 11 Taskbar with background Git hook listeners.

\`\`\`powershell
# In PowerShell:
.\\build-tauri-windows.ps1
\`\`\``
  },
  {
    id: 'system-spec',
    title: 'System Specification & PRD Roadmap',
    badge: 'Product Spec',
    icon: 'assignment',
    category: 'Specification',
    summary: 'Product requirements, 60fps velocity goals, and complete sprint roadmap.',
    content: `# DevPulse — System Specification & Implementation Roadmap

## 1. Performance Goals
- **Resident RAM**: <20 MB (macOS) / <15 MB (Windows 11).
- **Query Latency**: <0.8ms local SQLite WAL response.
- **Rendering**: Steady 60 FPS CSS backdrop-filter glassmorphism.

## 2. Integrated Modules
1. Today's Tasks & Execution Velocity (⌘N)
2. Jira Stories Workspace (CORE-1042)
3. GitHub Activity & Pulse Chart
4. Schedule & Deadlines Strip
5. History & Omnisearch Inspector (⌘K)
6. Zero-Trace Hardware Keyring Vault`
  },
  {
    id: 'api-keychain',
    title: 'API & Hardware Keyring Integrations',
    badge: 'Security',
    icon: 'key',
    category: 'Security',
    summary: 'GitHub Personal Access Tokens, Jira REST API v3, and AES-256 clipboard redactor.',
    content: `# DevPulse — API & Keyring Integration Specification

## 1. GitHub Integration
- Fine-grained / Classic PAT with repo and workflow scopes.
- Smart rate-limit throttling (5,000 requests/hour limit monitor).
- Local WebSocket hook listener on port 49152.

## 2. Atlassian Jira Cloud REST API v3
- Real-time status transitions and work log sync.
- Interactive acceptance criteria validation.`
  },
  {
    id: 'user-manual',
    title: 'User Manual & Keyboard Shortcuts Guide',
    badge: 'Guide',
    icon: 'menu_book',
    category: 'User Manual',
    summary: 'Complete guide for ⌘K omnisearch, ⌘N fast intake, ⌘G git convert, and workflows.',
    content: `# DevPulse — User Manual & Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| \`⌘K\` / \`Ctrl+K\` | **Omnisearch & History** | Global search across tasks, commits, and Jira keys. |
| \`⌘N\` / \`Ctrl+N\` | **Fast Task Intake** | Focus task creation bar on Today's Tasks. |
| \`⌘G\` / \`Ctrl+G\` | **Quick Git Convert** | Spawn task from clipboard SHA or active branch. |
| \`⌘S\` / \`Ctrl+S\` | **Manual Sync** | Poll GitHub/Jira and flush SQLite WAL cache. |
| \`Esc\` | **Close Overlays** | Close any active modal. |`
  }
];

export const SystemDocsView: React.FC<SystemDocsViewProps> = ({ showToast }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Architecture', 'Windows Build', 'Specification', 'Security', 'User Manual'];

  const filteredDocs = DOCS_DATABASE.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeDoc = DOCS_DATABASE.find(d => d.id === selectedDocId) || DOCS_DATABASE[0];

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(activeDoc.content);
    showToast(`Copied "${activeDoc.title}" to clipboard!`);
  };

  const handleDownloadDoc = () => {
    const blob = new Blob([activeDoc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDoc.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${activeDoc.id}.md`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Workspace Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-white/10 shadow-xl bg-gradient-to-r from-blue-900/30 via-surface-container-low/40 to-indigo-900/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary ring-1 ring-primary/30 shadow-inner">
            <span className="material-symbols-outlined text-[28px]">library_books</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-on-surface">System Documentation & Manuals</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary-container text-on-primary-container border border-primary/30">
                6 Guides Available
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Complete offline engineering specifications, Docker Windows build pipelines, Tauri configs, and user manuals.</p>
          </div>
        </div>

        {/* Global Docs Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-on-surface transition active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy Markdown</span>
          </button>
          <button
            onClick={handleDownloadDoc}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary-container text-xs font-semibold shadow-md transition active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-surface-container-lowest/80 border border-white/5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest/90 border border-white/10 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* Master-Detail Document Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Doc Cards List */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`p-4 rounded-2xl glass-card cursor-pointer border transition-all ${
                selectedDocId === doc.id
                  ? 'border-primary/50 bg-surface-container-high/90 shadow-lg scale-[1.01]'
                  : 'border-white/5 hover:border-white/15 bg-surface-container-lowest/60 hover:bg-surface-container-low/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] ${selectedDocId === doc.id ? 'text-primary' : 'text-outline'}`}>
                    {doc.icon}
                  </span>
                  <span className="text-xs font-bold text-on-surface leading-tight">{doc.title}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/5 text-outline border border-white/10 shrink-0">
                  {doc.badge}
                </span>
              </div>
              <p className="text-[11px] text-outline mt-2 line-clamp-2 leading-relaxed">{doc.summary}</p>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-surface-container-lowest/50 border border-white/5 text-outline text-xs">
              No documentation found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Right Column: Full Document Reader Canvas */}
        <div className="lg:col-span-8 rounded-3xl glass-card p-6 border border-white/10 shadow-2xl bg-surface-container-lowest/90 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px] text-primary">{activeDoc.icon}</span>
              <div>
                <h2 className="text-base font-bold text-on-surface">{activeDoc.title}</h2>
                <span className="text-[10px] font-mono text-outline">Category: {activeDoc.category} | File: /docs/{activeDoc.id}.md</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDoc}
                title="Copy markdown content"
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              </button>
              <button
                onClick={handleDownloadDoc}
                title="Download document file"
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>

          {/* Rendered Document Body */}
          <div className="p-4 rounded-2xl bg-black/40 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap border border-white/5 overflow-x-auto max-h-[600px] overflow-y-auto">
            {activeDoc.content}
          </div>
        </div>
      </div>
    </div>
  );
};
