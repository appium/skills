---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.xcuitest

---

# Example: iOS/tvOS + XCUITest Setup

Use `skills/setup-xcuitest/SKILL.md` to prepare iOS/tvOS + XCUITest on macOS.
The Skill owns Context loading order, command-mode selection, approval gates,
and completion criteria; this example only illustrates the smoke check.

Rules:

- Treat `appium driver doctor xcuitest` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `xcuitest`.
4. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.
