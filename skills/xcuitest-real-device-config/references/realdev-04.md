---
name: "realdev-04"
description: "Preserved real-device-procedure procedure part 04 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 04

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

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

   **Option 1 (primary) — Download prebuilt WDA from GitHub releases**

   The [WebDriverAgent releases page](https://github.com/appium/WebDriverAgent/releases)
   provides prebuilt `.app` packages for real devices. These are built without embedded
   XCTest frameworks (safe for iOS 17+) and have no embedded provisioning profile;
   they must be signed with your own identity before use.

   Download [`resigner`](https://github.com/appium/resigner) from its
   [releases page](https://github.com/appium/resigner/releases). It handles profile
   embedding, optional bundle ID remapping, and signing in one step for any account type.
