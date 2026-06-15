---
name: "realdev-08"
description: "Preserved real-device-procedure procedure part 08 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 08

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

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
