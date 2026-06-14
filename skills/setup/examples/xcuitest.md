# Example: macOS + XCUITest Setup

Use this repository's skills to prepare macOS + XCUITest.

1. Load `skills/setup/SKILL.md`.
2. Load `profiles/macos.md`.
3. Load `profiles/xcuitest.md`.
4. Load `references/environment-setup-node.md`.
5. Load `references/environment-setup-xcuitest.md`.

Rules:

- Treat `appium driver doctor xcuitest` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `xcuitest`.
4. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.
