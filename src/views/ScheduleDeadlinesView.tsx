import React, { useState } from 'react';
import { ScheduleDay } from '../types';
import { SCHEDULE_DAYS } from '../data/mockData';

interface ScheduleDeadlinesViewProps {
  showToast: (msg: string) => void;
}

export const ScheduleDeadlinesView: React.FC<ScheduleDeadlinesViewProps> = ({ showToast }) => {
  const [days] = useState<ScheduleDay[]>(SCHEDULE_DAYS);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(26);
  const [futureTaskTitle, setFutureTaskTitle] = useState('Run automated load balancer stress benchmark');
  const [futureTargetDay, setFutureTargetDay] = useState<'Today' | 'Tmrw' | 'Wknd' | 'Mon'>('Tmrw');
  const [futureExpiryTime, setFutureExpiryTime] = useState('06:00 PM');
  const [strictCutoff, setStrictCutoff] = useState(true);

  const handleScheduleFuture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!futureTaskTitle.trim()) return;
    showToast(`Scheduled future task for ${futureTargetDay}: "${futureTaskTitle}"`);
    setFutureTaskTitle('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative">
      {/* Ambient background blur accent */}
      <div className="pointer-events-none absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-container/20 to-purple-500/15 blur-[120px] -z-10"></div>
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-emerald-500/15 to-primary/10 blur-[130px] -z-10"></div>

      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-xs text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]">event_repeat</span>
            <span>Schedule & Deadlines</span>
            <span className="text-outline font-normal font-mono text-[11px]">/ Production Sprint 42</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Git: <code className="text-primary font-bold">staging-v1.5</code></span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-emerald-400 text-xs font-mono font-semibold">
            <span className="material-symbols-outlined text-[14px]">memory</span>
            <span>18.4 MB</span>
          </div>
        </div>
      </div>

      {/* 10-Day Horizontal Calendar Strip */}
      <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-on-surface">October 2024</span>
            <span className="text-[10px] font-mono text-outline px-2 py-0.5 rounded bg-surface-container-high font-bold">
              Sprint W4
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-outline flex-wrap font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400"></span> Hard Expiry Cutoff
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Scheduled Deploy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed
            </span>
          </div>
        </div>

        {/* Day Pills Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1 overflow-x-auto">
          {days.map(d => {
            const isSelected = selectedDayNumber === d.dayNumber;
            return (
              <div
                key={d.dayNumber}
                onClick={() => {
                  setSelectedDayNumber(d.dayNumber);
                  showToast(`Selected schedule window: ${d.dayStr} Oct ${d.dayNumber}`);
                }}
                className={`flex flex-col items-center p-2.5 rounded-xl cursor-pointer text-center transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container shadow-md ring-2 ring-primary/40 font-bold'
                    : 'hover:bg-surface-container/60 text-on-surface'
                }`}
              >
                <span className={`text-[10px] font-mono ${isSelected ? 'opacity-90 font-bold' : 'text-outline'}`}>
                  {d.dayStr}
                </span>
                <span className="text-base font-bold mt-0.5">{d.dayNumber}</span>
                <div className="flex gap-1 mt-1.5 h-1.5 items-center">
                  {d.hasCutoff && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-red-400' : 'bg-red-500'}`} />}
                  {d.hasDeploy && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-on-primary-container' : 'bg-primary'}`} />}
                  {d.hasCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Window & Strategic Milestones (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Window Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-outline">
                <span>Active Window</span>
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping"></span>
              </div>
              <span className="text-xs text-outline font-mono">Tomorrow • Saturday, Oct 26</span>
            </div>

            {/* Major Milestone Card */}
            <div className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative overflow-hidden border-l-4 border-l-red-500">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">lock_clock</span>
                      Hard Cutoff
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[10px] font-mono">
                      v1.5.0-rc3
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-outline text-[10px]">
                      DevOps Pipeline
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface">
                    Deploy v1.5 staging build with WebPush notifications
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">
                    Automated rolling deploy triggered by CI/CD pipeline. Requires database schema migration verification and ServiceWorker certificate handshake check.
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 p-3 rounded-xl bg-surface-container-high/60 border border-white/5">
                  <span className="text-[10px] text-outline uppercase font-bold">Cutoff At</span>
                  <span className="text-base font-bold text-red-400 font-mono">06:00 PM</span>
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-0.5 font-mono">
                    <span className="material-symbols-outlined text-[13px] text-red-400">timer</span>
                    T-21h 32m
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex -space-x-1.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-[9px] font-bold">AR</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-[9px] font-bold">ML</span>
                  </div>
                  <span className="text-outline text-[11px]">Signed off by Platform Infra</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Dry migration execution complete: 0 schema collisions.')}
                    className="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                    <span>Run Dry Migration</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Staging deployment authorized.')}
                    className="px-4 py-1.5 rounded-xl bg-primary-container hover:brightness-110 text-on-primary-container text-xs font-bold transition shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
                    <span>Approve Deploy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Milestone Card */}
            <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">database</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">PostgreSQL read-replica dry run on staging cluster</h4>
                  <span className="text-[11px] text-outline">Simulated failover traffic validation • Assigned to Alex Rivera</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px]">11:00 AM EDT</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">Read-Ready</span>
              </div>
            </div>
          </div>

          {/* Upcoming Strategic Milestones Section */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-outline">Upcoming Strategic Milestones</span>
              <span className="text-xs font-mono text-outline">Sprint 43 Gate</span>
            </div>

            {/* SOC2 Compliance Card */}
            <div className="glass-card rounded-2xl p-5 shadow-sm flex flex-col gap-3.5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] font-mono">
                      SOC2 Compliance
                    </span>
                    <span className="text-xs text-outline font-mono">Nov 1, 2024 • 05:00 PM</span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface mt-0.5">
                    Quarterly GitHub dependency audit & security scan
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                    Mandatory quarterly vulnerability review across 34 microservices. Automated Dependabot pull requests must be vetted, approved, and merged before compliance lockdown.
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-outline uppercase font-bold block">Progress</span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">78%</span>
                  </div>
                  <span className="text-[11px] text-outline font-mono">14 of 18 patches</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-primary via-purple-500 to-emerald-400 h-full rounded-full w-[78%] transition-all duration-1000" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-surface-container-high/40 flex items-center justify-between border border-white/5">
                  <span className="text-xs text-outline">Open PRs</span>
                  <span className="text-xs font-bold text-on-surface font-mono">4 pending</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-high/40 flex items-center justify-between border border-white/5">
                  <span className="text-xs text-outline">Critical CVEs</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">0 detected</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container-high/40 flex items-center justify-between border border-white/5">
                  <span className="text-xs text-outline">Audit Score</span>
                  <span className="text-xs font-bold text-primary font-mono">A+ (99.2)</span>
                </div>
              </div>
            </div>

            {/* Sub-gates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Release Target</span>
                  <span className="material-symbols-outlined text-outline text-[16px]">open_in_new</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-on-surface font-mono">v1.5.0-GA</span>
                  <p className="text-xs text-on-surface-variant mt-0.5">General Availability release to production CDN edges globally.</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-primary font-semibold font-mono">T-6 Days • Nov 2</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold font-mono">Scheduled</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Infrastructure Gate</span>
                  <span className="material-symbols-outlined text-outline text-[16px]">shield</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-on-surface">TLS Cert Rotation</span>
                  <p className="text-xs text-on-surface-variant mt-0.5">Automated Let's Encrypt wildcard renewal for *.internal.devpulse.io</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-emerald-400 font-semibold font-mono">Auto-resolving • Nov 5</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold font-mono">Automated</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assign Future Task & Alerts (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Assign Future Task Form */}
          <div className="glass-card rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">add_task</span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-on-surface">Assign Future Task</h3>
              </div>
              <span className="text-[10px] font-mono text-outline">macOS Quick</span>
            </div>

            <form onSubmit={handleScheduleFuture} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface mb-1">
                  Task Title & Description
                </label>
                <input
                  type="text"
                  value={futureTaskTitle}
                  onChange={(e) => setFutureTaskTitle(e.target.value)}
                  placeholder="What needs to happen?"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-outline mb-1">
                  Target Schedule Date
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  {(['Today', 'Tmrw', 'Wknd', 'Mon'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFutureTargetDay(d)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                        futureTargetDay === d
                          ? 'bg-primary-container text-on-primary-container shadow-sm'
                          : 'bg-surface-container-high text-outline hover:text-on-surface'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-outline mb-1">
                    Expiry Time
                  </label>
                  <input
                    type="text"
                    value={futureExpiryTime}
                    onChange={(e) => setFutureExpiryTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-mono border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-outline mb-1">
                    Notification Pill
                  </label>
                  <select className="w-full px-2 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs border border-white/10 cursor-pointer">
                    <option>1h before expiry</option>
                    <option>30m before expiry</option>
                    <option>At exact cutoff</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-high/40 border border-white/5">
                <div>
                  <span className="font-semibold text-on-surface block text-xs">Strict Hard Cutoff</span>
                  <span className="text-[10px] text-outline">Block merge if unverified</span>
                </div>
                <input
                  type="checkbox"
                  checked={strictCutoff}
                  onChange={(e) => setStrictCutoff(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-container accent-primary-container cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary-container hover:brightness-110 active:scale-95 text-on-primary-container font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Schedule Future Task</span>
              </button>
            </form>
          </div>

          {/* Upcoming System Alerts */}
          <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-outline">Upcoming System Alerts</span>
              <span className="material-symbols-outlined text-outline text-[16px]">notifications_active</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <div>
                    <div className="font-semibold text-on-surface text-xs">Staging v1.5 freeze</div>
                    <div className="text-[10px] text-outline">Deploy cutoff triggers</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">T-22h</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <div>
                    <div className="font-semibold text-on-surface text-xs">Postgres dry run replica</div>
                    <div className="text-[10px] text-outline">Database staging test</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">T-25h</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <div>
                    <div className="font-semibold text-on-surface text-xs">Quarterly Sec Audit</div>
                    <div className="text-[10px] text-outline">SOC2 compliance freeze</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded">T-8d</span>
              </div>
            </div>
          </div>

          {/* Calendar Sync Status */}
          <div className="glass-card rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-outline text-[20px]">sync_alt</span>
              <div>
                <span className="text-xs font-semibold text-on-surface block">Calendar Sync: Apple iCal & Google</span>
                <span className="text-[10px] text-outline">Synced 4m ago • 100% telemetry</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          </div>
        </aside>
      </div>
    </div>
  );
};
