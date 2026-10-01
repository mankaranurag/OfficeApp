# DevPulse — API & Keyring Integration Specification

## 1. GitHub Integration

### 1.1 Personal Access Token (PAT) Setup
DevPulse uses fine-grained or classic GitHub Personal Access Tokens (PATs) with the following minimum required scopes:
- `repo` (Full repository control: Read/Write commits, issues, PRs)
- `workflow` (Read GitHub Actions CI/CD status)
- `read:user` & `read:org` (Profile authentication and organization repository mapping)

### 1.2 Rate Limiting & Polling Optimization
- **Standard Quota**: 5,000 requests/hour per authenticated PAT.
- **Smart Throttling**: The background polling interval dynamically scales between 30s and 10m based on user activity.
- **Local WebSocket Dispatcher**: A local IPC WebSocket listener on `localhost:49152` listens for local Git CLI hook executions (e.g. `post-commit`, `post-checkout`), eliminating the need for excessive remote API polling.

---

## 2. Atlassian Jira Cloud Integration

### 2.1 REST API v3 Connection
- **Host**: `https://<your-domain>.atlassian.net`
- **Authentication**: Basic Authentication with Jira account email and API token (`ATATT...`).
- **OAuth 2.0 (3LO)**: Supported scopes: `read:jira-work`, `write:jira-work`, `manage:jira-project`.

### 2.2 Bidirectional Synchronization
- Transitioning story status in DevPulse immediately commits to the local SQLite WAL journal, then asynchronously syncs to Jira Cloud via `POST /rest/api/3/issue/{issueIdOrKey}/transitions`.
- Logging work time calls `POST /rest/api/3/issue/{issueIdOrKey}/worklog`.
- Adding comments calls `POST /rest/api/3/issue/{issueIdOrKey}/comment`.

---

## 3. Local Hardware Keychain & Zero-Trace Protocol

### 3.1 Encryption Flow
1. API tokens are encrypted with AES-256-GCM using an encryption key generated and stored inside the OS Hardware Keychain (Apple Secure Enclave on macOS / TPM on Windows).
2. Plaintext tokens exist in memory strictly during active network requests.
3. Upon window minimize, screen lock, or system sleep, the memory pages holding decrypted tokens are immediately overwritten with cryptographically pseudo-random salt.
4. The background clipboard daemon intercepts terminal history and copy buffers, masking tokens matching `ghp_[A-Za-z0-9]{36}` or `ATATT[A-Za-z0-9_-]{64}`.
