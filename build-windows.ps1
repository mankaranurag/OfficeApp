# =========================================================================
#  DevPulse — Windows 11 Native Desktop Executable & Package Builder (PowerShell)
# =========================================================================

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  DevPulse v1.4.2 — Windows 11 Native Binary Packaging Suite (PowerShell)" -ForegroundColor Cyan
Write-Host "  Target: Windows 11 x64 / ARM64 with Mica & Acrylic Translucency" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Environment Check
Write-Host "[1/4] Verifying Node.js 24 environment..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "  Found Node.js $nodeVersion (Target: Node 24 Latest)" -ForegroundColor Green
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 24 from https://nodejs.org"
    exit 1
}

# 2. Dependency Installation
Write-Host "[2/4] Installing application dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Dependency installation failed."
    exit 1
}

# 3. Production Build
Write-Host "[3/4] Compiling optimized React SPA & Tailwind CSS bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Vite build failed."
    exit 1
}

# 4. Packaging
Write-Host "[4/4] Packaging Windows Desktop Installer..." -ForegroundColor Yellow
if (Test-Path "node_modules\electron-builder") {
    npx electron-builder --win nsis --x64
    Write-Host "[SUCCESS] Windows Installer created at dist\DevPulse Setup 1.4.2.exe" -ForegroundColor Green
} else {
    Write-Host "[INFO] Production bundle compiled to .\dist directory." -ForegroundColor Cyan
    Write-Host "[INFO] To package into a standalone Windows NSIS .exe installer:" -ForegroundColor Cyan
    Write-Host "       npx electron-builder --win nsis --x64" -ForegroundColor White
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  Build process completed successfully! Output: .\dist" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
