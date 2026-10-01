import React, { useState } from 'react';
import { JiraStory } from '../types';

interface JiraStoriesViewProps {
  story: JiraStory;
  onUpdateStoryStatus: (status: 'backlog' | 'in-progress' | 'code-review' | 'done') => void;
  onToggleAC: (id: string) => void;
  onAddComment: (text: string) => void;
  onOpenLogTime: () => void;
  onOpenDiffReview: () => void;
  showToast: (msg: string) => void;
}

export const JiraStoriesView: React.FC<JiraStoriesViewProps> = ({
  story,
  onUpdateStoryStatus,
  onToggleAC,
  onAddComment,
  onOpenLogTime,
  onOpenDiffReview,
  showToast
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSyncingJira, setIsSyncingJira] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'worklog' | 'history'>('comments');

  const verifiedACs = story.acceptanceCriteria.filter(ac => ac.verified).length;
  const totalACs = story.acceptanceCriteria.length;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
    showToast('Comment posted to Jira Cloud & linked to CORE-1042');
  };

  const handleMentionInsert = (text: string) => {
    setNewComment(prev => (prev ? `${prev} ${text} ` : `${text} `));
  };

  const handleSyncJira = () => {
    setIsSyncingJira(true);
    showToast('Syncing with Jira Cloud REST API (v3)...');
    setTimeout(() => {
      setIsSyncingJira(false);
      showToast('Jira Cloud synced: Board 42 & CORE-1042 updated.');
    }, 1200);
  };

  const handleCopyBranch = () => {
    navigator.clipboard?.writeText(story.githubBranch);
    showToast(`Copied branch "${story.githubBranch}" to clipboard!`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Story Header & Action Bar */}
      <header className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden">
        {/* Ambient background blur accent */}
        <div className="absolute -top-24 -left-12 w-96 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-20 right-10 w-80 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Row: Breadcrumb & Meta Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-outline font-mono">
            <span className="hover:text-on-surface transition-colors cursor-pointer">DevPulse</span>
            <span>/</span>
            <span className="hover:text-on-surface transition-colors cursor-pointer">CORE Project</span>
            <span>/</span>
            <span className="hover:text-on-surface transition-colors cursor-pointer">SPRINT-42</span>
            <span>/</span>
            <span className="text-primary font-bold">{story.key}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncJira}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <span className={`material-symbols-outlined text-[16px] text-primary ${isSyncingJira ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>Sync Jira Cloud</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Shared Jira Story link to team channel')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface text-xs font-medium transition"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Middle Row: Issue Identifier & Headline */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold tracking-wide font-mono">
                STORY • {story.key}
              </span>
              <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                {story.priority}
              </span>
              <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-medium font-mono">
                <span className="material-symbols-outlined text-[14px] text-purple-400">token</span>
                {story.storyPoints} Story Points
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-on-surface tracking-tight mt-1">
              {story.key}: {story.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={() => showToast('Assigned story to @Alex Rivera')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold shadow-sm transition"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">account_circle</span>
              <span>Assign to Me</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Jira Story attributes updated')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Update Story</span>
            </button>
          </div>
        </div>

        {/* Bottom Interactive Status Control Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 relative z-10 border-t border-white/10">
          <div className="flex items-center gap-2 bg-surface-container-lowest/80 p-1 rounded-xl border border-white/5">
            <span className="text-xs text-outline px-2 font-medium">Status:</span>
            <div className="inline-flex items-center gap-1">
              {(['backlog', 'in-progress', 'code-review', 'done'] as const).map(statusKey => {
                const isCurrent = story.status === statusKey;
                const labels: Record<string, string> = {
                  'backlog': 'Backlog',
                  'in-progress': 'In Progress',
                  'code-review': 'Code Review',
                  'done': 'Done'
                };
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => {
                      onUpdateStoryStatus(statusKey);
                      showToast(`Updated status to: ${labels[statusKey]}`);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {labels[statusKey]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-lowest/60 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="material-symbols-outlined text-[16px] text-secondary">fork_right</span>
            <code className="text-xs text-secondary font-mono font-semibold">{story.githubBranch}</code>
            <button onClick={handleCopyBranch} className="text-outline hover:text-on-surface transition p-0.5" title="Copy branch">
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
            </button>
            <span className="w-1 h-1 rounded-full bg-outline"></span>
            <button 
              onClick={onOpenDiffReview} 
              className="text-xs text-primary hover:underline font-mono font-semibold flex items-center gap-0.5"
            >
              <span>{story.pullRequest.id}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Story Specification & Activity Hub (8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Story Specification & Acceptance Criteria Card */}
          <article className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                <h2 className="text-base font-bold text-on-surface">Story Specification</h2>
              </div>
              <button 
                onClick={() => showToast('Editing Acceptance Criteria matrix')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition"
              >
                <span className="material-symbols-outlined text-[14px]">edit_note</span>
                <span>Edit Criteria</span>
              </button>
            </div>

            {/* Description Box */}
            <div className="rounded-xl bg-surface-container-lowest/60 p-4 flex flex-col gap-1 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Description</span>
              <p className="text-xs text-on-surface leading-relaxed">
                {story.description}
              </p>
            </div>

            {/* Interactive Acceptance Criteria Checklist */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Acceptance Criteria</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    verifiedACs === totalACs ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-container-highest text-emerald-400'
                  }`}>
                    {verifiedACs} of {totalACs} Passed
                  </span>
                </div>
                <span className="text-[11px] text-outline">Click checkbox to toggle verification</span>
              </div>

              <div className="flex flex-col gap-2 mt-1">
                {story.acceptanceCriteria.map(ac => (
                  <label
                    key={ac.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-high/60 transition cursor-pointer border border-white/5 group select-none"
                  >
                    <input
                      type="checkbox"
                      checked={ac.verified}
                      onChange={() => {
                        onToggleAC(ac.id);
                        showToast(`Updated verification: "${ac.text.substring(0, 30)}..."`);
                      }}
                      className="mt-0.5 rounded bg-surface-container-highest text-primary-container focus:ring-0 w-4 h-4 cursor-pointer accent-primary-container"
                    />
                    <span className={`flex-1 text-xs leading-relaxed ${
                      ac.verified ? 'text-outline line-through' : 'text-on-surface'
                    }`}>
                      {ac.text}
                    </span>
                    <span className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      ac.verified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-surface-container-highest text-outline'
                    }`}>
                      {ac.verified ? 'Verified' : ac.badge}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </article>

          {/* Activity & Comments Discussion Hub */}
          <article className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1 bg-surface-container-lowest/80 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeTab === 'comments' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Comments ({story.comments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('worklog')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeTab === 'worklog' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Work Log ({story.timeTracking.logged}h)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeTab === 'history' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-outline hover:text-on-surface'
                  }`}
                >
                  History & Audit
                </button>
              </div>

              <span className="text-[11px] text-outline flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Syncing
              </span>
            </div>

            {/* Comments Stream */}
            <div className="flex flex-col gap-3">
              {story.comments.map(comm => (
                <div
                  key={comm.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border border-white/5 ${
                    comm.isBot ? 'bg-surface-container-lowest/50' : 'bg-surface-container-low/75'
                  }`}
                >
                  {comm.avatar ? (
                    <img
                      src={comm.avatar}
                      alt={comm.author}
                      className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-on-surface">{comm.author}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/10 text-purple-300 font-mono">
                          {comm.role}
                        </span>
                        <span className="text-[11px] text-outline">• {comm.time}</span>
                      </div>
                      {comm.isAddressed && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold font-mono">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          Addressed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {comm.text}
                    </p>

                    {comm.codeSnippet && (
                      <div className="rounded-lg bg-surface-container-lowest p-2.5 font-mono text-[11px] text-on-surface-variant overflow-x-auto mt-1 border border-white/5">
                        <pre className="m-0 leading-relaxed"><code>{comm.codeSnippet}</code></pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Comment Composer */}
            <form onSubmit={handlePostComment} className="mt-2 rounded-xl bg-surface-container-lowest/80 p-3.5 flex flex-col gap-2.5 border border-white/10">
              <div className="flex items-center justify-between pb-1 flex-wrap gap-1">
                <div className="flex items-center gap-1 text-outline">
                  <button type="button" onClick={() => handleMentionInsert('**bold**')} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 hover:text-on-surface" title="Bold">
                    <span className="material-symbols-outlined text-[16px]">format_bold</span>
                  </button>
                  <button type="button" onClick={() => handleMentionInsert('*italic*')} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 hover:text-on-surface" title="Italic">
                    <span className="material-symbols-outlined text-[16px]">format_italic</span>
                  </button>
                  <button type="button" onClick={() => handleMentionInsert('`code`')} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 hover:text-on-surface" title="Code">
                    <span className="material-symbols-outlined text-[16px]">code</span>
                  </button>
                  <button type="button" onClick={() => handleMentionInsert('[link](url)')} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 hover:text-on-surface" title="Link">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-outline">Quick:</span>
                  <button
                    type="button"
                    onClick={() => handleMentionInsert('@Sarah Chen')}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-purple-300 transition"
                  >
                    @Sarah Chen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMentionInsert('#PR-88')}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary transition"
                  >
                    #PR-88
                  </button>
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply or update sprint status... (Markdown supported, type @ to mention team)"
                rows={3}
                className="w-full bg-surface-container-low/70 rounded-xl p-3 text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary transition resize-y min-h-[70px] border border-white/5"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleMentionInsert('```\n// Diff snippet:\n```');
                    showToast('Inserted code diff block');
                  }}
                  className="flex items-center gap-1 text-outline hover:text-on-surface text-xs transition"
                >
                  <span className="material-symbols-outlined text-[15px]">attach_file</span>
                  <span>Attach Log / Diff</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewComment('')}
                    className="px-3 py-1.5 rounded-xl text-outline hover:text-on-surface text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold hover:brightness-110 active:scale-95 transition shadow-sm"
                  >
                    <span>Post Comment</span>
                    <span className="material-symbols-outlined text-[15px]">send</span>
                  </button>
                </div>
              </div>
            </form>
          </article>
        </section>

        {/* Right Column: Story Attributes, Time Tracking & GitHub Context (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 min-w-0">
          {/* Story Attributes Card */}
          <div className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
                Story Attributes
              </h3>
              <span className="text-[10px] font-mono text-outline">Jira Sync Active</span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/70 border border-white/5">
                <span className="text-outline text-[11px]">Assignee</span>
                <div className="flex items-center gap-1.5">
                  <img src={story.assignee.avatar} alt={story.assignee.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-semibold text-on-surface text-xs">{story.assignee.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/70 border border-white/5">
                <span className="text-outline text-[11px]">Reporter</span>
                <div className="flex items-center gap-1.5">
                  <img src={story.reporter.avatar} alt={story.reporter.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-semibold text-on-surface text-xs">{story.reporter.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/70 border border-white/5">
                <span className="text-outline text-[11px]">Sprint</span>
                <div className="text-right">
                  <div className="font-semibold text-on-surface text-xs">{story.sprint}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{story.sprintDaysRemaining} days remaining</div>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-surface-container-low/70 border border-white/5">
                <span className="text-outline text-[10px]">Epic</span>
                <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold font-mono">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span className="truncate">{story.epic}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-surface-container-low/70 border border-white/5">
                <span className="text-outline text-[10px]">Components</span>
                <div className="flex flex-wrap gap-1">
                  {story.components.map(comp => (
                    <span key={comp} className="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-mono">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/70 border border-white/5">
                <span className="text-outline text-[11px]">Fix Version</span>
                <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                  {story.fixVersion}
                </span>
              </div>
            </div>
          </div>

          {/* Time Tracking Card */}
          <div className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">timer</span>
                Time Tracking
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {Math.round((story.timeTracking.logged / story.timeTracking.estimated) * 100)}% Logged
              </span>
            </div>

            <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 transition-all duration-700"
                style={{ width: `${Math.min(100, (story.timeTracking.logged / story.timeTracking.estimated) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-on-surface">Logged: <strong className="text-primary font-bold">{story.timeTracking.logged}h</strong></span>
              <span className="text-outline">Estimated: <strong className="text-on-surface">{story.timeTracking.estimated}h</strong></span>
            </div>

            <button
              type="button"
              onClick={onOpenLogTime}
              className="mt-1 w-full py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">add_circle</span>
              <span>+ Log Work Time</span>
            </button>
          </div>

          {/* GitHub Context Card */}
          <div className="glass-card rounded-2xl p-5 shadow-xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">terminal</span>
                GitHub Context
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                CI Passing
              </span>
            </div>

            {/* Target Branch */}
            <div className="p-2.5 rounded-xl bg-surface-container-low/70 border border-white/5 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-outline block">Target Branch</span>
                <code className="text-secondary font-mono font-semibold">{story.githubBranch}</code>
              </div>
              <button onClick={handleCopyBranch} className="p-1 rounded text-outline hover:text-on-surface transition" title="Copy checkout">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            {/* Linked PR Summary */}
            <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-white/5 flex flex-col gap-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">call_merge</span>
                  {story.pullRequest.title}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                  {story.pullRequest.checks}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-outline font-mono">
                <span>Target: <code className="text-on-surface">{story.pullRequest.target}</code></span>
                <span className="text-emerald-400">+{story.pullRequest.additions}</span>
                <span className="text-red-400">-{story.pullRequest.deletions}</span>
              </div>
              <button
                type="button"
                onClick={onOpenDiffReview}
                className="w-full mt-1 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition text-center"
              >
                Review Diff
              </button>
            </div>

            {/* Recent Commits */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Recent Commits</span>
              {story.recentCommits.map(c => (
                <div key={c.sha} className="p-2 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low transition text-xs flex items-start gap-2 border border-white/5">
                  <span className="material-symbols-outlined text-[14px] text-secondary mt-0.5">commit</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <code className="text-[11px] font-mono font-bold text-primary">{c.sha}</code>
                      <span className="text-[10px] text-outline font-mono">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => showToast('Search & link PR / commit dialog spawned')}
              className="w-full py-2 rounded-xl bg-surface-container-lowest/60 hover:bg-surface-container-high text-primary text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_link</span>
              <span>+ Link Another PR or Commit</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
