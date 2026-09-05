---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.uiautomator2

---

# Example: Android + UiAutomator2 Setup

Use `skills/setup-uiautomator2/SKILL.md` to prepare Android + UiAutomator2.
The Skill owns Context loading order, command-mode selection, approval gates,
and completion criteria; this example only illustrates the smoke check.

Smoke test:

If port 4723 is occupied, use an unused port with `--port` and update the
status/session URLs below. Follow the driver smoke reference for process checks.

1. Start Appium server in Terminal A: `appium server`; record its PID or terminal-job identity.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `uiautomator2`.
4. Stop this server with `Ctrl+C` in Terminal A and verify its recorded process exits. Preserve pre-existing servers.
