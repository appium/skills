---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/gecko/gecko-smoke-status.md"
id: appium.setup.references.gecko.gecko-smoke-status
name: "gecko-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Gecko"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/gecko/gecko-smoke-status.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/gecko/gecko-smoke-status.md bounded command output, local paths, driver names, IDs, and logs

---

# gecko-smoke-status

## Smoke Check

Start `appium server`, then run:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate readiness. Logs should include `Available drivers:` and `gecko`.

## Cleanup

Stop the server and verify:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```
