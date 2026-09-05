---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.safari.safari-smoke-status
name: "safari-smoke-status"
description: "Run Appium server smoke status checks and verify cleanup for Safari"

---

# safari-smoke-status

## Smoke Check

Record the process or terminal-job identity of the server started for this
check. Preserve any pre-existing server. If port 4723 is occupied, select an
unused port with `--port` and use that port for all status/session requests.

Start `appium server`, then run:

```bash
curl -s http://127.0.0.1:4723/status
```

The response must indicate readiness. Logs should include `Available drivers:` and `safari`.

## Cleanup

Stop only the server started for this check, using `Ctrl+C` in its owning
terminal or the recorded process handle. Confirm that process and any child
server it started have exited. On macOS/Linux, inspect the recorded PID with
`ps -p <server-pid> -o pid=,command=`; on Windows, use
`Get-Process -Id <server-pid> -ErrorAction SilentlyContinue`. A remaining
unrelated Appium process is not a cleanup failure; do not stop it.
