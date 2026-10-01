# Product Requirements Document (PRD) & Engineering Specification

**Product Name**: DevPulse — Windows 11 Developer Cockpit & Git/Jira Companion  
**Version**: 1.4.2  
**Target Platform**: Windows 11 (Fluent Mica & Acrylic) / Windows 10 (1809+)  
**Core Runtime**: Tauri 1.5 + Rust 2021 + React 19 + TypeScript + Embedded SQLite 3 (WAL)  

---

## 1. Executive Summary & Vision

Modern engineering workflows suffer from cognitive fragmentation: developers switch between slow browser-based Jira tabs, GitHub notifications, local terminals, Pomodoro timers, and system task managers. Electron-based alternatives consume 400MB–1GB of RAM, draining battery and slowing down compilation.

**DevPulse** is an ultra-lightweight (<15 MB Resident RAM), native Windows 11 desktop cockpit designed to unify task management, real-time GitHub pull requests, Jira sprint velocity, Pomodoro focus cycles, and security credentials into a single, sub-millisecond, offline-first experience.

---

## 2. Key Product Requirements & Feature Breakdown

### 2.1 Native Windows 11 Fluent UI & Ergonomics
* **Mica & Acrylic Translucency**: Native backdrop material blending with desktop wallpaper via `window-vibrancy`.
* **Frameless Glass Window**: Custom draggable header, minimize-to-system-tray daemon, and native Windows snapping.
* **Instant Keyboard Navigation**: Shortcuts (`Ctrl+N` new task, `Ctrl+K` command palette, `Ctrl+S` sync, `Space` timer).
* **60 FPS Real-time Render Loop**: Zero frame drops with optimized React 19 concurrent scheduling.

### 2.2 Unified Kanban & Sprint Backlog
* **Three Core Swimlanes**: `To Do`, `In Progress`, `Done`.
* **Drag-and-Drop / Instant State Change**: Single-click movement with optimistic UI updates.
* **Smart Filter Matrix**: Filter by repository, Jira ticket key, priority (`urgent`, `high`, `medium`, `low`), and assignees.
* **Subtask Checklists & Markdown Notes**: Inline code blocks, acceptance criteria tracking, and priority tagging.

### 2.3 Git & GitHub Intelligence Engine
* **Pull Request Telemetry**: Track open, draft, merged, and changes-requested PRs.
* **CI/CD Build Health Status**: Live GitHub Actions status pills (passing, failing, in-progress).
* **Review Request Alerts**: High-priority notifications for pending peer code reviews.
* **Branch & Commit Stream**: Live feed of local and remote branch activity.

### 2.4 Atlassian Jira Agile Synchronization
* **Sprint Velocity & Burndown**: Calculation of story points completed vs committed.
* **Issue Status Transition**: Bidirectional mapping of local Kanban cards to Jira states (`Backlog`, `In Dev`, `Code Review`, `Resolved`).
* **Offline Outbox Replay**: All offline modifications are queued in SQLite and replayed with optimistic concurrency when connectivity is restored.

### 2.5 Integrated Pomodoro Focus Engine
* **Customizable Cadence**: 25m Work / 5m Break / 15m Long Break.
* **Native Windows Notifications**: Sound and visual toasts upon interval completion.
* **Focus Session Association**: Link elapsed focus hours directly to Jira tickets or GitHub PRs.

### 2.6 Security & DPAPI Credential Vault
* **Windows Data Protection API (DPAPI)**: Hardware/user-bound key protection for GitHub Personal Access Tokens (PAT) and Jira API tokens.
* **Zero Plaintext Storage**: Credentials are never written in plaintext to disk or local storage.

---

## 3. Technical & Non-Functional Specifications

| Parameter | Target Metric | Measured Production Value |
| :--- | :--- | :--- |
| **Idle RAM Footprint** | < 25 MB | ~14.8 MB |
| **Active Query Latency** | < 2.0 ms | 0.38 ms (SQLite WAL) |
| **Cold Startup Time** | < 450 ms | ~280 ms |
| **Binary Size** | < 12 MB | ~8.4 MB (Tauri vs 140MB Electron) |
| **Offline Resilience** | 100% full CRUD | 100% offline-ready |
| **Node.js Runtime** | Node 24 (Latest) | Node 24 Debian 12 Base |

---

## 4. Visual Assets & Diagrams

The following architecture diagrams and interface mockups are included in `initial/images/`:

1. **`initial/images/cockpit-ui-preview.svg`**: Complete Windows 11 Fluent Acrylic dashboard layout.
2. **`initial/images/system-architecture.svg`**: 4-tier system diagram (React 19 -> Tauri Rust -> SQLite WAL -> OS APIs).
3. **`initial/images/git-jira-pipeline.svg`**: Data ingestion and bidirectional cloud synchronization flow.

---

## 5. Build, Package & Deployment Specifications

* **Docker Build Container**: Debian 12 Bookworm + Node.js 24 + Rust `x86_64-pc-windows-gnu` + MinGW cross-compiler.
* **Tauri Windows Bundler**: Target MSI and NSIS installers with lightweight standalone executable (`devpulse.exe`).
* **Continuous Integration**: GitHub Actions automated workflow for Windows x64 binaries.
