---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/xcuitest/xcuitest-smoke-status.md"
id: appium.setup.references.xcuitest.xcuitest-smoke-status
name: "xcuitest-smoke-status"
description: "Run Appium server smoke status checks and cleanup for XCUITest"
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-smoke-status.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-smoke-status.md bounded command output, local paths, driver names, IDs, and logs

---

# xcuitest-smoke-status

## Smoke Check

Start `appium server`, then run:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate readiness. Logs should include `Available drivers:` and `xcuitest`.

## Cleanup

Stop the server and verify:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```
