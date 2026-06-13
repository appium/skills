# Full Guidance Part 1

---
name: "xcuitest-real-device-config"
description: "Use this skill after base XCUITest setup passes to configure a physical iOS or tvOS device, provisioning, WDA signing, installation, and reuse patterns."
---
# xcuitest-real-device-config

## Goal
Prepare a trusted, signed, and verifiable WebDriverAgent path for a real iOS/tvOS device.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Do Not Use For
- Do not use for simulator-only XCUITest setup.
- Do not use for base Node/Appium/Xcode setup before `environment-setup-xcuitest` passes.

## Preflight
Confirm macOS, completed XCUITest setup, connected device UDID, Developer Mode/trust state, signing identity, team ID, bundle ID, and provisioning approach.

## Instructions
1. Choose one deployment pattern: xcodebuild, preinstalled WDA, prebuilt WDA, or attach to running WDA.
2. Modify signing, bundle IDs, or installed WDA only with explicit approval.
3. Keep recovery steps for any reversible WDA package changes.

## Verification
Confirm device visibility, valid code signature, provisioning match, and one working WDA deployment or attach path.

## Examples
- A real device rejects WDA launch; verify trust/signing, re-sign with approved inputs, reinstall, and confirm WDA responds.
