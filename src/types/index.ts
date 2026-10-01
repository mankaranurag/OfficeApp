export type WorkspaceTab = 
  | 'todays-tasks'
  | 'jira-stories'
  | 'github-activity'
  | 'schedule-deadlines'
  | 'history-search'
  | 'system-docs'
  | 'settings-api-keys';

export type OsMode = 'macos' | 'windows';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  duration?: string;
  tag: string;
  tagType?: 'core' | 'infra' | 'security' | 'review' | 'other';
  expiry?: string;
  estTime?: string;
  sha?: string;
  branch?: string;
  author?: string;
  issueId?: string;
  isUrgent?: boolean;
  isRestored?: boolean;
  status?: 'active' | 'in-progress' | 'completed';
  notes?: string;
  scheduledDate?: string;
}

export interface AcceptanceCriterion {
  id: string;
  text: string;
  verified: boolean;
  badge: string;
}

export interface JiraComment {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  text: string;
  codeSnippet?: string;
  isBot?: boolean;
  isAddressed?: boolean;
}

export interface JiraStory {
  key: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'code-review' | 'done';
  priority: string;
  storyPoints: number;
  description: string;
  acceptanceCriteria: AcceptanceCriterion[];
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  reporter: {
    name: string;
    avatar: string;
  };
  sprint: string;
  sprintDaysRemaining: number;
  epic: string;
  components: string[];
  fixVersion: string;
  timeTracking: {
    logged: number;
    estimated: number;
  };
  githubBranch: string;
  pullRequest: {
    id: string;
    title: string;
    checks: string;
    target: string;
    commitsCount: number;
    additions: number;
    deletions: number;
  };
  recentCommits: {
    sha: string;
    message: string;
    time: string;
  }[];
  comments: JiraComment[];
}

export interface GitEvent {
  id: string;
  type: 'commit' | 'pr' | 'branch';
  author: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  branch: string;
  time: string;
  sha: string;
  title: string;
  description: string;
  additions: number;
  deletions: number;
  filesCount: number;
  isGpgSigned?: boolean;
  ciStatus?: string;
  prNumber?: string;
}

export interface HistoryTask {
  id: string;
  taskKey: string;
  workspace: string;
  title: string;
  completedTime: string;
  spentTime: string;
  folder: string;
  sha: string;
  commitMsg: string;
  additions: number;
  deletions: number;
  onTime: boolean;
  prRef?: string;
  versionTag?: string;
  branchName?: string;
  reviewer?: string;
  ciStatus?: string;
  markdownNotes: string;
  benchmarkOutcome?: {
    p50: string;
    peakRam: string;
    note: string;
  };
  createdTime: string;
  scheduledTime: string;
  targetDeadline: string;
  completedAt: string;
  auditTrail: {
    text: string;
    time: string;
    icon: string;
    color: string;
  }[];
}

export interface ScheduleDay {
  dayStr: string;
  dayOfWeek: string;
  dayNumber: number;
  hasCutoff?: boolean;
  hasDeploy?: boolean;
  hasCompleted?: boolean;
  isToday?: boolean;
  tasksCount?: number;
}

export interface IntegrationSettings {
  githubPat: string;
  ghConnected: boolean;
  ghUsername: string;
  ghExpiresInDays: number;
  ghScopes: {
    repo: boolean;
    workflow: boolean;
    readUser: boolean;
    adminHook: boolean;
  };
  jiraHost: string;
  jiraEmail: string;
  jiraToken: string;
  jiraProject: string;
  syncRateMinutes: number;
  secureEnclave: boolean;
  flushOnMinimize: boolean;
  clipboardRedactor: boolean;
}
