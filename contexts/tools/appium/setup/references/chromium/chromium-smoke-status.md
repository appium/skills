---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.chromium.chromium-smoke-status
name: "chromium-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Chromium"

---

# chromium-smoke-status

## Smoke Check

Record the process or terminal-job identity of the server started for this
check. Preserve any pre-existing server. If port 4723 is occupied, select an
unused port with `--port` and use that port for all status/session requests.

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

Use `--server-url http://127.0.0.1:<port>/` when the server uses another port.
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

Stop only the server started for this check, using `Ctrl+C` in its owning
terminal or the recorded process handle. Confirm that process and any child
server it started have exited. On macOS/Linux, inspect the recorded PID with
`ps -p <server-pid> -o pid=,command=`; on Windows, use
`Get-Process -Id <server-pid> -ErrorAction SilentlyContinue`. A remaining
unrelated Appium process is not a cleanup failure; do not stop it.
