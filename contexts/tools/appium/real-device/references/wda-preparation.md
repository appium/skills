---
security_profile: appium-real-device-workflows
owner: appium
id: appium.real-device.references.wda-preparation
name: xcuitest-real-device-wda-preparation
description: Prepare and verify a local WebDriverAgent bundle for an Appium XCUITest real-device route that builds, modifies, signs, installs, or separately validates WDA.
status: stable
---

# XCUITest Real-Device WDA Preparation

This asset continues the ordered procedure in
`contexts/tools/appium/real-device/references/real-device-procedure.md`.
Before executing it, apply that parent asset's decision logic and load the hard
constraints in `contexts/tools/appium/real-device/references/wda-runtime.md`.

## Ordered Procedure

### 4. Prepare WDA

   Use this step only when the selected route needs a prepared local
   `WebDriverAgentRunner-Runner.app` or when Appium-managed signing needs separate
   validation. A running-WDA URL route must use its applicable safeguards instead:
   require endpoint reachability and a successful Appium attachment in step 6, without
   entering the local preparation, signing, or installation flow. Before running any
   command in this step that changes signing, provisioning, bundle contents, device
   registration, or device installation, obtain explicit approval. Try the options
   below in priority order and stop at the first that succeeds.

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

## Continue the Ordered Procedure

After completing the applicable preparation and signature checks, continue with
step 6 in `contexts/tools/appium/real-device/references/wda-runtime.md`.
