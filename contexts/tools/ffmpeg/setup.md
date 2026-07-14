---
security_profile: appium-local-workflows
owner: appium
id: tools.ffmpeg.setup
status: stable
source: contexts/tools/ffmpeg/setup.md

---

# FFmpeg Setup

## Goal
Install and validate FFmpeg in a cross-platform way so Appium and other workflows can use optional media-related capabilities when explicitly requested.

## Validation Command

```bash
node tools/appium/setup/scripts/check-ffmpeg-env.mjs
```

Use `summary.requiredOk: true` as the read-only setup gate after the user explicitly requests FFmpeg capability.

## Decision Logic
- If host OS is unsupported: stop and ask the user to run on macOS, Linux, or Windows.
- If `ffmpeg` is already available in `PATH`: do not reinstall; only validate version output.
- If user has not explicitly requested FFmpeg-related capability: skip this context.
- If host OS is macOS: prefer Homebrew install.
- If host OS is Linux: use distro package manager install.
- If host OS is Windows: prefer `winget`; fallback to Chocolatey if `winget` is unavailable.

## Instructions
1. **Detect OS and current FFmpeg availability**
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

2. **Install FFmpeg when missing**
   macOS (Homebrew):
   Set `FFMPEG_TAP` to the approved tap and `FFMPEG_FORMULA` to its exact versioned formula token. Do not substitute an unreviewed mutable formula name.
   ```bash
   : "${FFMPEG_TAP:?Set the approved Homebrew tap}"
: "${FFMPEG_FORMULA:?Set the approved exact versioned formula name}"
   brew install "$FFMPEG_TAP/$FFMPEG_FORMULA"
   ```
   Linux (Debian/Ubuntu): after explicit human approval for privileged package
   changes, install package `ffmpeg` with the system package manager.
   Linux (RHEL/CentOS/Fedora): after explicit human approval for privileged
   package changes, install package `ffmpeg` with the system package manager.
   Linux (Arch): after explicit human approval for privileged package changes,
   install package `ffmpeg` with the system package manager.
   Windows PowerShell (`winget` preferred):
   ```powershell
   winget install --id Gyan.FFmpeg --exact --accept-package-agreements --accept-source-agreements
   ```
   Windows PowerShell (Chocolatey fallback):
   ```powershell
   choco install ffmpeg -y
   ```

3. **Validate installation and PATH**
   macOS/Linux:
   ```bash
   command -v ffmpeg
   ffmpeg -version
   ```
   Windows PowerShell:
   ```powershell
   Get-Command ffmpeg.exe -ErrorAction SilentlyContinue
   ffmpeg -version
   ```

4. **Report capability in task result**
   Include:
   - resolved FFmpeg executable path
   - first line of `ffmpeg -version`
   - whether installation was skipped because FFmpeg was already present

## Completion criteria
Mark complete only when all are true:
- `ffmpeg` is resolvable from `PATH`
- `ffmpeg -version` succeeds
- result summary states whether install was performed or skipped

## Evidence To Report

- host OS
- whether FFmpeg was already present or installed
- package manager used, if installation was performed
- resolved `ffmpeg` path
- `ffmpeg -version` first line

## Self-Improvement Prompt

Before the final response, run the FFmpeg self-improvement check. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the context unless asked.

## Constraints

- This optional context requires explicit user request before installing FFmpeg.
- This is an optional context; run only when the user explicitly requests FFmpeg-related setup.
- Ask before installing optional dependencies.
- If privileged commands are required, pause and provide exact commands for user execution.
- Do not modify unrelated Appium, Java, Android SDK, or Xcode configuration in this context.
