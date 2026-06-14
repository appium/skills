---
name: "environment-setup-xcuitest"
description: "Use this skill to prepare Appium XCUITest automation on macOS for simulator workflows by validating Node/Appium, Xcode, the driver, doctor output, and smoke checks."
---
# environment-setup-xcuitest

## Goal
Validate the macOS XCUITest simulator environment until required doctor fixes are gone.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Do Not Use For
- Do not use for physical iOS/tvOS signing, provisioning, or WDA preinstall flows.
- Do not use for Android, Chromium, FFmpeg-only, or Node-only setup.

## Preflight
Confirm macOS, Xcode command-line tools, Node/Appium status, installed XCUITest driver, and whether simulator-only setup is intended.

## Instructions
1. Run Node setup first when Node/npm are missing or incompatible.
2. Install or update the XCUITest driver only when absent or incompatible.
3. Run doctor, fix required issues one at a time, and ask before license or first-launch commands.

## Verification
Require doctor output indicating zero required fixes and a server smoke check showing XCUITest available.

## Examples
- XCUITest doctor reports Xcode first launch incomplete; ask approval for the exact setup command, rerun doctor, then smoke-test.
