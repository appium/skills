---
name: "environment-setup-ffmpeg"
description: "Use this skill only when FFmpeg is explicitly requested or an Appium media capability needs it, then install or validate FFmpeg on macOS, Linux, or Windows."
---
# environment-setup-ffmpeg

## Goal
Make `ffmpeg` available in PATH and prove it reports a version.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Reference Routing
Load `full-guidance-part-01.md` when detailed FFmpeg install, PATH validation, or Appium media feature checks are needed.

## Do Not Use For
- Do not use for Node, Android SDK, Xcode, browser, or Appium driver setup.

## Preflight
Confirm the user requested FFmpeg or a media feature requires it, then check host OS and existing `ffmpeg` availability.

## Instructions
1. If FFmpeg already exists, validate version output and skip installation.
2. Prefer user-approved native package managers for missing FFmpeg.
3. Ask before privileged package installation.

## Verification
Run `ffmpeg -version` and report the first version line.

## Examples
- A user enables video recording; install or validate FFmpeg, then report the version evidence.
