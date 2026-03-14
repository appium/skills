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
  1. Download a prebuilt WDA package from the GitHub releases page, embed a provisioning profile, and sign with `codesign`.
  2. Build WDA with `xcodebuild` passing explicit `PRODUCT_BUNDLE_IDENTIFIER`, `DEVELOPMENT_TEAM`, and `CODE_SIGN_IDENTITY` settings.
  3. Build WDA via Xcode UI (`appium driver run xcuitest open-wda`) as a last resort.
- Run `appium driver run xcuitest open-wda` only for Option 3 (Xcode UI); skip for Options 1 and 2.
- After any build by Xcode or xcodebuild on iOS/tvOS 17+: remove `Frameworks/` files, then re-sign before verifying.
- For iOS/tvOS 17+, use the framework-removed and re-signed `.app` for Step 6/7 runtime checks; otherwise WDA may install but fail to launch.
- After any WDA preparation: always verify the signature with `codesign --verify --deep --strict` (step 5) before deploying.
- If a downloaded WDA package has no embedded provisioning profile: embed a `.mobileprovision` file before signing.
- For free-account or enterprise-profile setups where first launch may be blocked by trust prompts, install and trust a sample app signed with the same provisioning profile before launching WDA.
- For iOS/iPadOS 16+ without reliable internet: use an offline provisioning profile (see note in step 4, Option 1).
- WDA deployment pattern is optional and user-driven; the default uses `xcodebuild` every session:
  - For faster session start if WDA can remain installed between sessions → Run Preinstalled WDA (`appium:usePreinstalledWDA`).
  - For faster session start using a pre-built package (no xcodebuild at session time) → Run Prebuilt WDA (`appium:prebuiltWDAPath`).
  - For fully self-managed WDA lifecycle → Attach to Running WDA (`appium:webDriverAgentUrl`).
- Ask before installing optional 3rd-party device tools (ios-deploy, go-ios, pymobiledevice3, tidevice).

## Instructions

1. **Verify prerequisite: environment-setup-xcuitest completed**
   ```bash
   appium -v
   appium driver list --installed
   ```
   Confirm `xcuitest` appears in the installed driver list before continuing. If it is
   missing, complete `environment-setup-xcuitest` first.

2. **Connect device and confirm visibility**
   - Connect the device to the Mac via USB.
   - If prompted on the device, tap **Trust** to trust the connected computer.
   - Confirm the device is visible:
   ```bash
   xcrun xctrace list devices
   ```
   The output should include the connected device with its UDID. Record the UDID for
   use in Appium capabilities.
   - Opening Xcode after connecting also mounts the developer disk image automatically,
     which is required for launching XCTest sessions.

3. **Enable Developer Mode and required settings (iOS/iPadOS 16 and above)**
   - On the device: **Settings → Privacy & Security → Developer Mode** → enable.
     Restart if prompted.
   - After restart: **Settings → Developer → Enable UI Automation** → enable.
   - For Webview testing (optional): **Settings → Safari → Advanced → Web Inspector** and
     **Settings → Safari → Advanced → Remote Automation** → both on.
   - CLI alternative to trigger Developer Mode (macOS 13+ with a tethered device):
   ```bash
   devmodectl streaming
   ```

