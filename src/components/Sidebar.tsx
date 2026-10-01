import React from 'react';
import { WorkspaceTab } from '../types';

interface SidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  onOpenPreferences: () => void;
  onOpenDocs: () => void;
  onOpenWindowsBuild: () => void;
  onFilterTag: (tag: string) => void;
  activeFilterTag: string | null;
  ramUsage: string;
  onNewWorkspace: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenPreferences,
  onOpenDocs,
  onOpenWindowsBuild,
  onFilterTag,
  activeFilterTag,
  ramUsage,
  onNewWorkspace
}) => {
  const navItems: { id: WorkspaceTab; label: string; icon: string; badge?: string; badgeColor?: string; dot?: boolean }[] = [
    { id: 'todays-tasks', label: "Today's Tasks", icon: 'check_circle', badge: '2 Due', badgeColor: 'bg-blue-500/20 text-blue-300' },
    { id: 'jira-stories', label: 'Jira Stories', icon: 'developer_board', badge: 'CORE-1042', badgeColor: 'bg-purple-500/20 text-purple-300' },
    { id: 'github-activity', label: 'GitHub Activity', icon: 'terminal', dot: true },
    { id: 'schedule-deadlines', label: 'Schedule & Deadlines', icon: 'calendar_clock', badge: 'Oct 26', badgeColor: 'bg-white/10 text-outline' },
    { id: 'history-search', label: 'History & Search', icon: 'manage_search', badge: '142', badgeColor: 'text-outline font-mono' },
    { id: 'system-docs', label: 'Docs & Manuals', icon: 'menu_book', badge: '6 MD', badgeColor: 'bg-primary/20 text-primary' },
    { id: 'settings-api-keys', label: 'Settings & API Keys', icon: 'key' }
  ];

  const quickTags = [
    { label: '#core-engine', color: 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20' },
    { label: '#infra', color: 'bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20' },
    { label: '#security', color: 'bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20' },
    { label: '#v1.5-rc', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20' }
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 z-30 flex flex-col justify-between p-3 border-r overflow-y-auto">
      <div className="space-y-5">
        {/* Workspaces Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Workspaces
            </span>
            <button 
              onClick={onNewWorkspace}
              title="Add New Workspace"
              className="text-outline hover:text-on-surface text-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={`material-symbols-outlined text-[18px] ${
                      isActive ? 'text-on-primary-container' : 'text-outline group-hover:text-primary'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono shrink-0 ml-1 ${
                      isActive ? 'bg-black/20 text-on-primary-container' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.dot && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Filter Tags */}
        <div className="px-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-outline mb-2">
            Quick Filters
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickTags.map(tag => {
              const isSelected = activeFilterTag === tag.label;
              return (
                <button
                  key={tag.label}
                  onClick={() => onFilterTag(tag.label)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    isSelected 
                      ? 'bg-primary-container text-on-primary-container font-bold border-transparent shadow-sm' 
                      : `${tag.color}`
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Developer Centers */}
        <div className="px-2 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
            Tools &amp; Distribution
          </div>
          <button
            onClick={onOpenWindowsBuild}
            className="w-full flex items-center gap-2 p-2 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-high text-on-surface text-xs font-medium border border-white/5 transition"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">desktop_windows</span>
            <span>Windows 11 Build Hub</span>
          </button>
          <button
            onClick={onOpenDocs}
            className="w-full flex items-center gap-2 p-2 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-high text-on-surface text-xs font-medium border border-white/5 transition"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
            <span>Architecture &amp; Docs</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer Diagnostics & Preferences */}
      <div className="space-y-3 pt-3 border-t border-white/10 text-xs mt-auto">
        <div className="glass-subcard p-2.5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-outline flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>System Status</span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
              Live
            </span>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span className="flex items-center gap-1 text-outline">
              <span className="material-symbols-outlined text-[14px] text-primary">memory</span>
              RAM Usage
            </span>
            <span className="font-mono text-on-surface font-semibold">{ramUsage}</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary-container h-full w-[14%]"></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button 
            onClick={onOpenPreferences} 
            className="flex items-center gap-1.5 text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span className="text-[11px]">Preferences</span>
          </button>
          <span className="text-[11px] font-mono text-outline">v1.4.2</span>
        </div>
      </div>
    </aside>
  );
};
