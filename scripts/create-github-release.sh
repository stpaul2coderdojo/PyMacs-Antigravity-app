#!/usr/bin/env bash
# ==============================================================================
# PyMacs GitHub Release Automation Script
# Usage: ./scripts/create-github-release.sh [version_tag]
# ==============================================================================

set -e

VERSION="${1:-v4.2.0}"
echo "=================================================================="
echo " Packaging and Publishing PyMacs ${VERSION} on GitHub"
echo "=================================================================="

# 1. Ensure packages are built
python3 scripts/build_packages.py --all

# 2. Check if git tag exists
if git rev-parse "${VERSION}" >/dev/null 2>&1; then
    echo "[INFO] Tag ${VERSION} already exists locally."
else
    echo "[+] Creating git tag ${VERSION}..."
    git tag -a "${VERSION}" -m "PyMacs ${VERSION} release"
fi

# 3. Create Release on GitHub using GitHub CLI (gh) if available
if command -v gh >/dev/null 2>&1; then
    echo "[+] Creating GitHub Release via 'gh' CLI..."
    gh release create "${VERSION}" \
        public/downloads/pymacs-v4.2.0-win8-win10-win11-setup.exe \
        public/downloads/pymacs-v4.2.0-win8-win10-win11-portable.zip \
        public/downloads/pymacs-v4.2.0-android.apk \
        public/downloads/Dockerfile \
        public/downloads/docker-compose.yml \
        public/downloads/pymacs_paper.tex \
        public/downloads/references.bib \
        public/downloads/SHA256SUMS.txt \
        --title "PyMacs ${VERSION} (Docker, Android, Windows 8/10/11)" \
        --notes-file RELEASE_NOTES_v4.2.0.md
    echo "[OK] GitHub Release published successfully!"
else
    echo "[!] GitHub CLI ('gh') is not installed or not authenticated."
    echo "[*] To publish via GitHub Web UI or push tag:"
    echo "      git push origin main --tags"
    echo "    GitHub Actions (.github/workflows/release.yml) will automatically build and publish the release."
fi
