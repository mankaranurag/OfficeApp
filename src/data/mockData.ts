import { Task, JiraStory, GitEvent, HistoryTask, ScheduleDay, IntegrationSettings } from '../types';

export const INITIAL_TASKS: Task[] = [
  // Expiring Today
  {
    id: 'task-1',
    title: 'Refactor Redis connection pool pooling timeout',
    completed: false,
    tag: '#core-engine',
    tagType: 'core',
    expiry: 'Expires in 2 hrs (5:00 PM)',
    sha: '3a9f1b2',
    estTime: 'Est: 45m',
    isUrgent: true,
    status: 'active',
    author: 'Alex Rivera'
  },
  {
    id: 'task-2',
    title: 'Approve security patch & sign off deployment pipeline',
    completed: false,
    tag: '#402 fix',
    tagType: 'security',
    expiry: 'Expires in 3.5 hrs (6:30 PM)',
    sha: '9d84c01',
    estTime: 'Est: 20m',
    isUrgent: true,
    status: 'active',
    author: 'CI Runner #419'
  },
  // Active in Sprint Queue
  {
    id: 'task-3',
    title: 'Update OpenAPI 3.1 specification for telemetry endpoint',
    completed: false,
    tag: 'PR Review',
    tagType: 'review',
    estTime: 'Est: 1h 15m',
    status: 'in-progress',
    branch: 'spec/telemetry-api',
    author: 'Alex Rivera',
    issueId: '#1092',
    notes: 'Coordinate schema types with frontend types generator. Ensure backwards compatibility with older macOS DevPulse clients (v1.3.x).'
  },
  {
    id: 'task-4',
    title: 'Benchmark SQLite WAL mode on disk under high concurrency load',
    completed: false,
    tag: '#infra',
    tagType: 'infra',
    estTime: 'Est: 30m',
    status: 'in-progress',
    author: 'Alex Rivera'
  },
  // Completed Today
  {
    id: 'task-5',
    title: 'Rebuild dock icon rendering for high-DPI Retina screens',
    completed: true,
    completedAt: '11:20 AM',
    duration: '18m',
    tag: 'Done',
    tagType: 'other',
    status: 'completed'
  },
  {
    id: 'task-6',
    title: 'Sanitize query payloads for local telemetry audit log',
    completed: true,
    completedAt: '9:45 AM',
    duration: '25m',
    tag: 'Done',
    tagType: 'other',
    status: 'completed'
  },
  {
    id: 'task-7',
    title: 'Deploy staging cluster ingress router v1.1.8',
    completed: true,
    completedAt: '8:15 AM',
    duration: '24m',
    tag: 'Done',
    tagType: 'other',
    status: 'completed'
  }
];

