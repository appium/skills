---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/mac2/mac2-smoke-status.md"
id: appium.setup.references.mac2.mac2-smoke-status
name: "mac2-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Mac2"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/mac2/mac2-smoke-status.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/mac2/mac2-smoke-status.md bounded command output, local paths, driver names, IDs, and logs

---

# mac2-smoke-status

## Smoke Check

Start `appium server`, then run:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate readiness. Logs should include `Available drivers:` and `mac2`.

## Cleanup

Stop the server and verify:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```
