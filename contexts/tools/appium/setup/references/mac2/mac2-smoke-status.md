---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.mac2.mac2-smoke-status
name: "mac2-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Mac2"

---

# mac2-smoke-status

## Smoke Check

Run the shared lifecycle helper after the driver prerequisite and doctor gates:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver mac2 --report auto
```

Add `--appium-mode local` only for explicitly selected local mode. The helper
uses loopback, chooses a free port if 4723 is occupied, verifies readiness and
the selected driver in its own server logs, and cleans up its owned process
tree on success, failure, or interruption. Require `summary.requiredOk: true`;
inspect `diagnosticsPath` for failed evidence instead of repeating the workflow.
