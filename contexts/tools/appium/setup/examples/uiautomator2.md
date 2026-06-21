---
owner: appium
id: appium.setup.examples.uiautomator2

---

# Example: Android + UiAutomator2 Setup

Use this repository's skills to prepare Android + UiAutomator2.

1. Load `skills/setup/SKILL.md`.
2. Load `contexts/tools/appium/setup/profiles/global-appium.md` unless the user requests local mode.
3. Load `contexts/tools/appium/setup/profiles/android.md`.
4. Load `contexts/tools/appium/setup/node-environment.md`.
5. Load `contexts/tools/appium/setup/references/environment-setup-android.md`.
6. Load `contexts/tools/appium/setup/uiautomator2-environment.md`.

Smoke test:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `uiautomator2`.
4. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.
