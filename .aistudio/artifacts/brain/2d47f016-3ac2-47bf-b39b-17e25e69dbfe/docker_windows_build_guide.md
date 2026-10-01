# DevPulse — Docker & CI/CD Windows 11 Build Manual

This guide covers building the **DevPulse Windows 11 native desktop `.exe`** using Docker container cross-compilation or GitHub Actions.

---

## Method 1: Building `.exe` with Docker

### 1. Build and Export Binaries Directly
Using Docker's BuildKit export feature, you can build the Windows `.exe` without needing Rust or Windows installed locally:

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Compile and export the Windows .exe to ./dist-windows
docker build -f Dockerfile.windows --target tauri-builder -t devpulse-win-builder .
```

### 2. Extract `.exe` using Docker Compose
```bash
docker compose up build-windows-exe
```
The compiled Windows binary will be placed inside `./dist-windows/devpulse.exe`.

---

## Method 2: Automated GitHub Actions CI/CD (`.github/workflows/build-windows.yml`)

DevPulse includes an automated GitHub Actions workflow configured for `windows-latest`.

Whenever you push to GitHub:
1. GitHub spins up a native Windows 11 VM with MSVC & Rust.
2. Runs `npm run build` and `tauri build`.
3. Packages `DevPulse.exe`, `DevPulse_Setup_1.4.2_x64.exe` (NSIS), and `DevPulse.msi`.
4. Publishes downloadable releases to the **Actions / Releases** tab of your repository.

---

## Method 3: Local Windows 11 Native Build

If you are on a Windows machine:
```powershell
# Using PowerShell:
.\build-tauri-windows.ps1

# Or with Tauri CLI:
npm run build
npx @tauri-apps/cli build
```
Output files will be located at:
- `src-tauri/target/release/devpulse.exe`
- `src-tauri/target/release/bundle/nsis/DevPulse_1.4.2_x64-setup.exe`
