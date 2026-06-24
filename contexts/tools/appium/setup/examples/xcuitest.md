---
owner: appium
policy_scope: "contexts/tools/appium/setup/examples/xcuitest.md"
id: appium.setup.examples.xcuitest
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/setup/examples/xcuitest.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/examples/xcuitest.md bounded command output, local paths, driver names, IDs, and logs

---

# Example: macOS + XCUITest Setup

Use this repository's skills to prepare macOS + XCUITest.

1. Load `skills/setup/SKILL.md`.
2. Load `contexts/tools/appium/setup/profiles/macos.md`.
3. Load `contexts/tools/appium/setup/profiles/xcuitest.md`.
4. Load `contexts/tools/appium/setup/node-environment.md`.
5. Load `contexts/tools/appium/setup/references/environment-setup-xcuitest.md`.

Rules:

- Treat `appium driver doctor xcuitest` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `xcuitest`.
4. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.
