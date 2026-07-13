---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.espresso.espresso-smoke-status
name: "espresso-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Espresso"

---

# espresso-smoke-status

## Smoke Check

Start `appium server` in one terminal, then run:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate readiness. Server logs should include `Available drivers:` and `espresso`.

## Cleanup

Stop the server with `Ctrl+C`, then run:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```
