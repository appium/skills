---
security_profile: appium-local-workflows
owner: appium
id: appium.real-device.references.real-device-procedure-part1
name: "xcuitest-real-device-config"
description: "Prepare a real iOS/tvOS device for Appium XCUITest automation: device trust, Developer Mode, provisioning profile, WDA code-signing and deployment patterns"
  last_modified: "Fri, 13 Mar 2026 22:30:00 GMT"
metadata:

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
  3. Build WDA via Xcode UI (`appium driver run xcuitest open-wda`) as a last resort.
- Run `appium driver run xcuitest open-wda` only for Option 3 (Xcode UI); skip for Options 1 and 2.
- After any build by Xcode or xcodebuild on iOS/tvOS 17+: remove `Frameworks/` files, then re-sign before verifying.
- For iOS/tvOS 17+, use the framework-removed and re-signed `.app` for Step 6/7 runtime checks; otherwise WDA may install but fail to launch.
- After any WDA preparation: always verify the signature with `codesign --verify --deep --strict` (step 5) before deploying.
- If a downloaded WDA package has no embedded provisioning profile: use `resigner` which handles profile embedding, optional bundle ID remapping, and signing in one step.
- For free-account or enterprise-profile setups where first launch may be blocked by trust prompts, install and trust a sample app signed with the same provisioning profile before launching WDA.
- For iOS/iPadOS 16+ without reliable internet: use an offline provisioning profile (see note in step 4, Option 1).
- WDA deployment pattern is optional and user-driven; the default uses `xcodebuild` every session:
  - For faster session start if WDA can remain installed between sessions → Run Preinstalled WDA (`appium:usePreinstalledWDA`).
  - For faster session start using a pre-built package (no xcodebuild at session time) → Run Prebuilt WDA (`appium:prebuiltWDAPath`).
  - For fully self-managed WDA lifecycle → Attach to Running WDA (`appium:webDriverAgentUrl`).
- For WebDriverAgent v13+ prebuilt/preinstalled flows, require iOS/tvOS 17.0 or newer before using `appium:usePreinstalledWDA` or `appium:prebuiltWDAPath`. For iOS/tvOS 16.x or older, use the default `xcodebuild` flow, an `.xctestrun`/`bootstrapPath` flow, or attach to an already running WDA with `appium:webDriverAgentUrl`.
- Ask before installing optional 3rd-party device tools (ios-deploy, go-ios, pymobiledevice3, tidevice).