export const MOCK_JIRA_STORY: JiraStory = {
  key: 'CORE-1042',
  title: 'Implement SQLite WAL Mode & In-Memory Cache Tier for Sandbox Engine',
  status: 'in-progress',
  priority: 'High Priority (P1)',
  storyPoints: 5,
  description: 'Transition Core Engine local persistence layer from CoreData/disk-bound storage to lightweight SQLite with WAL (Write-Ahead Logging) mode to maintain resident memory strictly under 20MB during rapid git diff streaming and high-frequency AST token updates.',
  acceptanceCriteria: [
    {
      id: 'ac-1',
      text: 'SQLite connection pool restricted to max 2 threads with mutex locks to eliminate IPC starvation.',
      verified: true,
      badge: 'Verified'
    },
    {
      id: 'ac-2',
      text: 'WAL checkpointing runs asynchronously in daemon thread every 60s without blocking UI render loop.',
      verified: true,
      badge: 'Verified'
    },
    {
      id: 'ac-3',
      text: 'Benchmarks verify < 15MB base resident memory footprint under simulation of 1,000 cached commits.',
      verified: false,
      badge: 'Pending Diff'
    },
    {
      id: 'ac-4',
      text: 'Unit tests for multi-process lock contention pass reliably on both macOS Sequoia and Windows 11 sandbox environments.',
      verified: false,
      badge: 'In Review'
    }
  ],
  assignee: {
    name: 'Alex Rivera',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UXkE8QnEcgagLcItFqZG_e1ol7DiCr3syePWIDGlh72kKAvYDCXEVvI4jZ4C7DhwNY0B1bSDxkvXEQFmfVHpfGzZNkMnvbhY3CMjSTyNtG5yVP183PfuTT0IgFmw3Xirc5woV7GLCWBcqkKn3_fGtPP4fv9FBmKNNOqLrp4BZQ7Cs28a_gLlS4IfGblvp309U2BMx5WjReF3NQ2iM0A_Zz147SI2XvefaS7nwZwBm3D52l-kZD49yjkus3',
    role: 'Staff Engineer / Assignee'
  },
  reporter: {
    name: 'Sarah Chen',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1XIhTzY3eUe08iU9h0fR4lC7-FjQ46i4H_8P0Gj3oPzRjP7sYk=s96-c'
  },
  sprint: 'Sprint 42',
  sprintDaysRemaining: 4,
  epic: 'EPIC-12: Core Performance',
  components: ['#core-engine', '#sqlite', '#caching'],
  fixVersion: 'v1.4.2-rc',
  timeTracking: {
    logged: 14,
    estimated: 20
  },
  githubBranch: 'git/feature/sqlite-wal',
  pullRequest: {
    id: 'PR #88',
    title: 'PR #88 — Core Memory Sandbox Pipeline',
    checks: '4/4 checks passed',
    target: 'main',
    commitsCount: 6,
    additions: 428,
    deletions: 84
  },
  recentCommits: [
    {
      sha: '3a9f1b2',
      message: 'Fix memory leak in SwiftUI Table View cell reuse during streaming',
      time: '18m ago'
    },
    {
      sha: '9d84c01',
      message: 'Sign and notarize macOS build binaries for staging release',
      time: '3h ago'
    }
  ],
  comments: [
    {
      id: 'comm-1',
      author: 'Sarah Chen',
      role: 'Principal Architect',
      avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1XIhTzY3eUe08iU9h0fR4lC7-FjQ46i4H_8P0Gj3oPzRjP7sYk=s96-c',
      time: '2h ago',
      text: 'Checked the WAL benchmark PR. Look at checkpoint starvation if git polling interval drops below 5 seconds. On macOS APFS, simultaneous read-snapshots can delay truncation:',
      codeSnippet: '// Guard against checkpoint starvation:\nsqlite3_wal_checkpoint_v2(db, "main", SQLITE_CHECKPOINT_PASSIVE, &log_size, &ckp_size);'
    },
    {
      id: 'comm-2',
      author: 'Alex Rivera',
      role: 'Assignee',
      avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UXkE8QnEcgagLcItFqZG_e1ol7DiCr3syePWIDGlh72kKAvYDCXEVvI4jZ4C7DhwNY0B1bSDxkvXEQFmfVHpfGzZNkMnvbhY3CMjSTyNtG5yVP183PfuTT0IgFmw3Xirc5woV7GLCWBcqkKn3_fGtPP4fv9FBmKNNOqLrp4BZQ7Cs28a_gLlS4IfGblvp309U2BMx5WjReF3NQ2iM0A_Zz147SI2XvefaS7nwZwBm3D52l-kZD49yjkus3',
      time: '1h ago',
      text: 'Good catch. Added `PRAGMA wal_autocheckpoint=1000` to prevent uncommitted journal bloat. Updated PR #88 with the adjusted thread throttle diff.',
      isAddressed: true
    },
    {
      id: 'comm-3',
      author: 'DevPulse Sync Bot',
      role: 'Automated Webhook',
      avatar: '',
      time: '45m ago',
      text: 'Linked GitHub Commit `3a9f1b2` (Fix memory leak in SwiftUI Table View cell reuse during streaming) to CORE-1042.',
      isBot: true
    }
  ]
};

