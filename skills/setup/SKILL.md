---
name: "setup"
description: "Route Appium environment setup work to the correct preserved reference procedure for Node.js, Android, UiAutomator2, Espresso, Chromium, XCUITest, FFmpeg, or bundletool while keeping optional installs gated by explicit user request."
---

# setup

## Use When

Use this skill when preparing or validating an Appium automation environment. Start here for Android, iOS/macOS, Chromium desktop browser automation, and shared setup prerequisites.

## Do Not Use For

Do not use this skill for diagnosing an already-failing Appium session; use `skills/appium-troubleshooting/SKILL.md`. Do not use optional setup references for FFmpeg or bundletool unless the user explicitly requests those capabilities.

## Preflight

Before changing the environment, identify the target platform and driver, confirm whether the user wants global Appium mode (`appium`) or local mode (`npx appium`), and record the active OS, shell, Node.js, npm, Appium, Java, Android SDK, Xcode, browser, and device/simulator state that applies to the request.

## Reference Map

Load only the references required for the requested path:

- Node.js prerequisite: `references/environment-setup-node.md`
- Android SDK and Java: `references/environment-setup-android.md`
- Android UiAutomator2 driver: `references/environment-setup-uiautomator2.md`
- Android Espresso driver: `references/environment-setup-espresso.md`
- Desktop Chromium driver: `references/environment-setup-chromium.md`
- macOS XCUITest driver: `references/environment-setup-xcuitest.md`
- Optional FFmpeg capability: `references/environment-setup-ffmpeg.md`
- Optional bundletool capability: `references/environment-setup-bundletool.md`

Execute references one at a time in dependency order. Re-run the smallest relevant check after each fix.

## Examples

- "Prepare Android + UiAutomator2" -> load Node.js, Android, and UiAutomator2 references.
- "Prepare desktop Chrome automation" -> load Node.js and Chromium references.
- "Install FFmpeg for Appium screen recording" -> load the optional FFmpeg reference after explicit user request.

## Verification

Completion requires the matching reference criteria to pass. For Appium drivers, the blocking gate is the relevant doctor or smoke check with `0 required fixes needed` when doctor is available; optional warnings are non-blocking.

After completing setup, apply the loaded reference's `Self-Improvement Prompt` section and report any missing, ambiguous, outdated, or retry-causing instruction with proposed wording.
