---
name: "environment-setup-android"
description: "Prepare Android SDK, Java, adb, and emulator tooling for Appium Android drivers"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-android

## Goal
Validate Android SDK, Java, platform-tools, emulator tooling, licenses, and device inventory before UiAutomator2 or Espresso setup.

## Procedure
1. Confirm host OS is macOS, Linux, or Windows. Stop on unsupported OS.
2. Check Java and Android paths:
   - `java -version`
   - `javac -version`
   - `echo "$JAVA_HOME"` or `$env:JAVA_HOME`
   - `echo "$ANDROID_HOME"` or `$env:ANDROID_HOME`
   - `adb version`
   - `sdkmanager --version`
3. If Android Studio is installed, prefer its bundled JBR for `JAVA_HOME`. On macOS check both `/Applications/Android Studio.app` and `$HOME/Applications/Android Studio.app`.
4. If SDK tooling is missing, install Android Studio or official command-line tools into the user profile. Avoid `sudo` unless explicitly approved.
5. Configure PATH for the current shell and persistent user profile:
   - `platform-tools`
   - `cmdline-tools/latest/bin`
   - `emulator`
6. Accept SDK licenses and install required packages:
   - `platform-tools`
   - `cmdline-tools;latest`
   - `emulator`
   - at least one current stable `platforms;android-*`
   - matching `build-tools`
7. Device readiness:
   - `adb devices -l`
   - `emulator -version`
   - `emulator -list-avds`
   - Skip AVD creation when a usable device is connected or an AVD already exists.
8. If an emulator is needed, create one using the latest stable system image reported by `sdkmanager --list`, preferring the host-native architecture.
9. Re-run all failed checks after each fix.

## Completion Criteria
- Java, `adb`, `sdkmanager`, and `emulator` commands succeed.
- `ANDROID_HOME` points to an existing SDK.
- SDK licenses are accepted.
- Required SDK packages are installed.
- `adb devices -l` and emulator inventory are reported.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.
