---
security_profile: appium-local-workflows
owner: appium
id: platform.android.emulator-setup
name: "android-emulator-setup"
description: "Route Android SDK, Java, ADB, package, device, and emulator setup references for Android automation"
last_modified: "Mon, 27 Apr 2026 GMT"
optional_context:
  - contexts/platform/android/decision-logic.md
  - contexts/platform/android/references/detect-base-tooling.md
  - contexts/platform/android/references/sdk-commandline-tools.md
  - contexts/platform/android/references/java-configuration.md
  - contexts/platform/android/references/sdk-packages-and-path.md
  - contexts/platform/android/references/device-emulator-validation.md

---

# Android Emulator Setup

## Goal

Prepare Android automation by validating Java, Android SDK command-line tools, SDK packages, environment variables, ADB, device visibility, and emulator readiness.

## Routing

Start with read-only validation, or reuse equivalent current-run evidence from
the calling driver helper:

```bash
node tools/appium/setup/scripts/check-android-env.mjs
```

Load `contexts/platform/android/decision-logic.md` before any environment change.
Then load only references needed for failed or unresolved checks, applying fixes
in technical dependency order:

- `contexts/platform/android/references/detect-base-tooling.md` when host, Java,
  SDK, ADB, or emulator detection needs interpretation.
- `contexts/platform/android/references/sdk-commandline-tools.md` when the SDK
  path or command-line tools are missing.
- `contexts/platform/android/references/java-configuration.md` only when `java`
  or `javac` is missing.
- `contexts/platform/android/references/sdk-packages-and-path.md` when SDK
  variables, PATH entries, licenses, or required packages need changes.
- `contexts/platform/android/references/device-emulator-validation.md` when
  device visibility is unresolved, no device or AVD exists, or inventory fails
  under a managed sandbox. Read it before creating an emulator.

Preserve working installations. SDK license changes and emulator creation retain
the calling Skill's approval gates. Optional FFmpeg and bundletool remain outside
this workflow unless explicitly requested.

## Completion Criteria

- `java -version` and `javac -version` both succeed.
- Existing Java setup is preserved when Java already works.
- Android Studio bundled JBR is used as `JAVA_HOME` when Android Studio is present and Java setup is needed.
- `ANDROID_HOME` points to the platform default SDK path unless the user has an existing valid SDK path.
- `adb` is executable from `PATH`.
- Emulator binary exists under `ANDROID_HOME/emulator`.
- Required SDK packages are installed: `platform-tools`, one Android platform, and one build-tools version.
- Device inventory is reported with `adb devices -l`.
- Emulator inventory is reported with `emulator -version` and `emulator -list-avds`.
- If no device or emulator existed initially, one emulator AVD is created using the latest stable host-appropriate system image.

## Evidence To Report

Report host OS and architecture, `java -version`, `javac -version`, `JAVA_HOME`, `ANDROID_HOME`, `adb version`, `adb devices -l`, `emulator -version`, `emulator -list-avds`, installed SDK package evidence from `sdkmanager --list_installed`, and any Android Studio or OpenJDK path chosen.
