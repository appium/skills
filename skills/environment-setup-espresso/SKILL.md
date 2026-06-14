---
name: "environment-setup-espresso"
description: "Use this skill to prepare and validate Appium Espresso automation on Android after Node/Appium and Android base tooling are checked or required by a failing Espresso workflow."
---
# environment-setup-espresso

## Goal
Install or validate the Espresso driver and confirm Android device readiness for Espresso sessions.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Do Not Use For
- Do not use for UiAutomator2, XCUITest, Chromium, Node-only, FFmpeg-only, or bundletool-only setup.

## Preflight
Run the Node and Android base setup checks first, then capture device inventory and current Espresso driver status.

## Instructions
1. Install or update the Espresso driver only when absent or incompatible.
2. Run Espresso doctor and fix required issues one at a time.
3. Use optional FFmpeg or bundletool setup only when the requested capability needs it.

## Verification
Require doctor output indicating zero required fixes, plus a server smoke check showing Espresso available.

## Examples
- Espresso doctor reports missing Android packages; run Android setup, rerun doctor, then smoke-test the driver.
