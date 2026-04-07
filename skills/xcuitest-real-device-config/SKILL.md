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
  1. Download a prebuilt WDA package from the GitHub releases page and sign with [`resigner`](https://github.com/KazuCocoa/resigner) — handles profile embedding, optional bundle ID remapping, and signing in one step for any account type.
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
- Ask before installing optional 3rd-party device tools (ios-deploy, go-ios, pymobiledevice3, tidevice).

## Instructions

1. **Verify prerequisite: environment-setup-xcuitest completed**
   ```bash
   appium -v
  appium driver list --installed --json || appium driver list --installed
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

   Download [`resigner`](https://github.com/KazuCocoa/resigner) from its
   [releases page](https://github.com/KazuCocoa/resigner/releases). It handles profile
   embedding, optional bundle ID remapping, and signing in one step for any account type.
   Select the archive that matches the host machine architecture:
   ```bash
   ARCH="$(uname -m)"
   case "$ARCH" in
     arm64) RESIGNER_ARCHIVE="darwin-arm64.tar.gz" ;;
     x86_64) RESIGNER_ARCHIVE="darwin-amd64.tar.gz" ;;
     *) echo "Unsupported macOS arch: $ARCH"; exit 1 ;;
   esac

   tar xzf "$RESIGNER_ARCHIVE"
   # binary is at: darwin-*/resigner
   ```

   Export your signing certificate as a `.p12`. Use either method:

   **GUI (Keychain Access):** locate your Apple Development certificate (the one with a
   private key) → right-click → **Export** → choose **Personal Information Exchange
   (.p12)** → set an export password.

   **CLI (login keychain):**
   ```bash
   P12_PASS="<choose-a-password>"
   security export \
     -k ~/Library/Keychains/login.keychain-db \
     -t identities \
     -f pkcs12 \
     -P "$P12_PASS" \
     -o ~/sign/mysign.p12
   ```

   Inspect the downloaded package to confirm current bundle IDs and signing state:
   ```bash
   WDA_APP="/path/to/downloaded/WebDriverAgentRunner-Runner.app"
   resigner --inspect "$WDA_APP"
   ```
   The prebuilt package uses `com.facebook.WebDriverAgentRunner` as its root bundle ID.

   Decode your provisioning profile to confirm its allowed bundle identifier.
   For free accounts (always specific-ID profiles), the output includes a `TEAMID.`
   prefix and you must strip it to get `TARGET_BUNDLE_ID`. For paid accounts, do this
   strip step only when using a specific-ID profile; if using `*`, `TARGET_BUNDLE_ID`
   is not needed because remap flags are omitted.
   ```bash
   PROFILES_DIR="/path/to/profiles-directory"   # resigner --profile takes a directory
   security cms -D -i "$PROFILES_DIR/<profile>.mobileprovision" > /tmp/profile.plist
    # output example: TEAMID1234.com.example.wda  ->  TARGET_BUNDLE_ID=com.example.wda
   /usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" /tmp/profile.plist
    /usr/libexec/PlistBuddy -c "Print :ExpirationDate" /tmp/profile.plist

    APP_ID=$(/usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" /tmp/profile.plist)
    TARGET_BUNDLE_ID="${APP_ID#*.}"   # remove TEAMID. prefix if present
   ```

   Run `resigner` to embed the profile and sign. `--profile` accepts a **directory**
   path; resigner selects the matching profile automatically. Include `--bundle-id-remap`
   flags only when your profile app identifier is not a true wildcard (`*`):
   ```bash
   TARGET_BUNDLE_ID="<bundle-id-covered-by-your-profile>"  # strip the TEAMID. prefix
   # Omit the --bundle-id-remap lines ONLY if your profile app identifier is exactly `*`
   # Partial wildcards (e.g. io.appium.* or com.example.*) still require --bundle-id-remap

   resigner \
     --p12-file "<path-to-your.p12>" \
     --p12-password "<p12-password>" \
     --profile "$PROFILES_DIR" \
     --force \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner.xctrunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentLib=${TARGET_BUNDLE_ID}" \
     "$WDA_APP"
   ```
   After `resigner` completes, the package is already signed; proceed directly to step 5 to verify.

   Validate the result before install:
   ```bash
   codesign --verify --deep --strict --verbose=2 "$WDA_APP"
   ```

   If install fails with `ApplicationVerificationFailed` / `A valid provisioning profile
   for this executable was not found`, the profile does not cover the current bundle ID
   and device UDID. Regenerate the profile and re-sign.

   Provisioning profile notes:
   - A true wildcard profile (`*` app identifier) covers any bundle ID and requires a
     paid Apple Developer account — no `--bundle-id-remap` flags needed.
   - Partial wildcards (e.g. `io.appium.*`) and all specific-ID profiles (free account
     or paid account without a `*` profile) require the `--bundle-id-remap` flags.
   - Free-account profiles generated by Xcode are typically under
     `~/Library/Developer/Xcode/UserData/Provisioning Profiles/`.
   - System-cached profiles from manual downloads are under
     `~/Library/MobileDevice/Provisioning Profiles/`.
   - **Expired profiles are rejected** by `resigner` as "not usable".
   - Always confirm profile validity before running:
   ```bash
   security cms -D -i "$PROFILES_DIR/<profile>.mobileprovision" > /tmp/profile.plist
   /usr/libexec/PlistBuddy -c "Print :ExpirationDate" /tmp/profile.plist
   date
   ```

   > **Offline note (iOS 16+):** If the device has no reliable internet at test time,
   > set up an offline provisioning profile first. Follow the steps in the
   > [Appium issue comment](https://github.com/appium/appium/issues/18378#issuecomment-1482678074).

    > **Fast prebuilt workflow (verified):** Use `resigner --inspect` first to get the
    > source bundle IDs (`com.facebook.WebDriverAgentRunner*`), then derive
    > `TARGET_BUNDLE_ID` from the non-expired provisioning profile's
    > `Entitlements:application-identifier` (strip `TEAMID.`). Remap all WDA bundle IDs
    > to that exact target ID and sign in one run.
    >
    > If re-signing fails with "unable to find usable provisioning profile", the usual
    > causes are: expired profile, profile not matching the remapped target ID, or team/
    > certificate mismatch.

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
   - Do not hardcode personal prefixes (for example, `com.example.personal`) in reusable docs;
     treat those as environment-specific examples only.

   ```bash
   BUNDLE_ID="<user-provided.bundle.id>"
   # Prefer deriving values from the selected profile for repeatable automation:
   # PROFILE_PATH="/path/to/<profile>.mobileprovision"
   # security cms -D -i "$PROFILE_PATH" > /tmp/profile.plist
   # DEVELOPMENT_TEAM=$(/usr/libexec/PlistBuddy -c "Print :TeamIdentifier:0" /tmp/profile.plist)
   # APP_ID=$(/usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" /tmp/profile.plist)
   # BUNDLE_ID="${APP_ID#*.}"   # remove TEAMID. prefix if present

   DEVELOPMENT_TEAM="<USER_TEAM_ID>"   # 10-character team ID from the user's Apple account
   SIGN_ID="Apple Development"         # or the full identity string from security find-identity

   # Must: inspect the selected certificate subject and OU
   # security find-certificate -c "Apple Development: you@example.com" -p | openssl x509 -noout -subject
   # subject=UID=UID, CN=Apple Development: you@example.com (TEAMID), OU=TEAMID, O=your name, C=US

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

6. **Run Appium XCUITest with Prepared WDA** *(choose one mode only)*
   Use one mode below as an example. Do not run all modes.

   **Mode A — Reuse preinstalled WDA**
   Install WDA once and reuse it across sessions without running `xcodebuild` each time.
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "com.yourteam.WebDriverAgentRunner"
   }
   ```
   Notes:
   - For free-account or enterprise-profile setups, complete the step 5 pre-trust
     recommendation first.
   - If launch fails with repeated `ECONNREFUSED 127.0.0.1:8100`, rebuild from the
     iOS/tvOS 17+ flow in step 4 (`rm -rf Frameworks/` + re-sign), reinstall, then retry.
   - If the installed WDA bundle ID has no `.xctrunner` suffix:
   ```json
   {
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "io.appium.wda",
     "appium:updatedWDABundleIdSuffix": ""
   }
   ```

   **Mode B — Use prebuilt WDA app/xctestrun artifacts**
   Skip build work at session time by using previously prepared artifacts.

   Option B1: Signed `.app` artifact
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:prebuiltWDAPath": "/path/to/signed/WebDriverAgentRunner-Runner.app"
   }
   ```

   Option B2: `.xctestrun` artifact
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:useXctestrunFile": true,
     "appium:bootstrapPath": "/abs/path/to/appium_wda_ios/Build/Products"
   }
   ```
   If Appium expects `WebDriverAgentRunner_iphoneos-arm64.xctestrun` but build output
   is SDK-suffixed, copy/rename it to the expected filename in the same directory.

   **Mode C — Attach to already running WDA**
   Start WDA externally (Xcode/xcodebuild/tooling), then point Appium at it.
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:webDriverAgentUrl": "http://<device-ip-or-localhost>:8100"
   }
   ```
   If the remote WDA port differs from local forwarding, add `appium:wdaRemotePort`.

   **Skill report requirement:**
   - In the final skill report, print at least one copy-paste-ready capabilities JSON
     snippet for the mode that was validated.
   - Include one additional capabilities snippet as a fallback hint (for example,
     preinstalled mode and attach mode).

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
- Step 6 contains optional runtime modes; validate one mode only. The default
  xcodebuild-per-session flow is still valid.

## Agent completion criteria
Mark the skill complete only when all of the following are true:
- Connected device is visible in `xcrun xctrace list devices` output.
- A signed WDA `.app` has been prepared using one of the Options in step 4.
- `codesign --verify --deep --strict` on the prepared WDA exits cleanly (step 5 passes).
- At least one WDA runtime mode from step 6 is confirmed working (or default
  xcodebuild-per-session install succeeds).
- Final skill report includes capability hints:
  - one copy-paste JSON capabilities snippet for the validated mode, and
  - one additional fallback snippet.
