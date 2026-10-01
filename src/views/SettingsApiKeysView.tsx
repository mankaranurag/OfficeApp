import React, { useState } from 'react';
import { IntegrationSettings } from '../types';
import { INITIAL_INTEGRATION_SETTINGS } from '../data/mockData';

interface SettingsApiKeysViewProps {
  showToast: (msg: string) => void;
}

export const SettingsApiKeysView: React.FC<SettingsApiKeysViewProps> = ({ showToast }) => {
  const [settings, setSettings] = useState<IntegrationSettings>(INITIAL_INTEGRATION_SETTINGS);
  const [showGhToken, setShowGhToken] = useState(false);
  const [showJiraToken, setShowJiraToken] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'api' | 'sync' | 'notifications' | 'appearance'>('api');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    showToast('Encrypting & storing secrets in local Hardware Keychain (AES-256-GCM)...');
    setTimeout(() => {
      setIsSaving(false);
      showToast('Vault updated & saved to local hardware keyring!');
    }, 1000);
  };

  const handleTestGh = () => {
    showToast('Testing GitHub PAT connection... Rate limit verified: 4,820/5,000 remaining.');
  };

  const handleRotateGh = () => {
    showToast('GitHub secret rotated. New session token generated.');
  };

  const handleVerifyJira = () => {
    showToast('Jira Cloud REST connection verified! Board CORE synced.');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative">
      {/* Top Action Hub & Vault Security Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-outline font-mono">
            <span className="hover:text-on-surface transition-colors cursor-pointer">Settings & Integrations</span>
            <span>/</span>
            <span className="text-primary font-bold">API Tokens & Local Vault</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Secrets & Keyring Management</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high shadow-sm border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-on-surface font-semibold font-mono">Local Keychain: AES-256-GCM</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-highest text-outline text-xs font-mono">
              <span className="material-symbols-outlined text-[14px] text-primary">memory</span>
              <span>Vault Footprint: 2.1 MB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => showToast('Opening security audit logs...')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold shadow-sm transition"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">policy</span>
            <span>Audit Logs</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Exported encrypted configuration package')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold shadow-sm transition"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">file_download</span>
            <span>Export Config</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold shadow-lg transition hover:brightness-110 active:scale-95"
          >
            <span className={`material-symbols-outlined text-[16px] ${isSaving ? 'animate-spin' : ''}`}>
              verified_user
            </span>
            <span>{isSaving ? 'Encrypting...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Pill */}
      <div className="p-1 rounded-2xl bg-surface-container-lowest/80 flex flex-wrap gap-1 shadow-inner border border-white/5 text-xs">
        {[
          { id: 'api', label: 'API Keys & Integrations', icon: 'key' },
          { id: 'sync', label: 'Sync & SQLite WAL', icon: 'database' },
          { id: 'notifications', label: 'Notifications & Expiry', icon: 'notifications_active' },
          { id: 'appearance', label: 'Appearance & Glass Engine', icon: 'palette' }
        ].map(tab => {
          const isActive = activeSegment === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSegment(tab.id as any);
                showToast(`Switched settings view: ${tab.label}`);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition ${
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-outline hover:text-on-surface hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Primary Config Column (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* GitHub PAT Section Card */}
          <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[26px] text-primary">terminal</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">GitHub Integration</h2>
                  <p className="text-xs text-on-surface-variant">Personal Access Token (PAT) for Commit stream, PR review queues, and CI/CD status.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Connected • {settings.ghUsername}</span>
              </div>
            </div>

            {/* Secret Input Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline">
                  Access Token (Fine-Grained or Classic)
                </label>
                <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">timer</span>
                  Expires in {settings.ghExpiresInDays} days • Nov 24, 2024
                </span>
              </div>

              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">lock</span>
                <input
                  type={showGhToken ? 'text' : 'password'}
                  value={settings.githubPat}
                  onChange={(e) => setSettings({ ...settings, githubPat: e.target.value })}
                  className="w-full h-11 pl-11 pr-24 rounded-xl bg-surface-container-lowest text-on-surface font-mono text-xs tracking-wider focus:outline-none focus:ring-1 focus:ring-primary border border-white/10"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowGhToken(!showGhToken)}
                    className="p-1.5 rounded-lg text-outline hover:text-on-surface transition"
                    title="Toggle token visibility"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {showGhToken ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(settings.githubPat);
                      showToast('GitHub Personal Access Token copied to clipboard!');
                    }}
                    className="p-1.5 rounded-lg text-outline hover:text-on-surface transition"
                    title="Copy Secret"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions Badges */}
            <div className="p-3.5 rounded-2xl bg-surface-container/40 space-y-2 border border-white/5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Active Scope Matrix</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'repo', label: 'repo (Full control: Read/Write)', checked: true },
                  { key: 'workflow', label: 'workflow (Read GitHub Actions)', checked: true },
                  { key: 'readUser', label: 'read:user & read:org', checked: true },
                  { key: 'adminHook', label: 'admin:repo_hook (Dispatcher)', checked: false }
                ].map(sc => (
                  <label key={sc.key} className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface text-[11px] cursor-pointer select-none border border-white/5">
                    <input type="checkbox" defaultChecked={sc.checked} className="rounded text-primary-container focus:ring-0 w-3.5 h-3.5 accent-primary-container" />
                    <span>{sc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestGh}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">bolt</span>
                  <span>Test Connection</span>
                </button>
                <button
                  type="button"
                  onClick={handleRotateGh}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">sync</span>
                  <span>Rotate Secret</span>
                </button>
              </div>

              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline text-xs flex items-center gap-1 font-semibold"
              >
                <span>Token Settings</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Jira Cloud API Integration Card */}
          <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[26px] text-purple-400">developer_board</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Jira Cloud Integration</h2>
                  <p className="text-xs text-on-surface-variant">Atlassian REST API integration for real-time sprint backlog syncing and ticket dispatch.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sprint 42 Synced (14 active stories)</span>
              </div>
            </div>

            {/* Host Domain & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline">Atlassian Host Domain</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[16px]">dns</span>
                  <input
                    type="text"
                    value={settings.jiraHost}
                    onChange={(e) => setSettings({ ...settings, jiraHost: e.target.value })}
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline">Jira Account Email</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[16px]">mail</span>
                  <input
                    type="email"
                    value={settings.jiraEmail}
                    onChange={(e) => setSettings({ ...settings, jiraEmail: e.target.value })}
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-white/10"
                  />
                </div>
              </div>
            </div>

            {/* Jira API Secret */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline">Jira Cloud API Token</label>
                <span className="text-emerald-400 font-mono text-[11px] font-semibold">Verified OAuth 2.0 / API Token</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none">vpn_key</span>
                <input
                  type={showJiraToken ? 'text' : 'password'}
                  value={settings.jiraToken}
                  onChange={(e) => setSettings({ ...settings, jiraToken: e.target.value })}
                  className="w-full h-11 pl-11 pr-24 rounded-xl bg-surface-container-lowest text-on-surface font-mono text-xs tracking-wider focus:outline-none focus:ring-1 focus:ring-primary border border-white/10"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowJiraToken(!showJiraToken)}
                    className="p-1.5 rounded-lg text-outline hover:text-on-surface transition"
                    title="Toggle visibility"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {showJiraToken ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(settings.jiraToken);
                      showToast('Jira token copied to clipboard!');
                    }}
                    className="p-1.5 rounded-lg text-outline hover:text-on-surface transition"
                    title="Copy token"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Dropdowns & Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container/40 border border-white/5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-outline">Default Target Project & Board</label>
                <select
                  value={settings.jiraProject}
                  onChange={(e) => setSettings({ ...settings, jiraProject: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-high text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border-none"
                >
                  <option value="CORE • Core Engine & Sandboxing">CORE • Core Engine & Sandboxing</option>
                  <option value="INFRA • Edge Gateway & Telemetry">INFRA • Edge Gateway & Telemetry</option>
                  <option value="DESIGN • macOS Sonoma Fluid Shell">DESIGN • macOS Sonoma Fluid Shell</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-outline">Webhook Sync Rate</label>
                  <span className="text-primary font-mono font-bold">Poll every {settings.syncRateMinutes}m</span>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={settings.syncRateMinutes}
                    onChange={(e) => setSettings({ ...settings, syncRateMinutes: parseInt(e.target.value) || 2 })}
                    className="w-full accent-primary-container h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={handleVerifyJira}
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">cloud_sync</span>
                <span>Verify & Force Sync Projects</span>
              </button>
              <div className="flex items-center gap-1 text-outline font-mono text-[11px]">
                <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                <span>OAuth Scope: read:jira-work, manage:jira-project</span>
              </div>
            </div>
          </div>

          {/* Local Hardware Keychain & Zero-Trace Security */}
          <div className="glass-card rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-1 border-b border-white/10">
              <span className="material-symbols-outlined text-primary text-[24px]">shield_lock</span>
              <div>
                <h2 className="text-base font-bold text-on-surface">Local Hardware Keychain & Zero-Trace Security</h2>
                <p className="text-xs text-on-surface-variant">Defense-in-depth settings for in-memory token encryption and OS biometric protection.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container/30 border border-white/5">
                <div className="space-y-0.5 max-w-xl">
                  <span className="font-bold text-on-surface block text-xs">Store secrets in Apple Secure Enclave / TPM Hardware</span>
                  <span className="text-[11px] text-outline block">Enforces biometrics (Touch ID / Face ID) when decrypting local SQLite WAL keyrings.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.secureEnclave}
                  onChange={(e) => setSettings({ ...settings, secureEnclave: e.target.checked })}
                  className="w-5 h-5 rounded text-primary-container accent-primary-container cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container/30 border border-white/5">
                <div className="space-y-0.5 max-w-xl">
                  <span className="font-bold text-on-surface block text-xs">Flush memory-mapped token buffer on Minimize / Screen Sleep</span>
                  <span className="text-[11px] text-outline block">Instantly overwrites plaintext RAM slices with cryptographic salt when the desktop loses window focus.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.flushOnMinimize}
                  onChange={(e) => setSettings({ ...settings, flushOnMinimize: e.target.checked })}
                  className="w-5 h-5 rounded text-primary-container accent-primary-container cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container/30 border border-white/5">
                <div className="space-y-0.5 max-w-xl">
                  <span className="font-bold text-on-surface block text-xs">Clipboard & Log Auto-Redactor daemon</span>
                  <span className="text-[11px] text-outline block">Masks regex-detected credentials (`ghp_*`, `ATATT*`) from terminal history, stack traces, and copy buffers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.clipboardRedactor}
                  onChange={(e) => setSettings({ ...settings, clipboardRedactor: e.target.checked })}
                  className="w-5 h-5 rounded text-primary-container accent-primary-container cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-outline flex items-center gap-1 font-mono text-[11px]">
                <span className="material-symbols-outlined text-[14px] text-emerald-400">lock_reset</span>
                Key ID: <span className="text-on-surface font-bold">SE-802F-9B11</span>
              </span>
              <button
                type="button"
                onClick={() => showToast('Local SQLite Auth cache flushed.')}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold flex items-center gap-1 transition"
              >
                <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
                <span>Flush SQLite Auth Cache</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Health Quotas & Audit Trail (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Integration Health Card */}
          <div className="glass-card rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Integration Health</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                All Systems Normal
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* GitHub Quota */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    GitHub API Rate Limit
                  </span>
                  <span className="font-mono text-primary font-bold">4,820 / 5,000</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-primary-container h-full w-[96.4%] rounded-full shadow-[0_0_8px_rgba(62,144,255,0.6)]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-outline font-mono">
                  <span>96.4% quota available</span>
                  <span>Resets in 41m</span>
                </div>
              </div>

              {/* Jira Quota */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Jira REST API v3
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">Latency: 82ms</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-emerald-500 h-full w-[88%] rounded-full shadow-[0_0_8px_rgba(71,226,102,0.5)]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-outline font-mono">
                  <span>Status 200 OK</span>
                  <span>Last payload: 32s ago</span>
                </div>
              </div>

              {/* WebSocket Dispatcher */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    WebSocket Dispatcher
                  </span>
                  <span className="font-mono text-purple-300 font-bold">Port 49152</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-high text-on-surface font-mono text-[11px] border border-white/5">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="material-symbols-outlined text-[14px]">sensors</span>
                    Listening (Local IPC)
                  </span>
                  <span>0 dropped events</span>
                </div>
              </div>
            </div>

            {/* Sparkline Jitter */}
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Real-time Ping Jitter (Last 15m)</span>
              <div className="h-12 w-full bg-surface-container-lowest rounded-xl p-2 flex items-end border border-white/5">
                <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 25">
                  <path d="M0,20 L10,18 L20,19 L30,12 L40,14 L50,8 L60,11 L70,5 L80,9 L90,6 L100,7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Vault Access Log */}
          <div className="glass-card rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-outline text-[18px]">history</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Vault Access Log</h3>
              </div>
              <button 
                type="button" 
                onClick={() => showToast('Access log cleared.')} 
                className="text-primary hover:underline text-xs font-semibold"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { title: 'GitHub PAT Access', time: '11:42:10', sub: 'Fetched 18 commits (devpulse/engine)' },
                { title: 'Jira Sprint Query', time: '11:38:05', sub: 'Retrieved Board 42 (14 issues cached)' },
                { title: 'Biometric Re-auth', time: '10:15:22', sub: 'Touch ID verified • Keyring unlocked' },
                { title: 'SQLite Keyring Flush', time: '09:00:00', sub: 'WAL checkpoint completed cleanly' }
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors border border-white/5">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400 mt-0.5">check_circle</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface text-[11px] truncate">{log.title}</span>
                      <span className="text-[10px] text-outline shrink-0">{log.time}</span>
                    </div>
                    <p className="text-[10px] text-outline truncate">{log.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
