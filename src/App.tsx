import React, { useState, useEffect } from 'react';
import { WorkspaceTab, Task, JiraStory, GitEvent } from './types';
import { INITIAL_TASKS, MOCK_JIRA_STORY, MOCK_GIT_EVENTS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { DiffReviewModal } from './components/DiffReviewModal';
import { PreferencesModal } from './components/PreferencesModal';
import { LogWorkTimeModal } from './components/LogWorkTimeModal';

import { TodaysTasksView } from './views/TodaysTasksView';
import { JiraStoriesView } from './views/JiraStoriesView';
import { GitHubActivityView } from './views/GitHubActivityView';
import { ScheduleDeadlinesView } from './views/ScheduleDeadlinesView';
import { HistorySearchView } from './views/HistorySearchView';
import { SettingsApiKeysView } from './views/SettingsApiKeysView';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('todays-tasks');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ramUsage, setRamUsage] = useState('18.4 MB');
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);

  // Modals state
  const [isDiffReviewOpen, setIsDiffReviewOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isLogWorkTimeOpen, setIsLogWorkTimeOpen] = useState(false);

  // Data state
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [jiraStory, setJiraStory] = useState<JiraStory>(MOCK_JIRA_STORY);
  const [gitEvents] = useState<GitEvent[]>(MOCK_GIT_EVENTS);

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

  // Global Keyboard Shortcuts (⌘K, ⌘N, ⌘G)
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

  const handleManualSync = () => {
    setIsSyncing(true);
    showToast('Polling GitHub API & vacuuming local SQLite WAL cache...');

    setTimeout(() => {
      setIsSyncing(false);
      const newRam = (18.1 + Math.random() * 0.5).toFixed(1) + ' MB';
      setRamUsage(newRam);
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
      isUrgent: expiry.includes('6:00') || expiry.includes('3:00')
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleConvertGitToTask = (title: string, sha: string) => {
    handleAddTask(`Review & Verify: ${title}`, '#core-engine', 'Expires 6:00 PM');
    setActiveTab('todays-tasks');
  };

  // Jira Story Handlers
  const handleUpdateStoryStatus = (status: 'backlog' | 'in-progress' | 'code-review' | 'done') => {
    setJiraStory(prev => ({ ...prev, status }));
  };

  const handleToggleAC = (id: string) => {
    setJiraStory(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map(ac =>
        ac.id === id ? { ...ac, verified: !ac.verified } : ac
      )
    }));
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
    setJiraStory(prev => ({
      ...prev,
      comments: [...prev.comments, newComm]
    }));
  };

  const handleLogWorkTime = (hours: number, note: string) => {
    setJiraStory(prev => ({
      ...prev,
      timeTracking: {
        ...prev.timeTracking,
        logged: prev.timeTracking.logged + hours
      }
    }));
    showToast(`Logged ${hours}h on CORE-1042: "${note || 'Development update'}"`);
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
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#111317] text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Toast Notification */}
      <Toast message={toastMessage} />

      {/* Top macOS Navigation Header */}
      <Header
        theme={theme}
        onToggleTheme={setTheme}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        ramUsage={ramUsage}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        showToast={showToast}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex pt-14 h-screen overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
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
              story={jiraStory}
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
            <ScheduleDeadlinesView showToast={showToast} />
          )}

          {activeTab === 'history-search' && (
            <HistorySearchView showToast={showToast} />
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
    </div>
  );
}
