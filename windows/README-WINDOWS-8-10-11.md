# PyMacs Universal Desktop Package for Windows 8, 10, and 11

## Architecture & Compatibility Overview

PyMacs Desktop Edition is an autonomous browser operating system container running an embedded Python microkernel, thread-based virtual filesystem (`/sys`, `/dom`, `/dev`), and reactive Antigravity DOM viewport.

| OS Version | Compatibility Status | Graphics Engine | Runtime Requirement |
| :--- | :--- | :--- | :--- |
| **Windows 11** (Build 22000+) | Full Native (Tier-1) | Direct3D 12 / WebGPU | Edge WebView2 Evergreen |
| **Windows 10** (1607 - 22H2) | Full Native (Tier-1) | Direct3D 11 / WebGL 2.0 | Edge WebView2 or Chrome |
| **Windows 8.1** (NT 6.3) | Compatible (Tier-2) | Direct3D 11 with Software Rasterizer fallback | Google Chrome or Edge Standalone |
| **Windows 8** (NT 6.2) | Compatible (Tier-2) | Direct3D 11 with Software Rasterizer fallback | Google Chrome or Chromium runtime |

## Package Contents

1. `PyMacs-Launcher.bat`: Polyglot Windows batch launcher that auto-detects the Windows NT kernel version and applies appropriate sandbox and rasterizer flags.
2. `PyMacs-Setup-Win8-10-11.cmd`: One-click setup wizard that installs PyMacs to `%LOCALAPPDATA%\PyMacs` and generates Desktop and Start Menu shortcuts.
3. `pymacs-win.config.json`: Hardware profile and port binding configuration.

## Installation Instructions

### Method A: One-Click Automated Installer
1. Download `pymacs-v4.2.0-win8-win10-win11-setup.exe` (or extract `pymacs-v4.2.0-win8-win10-win11-portable.zip`).
2. Run `PyMacs-Setup-Win8-10-11.cmd` (or double click the setup executable).
3. PyMacs will create a desktop icon named **PyMacs OS** and launch automatically.

### Method B: Portable Zero-Install Execution
1. Extract `pymacs-v4.2.0-win8-win10-win11-portable.zip` into any folder (e.g. `C:\PyMacs` or a USB drive).
2. Double-click `PyMacs-Launcher.bat`.
3. The launcher will automatically select Microsoft Edge App Mode, Google Chrome, or default browser with optimized hardware flags.

### Method C: Silent Installation (SysAdmins / Enterprise)
```cmd
cmd.exe /c "PyMacs-Setup-Win8-10-11.cmd /quiet"
```