export const MOCK_GIT_EVENTS: GitEvent[] = [
  {
    id: 'git-1',
    type: 'commit',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UXkE8QnEcgagLcItFqZG_e1ol7DiCr3syePWIDGlh72kKAvYDCXEVvI4jZ4C7DhwNY0B1bSDxkvXEQFmfVHpfGzZNkMnvbhY3CMjSTyNtG5yVP183PfuTT0IgFmw3Xirc5woV7GLCWBcqkKn3_fGtPP4fv9FBmKNNOqLrp4BZQ7Cs28a_gLlS4IfGblvp309U2BMx5WjReF3NQ2iM0A_Zz147SI2XvefaS7nwZwBm3D52l-kZD49yjkus3'
    },
    branch: 'feature/push-scheduler',
    time: '8m ago',
    sha: 'c8f902e',
    title: 'feat: add native background push notification scheduler',
    description: 'Integrated APNS low-power payload parser with macOS dynamic sleep cycle hooks.',
    additions: 124,
    deletions: 18,
    filesCount: 4,
    isGpgSigned: true
  },
  {
    id: 'git-2',
    type: 'pr',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1XIhTzY3eUe08iU9h0fR4lC7-FjQ46i4H_8P0Gj3oPzRjP7sYk=s96-c'
    },
    branch: 'main',
    time: '42m ago',
    sha: '#482',
    prNumber: '#482',
    title: 'perf(engine): optimize thread pool queue allocation for multi-core Apple Silicon',
    description: 'Reduces thread wake contention by 34% under heavy local re-indexing workflows.',
    additions: 308,
    deletions: 94,
    filesCount: 7,
    ciStatus: 'All checks passed (CI: 1m 14s)'
  },
  {
    id: 'git-3',
    type: 'branch',
    author: {
      name: 'Devin Vance',
      initials: 'DV'
    },
    branch: 'fix/ipc-memory-leak',
    time: '1h ago',
    sha: '44b2a8d',
    title: 'Spawned branch from origin/main (SHA: 44b2a8d)',
    description: 'Isolated reproduction branch for cross-process IPC buffer leak.',
    additions: 0,
    deletions: 0,
    filesCount: 0
  },
  {
    id: 'git-4',
    type: 'commit',
    author: {
      name: 'Alex Rivera',
      initials: 'AR'
    },
    branch: 'main',
    time: '2h ago',
    sha: 'a11bc3e',
    title: 'chore(deps): bump sqlite3-embedded from 3.42.0 to 3.44.1',
    description: 'Upgraded SQLite C-core to latest release for optimized WAL page prefetching.',
    additions: 4,
    deletions: 4,
    filesCount: 1
  }
];

export const MOCK_HISTORY_TASKS: HistoryTask[] = [
  {
    id: 'hist-1',
    taskKey: 'TASK-1092',
    workspace: 'Core Infrastructure',
    title: 'Refactor LMDB cursor pool & optimize garbage collection',
    completedTime: 'Completed 16:42',
    spentTime: '2h 10m spent',
    folder: 'core-storage',
    sha: '8f2a10c',
    commitMsg: 'feat(db): low-mem store & bounded cursor eviction',
    additions: 148,
    deletions: 22,
    onTime: true,
    prRef: 'PR #482 Merged',
    versionTag: 'v1.4.2-rc',
    branchName: 'devpulse/engine: feat/lmdb-pool-v2',
    reviewer: '@sarah-k',
    ciStatus: 'PASSING',
    markdownNotes: 'Replaced default cursor allocation with bounded ring buffer. Cursors now return to idle slab upon transaction commit without triggering macOS Mach memory compaction passes.',
    benchmarkOutcome: {
      p50: '0.12ms → 0.04ms (-66%)',
      peakRam: '24.2MB → 18.4MB (-24%)',
      note: 'Verified with Instruments.app Allocations Trace #893-b on macOS Sonoma 14.5.'
    },
    createdTime: 'Oct 25, 09:12 AM',
    scheduledTime: 'Oct 25, 14:00 PM',
    targetDeadline: 'Oct 25, 17:30 PM',
    completedAt: 'Oct 25, 16:42 PM',
    auditTrail: [
      { text: 'macOS Notification: "Task Done (Ahead of Time)"', time: '16:42:01', icon: 'notifications_active', color: 'text-emerald-400' },
      { text: 'GitHub Webhook: PR #482 auto-closed TASK-1092', time: '16:40:18', icon: 'cloud_done', color: 'text-purple-400' },
      { text: 'Midpoint Checkpoint: 50% target elapsed', time: '15:15:00', icon: 'alarm', color: 'text-slate-400' }
    ]
  },
  {
    id: 'hist-2',
    taskKey: 'TASK-1090',
    workspace: 'UI Shell',
    title: 'Integrate WebKit native titlebar vibrancy injection',
    completedTime: 'Completed 12:15',
    spentTime: '1h 45m spent',
    folder: 'ui-shell',
    sha: '0b39e41',
    commitMsg: 'refactor(macOS): apply NSVisualEffectView blurs',
    additions: 62,
    deletions: 8,
    onTime: true,
    versionTag: 'v1.4.2-rc',
    branchName: 'devpulse/ui: feat/vibrancy',
    reviewer: '@marcus',
    ciStatus: 'PASSING',
    markdownNotes: 'Configured NSVisualEffectView with NSVisualEffectMaterialSidebar and proper subview layer hierarchy to avoid window tearing.',
    createdTime: 'Oct 25, 08:30 AM',
    scheduledTime: 'Oct 25, 10:00 AM',
    targetDeadline: 'Oct 25, 13:00 PM',
    completedAt: 'Oct 25, 12:15 PM',
    auditTrail: [
      { text: 'Task completed and verified on Retina display', time: '12:15:00', icon: 'check_circle', color: 'text-emerald-400' }
    ]
  },
  {
    id: 'hist-3',
    taskKey: 'TASK-1088',
    workspace: 'Runtime Daemon',
    title: 'Verify hotkey handler reentrancy under low-latency sleep',
    completedTime: 'Completed 09:30',
    spentTime: '45m spent',
    folder: 'runtime-daemon',
    sha: '7f91a2e',
    commitMsg: 'fix(hotkey): avoid lock reentrancy on wake',
    additions: 28,
    deletions: 5,
    onTime: true,
    versionTag: 'v1.4.1',
    markdownNotes: 'Wrapped global event tap with non-reentrant dispatch_queue to handle sudden macOS lid open/close events.',
    createdTime: 'Oct 25, 08:00 AM',
    scheduledTime: 'Oct 25, 08:30 AM',
    targetDeadline: 'Oct 25, 10:00 AM',
    completedAt: 'Oct 25, 09:30 AM',
    auditTrail: [
      { text: 'Unit tests passed for Carbon hotkey bindings', time: '09:30:10', icon: 'check_circle', color: 'text-emerald-400' }
    ]
  },
  {
    id: 'hist-4',
    taskKey: 'TASK-1085',
    workspace: 'Metrics Collector',
    title: 'Implement zero-allocation telemetry dispatch batching',
    completedTime: 'Completed Oct 24, 18:05',
    spentTime: '3h 20m spent',
    folder: 'metrics-collector',
    sha: '6c18e90',
    commitMsg: 'perf(telemetry): use fixed ring buffer for flush queue',
    additions: 310,
    deletions: 144,
    onTime: true,
    prRef: 'PR #479',
    versionTag: 'v1.4.0',
    markdownNotes: 'Swapped heap allocations for static pre-allocated ring buffer. Zero GC sweeps during high frequency metric capture.',
    createdTime: 'Oct 24, 13:00 PM',
    scheduledTime: 'Oct 24, 14:00 PM',
    targetDeadline: 'Oct 24, 19:00 PM',
    completedAt: 'Oct 24, 18:05 PM',
    auditTrail: [
      { text: 'Memory profiler shows zero allocations during 10k tick loop', time: '18:05:00', icon: 'check_circle', color: 'text-emerald-400' }
    ]
  }
];

