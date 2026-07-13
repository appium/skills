---
security_profile: appium-local-workflows
owner: appium
id: platform.ios.simulator-setup
name: "ios-simulator-setup"
description: "Route iOS simulator, Xcode, XCUITest driver, doctor, and smoke validation setup"

---

# iOS Simulator Setup

## Goal

Prepare Appium XCUITest on macOS by validating Node/Appium, Xcode, driver installation, doctor checks, simulator readiness, and server smoke evidence until required fixes are zero.

## Routing

Load these references in order:

1. `contexts/tools/appium/setup-basics.md` for Node.js and npm.
2. `contexts/tools/appium/setup/references/xcuitest/xcuitest-decision-logic.md` for macOS-only setup gates and optional dependency boundaries.
3. `contexts/platform/macos/xcode-prereqs.md` for Xcode, command-line tools, license, and first-launch checks.
4. `contexts/tools/appium/setup/references/xcuitest/xcuitest-driver-doctor.md` for driver install and doctor pass criteria.
5. `contexts/tools/appium/setup/references/xcuitest/xcuitest-smoke-status.md` for simulator inventory, `/status`, log evidence, and cleanup.

## Validation Command

```bash
node tools/appium/setup/scripts/check-xcuitest-env.mjs
```

Use `summary.requiredOk: true` as the read-only setup gate before smoke checks.

## Completion Criteria

- Host OS is macOS.
- `xcodebuild -version` and `xcode-select -p` succeed.
- Xcode license and first-launch requirements are handled.
- `appium -v` succeeds and installed driver list includes `xcuitest`.
- `appium driver doctor xcuitest` reports `0 required fixes needed`.
- `/status` returns readiness and logs include `Available drivers:` with `xcuitest`.

## Constraints

macOS only. Use global npm/Appium by default. Use `npx appium` only when explicitly requested. Ask before optional FFmpeg setup or privileged commands.
