---
name: "realdev-01"
description: "Preserved real-device-procedure procedure part 01 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 01

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

---
name: "xcuitest-real-device-config"
description: "Prepare a real iOS/tvOS device for Appium XCUITest automation: device trust, Developer Mode, provisioning profile, WDA code-signing and deployment patterns"
metadata:
  last_modified: "Fri, 13 Mar 2026 22:30:00 GMT"

---
# xcuitest-real-device-config

## Goal
Prepares a physical iOS/tvOS device to run Appium XCUITest sessions by configuring
device trust and security settings, building or downloading a properly signed
WebDriverAgent (WDA) package, verifying its code signature, and optionally configuring
faster WDA deployment patterns (preinstalled, prebuilt, or attach-to-running).

## Decision Logic
- If host OS is not macOS: stop and tell the user this skill is macOS-only.
- If `environment-setup-xcuitest` has not been completed: require it first.
- Before Option 2/3 signing steps, collect user inputs for bundle/team:
  - Free Apple ID: use a bundle ID that Xcode has already accepted for that Apple ID.
  - Paid Apple Developer: ask for the expected bundle ID and team ID used by their org.
- WDA preparation (step 4) — try in priority order and stop at the first that succeeds:
  1. Download a prebuilt WDA package from the GitHub releases page and sign with [`resigner`](https://github.com/appium/resigner) — handles profile embedding, optional bundle ID remapping, and signing in one step for any account type.
  2. Build WDA with `xcodebuild` passing explicit `PRODUCT_BUNDLE_IDENTIFIER`, `DEVELOPMENT_TEAM`, and `CODE_SIGN_IDENTITY` settings.
