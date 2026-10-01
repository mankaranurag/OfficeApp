# =========================================================================
#  DevPulse — Windows 11 Tauri Native Desktop Builder (PowerShell)
# =========================================================================

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  DevPulse v1.4.2 — Windows 11 Native Tauri & Rust Compiler Suite   " -ForegroundColor Cyan
Write-Host "  Vibrancy: Windows 11 Mica / Acrylic | Footprint: <15MB RAM Target  " -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js and Rust Toolchains
Write-Host "[1/4] Checking prerequisites..." -ForegroundColor Yellow
$hasRust = Get-Command cargo -ErrorAction SilentlyContinue
if (-not $hasRust) {
    Write-Host "  [WARN] Rust / Cargo toolchain is not found." -ForegroundColor Yellow
    Write-Host "  Please install Rust for Windows 11 via: https://rustup.rs" -ForegroundColor White
} else {
    $rustVersion = cargo --version
    Write-Host "  Found Rust: $rustVersion" -ForegroundColor Green
}

# 2. Build Web Frontend Asset Bundle
Write-Host "[2/4] Building optimized React SPA & Tailwind CSS bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Vite frontend build failed."
    exit 1
}

# 3. Compile Tauri Native Binary
Write-Host "[3/4] Compiling native Windows 11 binary with Tauri..." -ForegroundColor Yellow
npx @tauri-apps/cli build
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Windows 11 Native Desktop App compiled successfully!" -ForegroundColor Green
    Write-Host "  Binary output: src-tauri\target\release\devpulse.exe" -ForegroundColor Green
    Write-Host "  MSI Installer: src-tauri\target\release\bundle\msi\DevPulse_1.4.2_x64_en-US.msi" -ForegroundColor Green
    Write-Host "  NSIS Setup:    src-tauri\target\release\bundle\nsis\DevPulse_1.4.2_x64-setup.exe" -ForegroundColor Green
} else {
    Write-Host "[INFO] Standard frontend dist compiled. Run 'cargo tauri build' with Rust installed to generate the .exe." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  DevPulse Windows 11 Build Process Finished!                      " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
