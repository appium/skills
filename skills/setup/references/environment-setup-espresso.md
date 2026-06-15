---
name: "environment-setup-espresso"
description: "Prepare and validate Appium Espresso Driver on Android"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-espresso

## Goal
Validate Node/Appium, Android prerequisites, Espresso driver install, doctor output, and Appium `/status` smoke readiness.

## Procedure
1. Confirm host OS is macOS, Linux, or Windows.
2. Complete `environment-setup-node` and `environment-setup-android`.
3. Use global Appium by default:
   - `appium -v`
   - `appium driver list --installed --json`
4. If `espresso` is missing, run `appium driver install espresso`. Ignore "already installed" as success.
5. Capture device and emulator inventory:
   - `adb devices -l`
   - `emulator -version`
   - `emulator -list-avds`
6. Run doctor:
   - `appium driver doctor espresso --json`
   - fall back to `appium driver doctor espresso`
   Pass only with `0 required fixes needed`; optional warnings are non-blocking.
7. If doctor wording changes, accept a pass only when JSON or summary clearly indicates zero required issues. Otherwise mark `needs-manual-review`.
8. Start Appium, check `/status`, confirm `Available drivers:` includes `espresso`, then stop the server.

## Completion Criteria
- Installed driver list includes `espresso`.
- Android setup completion criteria are satisfied.
- Doctor reports zero required fixes.
- `/status` smoke check succeeds.
- Appium server process is cleaned up.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.
