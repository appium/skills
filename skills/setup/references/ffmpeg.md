# FFmpeg Setup

## Goal
Make `ffmpeg` available in PATH and prove it reports a version for Appium media-related features.

## Do Not Use For
Do not use for Node, Android SDK, Xcode, browser, or Appium driver setup. Do not install FFmpeg unless explicitly requested or required by requested media capabilities.

## Preflight
Check `command -v ffmpeg`, `ffmpeg -version`, OS package manager availability, and whether the requested driver capability actually needs FFmpeg.

## Instructions
1. Prefer an existing FFmpeg binary when present.
2. Prefer user-approved native package managers for missing FFmpeg.
3. Ask before privileged package installation.

## Verification
Run `ffmpeg -version` and report the first version line and resolved path.
