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

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `uiautomator2`.
4. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.
