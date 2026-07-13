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

Load these references in order:

1. `contexts/platform/android/decision-logic.md` for supported hosts, preservation rules, optional dependency boundaries, and install triggers.
2. `contexts/platform/android/references/detect-base-tooling.md` for OS, Java, Android SDK, ADB, and emulator binary detection.
3. `contexts/platform/android/references/sdk-commandline-tools.md` for platform default SDK paths and command-line tools bootstrap.
4. `contexts/platform/android/references/java-configuration.md` for Java setup only when `java` or `javac` is missing.
5. `contexts/platform/android/references/sdk-packages-and-path.md` for `ANDROID_HOME`, `PATH`, licenses, and required SDK packages.
6. `contexts/platform/android/references/device-emulator-validation.md` for device inventory, emulator creation, final validation, and evidence.

For deterministic read-only validation, run:

```bash
node tools/appium/setup/scripts/check-android-env.mjs
```

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
