---
name: "environment-setup-xcuitest"
description: "Route macOS XCUITest Appium driver setup, Xcode validation, doctor checks, and smoke tests"
---

# appium-xcuitest-environment-setup

## Goal

Prepare Appium XCUITest on macOS by validating Node/Appium, Xcode, driver installation, doctor checks, simulator readiness, and server smoke evidence until required fixes are zero.

## Routing

Load these references in order:

1. `environment-setup-node.md` for Node.js and npm.
2. `xcuitest/xcuitest-decision-logic.md` for macOS-only setup gates and optional dependency boundaries.
3. `xcuitest/xcuitest-xcode-prereqs.md` for Xcode, command-line tools, license, and first-launch checks.
4. `xcuitest/xcuitest-driver-doctor.md` for driver install and doctor pass criteria.
5. `xcuitest/xcuitest-smoke-status.md` for simulator inventory, `/status`, log evidence, and cleanup.

## Completion Criteria

- Host OS is macOS.
- `xcodebuild -version` and `xcode-select -p` succeed.
- Xcode license and first-launch requirements are handled.
- `appium -v` succeeds and installed driver list includes `xcuitest`.
- `appium driver doctor xcuitest` reports `0 required fixes needed`.
- `/status` returns readiness and logs include `Available drivers:` with `xcuitest`.

## Constraints

macOS only. Use global npm/Appium by default. Use `npx appium` only when explicitly requested. Ask before optional FFmpeg setup or privileged commands.
