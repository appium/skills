# FFmpeg Setup

## Goal
Install and validate FFmpeg for optional Appium media-related capabilities when explicitly requested.

## Decision Logic
- If host OS is not macOS, Linux, or Windows, stop and ask for a supported host.
- If `ffmpeg` is already available in `PATH`, do not reinstall; only validate version.
- On macOS, prefer Homebrew.
- On Linux, use the distro package manager.
- On Windows, prefer `winget`; fallback to Chocolatey if `winget` is unavailable.
- Ask before privileged package installation.

## Preflight Commands
macOS/Linux:

```bash
uname -s
command -v ffmpeg || echo "ffmpeg not found"
ffmpeg -version || true
```

Windows PowerShell:

```powershell
[System.Environment]::OSVersion.VersionString
Get-Command ffmpeg.exe -ErrorAction SilentlyContinue
ffmpeg -version
```

## Install When Missing
macOS:

```bash
brew install ffmpeg
```

Debian/Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y ffmpeg
```

Fedora/RHEL:

```bash
sudo dnf install -y ffmpeg
```

Arch:

```bash
sudo pacman -S --noconfirm ffmpeg
```

Windows:

```powershell
winget install --id Gyan.FFmpeg
```

## Verification
Run:

```bash
command -v ffmpeg
ffmpeg -version
```

Report the resolved path and first version line. If install was skipped because FFmpeg already existed, say so.
