---
name: "environment-setup-android"
description: "Route Android SDK, Java, ADB, package, and emulator setup references for Appium Android drivers"
last_modified: "Mon, 27 Apr 2026 GMT"
---

# environment-setup-android

## Goal

Prepare Android automation by validating Java, Android SDK command-line tools, SDK packages, environment variables, ADB, device visibility, and emulator readiness.

## Routing

Load these references in order:

1. `contexts/tools/appium/setup/android-decision-logic.md` for supported hosts, preservation rules, optional dependency boundaries, and install triggers.
2. `android/android-detect-base-tooling.md` for OS, Java, Android SDK, ADB, and emulator binary detection.
3. `android/android-sdk-commandline-tools.md` for platform default SDK paths and command-line tools bootstrap.
4. `android/android-java-configuration.md` for Java setup only when `java` or `javac` is missing.
5. `android/android-sdk-packages-and-path.md` for `ANDROID_HOME`, `PATH`, licenses, and required SDK packages.
6. `android/android-device-emulator-validation.md` for device inventory, emulator creation, final validation, and evidence.

For deterministic read-only validation, run:

```bash
node skills/setup/scripts/check-android-env.mjs
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
