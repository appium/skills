# Full Guidance

This file preserves the detailed guidance that was moved out of SKILL.md to keep the skill entrypoint compact.

---
name: "environment-setup-ffmpeg"
description: "Install and validate FFmpeg on macOS, Linux, or Windows for optional Appium media capabilities"
metadata:
  last_modified: "Mon, 09 Mar 2026 13:10:00 GMT"

---
# environment-setup-ffmpeg

## Goal
Installs and validates FFmpeg in a cross-platform way so Appium environments can use optional media-related capabilities when explicitly requested.

## Do Not Use For
- Do not use this skill unless the user explicitly requested FFmpeg or an Appium media capability needs it.
- Do not use this skill for Node, Android SDK, Xcode, browser, or Appium driver setup.


## Decision Logic
- If host OS is unsupported: stop and ask the user to run on macOS, Linux, or Windows.
- If `ffmpeg` is already available in `PATH`: do not reinstall; only validate version output.
- If user has not explicitly requested FFmpeg-related capability: skip this skill.
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
   ```bash
   brew install ffmpeg
   ```
   Linux:
- After explicit user approval for privileged package installation, install the `ffmpeg` package with the approved distro package-manager command.
- Debian/Ubuntu, RHEL/CentOS/Fedora, and Arch package name: `ffmpeg`.

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

## Examples
- User asks to enable Appium media recording: install or validate FFmpeg, then report `ffmpeg -version`.
- User only asks for a basic Appium driver setup without media capabilities: skip this skill and say FFmpeg was not required.

## Verification
- Confirm `command -v ffmpeg` or `Get-Command ffmpeg.exe` succeeds.
- Confirm `ffmpeg -version` exits successfully and report the first version line.

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

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints

- This optional skill requires explicit user request before installing FFmpeg.
- This is an optional skill; run only when the user explicitly requests FFmpeg-related setup.
- Ask before installing optional dependencies.
- If privileged commands are required, pause and provide exact commands for user execution.
- Do not modify unrelated Appium, Java, Android SDK, or Xcode configuration in this skill.
