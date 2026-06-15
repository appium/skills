---
name: "realdev-12"
description: "Preserved real-device-procedure procedure part 12 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 12

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

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
