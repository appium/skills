---
security_profile: appium-local-workflows
owner: appium
id: appium-troubleshooting-references-troubleshooting-procedure-part1
status: stable
source: contexts/tools/appium/troubleshooting/procedure-part1.md

---

# appium-troubleshooting

## Goal
Triage one Appium driver failure, apply the smallest plausible fix, and re-check until confirmed or handed back.

## Decision Logic
- Identify the active automation driver first (`uiautomator2` or `xcuitest`). If unknown, stop and ask for the failing session capabilities/log line that names the driver.
- If the failure is an environment or driver-install problem (`node`, `npm`, `appium`, Java, Android SDK, `Xcode`, doctor failures): run the matching setup skill for the selected driver first.
- UiAutomator2 path only:
  - session startup, wrong activity, early drop, or `socket hang up`: read `contexts/tools/appium/troubleshooting/references/uiautomator2-session-startup.md`.
  - locator issues: read `contexts/tools/appium/troubleshooting/references/uiautomator2-locators.md`.
- XCUITest path only:
  - WebDriverAgent startup/install/reachability, app install/launch, device/simulator state: read `contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md`.
  - element lookup or locator issues: read `contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md` and `contexts/tools/appium/troubleshooting/references/xcuitest-locators.md`.
- If the official docs do not explain the exact stack trace or symptom, use `contexts/tools/appium/troubleshooting/references/community-search.md` as a fallback workflow.

## Instructions
1. **Capture the failing command and lock the driver scope**
   Record the exact error text, platform, automation driver, and relevant capabilities before changing anything. If the driver is still unclear, ask for one of these before continuing:
   - the desired capabilities block containing `platformName` and `appium:automationName`
   - the Appium server log lines from `POST /session` through the first real error after `createSession`
   If the client hides capabilities, rerun one failing session with Appium server logs enabled and capture that window before troubleshooting further.

2. **Run baseline checks only when the error message alone is not enough**
   If the error text already points to a known issue, open the matching driver-specific official reference first and confirm the closest symptom before changing anything. Then collect what is needed:
   - `appium -v` and `appium driver list --installed --json` (fallback to `appium driver list --installed` if `--json` is unsupported) — to confirm driver presence and version.
   - UiAutomator2: `adb devices -l` and `appium driver doctor uiautomator2 --json || appium driver doctor uiautomator2` — only if the error suggests a device connectivity or prerequisite problem.
   - Espresso: `adb devices -l`, emulator/device inventory, and `appium driver doctor espresso --json || appium driver doctor espresso` — only if the error suggests a device, instrumentation, Android build, or prerequisite problem.
   - XCUITest: `xcodebuild -version` and `appium driver doctor xcuitest --json || appium driver doctor xcuitest` — only if the error suggests a build, signing, WDA, or toolchain problem.
   - Chromium: browser version, selected browser executable, chromedriver/msedgedriver version, and `appium driver doctor chromium --json || appium driver doctor chromium` when supported — only if the error suggests browser startup, driver matching, or prerequisite problems.
   If any doctor or prerequisite check fails, switch to the matching setup skill before deeper troubleshooting. Use `contexts/tools/appium/troubleshooting/references/community-search.md` only after the relevant official reference does not explain the exact stack trace or symptom.
