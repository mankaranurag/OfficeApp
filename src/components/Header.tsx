import React, { useState } from 'react';
import { OsMode } from '../types';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: (theme: 'dark' | 'light') => void;
  osMode: OsMode;
  onToggleOsMode: (mode: OsMode) => void;
  onManualSync: () => void;
  isSyncing: boolean;
  ramUsage: string;
  onOpenPreferences: () => void;
  onOpenDocs: () => void;
  onOpenWindowsBuild: () => void;
  showToast: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  osMode,
  onToggleOsMode,
  onManualSync,
  isSyncing,
  ramUsage,
  onOpenPreferences,
  onOpenDocs,
  onOpenWindowsBuild,
  showToast
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'PR #88 Hard Freeze', subtitle: 'Alert in 41m (Slack + macOS)', time: '41m', type: 'error' },
    { id: 2, title: 'Standup Sync Note', subtitle: 'At 4:30 PM (Calendar ping)', time: '4:30 PM', type: 'secondary' },
    { id: 3, title: 'Git Backup Daemon', subtitle: 'Auto-vacuum cache to <20MB', time: '11:00 PM', type: 'primary' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 w-full flex items-center justify-between px-4 border-b border-white/10 select-none">
      {/* Left: Window Controls & Workspace Brand */}
      <div className="flex items-center space-x-3 w-72 shrink-0">
        {/* macOS Traffic Lights */}
        {osMode === 'macos' && (
          <div className="flex space-x-1.5 mr-2">
            <div 
              onClick={() => showToast('Minimized DevPulse window to system tray')}
              title="Close" 
              className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] cursor-pointer hover:opacity-80 transition-opacity"
            />
            <div 
              onClick={() => showToast('DevPulse minimized to Dock')}
              title="Minimize" 
              className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] cursor-pointer hover:opacity-80 transition-opacity"
            />
            <div 
              onClick={() => showToast('Full screen toggled')}
              title="Maximize" 
              className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
        )}

        {/* Windows 11 App Icon when in Windows mode */}
        {osMode === 'windows' && (
          <div className="flex items-center mr-1">
            <span className="material-symbols-outlined text-[18px] text-primary">desktop_windows</span>
          </div>
        )}

        <div className="flex items-center space-x-2 pl-1">
          <img 
            src="https://lh3.googleusercontent.com/aida/AEtjO1XK2cGMJjJ8Iyi0FJCw_L-iYeeHBRiqez45tz-imk6C6zTixWb3oqRdyzKgFB1Yf1RlDyAeFc4XtxC04E3_w7jSR7e7kGbRO_Rv0hGNMwEhxKRYKJGVc9HBdciWpJj23z0ldtaw-bB6hVBnQV8enw29Dt0b0jv3sXGy-vq1GeN7atbdRs-7CeMxULiXztolCT4OMLrAyJiTBH8SQE6GyOGikMzvjGwXK2v5sn0BOQlsKc6AgpV0_ygiHr1Q" 
            alt="DevPulse Logo" 
            className="w-6 h-6 rounded-md object-contain shadow-sm"
          />
          <span className="font-bold text-base tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-200 bg-clip-text text-transparent">
            DevPulse
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            v1.4.2
          </span>
        </div>
      </div>

      {/* Center: Realtime Telemetry Diagnostics */}
      <div className="hidden md:flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle"></span>
          <span>{ramUsage} RAM</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-mono text-[11px]">
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          <span>CPU 0.4%</span>
        </div>
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 font-mono text-[11px]">
          <span className="material-symbols-outlined text-[14px]">sync</span>
          <span>SQLite WAL: Sync</span>
        </div>
      </div>

      {/* Right Controls: Docs, Windows Build Hub, Theme Switcher, Sync & Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Docs Button */}
        <button
          onClick={onOpenDocs}
          title="Open DevPulse Documentation & Manual"
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-on-surface transition active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
          <span className="hidden xl:inline">Docs</span>
        </button>

        {/* Windows 11 Build & Frame Button */}
        <button
          onClick={onOpenWindowsBuild}
          title="Windows 11 Native Build & Frame Mode"
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-white/10 text-xs font-semibold text-on-surface transition active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">desktop_windows</span>
          <span className="hidden lg:inline">{osMode === 'windows' ? 'Windows 11' : 'Win Build'}</span>
        </button>

        {/* Interactive Segmented Glass Pill Theme Toggle */}
        <div 
          onClick={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative flex items-center p-1 rounded-full bg-black/20 dark:bg-black/40 border border-white/10 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] cursor-pointer select-none"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          role="button"
          tabIndex={0}
        >
          <div 
            className={`segmented-pill-bg absolute top-1 left-1 w-7 h-7 rounded-full bg-white/15 dark:bg-white/10 shadow-md pointer-events-none border border-white/20 transition-transform duration-300 ${
              theme === 'light' ? 'translate-x-[28px]' : 'translate-x-0'
            }`}
          />
          <button 
            type="button" 
            tabIndex={-1}
            className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
              theme === 'dark' ? 'text-on-surface' : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">dark_mode</span>
          </button>
          <button 
            type="button" 
            tabIndex={-1}
            className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
              theme === 'light' ? 'text-on-surface' : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">light_mode</span>
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-on-surface-variant hover:bg-white/10 hover:text-on-surface transition-colors"
            title="Notifications"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl glass-card p-3 shadow-2xl z-50 border border-white/15 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">notifications_active</span>
                  Alert Queue
                </span>
                <span className="text-[10px] font-mono text-outline">3 scheduled</span>
              </div>
              <div className="space-y-1.5">
                {notifications.map(item => (
                  <div key={item.id} className="p-2 rounded-xl bg-black/20 hover:bg-white/5 transition-colors text-xs flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        item.type === 'error' ? 'bg-red-400' : item.type === 'secondary' ? 'bg-purple-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <div className="font-semibold text-on-surface text-[11px]">{item.title}</div>
                        <div className="text-[10px] text-outline">{item.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-outline shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-center border-t border-white/10 mt-2">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    showToast('All notifications acknowledged');
                  }}
                  className="text-[11px] text-primary font-semibold hover:underline"
                >
                  Mark All Read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sync Button */}
        <button 
          onClick={onManualSync} 
          title="Manual GitHub & SQLite Sync" 
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-on-surface-variant hover:text-on-surface transition active:scale-95"
        >
          <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin text-primary' : ''}`}>
            sync
          </span>
          <span className="hidden xl:inline">Sync</span>
        </button>

        {/* User Profile Avatar */}
        <div 
          onClick={onOpenPreferences}
          className="flex items-center space-x-2 pl-1 border-l border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
          title="Open Profile & Preferences"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida/AEtjO1UXkE8QnEcgagLcItFqZG_e1ol7DiCr3syePWIDGlh72kKAvYDCXEVvI4jZ4C7DhwNY0B1bSDxkvXEQFmfVHpfGzZNkMnvbhY3CMjSTyNtG5yVP183PfuTT0IgFmw3Xirc5woV7GLCWBcqkKn3_fGtPP4fv9FBmKNNOqLrp4BZQ7Cs28a_gLlS4IfGblvp309U2BMx5WjReF3NQ2iM0A_Zz147SI2XvefaS7nwZwBm3D52l-kZD49yjkus3" 
            alt="Alex Rivera" 
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 shadow-sm"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold leading-none text-on-surface">Alex Rivera</span>
            <span className="text-[10px] text-outline leading-tight">Staff Engineer</span>
          </div>
        </div>

        {/* Windows 11 Fluent Right Window Chrome */}
        {osMode === 'windows' && (
          <div className="flex items-center space-x-1 pl-2 border-l border-white/10">
            <button
              onClick={() => showToast('Minimized DevPulse to Windows Taskbar')}
              className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-outline hover:text-on-surface transition"
              title="Minimize"
            >
              <span className="material-symbols-outlined text-[14px]">remove</span>
            </button>
            <button
              onClick={() => showToast('Maximized DevPulse Window')}
              className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-outline hover:text-on-surface transition"
              title="Maximize"
            >
              <span className="material-symbols-outlined text-[14px]">crop_square</span>
            </button>
            <button
              onClick={() => showToast('Closed DevPulse to System Tray')}
              className="w-7 h-7 rounded hover:bg-red-500 hover:text-white flex items-center justify-center text-outline transition"
              title="Close"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
