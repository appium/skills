---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/environment-setup-xcuitest.md"
id: appium.setup.references.environment-setup-xcuitest
name: "environment-setup-xcuitest"
description: "Route macOS XCUITest Appium driver setup, Xcode validation, doctor checks, and smoke tests"
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/setup/references/environment-setup-xcuitest.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/environment-setup-xcuitest.md bounded command output, local paths, driver names, IDs, and logs

---

# appium-xcuitest-environment-setup

## Goal

Prepare Appium XCUITest on macOS by validating Node/Appium, Xcode, driver installation, doctor checks, simulator readiness, and server smoke evidence until required fixes are zero.

## Routing

Load these references in order:

1. `contexts/tools/appium/setup/node-environment.md` for Node.js and npm.
2. `contexts/tools/appium/setup/references/xcuitest/xcuitest-decision-logic.md` for macOS-only setup gates and optional dependency boundaries.
3. `contexts/tools/appium/setup/references/xcuitest/xcuitest-xcode-prereqs.md` for Xcode, command-line tools, license, and first-launch checks.
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
