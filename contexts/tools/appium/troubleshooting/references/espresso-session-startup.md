---
security_profile: appium-local-workflows
owner: appium
id: appium.troubleshooting.references.espresso-session-startup

---

# Espresso Session Startup

## Official References
- `https://appium.github.io/appium-espresso-driver/latest/troubleshooting/`
- `https://appium.github.io/appium-espresso-driver/latest/troubleshooting/startup/`
- `https://appium.github.io/appium-espresso-driver/latest/troubleshooting/compose/`
- `https://appium.github.io/appium-espresso-driver/latest/guides/activity-startup/`
- `https://appium.github.io/appium-espresso-driver/latest/reference/scripts/`

## When To Read This
- `Espresso server has failed to start` or instrumentation crashes during session creation
- `NoSuchMethodError`, `ClassNotFoundException`, or `Resources$NotFoundException` in `adb logcat`
- Jetpack Compose version or `compileSdk` mismatch between the Espresso server and the app under test (AUT)
- non-Compose app fails when the default Compose dependencies are bundled in the Espresso server
- missing `android.permission.INTERNET` in the AUT manifest or signature mismatch between the AUT and `io.appium.espressoserver.test`
- `SecurityException: Permission Denial` or `never started` on `appActivity` / `appWaitActivity`

This file is a shortcut into the official driver docs, not a replacement for them.

## Local Triage
1. Run the driver's static APK check (`appium driver run espresso diagnose-app --app <path-to-apk>`, or with `npx --no-install appium` in local mode) when an APK path is available to surface manifest permission, obfuscation, and AndroidX/Compose alignment issues before changing capabilities.
2. Separate instrumentation/build/classpath failures (`Espresso server has failed to start`, Gradle build failures, `NoSuchMethodError`, `Resources$NotFoundException`, missing `INTERNET` permission) from activity launch failures (`SecurityException: Permission Denial`, `never started`).
3. If the AUT does not use Jetpack Compose and startup fails on Compose classes, disable Compose support in `appium:espressoBuildConfig` (`{"composeSupport": false}`) and leave the `driver` setting at `espresso`.
4. If the AUT uses Jetpack Compose and `adb logcat` shows `NoSuchMethodError` or Compose runtime conflicts, align `toolsVersions.composeVersion` and `toolsVersions.compileSdk` inside `appium:espressoBuildConfig` with the AUT.
5. After any `appium:espressoBuildConfig` change or suspected stale server APK, set `appium:forceEspressoRebuild` to `true` for one verification run, then return it to `false` once startup succeeds.
6. Verify `appium:appPackage`, `appium:appActivity`, `appium:appWaitPackage`, and `appium:appWaitActivity` against the actual foreground activity from device state (`adb shell dumpsys window windows`), using wildcards in `appium:appWaitActivity` when startup transitions through dynamic or splash activities.

## Log Clues To Separate Common Causes
- Missing `INTERNET` permission in the AUT manifest is indicated when Appium or `adb logcat` reports `socket failed: EPERM` or explicitly requests `<uses-permission android:name="android.permission.INTERNET" />`.
- Dependency or ProGuard mismatch is more likely when `adb logcat -d` shows `NoSuchMethodError`, `ClassNotFoundException`, or `Resources$NotFoundException` under `AndroidRuntime` or `TestRunner` while starting `io.appium.espressoserver.test`.
- Activity launch mismatch is more likely when logs report `SecurityException: Permission Denial: starting Intent` (non-exported or non-launcher activity) or `<activity> never started`.

## Minimal Checks
```bash
adb shell dumpsys window windows
adb shell dumpsys activity activities
adb logcat -d | grep -E "TestRunner|AndroidRuntime|appium|espressoserver"
grep -i "espresso\|instrumentation\|never started\|Permission Denial\|INTERNET" <appium-server-log-file>
```

## First Pass Order
1. Capture the failing Appium server log lines and matching `adb logcat -d` lines around `TestRunner` and `AndroidRuntime`.
2. Decide whether the first failure signal is an AUT manifest/signing precondition, an `appium:espressoBuildConfig` (Compose/AndroidX/ProGuard) mismatch, a stale Espresso server build, or an activity startup mismatch.
3. Apply only the single targeted capability or build-config change for that first signal (including `appium:forceEspressoRebuild: true` when testing a server rebuild).
4. Re-run one fresh session start and inspect fresh logs before changing anything else.
