---
owner: appium
id: appium.real-device.references.real-device-procedure-part8

---

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

