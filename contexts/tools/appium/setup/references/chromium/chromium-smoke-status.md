---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.chromium.chromium-smoke-status
name: "chromium-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Chromium"

---

# chromium-smoke-status

## Smoke Check

Start the server with `appium server` in global mode or, from the project root,
`npx --no-install appium server` in local mode. Then run:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate readiness. Logs should include `Available drivers:` and `chromium`.

## Minimal Browser Session

With the server still running, execute the deterministic smoke helper:

```bash
node tools/appium/setup/scripts/smoke-chromium-session.mjs
```

Use `--browser edge` for Edge. Use `--browser-binary <path>` to select a particular
browser and `--driver-executable <path>` to select an existing compatible
`chromedriver` or `msedgedriver`. The helper sends W3C `POST /session`, extracts the
session ID, and sends `DELETE /session/:sessionId`. It sets
`appium:autodownloadEnabled` to `false` by default, so a missing compatible driver
fails without downloading. Pass `--allow-driver-download` only after explicit approval
for that session-time download. Require the helper's top-level
`summary.requiredOk: true`; a passing `/status` alone does not prove browser
compatibility.

## Cleanup

Stop the server and verify:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```
