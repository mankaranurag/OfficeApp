# DevPulse — Complete User Manual & Keyboard Shortcuts Guide

## 1. Global Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| `⌘K` / `Ctrl+K` | **Omnisearch & History** | Focuses the global search bar across all archived tasks, git commits, and Jira keys. |
| `⌘N` / `Ctrl+N` | **Fast Task Intake** | Focuses the task creation bar on Today's Tasks with default EOD expiry. |
| `⌘G` / `Ctrl+G` | **Quick Git Convert** | Spawns a tracked task from the clipboard commit SHA or active branch. |
| `⌘S` / `Ctrl+S` | **Manual Sync** | Triggers an immediate poll of GitHub and Jira APIs, flushing the local SQLite WAL cache. |
| `Esc` | **Close Overlays** | Closes any open modal dialog (Diff Viewer, Preferences, Work Log, Documentation). |

---

## 2. Workspace Navigation

### 2.1 Today's Tasks
- **Task Intake**: Type any task title in the command bar, pick an expiry time, select a tag (`#core-engine`, `#infra`, `#security`), and hit `Enter`.
- **Reversible Execution State**: Check off tasks as you finish them. If checked by accident, simply click the undo icon in the *Completed Today* list to restore the task to the active sprint queue.
- **Urgent Review Banner**: Review incoming PRs that have impending branch freeze cutoffs. Click **Review Diff** to inspect changes line-by-line before signing off.

### 2.2 Jira Stories
- **Status Transitions**: Switch between `Backlog`, `In Progress`, `Code Review`, and `Done` using the top status capsule.
- **Acceptance Criteria**: Click each checklist item to mark verification. The verified counter automatically updates.
- **Comments**: Write replies using the markdown formatting toolbar or mention teammates via `@Sarah Chen` and ticket keys `#PR-88`.
- **Work Logging**: Click `+ Log Work Time` to record hours spent, updating the visual burn-down progress bar.

### 2.3 GitHub Activity
- **Push Telemetry**: Inspect daily commit volume across the 7-day bar chart.
- **Convert to Task**: Click `Convert to Task` on any live commit or PR event to immediately spawn an actionable item in Today's tasks.

### 2.4 Schedule & Deadlines
- **Timeline Strip**: Click any date in the 10-day strip to view scheduled work and cutoff deadlines for that day.
- **Dry Migration & Deploy**: Run test migration scripts or authorize rolling deployments directly from the active window card.

### 2.5 History & Task Inspector
- **Search & Filter**: Search by title, commit SHA, or author with instant result filtering.
- **Inspector Drawer**: Click any task row to view associated diff statistics (`+148 -22`), benchmark notes, lifecycle timestamps, and notification audit trails.
- **Export**: Click `Export CSV` to download your complete history log.
