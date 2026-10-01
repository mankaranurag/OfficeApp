import React, { useState } from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose, showToast }) => {
  const [activeDoc, setActiveDoc] = useState<'architecture' | 'windows' | 'api' | 'userguide'>('architecture');

  if (!isOpen) return null;

  const docTabs = [
    { id: 'architecture', title: 'Architecture & Engine', icon: 'account_tree' },
    { id: 'windows', title: 'Windows 11 Native Build', icon: 'desktop_windows' },
    { id: 'api', title: 'API & Keyring Integrations', icon: 'key' },
    { id: 'userguide', title: 'User Manual & Shortcuts', icon: 'menu_book' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-4xl rounded-3xl p-6 shadow-2xl space-y-4 border border-white/20 animate-fade-in max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">library_books</span>
            <div>
              <h2 className="text-base font-bold text-on-surface">DevPulse Documentation & Developer Manual</h2>
              <p className="text-xs text-on-surface-variant">Embedded offline reference for local SQLite engine, Windows native builds, and integrations.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-white/10 transition">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-surface-container-lowest shrink-0 border border-white/5 text-xs">
          {docTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDoc(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition ${
                activeDoc === tab.id
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Document Content Viewport */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-surface-container-lowest/80 p-5 text-xs text-on-surface leading-relaxed font-sans space-y-4 border border-white/5">
          {activeDoc === 'architecture' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-primary">System Architecture & Core Engine</h3>
              <p>
                DevPulse is built with an embedded SQLite 3 Write-Ahead Logging (WAL) architecture to maintain a resident memory footprint strictly under <strong>20 MB</strong>.
              </p>
              <div className="p-3.5 rounded-xl bg-black/40 font-mono text-[11px] text-emerald-300 space-y-1">
                <div>• SQLite WAL checkpointer runs asynchronously in daemon thread every 60s</div>
                <div>• Query execution latency &lt;0.8ms via direct zero-IPC in-memory cache</div>
                <div>• Sub-16ms rendering pipeline adhering to Apple Liquid Glassmorphism & Material UI v7</div>
              </div>
              <h4 className="text-sm font-bold text-on-surface pt-2">Zero-Trace Security Vault</h4>
              <p className="text-outline">
                All external API secrets (GitHub Personal Access Tokens and Atlassian Jira Cloud tokens) are stored encrypted in OS hardware keyrings (Apple Secure Enclave on macOS / TPM &amp; DPAPI on Windows) with AES-256-GCM.
              </p>
            </div>
          )}

          {activeDoc === 'windows' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-primary">Building DevPulse as Native Windows 11 App</h3>
              <p>
                DevPulse natively supports Windows 11 with custom titlebar controls, Mica/Acrylic transparency blur, and Windows Data Protection API (DPAPI).
              </p>
              <div className="space-y-2">
                <span className="font-bold text-on-surface block text-xs">Build Commands:</span>
                <div className="p-3 rounded-xl bg-black/40 font-mono text-[11px] text-purple-300 space-y-1.5">
                  <div className="text-outline"># 1. Compile frontend distribution</div>
                  <div>npm run build</div>
                  <div className="text-outline mt-2"># 2. Package native Windows 64-bit installer (.exe / .msix)</div>
                  <div>npx electron-builder --win nsis --x64</div>
                  <div className="text-outline mt-2"># 3. Or compile with Tauri / Rust (&lt;15MB RAM target)</div>
                  <div>npx tauri build</div>
                </div>
              </div>
              <p className="text-outline">
                When running in Windows mode, window controls automatically shift to the top-right corner with Windows 11 Fluent styling.
              </p>
            </div>
          )}

          {activeDoc === 'api' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-primary">API Tokens &amp; Keyring Integration Guide</h3>
              <p>
                Configure GitHub and Jira Cloud integrations with rate-limit self-throttling and automated webhook dispatching.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-surface-container-high/40 border border-white/5 space-y-1">
                  <span className="font-bold text-primary block">GitHub PAT Scopes:</span>
                  <p className="text-outline">• <code>repo</code> (Full status, issues, PRs)</p>
                  <p className="text-outline">• <code>workflow</code> (Actions telemetry)</p>
                  <p className="text-outline">• <code>read:user</code> &amp; <code>read:org</code></p>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-high/40 border border-white/5 space-y-1">
                  <span className="font-bold text-emerald-400 block">Jira Cloud REST v3:</span>
                  <p className="text-outline">• <code>read:jira-work</code></p>
                  <p className="text-outline">• <code>manage:jira-project</code></p>
                  <p className="text-outline">• Host: <code>https://&lt;domain&gt;.atlassian.net</code></p>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'userguide' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-primary">Keyboard Shortcuts &amp; User Manual</h3>
              <div className="p-3 rounded-xl bg-black/30 font-mono text-[11px] space-y-2">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-primary font-bold">⌘K / Ctrl+K</span>
                  <span className="text-on-surface">Omnisearch across all archived tasks, git commits, and Jira keys</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-primary font-bold">⌘N / Ctrl+N</span>
                  <span className="text-on-surface">Fast Task Intake on Today's tasks</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-primary font-bold">⌘G / Ctrl+G</span>
                  <span className="text-on-surface">Quick Git Convert (Paste PR/Commit into task)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary font-bold">Esc</span>
                  <span className="text-on-surface">Close active overlay / diff inspector</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 shrink-0">
          <span className="text-[11px] text-outline font-mono">DevPulse Engine Docs • v1.4.2</span>
          <button
            onClick={() => {
              onClose();
              showToast('Docs closed');
            }}
            className="px-4 py-1.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold shadow transition hover:brightness-110"
          >
            Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
