---
owner: appium
id: appium.setup.examples.chromium

---

# Example: Desktop Chromium Setup

Use this repository's skills to prepare Appium Chromium Driver for desktop browser automation.

1. Load `skills/setup/SKILL.md`.
2. Load `contexts/tools/appium/setup/profiles/global-appium.md` unless the user requests local mode.
3. Load `contexts/tools/appium/setup/profiles/chromium.md`.
4. Load `contexts/tools/appium/setup/node-environment.md`.
5. Load `contexts/tools/appium/setup/references/environment-setup-chromium.md`.

Rules:

- If `appium driver doctor chromium` is supported, treat required fixes as blocking.
- If doctor is not supported for `chromium`, use install, list, and smoke checks as blocking gates.

Smoke test:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `chromium`.
4. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.
