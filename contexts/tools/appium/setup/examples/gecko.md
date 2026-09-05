---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.gecko

---

# Gecko Setup

Use `skills/setup-gecko/SKILL.md` for the complete Firefox route. Apply the
Skill's Context, command-mode, approval, and completion rules before using the
server smoke sequence below.

Rules:

- Use global Appium commands by default: `appium`, `npm -g`.
- If `appium driver doctor gecko` is supported, treat required fixes as blocking.
- If doctor is not supported for `gecko`, use install, list, Firefox availability, and smoke checks as blocking gates.
- Ask before privileged package-manager commands or browser installs.

Smoke:

If port 4723 is occupied, use an unused port with `--port` and update the
status/session URLs below. Follow the driver smoke reference for process checks.

1. Start Appium server in Terminal A: `appium server`; record its PID or terminal-job identity.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm readiness.
3. In Terminal A logs confirm `Available drivers:` contains `gecko`.
4. Stop this server with `Ctrl+C` in Terminal A.
5. Verify the recorded server process exits; preserve pre-existing servers.
