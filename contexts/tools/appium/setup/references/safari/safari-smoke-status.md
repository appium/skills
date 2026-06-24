---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/safari/safari-smoke-status.md"
id: appium.setup.references.safari.safari-smoke-status
name: "safari-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Safari"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/safari/safari-smoke-status.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/safari/safari-smoke-status.md bounded command output, local paths, driver names, IDs, and logs

---

# safari-smoke-status

## Smoke Check

Start `appium server`, then run:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate readiness. Logs should include `Available drivers:` and `safari`.

## Cleanup

Stop the server and verify no leftover Appium server process.
