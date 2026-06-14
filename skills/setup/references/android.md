# Android Setup

## Goal
Validate Android base tooling for UiAutomator2 or Espresso and install only missing required pieces.

## Do Not Use For
Do not use for iOS, tvOS, Chromium, Node-only, FFmpeg-only, or bundletool-only setup. Do not reconfigure Java or Android SDK when checks already pass.

## Preflight
Identify OS, shell, Java/Javac status, `ANDROID_HOME`, `ANDROID_SDK_ROOT`, adb availability, emulator availability, SDK command-line tools, connected devices, emulator inventory, and permission limits.

## Instructions
1. Prefer existing Android Studio or command-line tools paths before installing anything.
2. Install missing SDK packages with `sdkmanager` only after confirming required gaps.
3. Ask for explicit approval before privileged OS package installation.

## Verification
Verify Java/Javac, adb, emulator, Android SDK paths, required packages, and either a connected device or prepared emulator; then run the relevant Appium Android driver doctor check and confirm `0 required fixes needed`.
