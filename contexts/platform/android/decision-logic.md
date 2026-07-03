---
owner: appium
id: setup-references-android-android-decision-logic
status: stable
source: contexts/platform/android/decision-logic.md

---

# android-decision-logic

## Decision Logic

- If the host OS is not macOS, Linux, or Windows: stop and ask the user to switch to a supported host.
- If `java -version` and `javac -version` already succeed: keep the existing Java setup and do not reconfigure `JAVA_HOME`.
- On macOS, prefer Android Studio's bundled JBR from `/Applications/Android Studio.app` or `$HOME/Applications/Android Studio.app`, then package-manager OpenJDK only if needed.
- On Linux, prefer an existing Android Studio JBR when present, then distro OpenJDK only if needed.
- On Windows, prefer Android Studio's bundled JBR, then Microsoft OpenJDK only if needed.
- If `ANDROID_HOME` is unset or points to a missing directory: configure the platform default SDK path.
- If `adb` is missing: install Android `platform-tools` with `sdkmanager`.
- If the emulator binary is missing under `ANDROID_HOME/emulator`: install the Android emulator package.
- If no physical device is connected and no emulator instance exists: prepare one emulator using the latest stable `google_apis` system image reported by `sdkmanager --list`.
- Use the host-optimized emulator architecture first, then fallback architecture.
- If required SDK packages are missing: install them and re-run validation.

## Safety Notes

- Do not reconfigure Java when `java` and `javac` already work.
- Do not install optional FFmpeg or bundletool dependencies from this reference.
- Require explicit human approval before using privileged system package managers.
- Prefer user-space installs and platform default SDK paths.
- Re-run validation commands after each environment change.
- Do not claim success if `adb`, emulator binary, Java, or required SDK package checks fail.
- Use shell-appropriate commands: bash for macOS/Linux and PowerShell for Windows.
