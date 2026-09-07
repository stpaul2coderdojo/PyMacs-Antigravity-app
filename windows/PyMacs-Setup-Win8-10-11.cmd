@echo off
rem ==============================================================================
rem PyMacs Desktop Installer & Shortcut Generator for Windows 8, 10, 11
rem ==============================================================================
setlocal enabledelayedexpansion
title PyMacs Desktop Installer (Win 8 / 10 / 11)

echo ====================================================================
echo   PyMacs Desktop Installation Wizard (Windows 8, 10, 11)
echo   Version 4.2.0 - Universal Desktop Package
echo ====================================================================
echo.

set INSTALL_DIR=%LOCALAPPDATA%\PyMacs
echo [*] Installing PyMacs to %INSTALL_DIR%...

if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [*] Copying application assets and scripts...
copy /Y "%~dp0PyMacs-Launcher.bat" "%INSTALL_DIR%\PyMacs-Launcher.bat" >nul
if exist "%~dp0pymacs-win.config.json" copy /Y "%~dp0pymacs-win.config.json" "%INSTALL_DIR%\pymacs-win.config.json" >nul

echo [*] Creating Desktop and Start Menu Shortcuts via PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'PyMacs OS.lnk')); $s.TargetPath = '%INSTALL_DIR%\PyMacs-Launcher.bat'; $s.IconLocation = '%SystemRoot%\System32\shell32.dll,14'; $s.Description = 'PyMacs Operating System in Python'; $s.Save()"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $startDir = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('StartMenu'), 'Programs', 'PyMacs'); if (-not (Test-Path $startDir)) { New-Item -ItemType Directory -Path $startDir | Out-Null }; $s = $ws.CreateShortcut([System.IO.Path]::Combine($startDir, 'PyMacs OS.lnk')); $s.TargetPath = '%INSTALL_DIR%\PyMacs-Launcher.bat'; $s.IconLocation = '%SystemRoot%\System32\shell32.dll,14'; $s.Description = 'PyMacs Operating System'; $s.Save()"

echo.
echo [OK] PyMacs v4.2.0 installed successfully on Windows!
echo [OK] Shortcuts created on Desktop and Start Menu.
echo.
echo Launching PyMacs now...
start "" "%INSTALL_DIR%\PyMacs-Launcher.bat"
timeout /t 3 >nul
