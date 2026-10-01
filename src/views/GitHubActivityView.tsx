import React, { useState } from 'react';
import { GitEvent } from '../types';

interface GitHubActivityViewProps {
  events: GitEvent[];
  onConvertToTask: (title: string, sha: string) => void;
  onManualSync: () => void;
  isSyncing: boolean;
  showToast: (msg: string) => void;
}

export const GitHubActivityView: React.FC<GitHubActivityViewProps> = ({
  events,
  onConvertToTask,
  onManualSync,
  isSyncing,
  showToast
}) => {
  const [activeRepo, setActiveRepo] = useState('devpulse/desktop-client');
  const [showRepoMenu, setShowRepoMenu] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'commit' | 'pr' | 'branch'>('all');
  const [convertedIds, setConvertedIds] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Wed');

  const filteredEvents = events.filter(e => {
    if (eventFilter === 'all') return true;
    return e.type === eventFilter;
  });

  const weekDays = [
    { day: 'Mon', count: 18, height: '48%', active: false },
    { day: 'Tue', count: 29, height: '72%', active: false },
    { day: 'Wed', count: 41, height: '94%', active: true, isPeak: true },
    { day: 'Thu', count: 36, height: '85%', active: false },
    { day: 'Fri', count: 15, height: '38%', active: false },
    { day: 'Sat', count: 2, height: '12%', active: false },
    { day: 'Sun', count: 1, height: '6%', active: false }
  ];

  const handleConvert = (ev: GitEvent) => {
    onConvertToTask(ev.title, ev.sha);
    setConvertedIds(prev => [...prev, ev.id]);
    showToast(`Converted commit "${ev.sha}" to today's task execution queue!`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative">
      {/* Ambient background blur accent */}
      <div className="absolute -top-10 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Repository & Branch Context Toolbar */}
      <section className="w-full glass-card rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Repo dropdown */}
          <div className="relative inline-flex items-center">
            <button
              onClick={() => setShowRepoMenu(!showRepoMenu)}
              className="flex items-center gap-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3.5 py-2 rounded-xl transition shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">source_environment</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-outline uppercase tracking-wider font-bold">Repository</span>
                <span className="text-xs font-bold text-on-surface leading-tight font-mono">{activeRepo}</span>
              </div>
              <span className="material-symbols-outlined text-outline text-[16px] ml-1">expand_more</span>
            </button>

            {showRepoMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 glass-card rounded-2xl shadow-2xl p-2 z-30 flex flex-col gap-1 border border-white/15 animate-fade-in">
                {['devpulse/desktop-client', 'devpulse/core-engine', 'devpulse/telemetry-daemon'].map(repo => (
                  <button
                    key={repo}
                    onClick={() => {
                      setActiveRepo(repo);
                      setShowRepoMenu(false);
                      showToast(`Switched active repository context to: ${repo}`);
                    }}
                    className={`flex items-center justify-between w-full p-2.5 rounded-xl text-left text-xs font-medium transition ${
                      activeRepo === repo ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-white/10 hover:text-on-surface'
                    }`}
                  >
                    <span className="font-mono">{repo}</span>
                    {activeRepo === repo && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Branch Pill */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-2 rounded-xl border border-white/5">
            <span className="material-symbols-outlined text-[16px] text-secondary">alt_route</span>
            <span className="text-xs font-mono font-bold text-on-surface">main</span>
            <span className="h-3 w-px bg-white/10 mx-0.5"></span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Clean Tree
            </span>
          </div>

          {/* Git Hooks Daemon Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-xl text-xs border border-white/5">
            <span className="material-symbols-outlined text-[16px] text-primary animate-spin" style={{ animationDuration: '9s' }}>sync</span>
            <span className="text-outline text-[11px]">Hooks:</span>
            <span className="text-on-surface font-semibold text-[11px]">active</span>
            <span className="text-emerald-400 bg-surface-container-high px-2 py-0.5 rounded-full font-mono text-[10px]">0.4% CPU</span>
          </div>
        </div>

        {/* Right cluster: Sync actions */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[10px] text-outline uppercase tracking-wider font-bold">Last Polled</span>
            <span className="text-xs text-on-surface font-mono">12s ago (20:41:09)</span>
          </div>
          <button
            onClick={onManualSync}
            className="flex items-center gap-1.5 bg-primary-container hover:brightness-110 active:scale-95 text-on-primary-container text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
          >
            <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Manual Sync</span>
          </button>
        </div>
      </section>

      {/* Weekly Git Activity Heatmap Ribbon Card */}
      <section className="w-full glass-card rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Weekly Git Pulse & Push Frequency</h2>
              <p className="text-xs text-on-surface-variant">Continuous telemetry captured across active engineering branches (Mon-Sun)</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-bold uppercase">Total Pushes</span>
              <span className="text-lg font-bold text-on-surface font-mono">142</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-bold uppercase">LOC Net Gain</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">+3,418</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-bold uppercase">Lead Time</span>
              <span className="text-lg font-bold text-purple-400 font-mono">1.8 hrs</span>
            </div>
          </div>
        </div>

        {/* 7-Day Bar Chart */}
        <div className="grid grid-cols-7 gap-3 pt-2">
          {weekDays.map(item => {
            const isSelected = selectedDay === item.day;
            return (
              <div
                key={item.day}
                onClick={() => {
                  setSelectedDay(item.day);
                  showToast(`Filtering Git telemetry for: ${item.day} (${item.count} commits)`);
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-full h-36 rounded-xl p-1 flex flex-col justify-end relative overflow-hidden transition-all ${
                  isSelected ? 'bg-surface-container-high ring-1 ring-primary/40' : 'bg-surface-container-low hover:bg-surface-container'
                }`}>
                  <div
                    className={`w-full rounded-lg transition-all duration-500 shadow-sm ${
                      item.isPeak
                        ? 'bg-gradient-to-t from-purple-600 to-indigo-400 shadow-purple-500/25'
                        : item.day === 'Thu'
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                        : 'bg-gradient-to-t from-primary-container to-primary'
                    }`}
                    style={{ height: item.height }}
                  />
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-on-surface font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                </div>
                <span className={`text-[11px] font-mono ${
                  item.isPeak ? 'text-purple-400 font-bold' : isSelected ? 'text-primary font-bold' : 'text-outline group-hover:text-on-surface'
                }`}>
                  {item.day} {item.isPeak && '•'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Git Event Stream (8 cols) */}
        <section className="xl:col-span-8 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">stream</span>
              <span className="text-xs font-bold text-on-surface">Live Git Event Stream</span>
              <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                {events.length} updates today
              </span>
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center p-0.5 rounded-xl bg-surface-container-lowest border border-white/10 text-xs">
              {(['all', 'commit', 'pr', 'branch'] as const).map(tab => {
                const labels: Record<string, string> = {
                  'all': 'All Events',
                  'commit': 'Commits',
                  'pr': 'Pull Requests',
                  'branch': 'Branches'
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setEventFilter(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      eventFilter === tab ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Stream List */}
          <div className="flex flex-col gap-3">
            {filteredEvents.map(ev => {
              const isConverted = convertedIds.includes(ev.id);
              return (
                <article
                  key={ev.id}
                  className="glass-card rounded-2xl p-4 shadow-md flex flex-col gap-2.5 transition hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {ev.author.avatar ? (
                        <img
                          src={ev.author.avatar}
                          alt={ev.author.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface-variant shrink-0 mt-0.5 font-mono">
                          {ev.author.initials || 'AR'}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                          <span className="font-bold text-on-surface">{ev.author.name}</span>
                          <span className="text-outline text-[11px]">
                            {ev.type === 'commit' ? 'committed to' : ev.type === 'pr' ? 'merged' : 'created branch'}
                          </span>
                          <span className="font-mono text-[11px] text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                            {ev.branch}
                          </span>
                          <span className="text-[10px] text-outline font-mono">• {ev.time}</span>
                        </div>

                        <h3 className="text-xs font-bold text-on-surface mt-1">
                          {ev.title}
                        </h3>
                        <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                          {ev.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono bg-surface-container-lowest text-primary px-2.5 py-1 rounded-lg shrink-0 border border-white/5 font-semibold">
                      {ev.sha}
                    </span>
                  </div>

                  {/* Metadata & Action Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-lowest/40 -mx-4 -mb-4 px-4 py-2.5 rounded-b-2xl border-t border-white/5 text-xs">
                    <div className="flex items-center gap-3 text-outline text-[11px] font-mono">
                      {ev.additions > 0 && (
                        <span>
                          <strong className="text-emerald-400">+{ev.additions}</strong> / <strong className="text-red-400">-{ev.deletions}</strong>
                        </span>
                      )}
                      {ev.filesCount > 0 && <span>{ev.filesCount} files</span>}
                      {ev.isGpgSigned && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          GPG Signed
                        </span>
                      )}
                      {ev.ciStatus && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          {ev.ciStatus}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleConvert(ev)}
                        disabled={isConverted}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isConverted
                            ? 'bg-surface-container-highest text-emerald-400 cursor-default'
                            : 'bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface shadow-sm'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isConverted ? 'check' : 'playlist_add'}
                        </span>
                        <span>{isConverted ? 'Task Created' : 'Convert to Task'}</span>
                      </button>
                      <button
                        onClick={() => showToast(`Attached commit ${ev.sha} to active task context`)}
                        className="p-1.5 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition"
                        title="Attach to Active Task"
                      >
                        <span className="material-symbols-outlined text-[16px]">link</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Right Column: PR Reviews & Diagnostics (4 cols) */}
        <aside className="xl:col-span-4 flex flex-col gap-6">
          {/* Card 1: Pending PR Reviews */}
          <div className="glass-card rounded-2xl p-5 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple-400 text-[18px]">rate_review</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">PR Reviews & Mentions</h3>
              </div>
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                2 Due
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low/90 border border-white/5 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-primary font-bold">PR #490</span>
                    <span className="text-xs font-semibold text-on-surface">Implement dark-mode glass blur rendering canvas</span>
                  </div>
                  <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded shrink-0">
                    Needs Review
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1 font-mono">
                  <span className="text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    Expires in 3h 15m
                  </span>
                  <span>@marcus</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low/90 border border-white/5 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-primary font-bold">PR #487</span>
                    <span className="text-xs font-semibold text-on-surface">Zero-overhead IPC transport socket</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded shrink-0">
                    1 Approval
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">timer</span>
                    Expires in 18h
                  </span>
                  <span>@alexr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Git Pulse Preferences */}
          <div className="glass-card rounded-2xl p-5 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Git Pulse Preferences</h3>
              </div>
              <span className="text-[10px] font-mono text-outline">macOS Daemon</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/60 border border-white/5 cursor-pointer">
                <div className="flex flex-col pr-2">
                  <span className="font-semibold text-on-surface text-xs">Notify on PR review request</span>
                  <span className="text-[10px] text-outline">Direct desktop push banner</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-container bg-black/40 border-white/20 accent-primary-container cursor-pointer" />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/60 border border-white/5 cursor-pointer">
                <div className="flex flex-col pr-2">
                  <span className="font-semibold text-on-surface text-xs">Alert on 30m unassigned commit</span>
                  <span className="text-[10px] text-outline">Prompt to convert to daily task</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-container bg-black/40 border-white/20 accent-primary-container cursor-pointer" />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/60 border border-white/5 cursor-pointer">
                <div className="flex flex-col pr-2">
                  <span className="font-semibold text-on-surface text-xs">Task expiry reminder push</span>
                  <span className="text-[10px] text-outline">Ping 45m before commit SLA</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-container bg-black/40 border-white/20 accent-primary-container cursor-pointer" />
              </label>
            </div>
          </div>

          {/* Card 3: Local Git Cache & SQLite Diagnostics */}
          <div className="glass-card rounded-2xl p-5 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">database</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Local Git Cache & SQLite</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Offline Ready
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-3 border border-white/5">
              <div className="flex items-center gap-3">
                {/* Mini Gauge Ring */}
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-black/30" cx="18" cy="18" fill="none" r="14" stroke="currentColor" strokeWidth="3.5" />
                    <circle className="text-emerald-400" cx="18" cy="18" fill="none" r="14" stroke="currentColor" strokeWidth="3.5" strokeDasharray="14.2, 100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[11px] font-bold text-on-surface font-mono leading-none">14.2</span>
                    <span className="text-[8px] text-outline font-mono">MB</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">SQLite Index Footprint</span>
                  <span className="text-[10px] text-outline font-mono">18,402 commits indexed</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5">Instant fallback active</span>
                </div>
              </div>

              <button
                onClick={() => showToast('Flushed local SQLite cache & triggered WAL checkpoint.')}
                className="p-2 rounded-xl text-outline hover:text-red-400 hover:bg-surface-container-high transition"
                title="Purge Local Cache"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-outline font-mono px-1">
              <span>Latency: <strong className="text-on-surface">0.12ms</strong></span>
              <span>Engine: <strong className="text-on-surface">LibGit2 v1.7</strong></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
