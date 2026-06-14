---
name: "environment-setup-android"
description: "Use this skill to prepare Android SDK, Java, adb, emulator, environment variables, and device readiness for Appium Android drivers on supported desktop hosts."
---
# environment-setup-android

## Goal
Validate Android base tooling for UiAutomator2 or Espresso and install only missing required pieces.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Do Not Use For
- Do not use for iOS, tvOS, Chromium, Node-only, or FFmpeg-only setup.
- Do not use for reconfiguring Java or Android SDK when checks already pass.

## Preflight
Identify OS, shell, Java/Javac status, `ANDROID_HOME`, adb availability, emulator inventory, connected devices, and permission limits.

## Instructions
1. Prefer existing Android Studio or command-line tools paths before installing anything.
2. Install missing SDK packages with sdkmanager only after confirming required gaps.
3. Ask for explicit approval before privileged OS package installation.

## Verification
Confirm Java/Javac, adb, Android SDK paths, required packages, and either a connected device or prepared emulator.

## Examples
- UiAutomator2 setup reports adb missing; validate `ANDROID_HOME`, install platform-tools, then rerun the driver doctor.
