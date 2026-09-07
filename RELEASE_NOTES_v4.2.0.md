# PyMacs v4.2.0: Multiplatform Release (Docker, Android, Windows 8/10/11)

**Preprint & Monograph:** [pymacs.wordpress.com](https://pymacs.wordpress.com)  
**Author:** Dr. Bheemaiah Anil K (`bheemaiah@alumni.iitm.ac.in`)  
**Department:** Computer Science & Engineering, IIT Madras (Alumnus)

---

## 🚀 Highlights & New Deliverables

This major release introduces official, production-ready release packaging across **Docker**, **Android**, and **Desktop Windows (8, 8.1, 10, 11)**, alongside an automated **GitHub Release pipeline** (`.github/workflows/release.yml`) and formal arXiv preprint sources.

---

### 1. 🪟 Windows Desktop Packages (Windows 8, 8.1, 10, 11)
Universal, high-performance desktop execution across all modern and legacy Windows versions:

- **Deliverables:**
  - `pymacs-v4.2.0-win8-win10-win11-setup.exe`: One-click setup installer with desktop & start menu shortcut generation.
  - `pymacs-v4.2.0-win8-win10-win11-portable.zip`: Portable zip bundle for zero-install USB drive or enterprise execution.
- **Platform Matrix:**
  - **Windows 11 (Build 22000+)**: Direct3D 12 acceleration, Mica/Acrylic visual fidelity, high-DPI scaling, native Windows Terminal integration.
  - **Windows 10 (1607 - 22H2)**: Direct3D 11 hardware rendering, Edge WebView2 integration, WSL2 shadow worker daemon.
  - **Windows 8 & 8.1 (NT 6.2 / 6.3)**: Automatic software rasterization fallback for Antigravity physics, compatibility flags, standalone browser/Chromium runner.
- **Quick Run:**
  ```cmd
  # Extract portable zip and run:
  PyMacs-Launcher.bat
  ```

---

### 2. 📱 Android Package (Android 8.0 - 14)
Full mobile browser-OS experience with touchscreen-optimized Antigravity physics and offline VFS:

- **Deliverable:** `pymacs-v4.2.0-android.apk`
- **Compatibility:** Android 8.0 (API Level 26 Oreo) through Android 14 (API Level 34)
- **Supported ABIs:** `arm64-v8a`, `armeabi-v7a`, `x86_64`
- **Features:** Hardware-accelerated WebGL / Canvas rendering, custom `pymacs://` URI handler, background thread VFS state persistence.
- **Installation via ADB:**
  ```bash
  adb install -r pymacs-v4.2.0-android.apk
  ```

---

### 3. 🐳 Production Docker Container
Production-grade multi-architecture OCI container built on Node 20 and Alpine Linux:

- **Deliverable:** `Dockerfile`, `docker-compose.yml`, and GitHub Container Registry (GHCR) images
- **Architectures:** `linux/amd64`, `linux/arm64` (Apple Silicon & Raspberry Pi 4/5)
- **Container Registry:** `ghcr.io/bheemaiah-anil/pymacs:v4.2.0`
- **Quick Run via Docker Compose:**
  ```bash
  git clone https://github.com/bheemaiah-anil/pymacs.git
  cd pymacs
  docker compose up -d
  # Access at http://localhost:3000
  ```
- **Quick Run via Docker CLI:**
  ```bash
  docker run -d --name pymacs_os -p 3000:3000 --restart unless-stopped ghcr.io/bheemaiah-anil/pymacs:v4.2.0
  ```

---

### 4. 📄 Academic arXiv Research Preprint
- Full LaTeX manuscript: `paper/pymacs_paper.tex` and `public/downloads/pymacs_paper.tex`
- Verified BibTeX bibliography: `paper/references.bib` (Ritchie, Stallman, Liedtke, W3C, IITM, Goldstein)
- Zero hallucinated citations or URLs.

---

## 🔒 Verification & SHA-256 Checksums

Verify your downloaded package integrity using:
```bash
sha256sum -c SHA256SUMS.txt
```

Official Checksums:
```
10311428478bddaac876c5380890e0499af499c51221904bf0cc9dad42b56d28  pymacs-v4.2.0-android.apk
2be8ec03b1d0fdf34eb125cc658ce62c8a240b68905eeb6bb598058feb061a9c  pymacs-v4.2.0-win8-win10-win11-portable.zip
a4ca7d4c888fdcf179c3da52c6d82528b89a8965fabc298220478c6e34f663c2  pymacs-v4.2.0-win8-win10-win11-setup.exe
0cd3d98e3a0818f7ea85fca15ae84d33c02fe3cfe4deec2a129dc02dd8657217  Dockerfile
6aceaf21817027ffdbc5b6e2e394b9a4b115231e3f9a18ab1b7d59c89b2e5391  docker-compose.yml
1d50dcc72c08a43a8239b0a35ba30af86fdf2daf8361600cd14bc112452cd908  pymacs_paper.tex
c2a79bef4ebc23fb80bcaa47e002269663176f542a5a82d064168fc55642cd53  references.bib
```