export const SCHEDULE_DAYS: ScheduleDay[] = [
  { dayStr: 'Mon', dayOfWeek: 'Mon', dayNumber: 21, hasCompleted: true },
  { dayStr: 'Tue', dayOfWeek: 'Tue', dayNumber: 22, hasCompleted: true },
  { dayStr: 'Wed', dayOfWeek: 'Wed', dayNumber: 23, hasCompleted: true, hasDeploy: true },
  { dayStr: 'Thu', dayOfWeek: 'Thu', dayNumber: 24, hasCompleted: true },
  { dayStr: 'Fri', dayOfWeek: 'Fri', dayNumber: 25, hasCompleted: true },
  { dayStr: 'Sat', dayOfWeek: 'Sat', dayNumber: 26, isToday: true, hasCutoff: true, hasDeploy: true, tasksCount: 2 },
  { dayStr: 'Sun', dayOfWeek: 'Sun', dayNumber: 27 },
  { dayStr: 'Mon', dayOfWeek: 'Mon', dayNumber: 28, hasDeploy: true },
  { dayStr: 'Tue', dayOfWeek: 'Tue', dayNumber: 29, hasDeploy: true },
  { dayStr: 'Wed', dayOfWeek: 'Wed', dayNumber: 30, hasCutoff: true }
];

export const INITIAL_INTEGRATION_SETTINGS: IntegrationSettings = {
  githubPat: 'ghp_xK894hFmB7190qWvLqS8021mNqZ4p3a9f',
  ghConnected: true,
  ghUsername: 'alexrivera-dev',
  ghExpiresInDays: 28,
  ghScopes: {
    repo: true,
    workflow: true,
    readUser: true,
    adminHook: false
  },
  jiraHost: 'https://devpulse-sprint.atlassian.net',
  jiraEmail: 'alex.rivera@devpulse.io',
  jiraToken: 'ATATT3xFfGF0kMvA9X2hLp892m30Qv92K81014pL128912c7c4b',
  jiraProject: 'CORE • Core Engine & Sandboxing',
  syncRateMinutes: 2,
  secureEnclave: true,
  flushOnMinimize: true,
  clipboardRedactor: true
};
