# XCUITest Setup

## Goal
Validate the macOS XCUITest simulator environment until required doctor fixes are gone.

## Do Not Use For
Do not use for physical iOS/tvOS signing, provisioning, WDA preinstall flows, Android, Chromium, FFmpeg-only, or Node-only setup.

## Preflight
Confirm macOS, Xcode command-line tools, Node/Appium status, installed XCUITest driver, simulator availability, and that simulator-only setup is intended.

## Instructions
1. Run Node setup first when Node/npm/Appium are missing or incompatible.
2. Install or update the XCUITest driver only when absent or incompatible.
3. Run doctor, fix required issues one at a time, and ask before license or first-launch commands.

## Verification
Require `appium driver doctor xcuitest` to report `0 required fixes needed`. Start an Appium server, confirm `/status` is ready, confirm `xcuitest` is installed or advertised, then stop the server.
