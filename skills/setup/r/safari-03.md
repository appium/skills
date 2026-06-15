---
name: "safari-03"
description: "Preserved safari setup procedure part 3 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# safari Part 3

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-safari.md; strip this generated header when comparing -->

   Use capabilities with `platformName: "iOS"`, `appium:automationName: "Safari"`, `browserName: "Safari"` or a client-compatible Safari browser name, and `safari:useSimulator: true`.

7. **Real iOS device prerequisite**

   For real devices, tell the user to enable Remote Automation on the device:

   `Settings -> Safari -> Advanced -> Remote Automation`

   Do not attempt signing, WebDriverAgent, or XCUITest real-device setup from this reference. Route those requests to `skills/xcuitest-real-device-config/SKILL.md` only when explicitly needed.

8. **Start Appium server smoke test**

   ```bash
   appium server
   ```

   Keep this server process running in Terminal A.

   In Terminal B, run:

   ```bash
   curl -s http://127.0.0.1:4723/status
   ```

   First confirm `/status` responds successfully. Then confirm startup/readiness from server logs and ensure the `Available drivers:` block contains `safari` (for example, `- safari@<version> (automationName 'Safari')`).

   If startup banner logs are unavailable, use this fallback verification path:

   - `appium driver list --installed --json` includes `safari`
   - `/status` reports server readiness

   After smoke validation, clean up the running Appium server:

   - In Terminal A, stop the server with `Ctrl+C`.
   - Verify no leftover Appium server process:

   ```bash
   pgrep -fl "appium.*server" || echo "no appium server process"
   ```

## Agent Completion Criteria

Mark complete only when all are true:

- `appium -v` succeeds and reports Appium 3.x.
- `safaridriver --version` succeeds.
- Safari WebDriver automation was already enabled or `safaridriver --enable` completed.
- `appium driver list --installed --json` includes `safari`.
