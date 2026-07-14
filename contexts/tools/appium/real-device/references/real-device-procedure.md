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
- [Instructions](#instructions)
- [Evidence To Report](#evidence-to-report)
- [Self-Improvement Prompt](#self-improvement-prompt)
- [Constraints](#constraints)
- [Completion Criteria](#completion-criteria)

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
- If the iOS/tvOS + XCUITest route in `contexts/tools/appium/setup/routing.md` has not been completed: require it first.
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
   missing, complete the iOS/tvOS + XCUITest route in
   `contexts/tools/appium/setup/routing.md` first.

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

### 4. Prepare WDA

   Use this step only when the selected route needs a prepared local
   `WebDriverAgentRunner-Runner.app` or when Appium-managed signing needs separate
   validation. Skip it for a running-WDA URL route. Before running any command in
   this step that changes signing, provisioning, bundle contents, device registration,
   or device installation, obtain explicit approval. Try the options below in priority
   order and stop at the first that succeeds.

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
   Note the identity locally (e.g. `"Apple Development: you@example.com (TEAMID)"`).
   Do not return the full identity in command evidence.

   ---

#### Option 1 (primary) — Download prebuilt WDA from GitHub releases

   The [WebDriverAgent releases page](https://github.com/appium/WebDriverAgent/releases)
   provides prebuilt `.app` packages for real devices. These are built without embedded
   XCTest frameworks (safe for iOS 17+) and have no embedded provisioning profile;
   they must be signed with your own identity before use.

   Download [`resigner`](https://github.com/appium/resigner) from its
   [releases page](https://github.com/appium/resigner/releases). It handles profile
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

   Prepare a local `.p12` signing archive outside the chat or agent context; never upload, attach, copy, print, or log the archive.
   The human operator must create it locally, keep the password out of prompts,
   logs, and diagnostics, and provide only a filesystem path placeholder when
   documenting the workflow.

   Inspect the downloaded package to confirm current bundle IDs and signing state:
   ```bash
   WDA_APP="/path/to/downloaded/WebDriverAgentRunner-Runner.app"
   resigner --inspect "$WDA_APP"
   ```
   The prebuilt package uses `com.facebook.WebDriverAgentRunner` as its root bundle ID.

   Have the human operator decode the provisioning profile locally to confirm its
   allowed bundle identifier. Do not run profile-decoding commands through an agent
   tool that captures output; return only expiration-valid and identifier-match results.
   For free accounts (always specific-ID profiles), the output includes a `TEAMID.`
   prefix and you must strip it to get `TARGET_BUNDLE_ID`. For paid accounts, do this
   strip step only when using a specific-ID profile; if using `*`, `TARGET_BUNDLE_ID`
   is not needed because remap flags are omitted.
   ```bash
   PROFILES_DIR="/path/to/profiles-directory"   # resigner --profile takes a directory
   PROFILE_TMP_DIR="$(mktemp -d)"
   PROFILE_PLIST="$PROFILE_TMP_DIR/profile.plist"
   security cms -D -i "$PROFILES_DIR/<profile>.mobileprovision" > "$PROFILE_PLIST" # never print, log, or upload profile contents
    # output example: TEAMID1234.com.example.wda  ->  TARGET_BUNDLE_ID=com.example.wda
   /usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" "$PROFILE_PLIST"
    /usr/libexec/PlistBuddy -c "Print :ExpirationDate" "$PROFILE_PLIST"

    APP_ID=$(/usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" "$PROFILE_PLIST")
    TARGET_BUNDLE_ID="${APP_ID#*.}"   # remove TEAMID. prefix if present
   ```
   Delete `PROFILE_TMP_DIR` after the profile checks complete.

   Run `resigner` to embed the profile and sign. `--profile` accepts a **directory**
   path containing `.mobileprovision` files, not the `.mobileprovision` file itself; never upload, attach, print, or log those files.
   resigner selects the matching profile automatically. Include `--bundle-id-remap`
   flags only when your profile app identifier is not a true wildcard (`*`). Each
   remap must use `old.bundle.id=new.bundle.id` syntax. Have the human operator set
   `P12_PASSWORD` in the local shell outside the agent or chat context. Never pass the
   password on the command line, echo it, log it, upload it, or return it as evidence;
   unset it immediately after signing:
   ```bash
   TARGET_BUNDLE_ID="<bundle-id-covered-by-your-profile>"  # strip the TEAMID. prefix
   # Omit the --bundle-id-remap lines ONLY if your profile app identifier is exactly `*`
   # Partial wildcards (e.g. io.appium.* or com.example.*) still require --bundle-id-remap
   : "${P12_PASSWORD:?Human operator must set P12_PASSWORD locally before signing}"

   resigner \
     --p12-file "<local-signing-archive-path>" \
     --profile "$PROFILES_DIR" \
     --force \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner.xctrunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentLib=${TARGET_BUNDLE_ID}" \
     "$WDA_APP"

   unset P12_PASSWORD
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
   PROFILE_TMP_DIR="$(mktemp -d)"
   PROFILE_PLIST="$PROFILE_TMP_DIR/profile.plist"
   security cms -D -i "$PROFILES_DIR/<profile>.mobileprovision" > "$PROFILE_PLIST" # never print, log, or upload profile contents
   /usr/libexec/PlistBuddy -c "Print :ExpirationDate" "$PROFILE_PLIST"
   date
   ```
   Delete `PROFILE_TMP_DIR` after the profile checks complete.

   > **Disconnected-run note (iOS 16+):** To prepare a provisioning profile that
   > remains usable during disconnected test runs, follow the steps in the
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

#### Option 2 — Build WDA with xcodebuild using explicit signing settings

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
BACKUP_DIR="$WDA_APP/../WDA-framework-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

find "$WDA_APP/Frameworks" -maxdepth 1 -type d -name 'XC*.framework' -exec mv {} "$BACKUP_DIR"/ \;
for framework_item in Testing.framework libXCTestSwiftSupport.dylib; do
  test ! -e "$WDA_APP/Frameworks/$framework_item" || mv "$WDA_APP/Frameworks/$framework_item" "$BACKUP_DIR"/
done

   # Re-sign with the same identity used during build
   codesign --force --sign "$SIGN_ID" "$WDA_APP"
   ```

   Proceed to step 5 to verify the signature.

   ---

#### Option 3 (Xcode UI fallback) — Build WDA via Xcode

   Use this when the prebuilt release is unavailable and xcodebuild signing fails.
   Open the WDA project in Xcode:
   ```bash
   appium driver run xcuitest open-wda
   ```
   Then choose the signing sub-option that matches your Apple Developer account:

##### Option 3a — Automatic signing (paid Apple Developer account)

   - Select `WebDriverAgentRunner` target → Signing & Capabilities.
   - Check **Automatically manage signing** and select your paid team.
   - Build and install: **Product → Test** on the connected device.

##### Option 3b — Free Apple ID

   - Create a new temporary iOS app project in Xcode; let Xcode generate a provisioning
     profile for a bundle ID your free account covers.
   - Back in the WDA project, select `WebDriverAgentRunner` target, set the bundle ID to
     the one Xcode accepted, sign with your free team.
   - Build and install: **Product → Test** on the connected device.

##### Option 3c — Manual bundle assignment

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
BACKUP_DIR="$WDA_APP/../WDA-framework-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

find "$WDA_APP/Frameworks" -maxdepth 1 -type d -name 'XC*.framework' -exec mv {} "$BACKUP_DIR"/ \;
test ! -e "$WDA_APP"/Frameworks/Testing.framework || mv "$WDA_APP"/Frameworks/Testing.framework "$BACKUP_DIR"/
test ! -e "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib || mv "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib "$BACKUP_DIR"/

   SIGNING_IDENTITY="Apple Development: you@example.com (TEAMID)"
   codesign --force --sign "$SIGNING_IDENTITY" "$WDA_APP"
   ```

   Proceed to step 5 to verify the signature.

### 5. Verify WDA signature

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

### 6. Run Appium XCUITest with the selected WDA route

Choose one mode only. Do not run all modes.

#### Mode A — Default Appium-managed xcodebuild

   Use this default when Appium should build, sign, install, and launch WDA for
   the session. Omit `appium:usePreinstalledWDA`, `appium:prebuiltWDAPath`, and
   `appium:webDriverAgentUrl`. Supply the signing values validated for the selected
   account without including their real values in shared evidence:
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:xcodeOrgId": "<team-id>",
     "appium:xcodeSigningId": "Apple Development",
     "appium:updatedWDABundleId": "<profile-covered-bundle-id>"
   }
   ```
   Start one Appium session and require the Appium-managed WDA build, installation,
   launch, and `/status` connection to succeed.

#### Mode B — Reuse preinstalled WDA

   Install WDA once and reuse it across sessions without running `xcodebuild` each time.
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "<wda-bundle-id>"
   }
   ```
   Notes:
   - For free-account or enterprise-profile setups, complete the step 5 pre-trust
     recommendation first.
   - If launch fails with repeated `ECONNREFUSED 127.0.0.1:8100`, rebuild from the
     iOS/tvOS 17+ flow in step 4 (move XCTest runtime artifacts to backup + re-sign),
     reinstall, then retry.
   - If the installed WDA bundle ID has no `.xctrunner` suffix:
   ```json
   {
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "io.appium.wda",
     "appium:updatedWDABundleIdSuffix": ""
   }
   ```

#### Mode C — Use prebuilt WDA app/xctestrun artifacts

   Skip build work at session time by using previously prepared artifacts.

##### Option C1: Signed `.app` artifact

   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:prebuiltWDAPath": "/path/to/signed/WebDriverAgentRunner-Runner.app"
   }
   ```

##### Option C2: `.xctestrun` artifact

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

#### Mode D — Attach to already running WDA

   Start WDA externally (Xcode/xcodebuild/tooling), then point Appium at it.
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:platformVersion": "<device-os-version>",
     "appium:udid": "<device-udid>",
     "appium:deviceName": "<device-name>",
     "appium:webDriverAgentUrl": "http://<device-ip-or-localhost>:8100"
   }
   ```
   If the remote WDA port differs from local forwarding, add `appium:wdaRemotePort`.
   Verify the URL without printing any credential-bearing URL components:
   ```bash
   WDA_URL="http://<device-ip-or-localhost>:8100"
   curl -fsS "${WDA_URL%/}/status"
   ```
   Require the status request to exit successfully and return valid WDA status JSON.
   Then start one Appium session and require successful attachment. Do not request
   local signing, provisioning, artifact, or installation evidence for this route
   unless the user separately asks to diagnose the running WDA.

## Evidence To Report

- macOS version and Xcode version
- target device type, redacted UDID fingerprint, OS version, and visibility in `xcrun xctrace list devices`
- selected provisioning approach when applicable, plus bundle-ID, Team-ID, certificate, and profile match/no-match results; never report their full values
- WDA preparation mode: default `xcodebuild`, preinstalled, prebuilt, `.xctestrun`, or attach-to-running
- whether the target OS supports `appium:usePreinstalledWDA` / `appium:prebuiltWDAPath`
- `codesign --verify --deep --strict` result for any locally prepared WDA bundle
- sanitized deployment or attachment command summary and smallest successful verification
- any required on-device action that remains manual

Never include a full UDID, Team ID, certificate identity, bundle ID, provisioning-
profile contents, signing-archive path, signing password, private key, or credential in
the report.

## Self-Improvement Prompt

Before the final response, run this self-improvement check. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit this context unless asked.

## Constraints
- This workflow is macOS-only; do not provide Linux/Windows alternatives.
- Complete the iOS/tvOS + XCUITest route in `contexts/tools/appium/setup/routing.md` first.
- Verify every locally prepared WDA signature with `codesign --verify --deep --strict`
  (step 5) before deploying. Do not require local signature evidence for a running-WDA
  URL route.
- Never skip re-signing after modifying a signed `.app` bundle (e.g. removing frameworks).
- Mark paid-account-only steps; do not require them for free Apple IDs.
- Ask the user before installing any 3rd-party device tool (ios-deploy, go-ios,
  pymobiledevice3, tidevice, ios-app-signer, etc.).
- For steps that require physical interaction with the device (Trust popup, Developer
  Mode toggle), pause and provide the exact on-device instruction.
- Step 6 contains optional runtime modes; validate one mode only. The default
  xcodebuild-per-session flow is still valid.

## Completion Criteria
Mark the workflow complete only when the shared prerequisites and the selected
route's checks pass:
- The connected device is visible in `xcrun xctrace list devices` output.
- For default Appium-managed `xcodebuild`, one session completes WDA build, signing,
  installation, launch, and connection successfully.
- For a prebuilt route, the local artifact passes `codesign --verify --deep --strict`,
  deployment succeeds, and one session connects.
- For a preinstalled route, the installed runner launches and one session connects;
  require a local signature check only when the workflow rebuilt or re-signed it.
- For a running-WDA URL route, the endpoint is reachable and one Appium session
  attaches successfully; steps 4 and 5 are not required.
- Final report includes capability hints:
  - one copy-paste JSON capabilities snippet for the validated mode, and
  - one attach-only fallback for a running-WDA route (for example, device IP versus an existing localhost port forward) when available, or an explicit note that the user's constraints exclude a safe fallback.
  Use sanitized placeholders in every snippet.
