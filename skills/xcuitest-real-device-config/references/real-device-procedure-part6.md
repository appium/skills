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
BACKUP_DIR="$WDA_APP/../WDA-framework-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

find "$WDA_APP/Frameworks" -maxdepth 1 -type d -name 'XC*.framework' -exec mv {} "$BACKUP_DIR"/ \;
test ! -e "$WDA_APP"/Frameworks/Testing.framework || mv "$WDA_APP"/Frameworks/Testing.framework "$BACKUP_DIR"/
test ! -e "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib || mv "$WDA_APP"/Frameworks/libXCTestSwiftSupport.dylib "$BACKUP_DIR"/

   SIGNING_IDENTITY="Apple Development: you@example.com (TEAMID)"
   codesign --force --sign "$SIGNING_IDENTITY" "$WDA_APP"
   ```

   Proceed to step 5 to verify the signature.

