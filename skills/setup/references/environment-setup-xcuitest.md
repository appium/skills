---
name: "environment-setup-xcuitest"
description: "Prepare and validate Appium XCUITest Driver on macOS"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-xcuitest

## Goal
Validate macOS, Node/Appium, Xcode, XCUITest driver install, doctor output, and Appium `/status` smoke readiness.

## Procedure
1. Confirm host OS is macOS. Stop on Linux or Windows.
2. Complete `environment-setup-node`; use global Appium unless the user requested `npx appium`.
3. Validate Xcode:
   - `xcodebuild -version`
   - `xcode-select -p`
   - `xcrun simctl list devices`
4. If Xcode license or first launch is incomplete, stop and provide the exact privileged or GUI command for user approval.
5. Validate Appium and driver list:
   - `appium -v`
   - `appium driver list --installed --json`
6. If `xcuitest` is missing, run `appium driver install xcuitest`. Ignore "already installed" as success.
7. Run doctor:
   - `appium driver doctor xcuitest --json`
   - fall back to `appium driver doctor xcuitest`
   Pass only with `0 required fixes needed`; optional warnings are non-blocking.
8. If requested, run `environment-setup-ffmpeg` before final validation.
9. Start Appium, check `/status`, confirm `Available drivers:` includes `xcuitest`, then stop the server.

## Completion Criteria
- macOS host and Xcode command line tools are ready.
- Installed driver list includes `xcuitest`.
- Doctor reports zero required fixes.
- Simulator inventory is reported when simulator validation is in scope.
- `/status` smoke check succeeds and Appium server is cleaned up.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.
