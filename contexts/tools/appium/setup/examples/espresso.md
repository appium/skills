---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.espresso

---

# Example: Android + Espresso Setup

Use `skills/setup-espresso/SKILL.md` to prepare Android + Espresso. The Skill
owns Context loading order, command-mode selection, approval gates, and
completion criteria; this example only illustrates the smoke check.

Rules:

- Treat `appium driver doctor espresso` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

If port 4723 is occupied, use an unused port with `--port` and update the
status/session URLs below. Follow the driver smoke reference for process checks.

- Terminal A: start the server with `appium server`; record its PID or terminal-job identity.
- Terminal B: run `curl -s http://127.0.0.1:4723/status` and confirm success.
- Terminal A logs: confirm `Available drivers:` contains `espresso`.
- Cleanup: stop this server with `Ctrl+C` in Terminal A and verify its recorded process exits. Preserve pre-existing servers.
