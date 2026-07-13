---
security_profile: appium-local-workflows
owner: appium
id: appium.real-device.references.real-device-procedure-part5

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
