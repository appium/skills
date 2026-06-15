---
name: "trouble-02"
description: "Preserved troubleshooting-procedure procedure part 02 of 05"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# troubleshooting-procedure Part 02

<!-- preserved-source: 64dcf79:skills/appium-troubleshooting/references/troubleshooting-procedure.md; strip this generated header when comparing -->

   - the desired capabilities block containing `platformName` and `appium:automationName`
   - the Appium server log lines from `POST /session` through the first real error after `createSession`
   If the client hides capabilities, rerun one failing session with Appium server logs enabled and capture that window before troubleshooting further.

2. **Run baseline checks only when the error message alone is not enough**
   If the error text already points to a known issue, open the matching driver-specific official reference first and confirm the closest symptom before changing anything. Then collect what is needed:
   - `appium -v` and `appium driver list --installed --json` (fallback to `appium driver list --installed` if `--json` is unsupported) — to confirm driver presence and version.
   - UiAutomator2: `adb devices -l` and `appium driver doctor uiautomator2 --json || appium driver doctor uiautomator2` — only if the error suggests a device connectivity or prerequisite problem.
   - Espresso: `adb devices -l`, emulator/device inventory, and `appium driver doctor espresso --json || appium driver doctor espresso` — only if the error suggests a device, instrumentation, Android build, or prerequisite problem.
   - XCUITest: `xcodebuild -version` and `appium driver doctor xcuitest --json || appium driver doctor xcuitest` — only if the error suggests a build, signing, WDA, or toolchain problem.
