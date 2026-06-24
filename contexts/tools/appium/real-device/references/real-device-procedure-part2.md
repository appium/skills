---
owner: appium
policy_scope: "contexts/tools/appium/real-device/references/real-device-procedure-part2.md"
id: appium.real-device.references.real-device-procedure-part2
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/references/real-device-procedure-part2.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/references/real-device-procedure-part2.md bounded command output, local paths, driver names, IDs, and logs

---

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

