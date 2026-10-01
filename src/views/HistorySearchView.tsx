import React, { useState } from 'react';
import { HistoryTask } from '../types';
import { MOCK_HISTORY_TASKS } from '../data/mockData';

interface HistorySearchViewProps {
  showToast: (msg: string) => void;
}

export const HistorySearchView: React.FC<HistorySearchViewProps> = ({ showToast }) => {
  const [tasks] = useState<HistoryTask[]>(MOCK_HISTORY_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('hist-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterPill, setActiveFilterPill] = useState('all');

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  const filteredTasks = tasks.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      t.title.toLowerCase().includes(q) || 
      t.taskKey.toLowerCase().includes(q) || 
      t.sha.toLowerCase().includes(q) || 
      t.folder.toLowerCase().includes(q) ||
      t.markdownNotes.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeFilterPill === 'commits') return !!t.sha;
    if (activeFilterPill === 'ontime') return t.onTime;
    return true;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["ID,Task Key,Title,Completed At,Spent Time,Commit SHA,Status"]
        .concat(tasks.map(t => `"${t.id}","${t.taskKey}","${t.title}","${t.completedAt}","${t.spentTime}","${t.sha}","${t.onTime ? 'On-Time' : 'Delayed'}"`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "devpulse_task_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported 142 records to devpulse_task_history.csv');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative">
      {/* Ambient glass glows */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
      <div className="pointer-events-none absolute top-1/3 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>

      {/* Header & Omnisearch Suite */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary font-bold">
              <span className="material-symbols-outlined text-[16px]">manage_search</span>
              <span>Audit & Archive</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">History & Task Inspector</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">ios_share</span>
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Applied filter preset: Completed Sprints Q3-Q4')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-container text-on-primary-container rounded-xl text-xs font-bold transition shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Filter Presets</span>
            </button>
          </div>
        </div>

        {/* Omnisearch Bar (⌘K) */}
        <div className="relative w-full rounded-2xl glass-card p-1.5 flex items-center shadow-xl border border-white/10">
          <div className="pl-3.5 pr-2 flex items-center text-outline">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="global-search-input"
            placeholder="Search by task title, markdown notes, commit SHA (e.g. 8f2a10c), branch, or tags... (⌘K)"
            className="w-full bg-transparent border-0 text-on-surface text-xs placeholder:text-outline/70 focus:outline-none py-2"
          />
          <div className="hidden sm:flex items-center gap-1 pr-3">
            <kbd className="px-2 py-0.5 rounded-lg bg-surface-container-highest text-on-surface-variant text-[10px] font-mono shadow-sm">
              ⌘K
            </kbd>
            <span className="text-[10px] text-outline">or</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-surface-container-highest text-on-surface-variant text-[10px] font-mono shadow-sm">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'commits', label: 'With Linked Commits', icon: 'terminal' },
              { id: 'ontime', label: 'Completed On-Time', icon: 'check_circle' },
              { id: 'deferred', label: 'Expired/Deferred' }
            ].map(pill => {
              const isActive = activeFilterPill === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => {
                    setActiveFilterPill(pill.id);
                    showToast(`Filtering history archive by: ${pill.label}`);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container shadow-sm font-bold'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {pill.icon && (
                    <span className="material-symbols-outlined text-[14px]">{pill.icon}</span>
                  )}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto text-xs font-mono text-outline">
            <span className="material-symbols-outlined text-[14px] text-primary">calendar_today</span>
            <span>Oct 18, 2024 - Oct 25, 2024</span>
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card shadow-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Archived Tasks</span>
            <div className="flex items-baseline gap-1.5 mt-1 font-mono">
              <span className="text-2xl font-bold text-on-surface">142</span>
              <span className="text-[11px] text-emerald-400 font-semibold">+12 this wk</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card shadow-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">On-Time Velocity</span>
            <div className="flex items-baseline gap-1.5 mt-1 font-mono">
              <span className="text-2xl font-bold text-emerald-400">96.4%</span>
              <span className="text-[11px] text-outline">target 95%</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">timer</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card shadow-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Git Commits Linked</span>
            <div className="flex items-baseline gap-1.5 mt-1 font-mono">
              <span className="text-2xl font-bold text-on-surface">48</span>
              <span className="text-[11px] text-purple-400 font-semibold">8 repos</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">commit</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card shadow-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">PRs Merged</span>
            <div className="flex items-baseline gap-1.5 mt-1 font-mono">
              <span className="text-2xl font-bold text-on-surface">14</span>
              <span className="text-[11px] text-emerald-400 font-semibold">0 reverted</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">merge_type</span>
          </div>
        </div>
      </div>

      {/* Master-Detail 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chronological Timeline List (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-xs font-bold text-on-surface">Today</span>
              <span className="text-[11px] text-outline font-mono">• Friday, Oct 25</span>
            </div>
            <span className="text-[11px] text-outline font-mono">{filteredTasks.length} tasks matching</span>
          </div>

          <div className="space-y-3">
            {filteredTasks.map(t => {
              const isSelected = selectedTaskId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTaskId(t.id);
                    showToast(`Inspecting details for: ${t.taskKey}`);
                  }}
                  className={`cursor-pointer p-4 rounded-2xl transition flex flex-col gap-2 border ${
                    isSelected
                      ? 'glass-card ring-2 ring-primary/40 border-primary/30 shadow-lg'
                      : 'bg-surface-container/50 hover:bg-surface-container/80 border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                      <span className="text-xs font-bold text-on-surface">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                      {t.onTime && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                          On Time
                        </span>
                      )}
                      {t.prRef && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-bold">
                          {t.prRef}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-on-surface-variant text-[11px] pl-6 font-mono flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-outline">schedule</span>
                      {t.completedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-outline">timelapse</span>
                      {t.spentTime}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[13px]">folder</span>
                      {t.folder}
                    </span>
                  </div>

                  {t.sha && (
                    <div className="ml-6 p-2 rounded-xl bg-surface-container-lowest/80 flex items-center justify-between text-[11px] border border-white/5 font-mono">
                      <div className="flex items-center gap-2 text-on-surface truncate">
                        <span className="material-symbols-outlined text-purple-400 text-[14px]">commit</span>
                        <code className="text-primary font-bold">{t.sha}</code>
                        <span className="truncate text-outline">{t.commitMsg}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-[10px]">
                        <span className="text-emerald-400 font-bold">+{t.additions}</span>
                        <span className="text-red-400 font-bold">-{t.deletions}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Task Inspector (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-primary-container/20 text-primary">
                  {selectedTask.taskKey}
                </span>
                <span className="text-[11px] text-outline truncate">{selectedTask.workspace}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => showToast(`Copied markdown link for ${selectedTask.taskKey}`)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-outline hover:text-on-surface transition"
                  title="Copy markdown link"
                >
                  <span className="material-symbols-outlined text-[16px]">link</span>
                </button>
                <button
                  onClick={() => showToast(`Opening ${selectedTask.taskKey} in GitHub web interface...`)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-outline hover:text-on-surface transition"
                  title="Open in GitHub"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </button>
              </div>
            </div>

            {/* Task Title & Status Badges */}
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base font-bold text-on-surface leading-snug">
                {selectedTask.title}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Completed On Time
                </span>
                {selectedTask.prRef && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">merge</span>
                    {selectedTask.prRef}
                  </span>
                )}
                {selectedTask.versionTag && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-outline">
                    {selectedTask.versionTag}
                  </span>
                )}
              </div>
            </div>

            {/* Visual PR & Branch Card */}
            {selectedTask.branchName && (
              <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-white/5 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-purple-300 font-semibold truncate">{selectedTask.branchName}</span>
                  <span className="text-emerald-400 font-bold text-[10px]">PASSING</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-outline font-mono">
                  <span>Commit: <code className="text-primary">{selectedTask.sha}</code></span>
                  <span>Reviewer: <strong>{selectedTask.reviewer || '@sarah-k'}</strong></span>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-400 font-bold">+{selectedTask.additions}</span>
                    <span className="text-red-400 font-bold">-{selectedTask.deletions}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Markdown Resolution Notes & Benchmarks */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Markdown Log & Outcomes</span>
              <div className="p-3 rounded-xl bg-surface-container/70 text-on-surface-variant flex flex-col gap-2 leading-relaxed border border-white/5">
                <p className="text-[11px]">{selectedTask.markdownNotes}</p>
                {selectedTask.benchmarkOutcome && (
                  <div className="p-2 rounded-lg bg-surface-container-lowest font-mono text-[10px] text-on-surface flex flex-col gap-0.5 border border-white/5">
                    <span className="text-outline">Benchmark results (10,000 read ops):</span>
                    <span className="text-emerald-400">p50: {selectedTask.benchmarkOutcome.p50}</span>
                    <span className="text-emerald-400">Peak Resident RAM: {selectedTask.benchmarkOutcome.peakRam}</span>
                    <span className="text-outline text-[9px] pt-0.5">{selectedTask.benchmarkOutcome.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lifecycle Timestamps */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-surface-container/50 flex flex-col border border-white/5">
                <span className="text-outline text-[10px]">Created</span>
                <span className="text-on-surface font-semibold">{selectedTask.createdTime}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container/50 flex flex-col border border-white/5">
                <span className="text-outline text-[10px]">Scheduled For</span>
                <span className="text-on-surface font-semibold">{selectedTask.scheduledTime}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container/50 flex flex-col border border-white/5">
                <span className="text-outline text-[10px]">Target Deadline</span>
                <span className="text-on-surface font-semibold">{selectedTask.targetDeadline}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container/50 flex flex-col border border-white/5">
                <span className="text-emerald-400 text-[10px]">Completed At</span>
                <span className="text-on-surface font-bold">{selectedTask.completedAt}</span>
              </div>
            </div>

            {/* Notification Audit Trail */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Notification Audit Trail</span>
                <span className="text-[10px] font-mono text-primary font-bold">{selectedTask.auditTrail.length} Events</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-outline">
                {selectedTask.auditTrail.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container/30">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className={`material-symbols-outlined text-[13px] ${ev.color}`}>{ev.icon}</span>
                      <span className="truncate">{ev.text}</span>
                    </span>
                    <span className="text-[10px] shrink-0">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => showToast(`Reopened task ${selectedTask.taskKey} into today's queue.`)}
                className="flex-1 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">replay</span>
                <span>Reopen Task</span>
              </button>
              <button
                type="button"
                onClick={() => showToast(`Duplicated task structure from ${selectedTask.taskKey}`)}
                className="flex-1 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Duplicate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
