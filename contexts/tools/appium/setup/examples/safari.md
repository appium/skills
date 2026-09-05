---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.safari

---

# Example: Safari Setup

Follow `skills/setup-safari/SKILL.md` for macOS Safari setup. Use this example
only for its final server check after the Skill has applied the selected
command mode, authorization boundaries, and required gates.

Rules:

- Use global Appium commands by default: `appium`, `npm -g`.
- Run `safaridriver --enable` only when the user accepts the required macOS authorization prompt.
- Treat Appium Safari driver doctor as optional. If unsupported, continue with install/list, `safaridriver`, and smoke checks.

Smoke test:

If port 4723 is occupied, use an unused port with `--port` and update the
status/session URLs below. Follow the driver smoke reference for process checks.

1. Start Appium server in Terminal A: `appium server`; record its PID or terminal-job identity.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status`.
3. In Terminal A logs confirm `Available drivers:` contains `safari`.
4. Stop this server with `Ctrl+C` in Terminal A.
5. Verify the recorded server process exits; preserve pre-existing servers.
