# UiAutomator2 Setup

## Goal
Install or validate the Appium UiAutomator2 driver and confirm Android device readiness for sessions.

## Do Not Use For
Do not use for Espresso, XCUITest, Chromium, Node-only, FFmpeg-only, or bundletool-only setup.

## Preflight
Run Node and Android setup checks first. Capture installed Appium drivers, `appium driver doctor uiautomator2`, `adb devices -l`, and whether the user expects a real device or emulator.

## Instructions
1. Install or update the UiAutomator2 driver only when absent or incompatible.
2. Fix required doctor issues one at a time.
3. Use optional FFmpeg or bundletool setup only when requested capabilities need them.

## Verification
Require `appium driver doctor uiautomator2` to report `0 required fixes needed`. Start an Appium server, confirm `/status` is ready, confirm `uiautomator2` is installed or advertised, then stop the server.
