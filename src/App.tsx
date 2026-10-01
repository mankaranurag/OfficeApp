import React, { useState, useEffect } from 'react';
import { WorkspaceTab, Task, JiraStory, GitEvent, OsMode } from './types';
import { INITIAL_TASKS, MOCK_JIRA_STORIES, MOCK_GIT_EVENTS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { DiffReviewModal } from './components/DiffReviewModal';
import { PreferencesModal } from './components/PreferencesModal';
import { LogWorkTimeModal } from './components/LogWorkTimeModal';
import { DocsModal } from './components/DocsModal';
import { WindowsBuildModal } from './components/WindowsBuildModal';
import { DryMigrationModal } from './components/DryMigrationModal';

import { TodaysTasksView } from './views/TodaysTasksView';
import { JiraStoriesView } from './views/JiraStoriesView';
import { GitHubActivityView } from './views/GitHubActivityView';
import { ScheduleDeadlinesView } from './views/ScheduleDeadlinesView';
import { HistorySearchView } from './views/HistorySearchView';
import { SystemDocsView } from './views/SystemDocsView';
import { SettingsApiKeysView } from './views/SettingsApiKeysView';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('todays-tasks');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [osMode, setOsMode] = useState<OsMode>('macos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ramUsage, setRamUsage] = useState('18.4 MB');
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);

  // Modals state
  const [isDiffReviewOpen, setIsDiffReviewOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isLogWorkTimeOpen, setIsLogWorkTimeOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isWindowsBuildOpen, setIsWindowsBuildOpen] = useState(false);
  const [isDryMigrationOpen, setIsDryMigrationOpen] = useState(false);

  // Data state
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [stories, setStories] = useState<JiraStory[]>(MOCK_JIRA_STORIES);
  const [activeStoryKey, setActiveStoryKey] = useState<string>('CORE-1042');
  const [gitEvents, setGitEvents] = useState<GitEvent[]>(MOCK_GIT_EVENTS);

  const activeStory = stories.find(s => s.key === activeStoryKey) || stories[0];

  // Apply theme class to root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  // Global Keyboard Shortcuts (⌘K, ⌘N, ⌘G, ⌘S, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('history-search');
        setTimeout(() => {
          const input = document.getElementById('global-search-input');
          if (input) {
            input.focus();
            (input as HTMLInputElement).select();
          }
        }, 100);
        showToast('Activated Omnisearch (⌘K)');
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setActiveTab('todays-tasks');
        setTimeout(() => {
          const input = document.getElementById('task-input-field');
          if (input) input.focus();
        }, 100);
        showToast('Fast Task Intake activated (⌘N)');
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleAddTask('PR #492: Integrate low-power background telemetry parser', '#core-engine', 'Expires 6:00 PM');
        showToast('Spawned tracked task from Git commit (⌘G)!');
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleManualSync();
      }

      if (e.key === 'Escape') {
        setIsDiffReviewOpen(false);
        setIsPreferencesOpen(false);
        setIsLogWorkTimeOpen(false);
        setIsDocsOpen(false);
        setIsWindowsBuildOpen(false);
        setIsDryMigrationOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Automated GitHub & SQLite Sync pipeline
  const pushGitSyncEvent = (title: string, branch: string = 'main', type: 'commit' | 'pr' | 'branch' = 'commit') => {
    const randomSha = Math.random().toString(16).substring(2, 9);
    const newEvent: GitEvent = {
      id: 'git-dyn-' + Date.now(),
      type,
      author: {
        name: 'Alex Rivera',
        avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UXkE8QnEcgagLcItFqZG_e1ol7DiCr3syePWIDGlh72kKAvYDCXEVvI4jZ4C7DhwNY0B1bSDxkvXEQFmfVHpfGzZNkMnvbhY3CMjSTyNtG5yVP183PfuTT0IgFmw3Xirc5woV7GLCWBcqkKn3_fGtPP4fv9FBmKNNOqLrp4BZQ7Cs28a_gLlS4IfGblvp309U2BMx5WjReF3NQ2iM0A_Zz147SI2XvefaS7nwZwBm3D52l-kZD49yjkus3'
      },
      branch,
      time: 'Just now',
      sha: randomSha,
      title,
      description: 'Synchronized via DevPulse SQLite WAL auto-journal daemon.',
      additions: Math.floor(Math.random() * 80) + 10,
      deletions: Math.floor(Math.random() * 20) + 2,
      filesCount: 2,
      isGpgSigned: true
    };
    setGitEvents(prev => [newEvent, ...prev]);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    showToast('Polling GitHub API & vacuuming local SQLite WAL cache...');

    setTimeout(() => {
      setIsSyncing(false);
      const newRam = (18.1 + Math.random() * 0.5).toFixed(1) + ' MB';
      setRamUsage(newRam);
      pushGitSyncEvent('chore(sync): manual WAL checkpoint & git index flush', 'main');
      showToast(`Sync complete! SQLite cache validated at ${newRam} resident footprint.`);
    }, 1200);
  };

  // Task Handlers (Reversible state machine)
  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newCompleted = !t.completed;
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          if (newCompleted) {
            pushGitSyncEvent(`feat(task): complete and verify "${t.title.substring(0, 30)}"`, 'feature/sprint-42');
          }
          return {
            ...t,
            completed: newCompleted,
            completedAt: newCompleted ? timeStr : undefined,
            isRestored: !newCompleted
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (title: string, tag: string, expiry: string) => {
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title,
      completed: false,
      tag,
      tagType: tag.includes('core') ? 'core' : tag.includes('infra') ? 'infra' : tag.includes('sec') ? 'security' : 'other',
      expiry,
      estTime: 'Est: 45m',
      status: 'active',
      isUrgent: expiry.includes('6:00') || expiry.includes('3:00'),
      scheduledDate: '26'
    };
    setTasks(prev => [newTask, ...prev]);
    pushGitSyncEvent(`task(create): new item "${title.substring(0, 28)}"`, 'feature/sprint-42');
  };

  const handleConvertGitToTask = (title: string, sha: string) => {
    handleAddTask(`Review & Verify: ${title} (${sha})`, '#core-engine', 'Expires 6:00 PM');
    setActiveTab('todays-tasks');
  };

  // Jira Story Handlers
  const handleUpdateStoryStatus = (status: 'backlog' | 'in-progress' | 'code-review' | 'done') => {
    setStories(prev =>
      prev.map(s => (s.key === activeStoryKey ? { ...s, status } : s))
    );
    pushGitSyncEvent(`jira(${activeStoryKey}): transition status to ${status}`, activeStory.githubBranch);
  };

  const handleToggleAC = (id: string) => {
    setStories(prev =>
      prev.map(s => {
        if (s.key === activeStoryKey) {
          return {
            ...s,
            acceptanceCriteria: s.acceptanceCriteria.map(ac =>
              ac.id === id ? { ...ac, verified: !ac.verified } : ac
            )
          };
        }
        return s;
      })
    );
    pushGitSyncEvent(`test(${activeStoryKey}): toggle acceptance criterion verification`, activeStory.githubBranch);
  };

  const handleAddComment = (text: string) => {
    const newComm = {
      id: 'comm-' + Date.now(),
      author: 'Alex Rivera',
      role: 'Assignee',
      avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UXkE8QnEcgagLcItFqZG_e1ol7DiCr3syePWIDGlh72kKAvYDCXEVvI4jZ4C7DhwNY0B1bSDxkvXEQFmfVHpfGzZNkMnvbhY3CMjSTyNtG5yVP183PfuTT0IgFmw3Xirc5woV7GLCWBcqkKn3_fGtPP4fv9FBmKNNOqLrp4BZQ7Cs28a_gLlS4IfGblvp309U2BMx5WjReF3NQ2iM0A_Zz147SI2XvefaS7nwZwBm3D52l-kZD49yjkus3',
      time: 'Just now',
      text
    };
    setStories(prev =>
      prev.map(s => {
        if (s.key === activeStoryKey) {
          return {
            ...s,
            comments: [...s.comments, newComm]
          };
        }
        return s;
      })
    );
    pushGitSyncEvent(`comment(${activeStoryKey}): ${text.substring(0, 30)}...`, activeStory.githubBranch);
  };

  const handleLogWorkTime = (hours: number, note: string) => {
    setStories(prev =>
      prev.map(s => {
        if (s.key === activeStoryKey) {
          return {
            ...s,
            timeTracking: {
              ...s.timeTracking,
              logged: s.timeTracking.logged + hours
            }
          };
        }
        return s;
      })
    );
    pushGitSyncEvent(`time(${activeStoryKey}): logged ${hours}h work`, activeStory.githubBranch);
    showToast(`Logged ${hours}h on ${activeStoryKey}: "${note || 'Development update'}"`);
  };

  const handleFilterTag = (tag: string) => {
    if (activeFilterTag === tag) {
      setActiveFilterTag(null);
      showToast('Cleared tag filter');
    } else {
      setActiveFilterTag(tag);
      showToast(`Filtered workspace view by: ${tag}`);
    }
  };

  const handleNewWorkspace = () => {
    const name = window.prompt('Enter new workspace name: (e.g. Core Engine, Release v1.5, QA Sandbox)');
    if (name) {
      showToast(`Created new workspace: "${name}"`);
      pushGitSyncEvent(`workspace(init): create workspace "${name}"`, 'main');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#111317] text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Toast Notification */}
      <Toast message={toastMessage} />

      {/* Top Navigation Header (macOS & Windows 11 Chrome support) */}
      <Header
        theme={theme}
        onToggleTheme={setTheme}
        osMode={osMode}
        onToggleOsMode={setOsMode}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        ramUsage={ramUsage}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenWindowsBuild={() => setIsWindowsBuildOpen(true)}
        showToast={showToast}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex pt-14 h-screen overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenWindowsBuild={() => setIsWindowsBuildOpen(true)}
          onFilterTag={handleFilterTag}
          activeFilterTag={activeFilterTag}
          ramUsage={ramUsage}
          onNewWorkspace={handleNewWorkspace}
        />

        {/* Dynamic Main Viewport Canvas */}
        <main className="flex-1 pl-64 overflow-y-auto h-full p-4 lg:p-6 bg-transparent">
          {activeTab === 'todays-tasks' && (
            <TodaysTasksView
              tasks={activeFilterTag ? tasks.filter(t => t.tag.toLowerCase().includes(activeFilterTag.replace('#', '').toLowerCase())) : tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onOpenDiffReview={() => setIsDiffReviewOpen(true)}
              showToast={showToast}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'jira-stories' && (
            <JiraStoriesView
              story={activeStory}
              stories={stories}
              onSelectStory={setActiveStoryKey}
              onUpdateStoryStatus={handleUpdateStoryStatus}
              onToggleAC={handleToggleAC}
              onAddComment={handleAddComment}
              onOpenLogTime={() => setIsLogWorkTimeOpen(true)}
              onOpenDiffReview={() => setIsDiffReviewOpen(true)}
              showToast={showToast}
            />
          )}

          {activeTab === 'github-activity' && (
            <GitHubActivityView
              events={gitEvents}
              onConvertToTask={handleConvertGitToTask}
              onManualSync={handleManualSync}
              isSyncing={isSyncing}
              showToast={showToast}
            />
          )}

          {activeTab === 'schedule-deadlines' && (
            <ScheduleDeadlinesView 
              showToast={showToast} 
              onOpenDryMigration={() => setIsDryMigrationOpen(true)}
            />
          )}

          {activeTab === 'history-search' && (
            <HistorySearchView showToast={showToast} />
          )}

          {activeTab === 'system-docs' && (
            <SystemDocsView showToast={showToast} />
          )}

          {activeTab === 'settings-api-keys' && (
            <SettingsApiKeysView showToast={showToast} />
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <DiffReviewModal
        isOpen={isDiffReviewOpen}
        onClose={() => setIsDiffReviewOpen(false)}
        onApprove={() => {
          setIsDiffReviewOpen(false);
          pushGitSyncEvent('review(approve): PR #88 signed off by Alex Rivera', 'feat/sqlite-wal', 'pr');
          showToast('Signed off & approved PR #88 — Core Memory Sandbox Pipeline!');
        }}
        onSnooze={() => {
          setIsDiffReviewOpen(false);
          showToast('PR #88 review reminder snoozed for 15 minutes.');
        }}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onSave={() => {
          setIsPreferencesOpen(false);
          showToast('DevPulse preferences saved & applied to local daemon.');
        }}
      />

      <LogWorkTimeModal
        isOpen={isLogWorkTimeOpen}
        onClose={() => setIsLogWorkTimeOpen(false)}
        onLogTime={handleLogWorkTime}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        showToast={showToast}
      />

      <WindowsBuildModal
        isOpen={isWindowsBuildOpen}
        onClose={() => setIsWindowsBuildOpen(false)}
        osMode={osMode}
        onToggleOsMode={setOsMode}
        showToast={showToast}
      />

      <DryMigrationModal
        isOpen={isDryMigrationOpen}
        onClose={() => setIsDryMigrationOpen(false)}
        showToast={showToast}
      />
    </div>
  );
}
