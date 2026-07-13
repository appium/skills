---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.mac2.mac2-smoke-status
name: "mac2-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Mac2"

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
