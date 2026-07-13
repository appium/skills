---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.uiautomator2.uiautomator2-smoke-status
name: "uiautomator2-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for UiAutomator2"

---

# uiautomator2-smoke-status

## Smoke Check

Start an Appium server in a separate terminal:

```bash
appium server
```

Then verify:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate server readiness. Server logs should include `Available drivers:` and `uiautomator2`.

## Cleanup

Stop the server with `Ctrl+C`, then verify no leftover process:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```

On Windows, inspect `Win32_Process` for command lines matching `appium.*server`.
