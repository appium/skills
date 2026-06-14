---
name: "setup"
description: "Use this skill to prepare Appium environment setup across Node.js, Android SDK, UiAutomator2, Espresso, XCUITest, Chromium, FFmpeg, and bundletool paths with doctor checks and smoke-test verification."
---

# setup

## Goal
Prepare the requested Appium setup path, installing only missing required pieces and verifying doctor checks.

## When To Use
Use this skill for Appium environment setup: Node/npm, Android, UiAutomator2, Espresso, XCUITest simulator, Chromium, FFmpeg, or bundletool.

## Reference Routing
Context selection uses `references/`. Load `references/node.md` before driver setup when Node/npm/Appium status is unknown. Load `references/android.md` before Android drivers. Load `references/uiautomator2.md`, `references/espresso.md`, `references/xcuitest.md`, or `references/chromium.md` for the requested driver. Load `references/ffmpeg.md` or `references/bundletool.md` only when explicitly requested or required by requested capabilities.

## Do Not Use For
- Do not use for diagnosing an existing Appium failure with a stack trace or server log; use `appium-troubleshooting`.
- Do not use for physical iOS/tvOS signing, provisioning, or WebDriverAgent deployment after XCUITest simulator setup; use `xcuitest-real-device-config`.

## Preflight
Identify OS, shell, permission limits, requested driver path, Node/npm/Appium versions, installed drivers, and platform tooling before changing anything.

## Instructions
1. Run `node.md` checks first when Node/npm/Appium status is unknown.
2. For Android drivers, run `android.md` before `uiautomator2.md` or `espresso.md`.
3. Ask before privileged OS package installation or optional dependency installation.
4. Re-run the smallest relevant doctor or smoke check after each fix.

## Verification
Verify required Appium doctor checks report `0 required fixes needed`. For driver setup, smoke-test the Appium server, confirm the requested driver, then stop the test server.

## Examples
- Android + UiAutomator2: load `node.md`, `android.md`, `uiautomator2.md`; verify `appium driver doctor uiautomator2`.
- XCUITest simulator: load `node.md`, `xcuitest.md`; verify `appium driver doctor xcuitest`.
