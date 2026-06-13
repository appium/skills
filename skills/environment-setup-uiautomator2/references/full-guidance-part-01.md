# Full Guidance Part 1

---
name: "environment-setup-uiautomator2"
description: "Use this skill to prepare and validate Appium UiAutomator2 automation on Android after Node/Appium and Android base tooling are checked or required by a failing workflow."
---
# environment-setup-uiautomator2

## Goal
Install or validate UiAutomator2 and confirm Android device readiness for sessions.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Do Not Use For
- Do not use for Espresso, XCUITest, Chromium, Node-only, FFmpeg-only, or bundletool-only setup.

## Preflight
Run Node and Android base setup checks first, then capture device inventory and current UiAutomator2 driver status.

## Instructions
1. Install or update the UiAutomator2 driver only when absent or incompatible.
2. Run UiAutomator2 doctor and fix required issues one at a time.
3. Use optional FFmpeg or bundletool setup only when requested capabilities need them.

## Verification
Require doctor output indicating zero required fixes, plus a server smoke check showing UiAutomator2 available.

## Examples
- UiAutomator2 doctor reports missing platform tools; run Android setup, rerun doctor, then smoke-test the driver.