4. **Prepare WDA**
   Build or obtain a properly signed `WebDriverAgentRunner-Runner.app` before running
   any Appium session. Try the options below in priority order and stop at the first
   that succeeds.

   If `APPIUM_HOME` is set, use it. Otherwise fall back to `$HOME/.appium`:
   ```bash
   APPIUM_HOME_DIR="${APPIUM_HOME:-$HOME/.appium}"
   ```

   First, find the WDA version bundled with the installed XCUITest driver — use the
   same version when choosing Option 1 or 2:
    ```bash
    cat "$APPIUM_HOME_DIR"/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/package.json | grep '"version"'
    ```
   Also list available signing identities for use in all options below:
   ```bash
   security find-identity -v -p codesigning
   ```
   Note the identity string (e.g. `"Apple Development: you@example.com (TEAMID)"`).

   ---

   **Option 1 (primary) — Download prebuilt WDA from GitHub releases**

   The [WebDriverAgent releases page](https://github.com/appium/WebDriverAgent/releases)
   provides prebuilt `.app` packages for real devices. These are built without embedded
   XCTest frameworks (safe for iOS 17+) and have no embedded provisioning profile;
   they must be signed with your own identity before use.

   ```bash
   WDA_APP="/path/to/downloaded/WebDriverAgentRunner-Runner.app"
   SIGNING_IDENTITY="Apple Development: you@example.com (TEAMID)"

   # 1. Check the bundle ID in the downloaded package
   defaults read "$WDA_APP/Info.plist" CFBundleIdentifier

   # 2. Embed a provisioning profile that covers this bundle ID and your device UDID
   cp /path/to/your_profile.mobileprovision "$WDA_APP/embedded.mobileprovision"

   # 3. Sign
   codesign --force --sign "$SIGNING_IDENTITY" "$WDA_APP"
   ```

    Validate the result before install:
    ```bash
    codesign --verify --deep --strict --verbose=2 "$WDA_APP"
    ```

    If install fails with `ApplicationVerificationFailed` / `A valid provisioning profile
    for this executable was not found`, the profile does not cover the current bundle ID
    and device UDID. Regenerate the profile and re-sign.

   Provisioning profile notes:
   - Wildcard profiles (e.g. `io.appium.*` or `*`) cover any bundle ID and require a
     paid Apple Developer account.
   - With a free Apple ID, the profile must match the exact bundle ID of the package.

   > **Offline note (iOS 16+):** If the device has no reliable internet at test time,
   > set up an offline provisioning profile first. Follow the steps in the
   > [Appium issue comment](https://github.com/appium/appium/issues/18378#issuecomment-1482678074).

   Proceed to step 5 to verify the signature.

   ---

   **Option 2 — Build WDA with xcodebuild using explicit signing settings**

   Use when a prebuilt release package does not match the required version, or when a
   custom bundle ID is needed. Pass signing settings directly as `xcodebuild` arguments:

   Before running `xcodebuild`, collect these inputs from the user:
   - `BUNDLE_ID`
   - `DEVELOPMENT_TEAM`
   - account type (free Apple ID or paid Apple Developer)

   How to choose `BUNDLE_ID`:
   - Free Apple ID: use a bundle ID that Xcode already accepted for that Apple ID
     (for example, from the temporary app project created in Option 3b), then append
     `WebDriverAgentRunner` naming as needed.
   - Paid Apple Developer: ask the user for the expected production/testing bundle ID
     and matching team ID for their org.
   - Do not hardcode personal prefixes (for example, `com.kazucocoa`) in reusable docs;
     treat those as environment-specific examples only.

   ```bash
   BUNDLE_ID="<user-provided.bundle.id>"
   DEVELOPMENT_TEAM="<USER_TEAM_ID>"   # 10-character team ID from the user's Apple account
   SIGN_ID="Apple Development"         # or the full identity string from security find-identity

   # Optional: inspect the selected certificate subject and OU (team)
   # security find-certificate -c "Apple Development: you@example.com" -p | openssl x509 -noout -subject

   # iOS/iPadOS
   xcodebuild clean build-for-testing \
     -project "$APPIUM_HOME_DIR"/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj \
     -derivedDataPath appium_wda_ios \
     -scheme WebDriverAgentRunner \
     -destination generic/platform=iOS \
     -allowProvisioningUpdates \
     -allowProvisioningDeviceRegistration \
      PRODUCT_BUNDLE_IDENTIFIER="$BUNDLE_ID" \
      DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" \
     CODE_SIGN_STYLE=Automatic \
     CODE_SIGN_IDENTITY="$SIGN_ID"

   # tvOS
   xcodebuild clean build-for-testing \
     -project "$APPIUM_HOME_DIR"/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj \
     -derivedDataPath appium_wda_tvos \
     -scheme WebDriverAgentRunner_tvOS \
     -destination generic/platform=tvOS \
     -allowProvisioningUpdates \
     -allowProvisioningDeviceRegistration \
     PRODUCT_BUNDLE_IDENTIFIER="$BUNDLE_ID" \
     DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" \
     CODE_SIGN_STYLE=Automatic \
     CODE_SIGN_IDENTITY="$SIGN_ID"
   ```

   If `xcodebuild` fails with `No Account for Team` or profile-not-found errors:
   - Ensure the Apple account is signed into Xcode for that team.
   - Confirm the provided `DEVELOPMENT_TEAM` matches the effective certificate team actually used
     for signing (for example, `TeamIdentifier` shown by `codesign -dv --verbose=4`).
   - Retry with the corrected team value.

   The built package will be at:
   ```
   appium_wda_ios/Build/Products/Debug-iphoneos/WebDriverAgentRunner-Runner.app
   ```

    **iOS 17+ / tvOS 17+:** The package embeds XCTest runtime artifacts that must be
    removed before the device can launch WDA with its own local XCTest runtime. After
    the build, remove the same artifacts as the GitHub release package and re-sign:
   ```bash
   WDA_APP="appium_wda_ios/Build/Products/Debug-iphoneos/WebDriverAgentRunner-Runner.app"

   rm -rf "$WDA_APP"/Frameworks/XC*.framework
   rm -f "$WDA_APP"/Frameworks/Testing.framework
   rm -f "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib

   # Re-sign with the same identity used during build
   codesign --force --sign "$SIGN_ID" "$WDA_APP"
   ```

   Proceed to step 5 to verify the signature.

   ---

   **Option 3 (Xcode UI fallback) — Build WDA via Xcode**

   Use this when the prebuilt release is unavailable and xcodebuild signing fails.
   Open the WDA project in Xcode:
   ```bash
   appium driver run xcuitest open-wda
   ```
   Then choose the signing sub-option that matches your Apple Developer account:

   **Option 3a — Automatic signing (paid Apple Developer account)**
   - Select `WebDriverAgentRunner` target → Signing & Capabilities.
   - Check **Automatically manage signing** and select your paid team.
   - Build and install: **Product → Test** on the connected device.

   **Option 3b — Free Apple ID**
   - Create a new temporary iOS app project in Xcode; let Xcode generate a provisioning
     profile for a bundle ID your free account covers.
   - Back in the WDA project, select `WebDriverAgentRunner` target, set the bundle ID to
     the one Xcode accepted, sign with your free team.
   - Build and install: **Product → Test** on the connected device.

   **Option 3c — Manual bundle assignment**
   In the WDA source root:
   ```bash
   mkdir -p Resources/WebDriverAgent.bundle
   ```
   - In Xcode: select root project → `WebDriverAgentRunner` target → Signing & Capabilities.
   - Change `com.facebook.WebDriverAgentRunner` to a bundle ID covered by your profile.
   - Build and install: **Product → Test** on the connected device.

    **iOS 17+ / tvOS 17+ (all Option 3 sub-options):**
    The Xcode-built package contains the same XCTest runtime artifacts as other WDA
    bundles. Remove `Frameworks/XC*.framework`, `Frameworks/Testing.framework`, and
    `Frameworks/libXCTestSwiftSupport.dylib`, then re-sign before installation:
   ```bash
   WDA_APP=~/Library/Developer/Xcode/DerivedData/WebDriverAgent-*/Build/Products/Debug-iphoneos/WebDriverAgentRunner-Runner.app

   rm -rf "$WDA_APP"/Frameworks/XC*.framework
   rm -f "$WDA_APP"/Frameworks/Testing.framework
   rm -f "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib

   SIGNING_IDENTITY="Apple Development: you@example.com (TEAMID)"
   codesign --force --sign "$SIGNING_IDENTITY" "$WDA_APP"
   ```

   Proceed to step 5 to verify the signature.

5. **Verify WDA signature**
   Run the following checks on the prepared `.app` before deploying it to the device.
   Removing any file from a signed bundle invalidates the Code Directory hash, so this
   check catches both a bad re-sign and a bundle that was never signed:
   ```bash
   WDA_APP="/path/to/WebDriverAgentRunner-Runner.app"

   # Verify signature recursively with strict checking
   codesign --verify --deep --strict --verbose=2 "$WDA_APP"

   # Inspect signing details (team, bundle ID, entitlements)
   codesign -dv --verbose=4 "$WDA_APP"
   ```
   A valid result produces:
   ```
   WebDriverAgentRunner-Runner.app: valid on disk
   WebDriverAgentRunner-Runner.app: satisfies its Designated Requirement
   ```
   If `codesign --verify` exits non-zero or reports `invalid`, return to step 4 and
   re-sign or rebuild the bundle.

   **Common install-time errors and fixes:**
   - `xcodebuild exited with code '65'` → code signing is misconfigured; redo step 4.
   - `Unable to launch … invalid code signature / inadequate entitlements / profile not trusted`
     → The developer is not yet trusted on the device.
     On the device: **Settings → General → VPN & Device Management** → select the
     development team → **Trust**. Then retry.

   **Recommendation (free account / enterprise profile):**
   Before first WDA launch, install a small sample app signed with the same
   provisioning profile/certificate, launch it once, and complete all trust prompts.
   This pre-trust step reduces WDA launch blocking on first run.

6. **Run Preinstalled WDA** *(optional — improves session start time)*
   Install WDA once on the device and reuse it across sessions without `xcodebuild`.

    For free-account or enterprise-profile setups, complete the step 5 pre-trust
    recommendation first (sample app signed with the same profile/certificate).

   After preparing and verifying WDA in steps 4–5, install the `.app` on the device
   using any 3rd-party device tool (ask before installing: ios-deploy, go-ios,
   pymobiledevice3, tidevice), or set `appium:prebuiltWDAPath` to let the driver
   install it each session:
   ```json
   {
     "appium:usePreinstalledWDA": true,
     "appium:prebuiltWDAPath": "/abs/path/to/WebDriverAgentRunner-Runner.app",
     "appium:updatedWDABundleId": "com.yourteam.WebDriverAgentRunner"
   }
   ```

   **Launch the session with preinstalled WDA:**
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "com.yourteam.WebDriverAgentRunner"
   }
   ```
   If launch fails with `Failed to start the preinstalled WebDriverAgent` and repeated
   `ECONNREFUSED 127.0.0.1:8100`, rebuild the app from step 4 iOS/tvOS 17+ flow
   (`rm -rf Frameworks/` + re-sign), reinstall, then retry.

   Known behavior with `go-ios` tooling on newer iOS versions:
   - `ios install` and `ios apps` can show tunnel-agent warnings while still succeeding.
   - Treat explicit `installation successful` / listed bundle ID as the success signal.
   If the WDA bundle ID has no `.xctrunner` suffix (e.g. set by a 3rd-party install tool):
   ```json
   {
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "io.appium.wda",
     "appium:updatedWDABundleIdSuffix": ""
   }
   ```

7. **Run Prebuilt WDA** *(optional — improves session start time)*
   Use the WDA `.app` prepared in step 4 to skip `xcodebuild build-for-testing` at
   session start.

   **Option A (primary) — Point directly at the `.app` from step 4:**
   ```json
   {
     "appium:usePreinstalledWDA": true,
     "appium:prebuiltWDAPath": "/path/to/signed/WebDriverAgentRunner-Runner.app"
   }
   ```

   **Option B — Use the `.xctestrun` output from step 4 Option 2:**
   Build with a device-targeted destination to produce a compatible `.xctestrun`:
   ```bash
   xcodebuild build-for-testing \
     -project "$APPIUM_HOME_DIR"/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent/WebDriverAgent.xcodeproj \
     -derivedDataPath wda_build \
     -scheme WebDriverAgentRunner \
     -destination "platform=iOS,id=<device-udid>" \
     -allowProvisioningUpdates \
     -allowProvisioningDeviceRegistration \
     PRODUCT_BUNDLE_IDENTIFIER="$BUNDLE_ID" \
     DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" \
     CODE_SIGN_STYLE=Automatic \
     CODE_SIGN_IDENTITY="Apple Development"
   ```

   If Appium expects `WebDriverAgentRunner_iphoneos-arm64.xctestrun` but build output
   is SDK-suffixed (for example `WebDriverAgentRunner_iphoneos26.2-arm64.xctestrun`),
   copy/rename it to the expected filename in the same `Build/Products` directory.

   Then reference the build products directory:
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:useXctestrunFile": true,
     "appium:bootstrapPath": "/abs/path/to/appium_wda_ios/Build/Products"
   }
   ```

   Validation note:
   - Option B was verified to start a real-device session successfully after
     device-targeted build and `.xctestrun` filename normalization.

8. **Attach to a Running WDA** *(optional — fully self-managed WDA lifecycle)*
   Start WDA on the device externally, then have the XCUITest driver attach to it.
   This skips all WDA build/install logic inside the driver.

   1. Start the WDA process on the device (via Xcode, xcodebuild, or a 3rd-party tool).
   2. Determine the reachable WDA URL:
      - Direct network access: `http://<device-ip>:8100`
      - USB port-forward to localhost: `http://localhost:8100`
   3. Pass the URL in the session capability:
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:deviceName": "iPhone",
     "appium:platformVersion": "18.0",
     "appium:webDriverAgentUrl": "http://<device-ip>:8100"
   }
   ```
   If the remote WDA port differs from the local forwarded port, add:
   ```json
   {
     "appium:wdaRemotePort": 8100
   }
   ```

## Constraints
- This skill is macOS-only; do not provide Linux/Windows alternatives.
- `environment-setup-xcuitest` must be completed before starting this skill.
- Always verify the WDA signature with `codesign --verify --deep --strict` (step 5)
  after any preparation step before deploying.
- Never skip re-signing after modifying a signed `.app` bundle (e.g. removing frameworks).
- Paid-account-only steps (automatic signing, wildcard profiles) must be clearly marked;
  do not require them from users with a free Apple ID.
- Ask the user before installing any 3rd-party device tool (ios-deploy, go-ios,
  pymobiledevice3, tidevice, ios-app-signer, etc.).
- For steps that require physical interaction with the device (Trust popup, Developer
  Mode toggle), pause and provide the exact on-device instruction.
- Steps 6–8 are optional performance improvements; the default xcodebuild-per-session
  flow is valid and does not require them.

## Agent completion criteria
Mark the skill complete only when all of the following are true:
- Connected device is visible in `xcrun xctrace list devices` output.
- A signed WDA `.app` has been prepared using one of the Options in step 4.
- `codesign --verify --deep --strict` on the prepared WDA exits cleanly (step 5 passes).
- At least one WDA deployment method is confirmed working:
  - Default: `xcodebuild`-based install succeeds, OR
  - Preinstalled: `appium:usePreinstalledWDA` session starts successfully, OR
  - Prebuilt: `appium:prebuiltWDAPath` / `appium:useXctestrunFile` session starts, OR
  - Attach: `appium:webDriverAgentUrl` session starts successfully.
