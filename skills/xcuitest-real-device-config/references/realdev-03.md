---
name: "realdev-03"
description: "Preserved real-device-procedure procedure part 03 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 03

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

  - For fully self-managed WDA lifecycle → Attach to Running WDA (`appium:webDriverAgentUrl`).
- For WebDriverAgent v13+ prebuilt/preinstalled flows, require iOS/tvOS 17.0 or newer before using `appium:usePreinstalledWDA` or `appium:prebuiltWDAPath`. For iOS/tvOS 16.x or older, use the default `xcodebuild` flow, an `.xctestrun`/`bootstrapPath` flow, or attach to an already running WDA with `appium:webDriverAgentUrl`.
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
