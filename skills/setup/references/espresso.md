# Espresso Setup

## Goal
Install or validate the Appium Espresso driver and confirm Android device readiness for Espresso sessions.

## Do Not Use For
Do not use for UiAutomator2, XCUITest, Chromium, Node-only, FFmpeg-only, or bundletool-only setup.

## Preflight
Run Node and Android setup checks first. Capture installed Appium drivers, `appium driver doctor espresso`, `adb devices -l`, and whether the user expects a real device or emulator.

## Instructions
1. Install or update the Espresso driver only when absent or incompatible.
2. Fix required doctor issues one at a time.
3. Use optional bundletool setup only when requested capabilities need it.

## Verification
Require `appium driver doctor espresso` to report `0 required fixes needed`. Start an Appium server, confirm `/status` is ready, confirm `espresso` is installed or advertised, then stop the server.
