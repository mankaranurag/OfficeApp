import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface TodaysTasksViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, tag: string, expiry: string) => void;
  onOpenDiffReview: () => void;
  showToast: (msg: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const TodaysTasksView: React.FC<TodaysTasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onOpenDiffReview,
  showToast,
  onNavigateToTab
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [expiryOption, setExpiryOption] = useState('Expires 6:00 PM');
  const [tagOption, setTagOption] = useState('#core-engine');
  const [dateSelection, setDateSelection] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [bannerSnoozed, setBannerSnoozed] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(44 * 60 + 14);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    onAddTask(taskInput.trim(), tagOption, expiryOption);
    setTaskInput('');
    showToast(`Task created & saved to SQLite: "${taskInput.trim()}"`);
  };

  const expiringTasks = tasks.filter(t => !t.completed && t.isUrgent);
  const activeSprintTasks = tasks.filter(t => !t.completed && !t.isUrgent);
  const completedTasks = tasks.filter(t => t.completed);

  const completedCount = completedTasks.length;
  const totalCount = tasks.length;
  const completionPercentage = Math.round((completedCount / (totalCount || 1)) * 100);

  const filteredSprintTasks = tasks.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in-progress') return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative">
      {/* Ambient glass glows */}
      <div className="absolute -top-12 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none -z-10"></div>

      {/* Urgent Review Alert Banner */}
      {!bannerSnoozed && (
        <div className="w-full glass-card rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-red-500 transition-all duration-300">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 text-red-400 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">timer_off</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-sm text-label-sm uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                  Urgent Review
                </span>
                <span className="font-semibold text-sm text-on-surface truncate">
                  PR #88 review expires in {formatCountdown(countdownSeconds)}
                </span>
                <span className="text-xs text-outline hidden sm:inline">
                  • ref: <code className="text-primary font-mono font-semibold">auth-jwt-refresh-v2</code>
                </span>
              </div>
              <span className="text-xs text-outline truncate">
                Required by core security milestone before automatic branch freeze
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => {
                setBannerSnoozed(true);
                showToast('Urgent PR #88 alert snoozed for 30 minutes');
              }}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-surface-container-highest/80 hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition"
            >
              Snooze 30m
            </button>
            <button
              onClick={onOpenDiffReview}
              type="button"
              className="px-4 py-1.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-1"
            >
              <span>Review Diff</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => setBannerSnoozed(true)}
              title="Dismiss banner"
              className="p-1 rounded-lg text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Glass Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Title & Memory Stats Card (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-outline">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Workspace • Core Runtime</span>
              </div>
              <h1 className="text-2xl font-bold text-on-surface mt-1 tracking-tight">Today's Tasks & Velocity</h1>
              <p className="text-xs text-on-surface-variant">Focus mode activated. {expiringTasks.length} high-priority blockers remain.</p>
            </div>

            {/* Native Spec Badge */}
            <div className="flex flex-col gap-1 bg-surface-container-lowest/80 p-3 rounded-xl shrink-0 border border-white/5">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-outline flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-primary">database</span>
                  SQLite Cached
                </span>
                <span className="text-emerald-400 font-mono font-semibold text-[11px]">18.4 MB</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-outline flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-purple-400">bolt</span>
                  CPU Overhead
                </span>
                <span className="text-on-surface font-mono font-semibold text-[11px]">0.4%</span>
              </div>
              <div className="w-36 bg-black/40 rounded-full h-1 mt-1 overflow-hidden">
                <div className="bg-primary-container h-full w-[12%]"></div>
              </div>
            </div>
          </div>

          {/* Metric Ribbon */}
          <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Completed Today</span>
              <div className="text-2xl font-extrabold text-on-surface mt-0.5 flex items-baseline gap-1">
                <span>{completedCount}</span>
                <span className="text-outline font-normal text-sm">/ {totalCount}</span>
                <span className="text-[11px] text-emerald-400 font-semibold ml-auto">+22%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Avg Task Velocity</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5 flex items-baseline gap-1">
                <span>24m</span>
                <span className="text-outline font-normal text-xs">/ task</span>
                <span className="text-[11px] text-primary font-semibold ml-auto">-6m vs avg</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Scheduled Deadlines</span>
              <div className="text-2xl font-extrabold text-primary mt-0.5 flex items-baseline gap-1">
                <span>2</span>
                <span className="text-outline font-normal text-xs">Critical</span>
                <span className="text-[11px] text-amber-400 font-semibold ml-auto">⚠️ EOD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sprint Progress Ring Card (4 cols) */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-5 flex items-center justify-between shadow-xl relative overflow-hidden">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Sprint Pulse</span>
            <span className="text-lg font-bold text-on-surface">Sprint 42</span>
            <p className="text-xs text-on-surface-variant max-w-[150px]">36 / 48 points cleared with 2 days to freeze.</p>
            <span className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> On track (+3d buffer)
            </span>
          </div>

          {/* Radial SVG Ring */}
          <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-black/30" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-primary-container transition-all duration-1000" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="38" 
                stroke="currentColor" 
                strokeDasharray="238.7" 
                strokeDashoffset={238.7 * (1 - 0.75)} 
                strokeLinecap="round" 
                strokeWidth="8" 
                style={{ filter: 'drop-shadow(0 0 6px rgba(62,144,255,0.6))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-base font-bold text-on-surface">75%</span>
              <span className="text-[9px] text-outline uppercase font-mono">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Task Creator Bar (Fast Intake ⌘N) */}
      <div className="w-full glass-card rounded-2xl p-4 shadow-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">add_task</span>
          <span className="font-semibold text-on-surface">Fast Intake & Command</span>
          <span className="text-[11px] text-outline ml-auto hidden sm:inline font-mono">⌘ + N shortcut</span>
        </div>

        <form onSubmit={handleCreateTask} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* Main Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Create new task (Markdown / Git ref supported)... e.g. Fix memory leak in SwiftUI Table View cell reuse"
              className="w-full h-11 px-4 bg-surface-container-lowest/80 text-on-surface rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline border border-white/10"
            />
          </div>

          {/* Expiry Selector */}
          <div className="flex items-center gap-1.5 bg-surface-container-lowest/80 px-3 h-11 rounded-xl shrink-0 border border-white/10">
            <span className="material-symbols-outlined text-outline text-[16px]">schedule</span>
            <select
              value={expiryOption}
              onChange={(e) => setExpiryOption(e.target.value)}
              className="bg-transparent text-on-surface text-xs focus:outline-none cursor-pointer"
            >
              <option className="bg-[#1e2024]" value="Expires 6:00 PM">Expires 6:00 PM</option>
              <option className="bg-[#1e2024]" value="Expires 3:00 PM">Expires 3:00 PM</option>
              <option className="bg-[#1e2024]" value="End of Day (11:59 PM)">End of Day (11:59 PM)</option>
              <option className="bg-[#1e2024]" value="No strict deadline">No strict deadline</option>
            </select>
          </div>

          {/* Date Picker Pill Selector */}
          <div className="flex items-center p-1 bg-surface-container-lowest/80 rounded-xl shrink-0 gap-1 border border-white/10">
            <button
              type="button"
              onClick={() => setDateSelection('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateSelection === 'today' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDateSelection('tomorrow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateSelection === 'tomorrow' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setDateSelection('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateSelection === 'custom' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Tag Quick Selector */}
          <div className="flex items-center gap-1.5 bg-surface-container-lowest/80 px-3 h-11 rounded-xl shrink-0 border border-white/10">
            <span className="material-symbols-outlined text-outline text-[16px]">label</span>
            <select
              value={tagOption}
              onChange={(e) => setTagOption(e.target.value)}
              className="bg-transparent text-on-surface text-xs focus:outline-none cursor-pointer"
            >
              <option className="bg-[#1e2024]" value="#core-engine">#core-engine</option>
              <option className="bg-[#1e2024]" value="#402 fix">#402 fix</option>
              <option className="bg-[#1e2024]" value="PR Review">PR Review</option>
              <option className="bg-[#1e2024]" value="#infra">#infra</option>
              <option className="bg-[#1e2024]" value="#security">#security</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            type="submit"
            className="h-11 px-5 bg-primary-container text-on-primary-container rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Task</span>
          </button>
        </form>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tasks Modules (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section 1: Expiring Today */}
          <div className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-[20px]">warning</span>
                <h2 className="text-base font-bold text-on-surface">Expiring Today</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                  {expiringTasks.length} Due
                </span>
              </div>
              <span className="text-[11px] text-outline">Priority Execution</span>
            </div>

            <div className="space-y-3">
              {expiringTasks.length === 0 ? (
                <div className="text-center py-6 text-outline text-xs">
                  🎉 No urgent blockers expiring today!
                </div>
              ) : (
                expiringTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-surface-container-lowest/50 hover:bg-surface-container/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-white/5"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          onToggleTask(task.id);
                          showToast(`Completed: ${task.title}`);
                        }}
                        className="mt-0.5 w-5 h-5 rounded-md bg-surface-container-highest flex items-center justify-center text-transparent hover:text-outline transition-colors border border-white/10"
                        title="Mark Complete"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </button>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-on-surface truncate">
                            {task.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            task.tagType === 'core' ? 'bg-purple-500/20 text-purple-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {task.tag}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-[11px] text-outline flex-wrap font-mono">
                          <span className="flex items-center gap-1 text-red-400 font-medium">
                            <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                            {task.expiry}
                          </span>
                          {task.sha && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">commit</span>
                              SHA: <code className="text-primary">{task.sha}</code>
                            </span>
                          )}
                          {task.estTime && <span>{task.estTime}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => showToast(`Opening branch details for ${task.sha}`)}
                        className="p-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
                        title="Branch Details"
                      >
                        <span className="material-symbols-outlined text-[16px]">fork_right</span>
                      </button>
                      <button
                        onClick={() => showToast(`Task options for "${task.title.substring(0, 20)}..."`)}
                        className="p-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
                        title="More"
                      >
                        <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Active & Completed Tasks (with Reversible State Machine) */}
          <div className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
                <h2 className="text-base font-bold text-on-surface">Active & Completed</h2>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-semibold">
                  {filteredSprintTasks.length} items
                </span>
              </div>

              {/* Segmented Filter Pills */}
              <div className="flex items-center p-0.5 rounded-xl bg-surface-container-lowest border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeFilter === 'all' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('in-progress')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeFilter === 'in-progress' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('completed')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    activeFilter === 'completed' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredSprintTasks.map(task => {
                if (task.completed) {
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-surface-container-lowest/40 flex items-center justify-between gap-3 opacity-70 hover:opacity-100 transition-all border border-white/5 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Interactive Reversible Checkmark */}
                        <button
                          type="button"
                          onClick={() => {
                            onToggleTask(task.id);
                            showToast(`Restored task to Active Sprint: "${task.title}"`);
                          }}
                          className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition"
                          title="Click to uncheck / restore task"
                        >
                          <span className="material-symbols-outlined text-[14px] font-bold group-hover:hidden">check</span>
                          <span className="material-symbols-outlined text-[14px] hidden group-hover:inline">undo</span>
                        </button>
                        <span className="text-xs text-outline line-through truncate font-medium">
                          {task.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-highest/60 text-outline text-[10px] shrink-0 font-mono">
                          {task.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-outline text-[11px] shrink-0 font-mono">
                        <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                        <span>{task.completedAt ? `Cleared ${task.completedAt}` : 'Done'}</span>
                      </div>
                    </div>
                  );
                }

                // In-progress expandable item
                return (
                  <details
                    key={task.id}
                    className="group bg-surface-container/50 rounded-xl overflow-hidden transition-all shadow-sm open:bg-surface-container/80 border border-white/5"
                  >
                    <summary className="p-3 flex items-center justify-between cursor-pointer list-none select-none">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(task.id);
                            showToast(`Completed task: "${task.title}"`);
                          }}
                          className="w-5 h-5 rounded-md bg-surface-container-highest flex items-center justify-center text-transparent hover:text-on-surface shrink-0 border border-white/10"
                          title="Mark Complete"
                        >
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </button>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-semibold text-on-surface truncate">
                            {task.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                            task.tagType === 'review' ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                          }`}>
                            {task.tag}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {task.estTime && (
                          <span className="text-[11px] text-outline hidden sm:inline font-mono">
                            {task.estTime}
                          </span>
                        )}
                        <span className="material-symbols-outlined text-outline text-[16px] transition-transform duration-200 group-open:rotate-180">
                          expand_more
                        </span>
                      </div>
                    </summary>

                    <div className="px-3 pb-3 pt-1 text-xs text-on-surface-variant flex flex-col gap-2 bg-surface-container-lowest/30 border-t border-white/5">
                      <p className="text-[11px] leading-relaxed">
                        {task.notes || 'Coordinated schema validation with backend core daemon. Tests validated in local sandbox.'}
                      </p>
                      <div className="flex items-center gap-3 text-outline text-[10px] font-mono">
                        {task.branch && <span>Branch: <code className="text-primary">{task.branch}</code></span>}
                        {task.author && <span>Author: @{task.author.toLowerCase().replace(' ', '')}</span>}
                        {task.issueId && <span>Linked Issue: {task.issueId}</span>}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Velocity & Git Helpers (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Sprint Velocity Sparkline Card */}
          <div className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">speed</span>
                <h3 className="text-sm font-bold text-on-surface">Sprint Velocity</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                +12% vs last
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-on-surface font-mono">4.8</span>
              <span className="text-xs text-outline font-medium">story points / day</span>
            </div>

            {/* Sparkline curve */}
            <div className="w-full h-16 pt-2">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="velGradToday" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#47e266" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#47e266" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M 0,35 Q 25,32 50,22 T 100,18 T 150,10 T 200,6 L 200,40 L 0,40 Z" fill="url(#velGradToday)"></path>
                <path d="M 0,35 Q 25,32 50,22 T 100,18 T 150,10 T 200,6" stroke="#47e266" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle className="animate-ping" cx="200" cy="6" fill="#47e266" r="3.5"></circle>
                <circle cx="200" cy="6" fill="#ffffff" r="2.5"></circle>
              </svg>
            </div>

            {/* Telemetry Status Strip */}
            <div className="flex flex-col gap-2 pt-2 bg-surface-container-lowest/60 p-3 rounded-xl border border-white/5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-[14px] text-primary">sync</span>
                  GitHub Sync Status
                </span>
                <span className="font-mono text-on-surface">3 mins ago</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-[14px] text-outline">storage</span>
                  Local Database
                </span>
                <span className="font-mono text-on-surface">Indexed (0.8ms)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">wifi_tethering</span>
                  Websocket Tunnel
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Connected (49152)</span>
              </div>
            </div>
          </div>

          {/* Quick Git Convert Dropzone */}
          <div 
            onClick={() => {
              onAddTask('PR #492: Integrate low-power background telemetry parser', '#core-engine', 'Expires 6:00 PM');
              showToast('Ingested Git ref into Today card!');
            }}
            className="glass-card rounded-2xl p-5 shadow-xl flex flex-col items-center text-center cursor-pointer group hover:border-blue-500/40 transition-all border border-dashed border-white/15"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <span className="material-symbols-outlined text-[24px]">terminal</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Quick Git Convert</span>
            <p className="text-[11px] text-outline mt-1 max-w-[200px]">
              Drag commit URL, branch, or issue SHA here to spawn tracked task
            </p>
            <span className="px-3 py-1 rounded-full bg-surface-container-highest text-outline text-[10px] font-mono mt-3">
              or press ⌘ + G
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
