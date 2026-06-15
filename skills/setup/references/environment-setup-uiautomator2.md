---
name: "environment-setup-uiautomator2"
description: "Prepare and validate Appium UiAutomator2 Driver on Android"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-uiautomator2

## Goal
Validate Node/Appium, Android prerequisites, UiAutomator2 driver install, doctor output, and Appium `/status` smoke readiness.

## Procedure
1. Confirm host OS is macOS, Linux, or Windows.
2. Complete `environment-setup-node` and `environment-setup-android`.
3. Use global Appium by default:
   - `appium -v`
   - `appium driver list --installed --json`
4. If `uiautomator2` is missing, run `appium driver install uiautomator2`. Ignore "already installed" as success.
5. Capture device and emulator inventory:
   - `adb devices -l`
   - `emulator -version`
   - `emulator -list-avds`
6. Run doctor:
   - `appium driver doctor uiautomator2 --json`
   - fall back to `appium driver doctor uiautomator2`
   Pass only with `0 required fixes needed`; optional warnings are non-blocking.
7. If doctor wording changes, accept a pass only when JSON or summary clearly indicates zero required issues. Otherwise mark `needs-manual-review`.
8. Start Appium, check `/status`, confirm `Available drivers:` includes `uiautomator2`, then stop the server.

## Completion Criteria
- Installed driver list includes `uiautomator2`.
- Android setup completion criteria are satisfied.
- Doctor reports zero required fixes.
- `/status` smoke check succeeds.
- Appium server process is cleaned up.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.
