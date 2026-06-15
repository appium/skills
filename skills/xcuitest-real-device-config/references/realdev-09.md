---
name: "realdev-09"
description: "Preserved real-device-procedure procedure part 09 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 09

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->


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
test ! -e "$WDA_APP"/Frameworks/Testing.framework || mv "$WDA_APP"/Frameworks/Testing.framework "$BACKUP_DIR"/
test ! -e "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib || mv "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib "$BACKUP_DIR"/

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
