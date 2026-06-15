---
name: "xcuitest-real-device-config"
description: "Prepare real iOS or tvOS devices for Appium XCUITest"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# xcuitest-real-device-config

## Goal
Prepare a physical iOS or tvOS device for Appium XCUITest by validating trust, Developer Mode, signing, WebDriverAgent (WDA), and the chosen deployment pattern.

## Preconditions
- Host OS must be macOS.
- `environment-setup-xcuitest` must already be complete.
- Confirm device UDID, iOS/tvOS version, signing account type, and whether the user wants preinstalled WDA, prebuilt WDA, or attach-to-running WDA URL.

## Procedure
1. Validate baseline:
   - `appium -v`
   - `appium driver list --installed --json`
   - `xcrun xctrace list devices`
2. Confirm the device is trusted, unlocked, and has Developer Mode enabled when required by the OS.
3. Locate Appium home with `APPIUM_HOME="${APPIUM_HOME:-$HOME/.appium}"` and record the XCUITest driver and WDA versions.
4. Choose one WDA path:
   - Download a prebuilt WDA `.app` and resign it.
   - Build WDA with Xcode using the selected team and provisioning profile.
   - Use an already running WDA URL with `appium:webDriverAgentUrl`.
5. For downloaded or prebuilt WDA, verify architecture, bundle ID, embedded provisioning profile, and code signature:
   - `codesign --verify --deep --strict --verbose=2 "$WDA_APP"`
   - inspect the embedded profile for device UDID and team.
6. Match signing profile to account type:
   - Free Apple ID: use a specific bundle ID and expect trust prompts.
   - Paid developer: use explicit or wildcard profile that covers device UDID.
   - Enterprise: use provided profile and certificate exactly as issued.
7. Select deployment capabilities:
   - iOS/tvOS 17+: `appium:usePreinstalledWDA` or `appium:prebuiltWDAPath` when supported.
   - iOS/tvOS 16.x: use xcodebuild flow, `.xctestrun`/`bootstrapPath`, or `appium:webDriverAgentUrl`.
8. Start a minimal Appium session or attach to running WDA, then verify WDA responds and the session starts.

## Completion Criteria
- Device appears in `xcrun xctrace list devices`.
- Signing identity, team ID, bundle ID, and provisioning profile are reported.
- WDA signature verifies.
- Chosen WDA deployment pattern is reflected in capabilities.
- A minimal real-device XCUITest session or WDA attach check succeeds.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.
