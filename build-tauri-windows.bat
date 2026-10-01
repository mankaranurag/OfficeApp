@echo off
REM =========================================================================
REM  DevPulse — Windows 11 Native Tauri & Rust Builder (Batch / CMD)
REM =========================================================================
echo.
echo ====================================================================
echo   DevPulse v1.4.2 — Windows 11 Tauri Native Executable Builder
echo   Architecture: x64 Windows 11 Fluent Acrylic / Mica Translucency
echo ====================================================================
echo.

echo [1/3] Building frontend distribution...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed.
    pause
    exit /b 1
)

echo [2/3] Compiling Tauri Rust Native Executable...
call npx @tauri-apps/cli build
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] To compile the final .exe installer, ensure Rust is installed from https://rustup.rs
) else (
    echo [SUCCESS] Windows 11 Executable compiled: src-tauri\target\release\devpulse.exe
)

echo.
echo [3/3] Done!
pause
