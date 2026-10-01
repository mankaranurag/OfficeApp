# DevPulse — System Specification & Implementation Roadmap

## 1. Executive Summary

DevPulse is an ultra-lightweight, cross-platform developer task tracker, Git & Jira intelligence companion engineered for zero-latency developer productivity. It combines offline-first embedded SQLite storage with seamless cloud integrations and native desktop shells for macOS Sonoma and Windows 11 Fluent UI.

---

## 2. Core Pillars & Architecture

### 2.1 Performance & Memory Footprint
- **Target Resident RAM**: `<20 MB` on macOS / `<15 MB` on Windows 11 (Tauri).
- **Target Idle CPU**: `<0.4%`.
- **Query Latency**: `<0.8ms` for local SQLite operations.
- **Framerate Target**: Steady 60 FPS liquid glassmorphism animations.

### 2.2 Security & Zero-Trace Protocol
- **OS Hardware Keyring**: Apple Secure Enclave & Windows Data Protection API (DPAPI).
- **Encryption**: AES-256-GCM authenticated encryption for all external API secrets.
- **Auto-Sanitization**: Plaintext RAM tokens wiped on system minimize/sleep.
- **Clipboard Masking**: Automated redactor daemon intercepts terminal tokens (`ghp_*`, `ATATT*`).

---

## 3. Workspaces & Feature Modules

1. **Today's Tasks (`⌘N`)**:
   - Reversible task execution state machine.
   - Urgent PR review gatekeeper countdown ticker with Diff Viewer.
   - Fast task intake with tag classification (`#core-engine`, `#infra`, `#security`).
   - Velocity telemetry ($24\text{m}/\text{task}$) & Sprint 42 burn-down radial ring.

2. **Jira Stories Workspace**:
   - Multi-story lifecycle switcher (`CORE-1042`, `CORE-1043`, `CORE-1044`).
   - Bidirectional status transitions (`Backlog` $\rightarrow$ `In Progress` $\rightarrow$ `Code Review` $\rightarrow$ `Done`).
   - Interactive Acceptance Criteria checklist with verified counter.
   - Rich markdown comment thread with user and ticket mentions.
   - Work time logger modal.

3. **GitHub Activity & Pulse**:
   - Repository switcher and branch monitor.
   - Interactive 7-day commit frequency bar chart.
   - Live polling & local WebSocket hook dispatcher (Port `49152`).
   - Direct convert-to-task pipeline for all incoming commits and PRs.

4. **Schedule & Deadlines**:
   - 10-day interactive calendar strip with hard cutoff indicators.
   - Active Window card for `Deploy v1.0` with Dry-Run Migration tester.
   - Scheduled alert notifications.

5. **History & Omnisearch (`⌘K`)**:
   - Global instant search across archived tasks, commit SHAs, and Jira keys.
   - Master-detail inspector drawer with diff stats (`+148 -22`) and benchmark notes.
   - CSV export generator.

6. **Settings & Vault Security**:
   - AES-256 local keychain vault manager.
   - Live GitHub API rate-limit meter ($4,820 / 5,000$) & Jira REST latency monitor ($82\text{ms}$).

7. **Documentation & Manual (`Docs`)**:
   - In-app interactive offline reader and exportable markdown documentation.
