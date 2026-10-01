# DevPulse — Windows 11 Native Desktop Build Guide

This guide details how to build and distribute DevPulse as a native Windows 11 desktop application (`.exe`, `.msix`, and portable standalone package) with full Windows 11 Mica/Acrylic backdrop styling and Windows titlebar integration.

---

## 1. Prerequisites for Windows Build

- **Node.js**: `v20+` or `v24.14.1+`
- **Package Manager**: `npm`
- **Windows Build Tools** (for native SQLite C-bindings and Windows Credential Manager):
  ```powershell
  # Run in elevated PowerShell on Windows:
  npm install --global --production windows-build-tools
  ```

---

## 2. Option A: Electron Desktop Build (Recommended)

### 2.1 Electron Main Process (`electron/main.cjs`)
DevPulse includes an Electron entry point configured with Windows 11 Mica vibrancy:

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false, // Custom Windows 11 Fluent titlebar
    titleBarStyle: 'hidden',
    backgroundMaterial: 'mica', // Windows 11 Mica material
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);
```

### 2.2 Building the Windows Executable (`.exe` / `.msix`)
```bash
# 1. Build Vite frontend bundle
npm run build

# 2. Package for Windows 64-bit
npx electron-builder --win nsis --x64
```

The output installer is created at `dist/DevPulse Setup 1.4.2.exe`.

---

## 3. Option B: Tauri Native Build (Ultra-Low Memory <15MB RAM)

For zero-overhead performance, DevPulse can also be compiled with Tauri / Rust:

```bash
# Install Tauri CLI
npm install -D @tauri-apps/cli

# Build native Windows binary
npx tauri build
```

The compiled binary will be placed at `src-tauri/target/release/devpulse.exe`.

---

## 4. Windows 11 Specific Features in DevPulse
- **Window Controls**: Dedicated Windows 11 style minimize, maximize, and close controls positioned in the top-right corner when Windows mode is active.
- **Windows Credential Manager / TPM Integration**: Uses DPAPI (Data Protection API) for hardware-backed token security.
- **Windows Taskbar Tray Minimization**: DevPulse docks into the system tray on minimize, keeping the background Git hook listener alive at <0.4% CPU.
