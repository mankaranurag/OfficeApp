# DevPulse — Complete System Architecture & Engineering Manual

## 1. System Overview

**DevPulse** is a cross-platform developer cockpit, task engine, and Git/Jira intelligence companion built for ultra-low memory footprints (<20MB resident RAM target). It unifies daily priority management, real-time git telemetry, sprint milestone tracking, and bidirectional Jira Cloud syncing.

---

## 2. Core Architectural Pillars

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DevPulse Unified Shell                          │
│     (macOS Sonoma Fluid Glass & Windows 11 Fluent Mica Engine)        │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌─────────────────────────────────────┐   ┌──────────────────────────────┐
│       Local Persistence Layer       │   │    Zero-Trace Security Vault │
│  - Embedded SQLite 3 (WAL Mode)     │   │  - OS Hardware Keyring / TPM │
│  - Sub-millisecond Memory Cache     │   │  - AES-256-GCM Encryption    │
│  - Asynchronous Checkpoint Daemon   │   │  - Plaintext RAM Sanitizer   │
│  - FTS5 Full-Text Search Engine     │   │  - Clipboard Auto-Redactor   │
└──────────────────┬──────────────────┘   └──────────────┬───────────────┘
                   │                                     │
                   ▼                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Sync & Integration Engine                         │
│  - GitHub REST & GraphQL API Client (with Rate-Limit Guard)            │
│  - Local Git Hook WebSocket Dispatcher (Port 49152)                    │
│  - Atlassian Jira Cloud REST API v3 Bidirectional Connector            │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 SQLite Write-Ahead Logging (WAL) Engine
- **Journal Mode**: `PRAGMA journal_mode=WAL;`
- **Synchronous Flag**: `PRAGMA synchronous=NORMAL;`
- **Auto-Checkpointing**: Daemon checkpoints every 1,000 pages or 60 seconds asynchronously in a background worker thread, ensuring the UI frame rate never drops below 60 FPS.
- **Query Latency**: <0.8ms for indexed primary queries.

### 2.2 Zero-Trace Security & Keyring Protocol
- **Storage**: OS Hardware Keyring (Apple Secure Enclave on macOS, Windows Data Protection API / TPM on Windows).
- **Encryption**: Secrets (GitHub PAT, Jira API tokens) are encrypted with AES-256-GCM.
- **RAM Sanitizer**: Decrypted plaintext token buffers in memory are automatically overwritten with cryptographic salt upon window minimize or system sleep.
- **Clipboard Redactor Daemon**: Automatically masks pattern-detected tokens (`ghp_*`, `ATATT*`) from copy buffers and command logs.

---

## 3. Workspaces & Functional Workflows

1. **Today's Tasks & Execution Velocity (`⌘N` / `Ctrl+N`)**:
   - Reversible task execution state machine (check/uncheck restoration).
   - Urgent PR review gatekeeper countdown ticker with Diff Viewer.
   - Fast task intake with automatic tag/expiry assignment.
   - Live velocity sparkline ($24\text{m}/\text{task}$) and Sprint 42 burn-down radial ring.
2. **Jira Stories (`CORE-1042`)**:
   - Multi-story navigator and live status transition workflow (`Backlog` $\rightarrow$ `In Progress` $\rightarrow$ `Code Review` $\rightarrow$ `Done`).
   - Interactive Acceptance Criteria checklist with dynamic verified progress counter.
   - Chronological collaborative comments stream with markdown tools and mention pills (`@Sarah Chen`, `#PR-88`).
   - Time tracking progress bar with interactive `Log Work Time` modal.
   - GitHub branch binding with live PR check stats and commit diff summaries.
3. **GitHub Activity & Telemetry**:
   - Repository switcher with real-time branch status (`main • Clean Tree`).
   - 7-day push frequency and LOC net gain visualizer.
   - Live Git event stream with filter tabs (`All`, `Commits`, `PRs`, `Branches`) and one-click `Convert to Task`.
   - PR review queue and local SQLite cache gauge.
4. **Schedule & Deadlines**:
   - 10-day interactive calendar strip with semantic milestone markers.
   - Hard cutoff window enforcer with dry migration simulator and deployment authorizer.
   - SOC2 compliance milestone tracker (78% complete, 14/18 patches).
   - Future task scheduler drawer with strict cutoff enforcer.
5. **History & Search (`⌘K` / `Ctrl+K`)**:
   - Omnisearch indexing with instant query filtering.
   - Detailed task inspector with linked commit diffs, benchmark logs, and audit trails.
   - CSV export and task reopening/duplication.
6. **Secrets & Keyring (Settings)**:
   - GitHub PAT & Jira API vault with visibility masks and clipboard copy.
   - Zero-Trace hardware security toggles and live integration health telemetry.
