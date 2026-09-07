@echo off
rem ==============================================================================
rem PyMacs Browser Operating System - Universal Windows Launcher
rem Compatible with Windows 8, Windows 8.1, Windows 10, and Windows 11 (64-bit / 32-bit)
rem Author: Dr. Bheemaiah Anil K <bheemaiah@alumni.iitm.ac.in>
rem Website: https://pymacs.wordpress.com
rem ==============================================================================

setlocal enabledelayedexpansion
title PyMacs Operating System v4.2.0 (Windows 8, 10, 11)

echo.
echo ==============================================================================
echo   PyMacs Browser Operating System - Desktop Edition
echo   Compatible with Windows 8, 8.1, 10, and 11 (x64 / x86)
echo   Antigravity DOM Engine • Thread VFS • Python Microkernel
echo ==============================================================================
echo.

rem Detect Windows Version via registry query
for /f "tokens=4-5 delims=. " %%i in ('ver') do set WIN_VER=%%i.%%j
echo [INFO] Detected Windows NT Kernel Version: !WIN_VER!

rem Check compatibility:
rem 6.2 = Windows 8
rem 6.3 = Windows 8.1
rem 10.0 = Windows 10 or Windows 11 (Build 22000+ is Win 11)

if "!WIN_VER!"=="6.2" (
    echo [INFO] Environment: Windows 8 Detected
    set COMPAT_FLAGS=--disable-gpu-sandbox --enable-software-rasterizer
) else if "!WIN_VER!"=="6.3" (
    echo [INFO] Environment: Windows 8.1 Detected
    set COMPAT_FLAGS=--disable-gpu-sandbox --enable-software-rasterizer
) else if "!WIN_VER!"=="10.0" (
    echo [INFO] Environment: Windows 10 or Windows 11 Detected
    set COMPAT_FLAGS=--enable-features=UseOzonePlatform --enable-gpu-rasterization --high-dpi-support=1
) else (
    echo [INFO] Environment: Compatible Windows Subsystem (!WIN_VER!)
    set COMPAT_FLAGS=
)

rem Set application directory
set PYMACS_DIR=%~dp0
cd /d "%PYMACS_DIR%"

rem Check if embedded Python or Node is present, or launch in default browser / WebView
set PORT=3000
set HOST=127.0.0.1
set URL=http://%HOST%:%PORT%

echo [INFO] Starting PyMacs Local Engine on port %PORT%...

rem Try launching modern WebView2 / Edge or Chrome with app mode
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    echo [LAUNCH] Starting PyMacs via Microsoft Edge App Mode...
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="https://ais-dev-r7rjmudhxbvbosukqzdflc-219346993343.asia-southeast1.run.app" --window-size=1280,820 %COMPAT_FLAGS%
    goto END
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    echo [LAUNCH] Starting PyMacs via Microsoft Edge App Mode...
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="https://ais-dev-r7rjmudhxbvbosukqzdflc-219346993343.asia-southeast1.run.app" --window-size=1280,820 %COMPAT_FLAGS%
    goto END
)

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    echo [LAUNCH] Starting PyMacs via Google Chrome App Mode...
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="https://ais-dev-r7rjmudhxbvbosukqzdflc-219346993343.asia-southeast1.run.app" --window-size=1280,820 %COMPAT_FLAGS%
    goto END
)

rem Fallback for Windows 8 / 8.1 default browser
echo [LAUNCH] Launching default web browser...
start "" "https://ais-dev-r7rjmudhxbvbosukqzdflc-219346993343.asia-southeast1.run.app"

:END
echo.
echo [STATUS] PyMacs is running. Press any key to close this terminal.
pause >nul
