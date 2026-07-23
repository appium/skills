---
security_profile: appium-real-device-workflows
owner: appium
id: appium.real-device.references.real-device-procedure
name: xcuitest-real-device-procedure
description: Prepare, sign, verify, deploy, and reuse WebDriverAgent for a real iOS or tvOS device with Appium XCUITest.
status: stable
---

# XCUITest Real Device Procedure

## Contents

- [Goal](#goal)
- [Decision Logic](#decision-logic)
- [Steps 1–3: shared prerequisites](#instructions)
- Steps 4–5: `contexts/tools/appium/real-device/references/wda-preparation.md`
- Step 6, evidence, constraints, and completion: `contexts/tools/appium/real-device/references/wda-runtime.md`

## Goal
Prepare a physical iOS/tvOS device for Appium XCUITest by configuring trust and
validating one WebDriverAgent (WDA) runtime route: Appium-managed `xcodebuild`,
a prepared or preinstalled artifact, or attachment to an already running WDA.
Require signing, signature, and installation evidence only for routes that build,
modify, sign, or install WDA locally.

Resolve command mode once. Use `appium` by default; when the user explicitly
selects local mode, run from the project root and replace every `appium ...`
invocation in this procedure with `npx --no-install appium ...`. Never mix global
and local modes in one run or allow `npx` to download a missing Appium package.

## Decision Logic
- If host OS is not macOS: stop and tell the user this workflow is macOS-only.
- If `skills/setup-xcuitest/SKILL.md` has not completed its shared iOS/tvOS
  XCUITest gates, stop and report that prerequisite first.
- Select one runtime route before preparing WDA:
  - Default Appium-managed `xcodebuild`: let Appium build and sign WDA during the session; use step 4 only when signing needs separate validation.
  - Prebuilt or preinstalled WDA: prepare or validate the artifact in steps 4 and 5 before deployment.
  - Running WDA URL: skip local preparation, signing, and installation in steps 4 and 5; verify endpoint reachability and a successful Appium attachment in step 6.
- Before changing device trust, Developer Mode, signing, provisioning, bundle contents, device registration, or installed apps, describe the exact change and obtain explicit approval. Treat `-allowProvisioningUpdates` and `-allowProvisioningDeviceRegistration` as state-changing.
- Before any default or local signing route, have the human operator confirm locally
  that the selected signing configuration covers the intended WDA identifier. For a
  free Apple ID, use an identifier Xcode already accepted. For an organization account,
  use its approved signing configuration. Return only redacted match/no-match results.
- When the selected route requires a prepared local WDA artifact, try step 4 options in priority order and stop at the first that succeeds:
  1. Download a prebuilt WDA package from the GitHub releases page and sign with [`resigner`](https://github.com/appium/resigner) — handles profile embedding, optional bundle ID remapping, and signing in one step for any account type.
  2. Build WDA with `xcodebuild` passing explicit `PRODUCT_BUNDLE_IDENTIFIER`, `DEVELOPMENT_TEAM`, and `CODE_SIGN_IDENTITY` settings.
  3. Build WDA via Xcode UI (`appium driver run xcuitest open-wda`) as a last resort.
- Run `appium driver run xcuitest open-wda` only for Option 3 (Xcode UI); skip for Options 1 and 2.
- After any build by Xcode or xcodebuild on iOS/tvOS 17+: remove `Frameworks/` files, then re-sign before verifying.
- For iOS/tvOS 17+, use the framework-removed and re-signed `.app` for step 6 runtime checks; otherwise WDA may install but fail to launch.
- If a downloaded WDA package has no embedded provisioning profile: use `resigner` which handles profile embedding, optional bundle ID remapping, and signing in one step.
- For free-account or enterprise-profile setups where first launch may be blocked by trust prompts, install and trust a sample app signed with the same provisioning profile before launching WDA.
- For iOS/iPadOS 16+ profiles intended for disconnected test runs, follow the
  preparation note in step 4, Option 1 before the test run.
- WDA runtime route is user-driven; the default uses Appium-managed `xcodebuild` every session:
  - For faster session start if WDA can remain installed between sessions → Run Preinstalled WDA (`appium:usePreinstalledWDA`).
  - For faster session start using a pre-built package (no xcodebuild at session time) → Run Prebuilt WDA (`appium:prebuiltWDAPath`).
  - For fully self-managed WDA lifecycle → Attach to Running WDA (`appium:webDriverAgentUrl`).
- For WebDriverAgent v13+ prebuilt/preinstalled flows, require iOS/tvOS 17.0 or newer before using `appium:usePreinstalledWDA` or `appium:prebuiltWDAPath`. For iOS/tvOS 16.x or older, use the default `xcodebuild` flow, an `.xctestrun`/`bootstrapPath` flow, or attach to an already running WDA with `appium:webDriverAgentUrl`.
- Ask before installing optional 3rd-party device tools (ios-deploy, go-ios, pymobiledevice3, tidevice).

## Instructions

### 1. Verify the iOS/tvOS + XCUITest setup prerequisite

   ```bash
   appium -v
   appium driver list --installed --json
   ```
   If the installed-list command does not support `--json`, run
   `appium driver list --installed` as a separate fallback.
   Confirm `xcuitest` appears in the installed driver list before continuing. If it is
   missing, complete `skills/setup-xcuitest/SKILL.md` first.

### 2. Connect device and confirm visibility

   - Connect the device by USB when trust or initial device configuration is needed, or use an already paired wireless device. Either route must appear in `xcrun xctrace list devices`.
   - If prompted on the device, describe the trust change and obtain explicit approval before asking the user to tap **Trust**.
   - Confirm the device is visible:
   ```bash
   xcrun xctrace list devices
   ```
   The output should include the connected device with its UDID. Record the UDID for
   use in Appium capabilities.
   - Opening Xcode after connecting also mounts the developer disk image automatically,
     which is required for launching XCTest sessions.

### 3. Enable Developer Mode and required settings (iOS/iPadOS 16 and above)

   - First have the user confirm the current Developer Mode and UI Automation state locally. If either setting is not already enabled, describe the state change and obtain explicit approval before continuing; do not toggle an already enabled setting.
   - On the device: **Settings → Privacy & Security → Developer Mode** → enable.
     Restart if prompted.
   - After restart: **Settings → Developer → Enable UI Automation** → enable.
   - For Webview testing (optional): **Settings → Safari → Advanced → Web Inspector** and
     **Settings → Safari → Advanced → Remote Automation** → both on.
   - CLI alternative to trigger Developer Mode (macOS 13+ with a tethered device):
   ```bash
   devmodectl streaming
   ```

## Continue the Ordered Procedure

Load the remaining routed assets before executing their steps:

1. Load `contexts/tools/appium/real-device/references/wda-preparation.md` for steps 4 and 5 when the selected route builds, modifies, signs, installs, or separately validates a local WDA bundle.
2. Load `contexts/tools/appium/real-device/references/wda-runtime.md` for route-wide constraints, step 6, evidence requirements, the self-improvement prompt, and completion criteria.

For a running-WDA URL route, load the runtime asset and use its endpoint and attachment
gates without entering the local preparation asset's steps.
