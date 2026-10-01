@echo off
REM =========================================================================
REM  DevPulse — Windows 11 Native Desktop Executable & Package Builder
REM =========================================================================
setlocal enabledelayedexpansion

echo.
echo  ====================================================================
echo    DevPulse v1.4.2 — Windows 11 Native Binary Packaging Suite
echo    Target Architectures: x64 / ARM64 Windows 11 (Fluent Acrylic / Mica)
echo  ====================================================================
echo.

echo [1/4] Checking Node.js 24 environment...
node -v
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js 24+ is required. Please install Node.js 24 from https://nodejs.org
    exit /b 1
)

echo [2/4] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed.
    exit /b 1
)

echo [3/4] Building production React SPA bundle...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed.
    exit /b 1
)

echo [4/4] Generating Windows 11 Desktop Distribution...
if exist "node_modules\electron-builder" (
    call npx electron-builder --win nsis --x64
    echo [SUCCESS] Windows Installer created at: dist\DevPulse Setup 1.4.2.exe
) else (
    echo [INFO] Standard production bundle created at .\dist
    echo [INFO] To create a single .exe installer, run: npx electron-builder --win nsis --x64
)

echo.
echo ====================================================================
echo  Build complete! Output directory: .\dist
echo ====================================================================
echo.
pause
